-- Create trial_subscriptions table
create table if not exists public.trial_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  trial_start_date timestamp with time zone default now(),
  trial_end_date timestamp with time zone not null,
  trial_days_remaining integer default 3,
  is_trial_active boolean default true,
  trial_unlocked_by_referral boolean default false,
  referral_unlock_date timestamp with time zone,
  pro_purchased boolean default false,
  pro_purchase_date timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create referral_codes table
create table if not exists public.referral_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code text not null unique,
  created_at timestamp with time zone default now(),
  unique(user_id)
);

-- Create referrals table (tracks referral relationships)
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references auth.users(id) on delete cascade,
  referred_user_id uuid not null references auth.users(id) on delete cascade,
  referral_code text not null,
  referred_email text not null,
  is_verified boolean default false,
  verification_method text, -- 'email', 'sms', 'google'
  verified_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  unique(referrer_id, referred_user_id)
);

-- Create device_logs table (for anti-fraud)
create table if not exists public.device_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  device_id text not null,
  ip_address text not null,
  user_agent text,
  created_at timestamp with time zone default now()
);

-- Create ip_trial_locks table (prevent multiple trials from same IP)
create table if not exists public.ip_trial_locks (
  id uuid primary key default gen_random_uuid(),
  ip_address text not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  trial_granted_at timestamp with time zone default now(),
  expires_at timestamp with time zone not null
);

-- Enable RLS
alter table public.trial_subscriptions enable row level security;
alter table public.referral_codes enable row level security;
alter table public.referrals enable row level security;
alter table public.device_logs enable row level security;
alter table public.ip_trial_locks enable row level security;

-- Trial subscriptions policies
create policy "trial_subscriptions_select_own"
  on public.trial_subscriptions for select
  using (auth.uid() = user_id);

create policy "trial_subscriptions_insert_own"
  on public.trial_subscriptions for insert
  with check (auth.uid() = user_id);

create policy "trial_subscriptions_update_own"
  on public.trial_subscriptions for update
  using (auth.uid() = user_id);

-- Referral codes policies
create policy "referral_codes_select_own"
  on public.referral_codes for select
  using (auth.uid() = user_id);

create policy "referral_codes_insert_own"
  on public.referral_codes for insert
  with check (auth.uid() = user_id);

-- Referrals policies
create policy "referrals_select_own_referrer"
  on public.referrals for select
  using (auth.uid() = referrer_id);

create policy "referrals_select_own_referred"
  on public.referrals for select
  using (auth.uid() = referred_user_id);

create policy "referrals_insert_own"
  on public.referrals for insert
  with check (auth.uid() = referrer_id);

-- Device logs policies
create policy "device_logs_select_own"
  on public.device_logs for select
  using (auth.uid() = user_id);

create policy "device_logs_insert_own"
  on public.device_logs for insert
  with check (auth.uid() = user_id);

-- IP trial locks (admin only for reads, system for writes)
create policy "ip_trial_locks_insert"
  on public.ip_trial_locks for insert
  with check (true);

-- Update trigger for trial_subscriptions
create or replace function public.update_trial_subscriptions_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists update_trial_subscriptions_timestamp on public.trial_subscriptions;

create trigger update_trial_subscriptions_timestamp
  before update on public.trial_subscriptions
  for each row
  execute function public.update_trial_subscriptions_timestamp();

-- Update trigger for referrals
create or replace function public.update_referrals_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.verified_at = now();
  return new;
end;
$$;

drop trigger if exists update_referrals_timestamp on public.referrals;

create trigger update_referrals_timestamp
  before update on public.referrals
  for each row
  when (new.is_verified = true and old.is_verified = false)
  execute function public.update_referrals_timestamp();

-- Create trial subscription on user signup
create or replace function public.handle_new_user_trial()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  trial_end_date timestamp with time zone;
  referral_code text;
begin
  -- Calculate trial end date (3 days from now)
  trial_end_date := now() + interval '3 days';
  
  -- Generate referral code (first 8 chars of user ID + random)
  referral_code := substring(new.id::text, 1, 8) || '-' || substring(md5(random()::text), 1, 8);
  
  -- Create trial subscription
  insert into public.trial_subscriptions (user_id, trial_end_date, trial_days_remaining)
  values (new.id, trial_end_date, 3)
  on conflict (user_id) do nothing;
  
  -- Create referral code
  insert into public.referral_codes (user_id, code)
  values (new.id, referral_code)
  on conflict (user_id) do nothing;
  
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_trial on auth.users;

create trigger on_auth_user_created_trial
  after insert on auth.users
  for each row
  execute function public.handle_new_user_trial();
