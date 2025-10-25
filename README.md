h# NutriTrack - Nutrition Tracking App

A Next.js application for tracking nutrition with AI-powered food analysis.

## Features







-- HeightMax App Database Schema for Supabase

-- User profiles table
CREATE TABLE user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    age INTEGER,
    height DECIMAL(5,2), -- in cm
    weight DECIMAL(5,2), -- in kg
    activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'very_active')),
    sleep_hours DECIMAL(3,1),
    goals TEXT[], -- array of goal IDs
    onboarding_completed BOOLEAN DEFAULT FALSE,
    level INTEGER DEFAULT 1,
    total_points INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    max_streak INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User tasks table
CREATE TABLE user_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('exercise', 'nutrition', 'sleep', 'lifestyle')),
    estimated_time TEXT,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    points INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    height_measurement DECIMAL(5,2), -- in cm
    weight_measurement DECIMAL(5,2), -- in kg
    tasks_completed INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI coach conversations
CREATE TABLE coach_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_user_message BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements
CREATE TABLE user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL,
    achievement_name TEXT NOT NULL,
    description TEXT,
    points_awarded INTEGER DEFAULT 0,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_tasks_user_id ON user_tasks(user_id);
CREATE INDEX idx_user_tasks_date ON user_tasks(date);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_date ON user_progress(date);
CREATE INDEX idx_coach_conversations_user_id ON coach_conversations(user_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for user_tasks
CREATE POLICY "Users can view own tasks" ON user_tasks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON user_tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON user_tasks
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies for user_progress
CREATE POLICY "Users can view own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies for coach_conversations
CREATE POLICY "Users can view own conversations" ON coach_conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" ON coach_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for user_achievements
CREATE POLICY "Users can view own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
- User authentication with Supabase
- AI-powered food image analysis
- Nutrition tracking and goal setting
- Trial system with referral program
- Responsive design with dark/light theme

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

### Required Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `FOOD_ANALYSIS_API_URL`: Backend API URL for food analysis

### Optional Environment Variables

- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`: Redirect URL for email confirmation (development only)

## Deployment on Vercel

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add all required variables from `.env.example`
3. **Deploy** - Vercel will automatically build and deploy your app

### Vercel Environment Variables Setup

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
FOOD_ANALYSIS_API_URL=http://82.153.70.111:8000/analyze-food
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://your-domain.vercel.app/auth/confirm
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

This app uses Supabase as the backend. You'll need to:

1. Create a Supabase project
2. Run the SQL scripts in the `scripts/` folder to set up your database schema
3. Configure Row Level Security (RLS) policies as needed

## API Routes

- `/api/analyze-food` - Food image analysis proxy
- `/api/trial/*` - Trial management endpoints

## Tech Stack

- **Framework**: Next.js 16
- **Database**: Supabase
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Authentication**: Supabase Auth
AIzaSyDr6rCHeE2HzGIbZ6LSM7J494T6n_kVI00
- **Deployment**: Vercel

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmeXJlZ3N0bXRndGlrcHVoaWV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDk0NDYsImV4cCI6MjA3Njk4NTQ0Nn0.jqBR5gA6ouwZxIeeVwkUleWc1WiGOo5PNZz0W6RTjIk



https://qfyregstmtgtikpuhiey.supabase.co

 

