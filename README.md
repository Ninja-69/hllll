https://qfyregstmtgtikpuhiey.supabase.co


eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmeXJlZ3N0bXRndGlrcHVoaWV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDk0NDYsImV4cCI6MjA3Njk4NTQ0Nn0.jqBR5gA6ouwZxIeeVwkUleWc1WiGOo5PNZz0W6RTjIk



Send a POST request to the URL:
https://qfyregstmtgtikpuhiey.supabase.co/functions/v1/clever-handlerSet Request Headers:Content-Type: application/jsonSet Request Body JSON:
Always send a JSON object containing these mandatory fields:"prompt": A string containing the user's question or message."userContext": An object containing user details like:{
  "name": "User's Name",
  "age": User's age as number,
  "weight": User's weight as number,
  // Add other relevant user attributes here
}Format of the body example:{
  "prompt": "How can I improve my height?",
  "userContext": {
    "name": "Rahul",
    "age": 15,
    "weight": 60
  }
}How to process response:The endpoint returns AI-generated content in JSON format.Extract the generated answer (usually inside choices[0].message.content or similar).Display that extracted text in the chat section as the AI’s reply.User interaction cycle:For every user message, build the JSON body with current prompt and latest updated user context.POST it to the endpoint and update chat UI with AI response.Maintain full user context on frontend or backend to continuously personalize prompts.

h# NutriTrack - Nutrition Tracking App

A Next.js application for tracking nutrition with AI-powered food analysis.

## Features





    
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

 


