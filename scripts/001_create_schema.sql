-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  first_name text,
  last_name text,
  age integer,
  gender text,
  height_cm integer,
  weight_kg numeric(5,2),
  activity_level text default 'moderate',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create goals table
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  daily_calories integer default 2000,
  daily_protein_g numeric(5,1) default 150,
  daily_carbs_g numeric(5,1) default 200,
  daily_fat_g numeric(5,1) default 65,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id)
);

-- Create meals table
create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  calories integer not null,
  protein_g numeric(5,1),
  carbs_g numeric(5,1),
  fat_g numeric(5,1),
  fiber_g numeric(5,1),
  image_url text,
  meal_type text not null,
  created_at timestamp with time zone default now(),
  date date default current_date
);

-- Create daily_stats table
create table if not exists public.daily_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  total_calories integer default 0,
  total_protein_g numeric(5,1) default 0,
  total_carbs_g numeric(5,1) default 0,
  total_fat_g numeric(5,1) default 0,
  total_fiber_g numeric(5,1) default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, date)
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.goals enable row level security;
alter table public.meals enable row level security;
alter table public.daily_stats enable row level security;

-- Profiles policies
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Goals policies
create policy "goals_select_own"
  on public.goals for select
  using (auth.uid() = user_id);

create policy "goals_insert_own"
  on public.goals for insert
  with check (auth.uid() = user_id);

create policy "goals_update_own"
  on public.goals for update
  using (auth.uid() = user_id);

-- Meals policies
create policy "meals_select_own"
  on public.meals for select
  using (auth.uid() = user_id);

create policy "meals_insert_own"
  on public.meals for insert
  with check (auth.uid() = user_id);

create policy "meals_update_own"
  on public.meals for update
  using (auth.uid() = user_id);

create policy "meals_delete_own"
  on public.meals for delete
  using (auth.uid() = user_id);

-- Daily stats policies
create policy "daily_stats_select_own"
  on public.daily_stats for select
  using (auth.uid() = user_id);

create policy "daily_stats_insert_own"
  on public.daily_stats for insert
  with check (auth.uid() = user_id);

create policy "daily_stats_update_own"
  on public.daily_stats for update
  using (auth.uid() = user_id);

-- Create trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  
  insert into public.goals (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
