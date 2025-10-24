# Deployment Checklist for Vercel

## Pre-deployment Setup

### 1. Supabase Configuration
- [ ] Create Supabase project
- [ ] Run database migration scripts from `scripts/` folder
- [ ] Configure Row Level Security (RLS) policies
- [ ] Get project URL and anon key from Supabase dashboard

### 2. Environment Variables
- [ ] Copy `.env.example` to `.env.local` for local development
- [ ] Set up all required environment variables in Vercel dashboard:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `FOOD_ANALYSIS_API_URL`
  - `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (set to your production domain)

### 3. Vercel Deployment
- [ ] Connect GitHub repository to Vercel
- [ ] Configure environment variables in Vercel project settings
- [ ] Ensure build command is set to `npm run build`
- [ ] Ensure output directory is set to `.next`

## Post-deployment Verification

### 1. Basic Functionality
- [ ] App loads without errors
- [ ] Authentication flow works (sign up/sign in)
- [ ] Database connections are working
- [ ] API routes respond correctly

### 2. Food Analysis API
- [ ] Test image upload functionality
- [ ] Verify API proxy is working
- [ ] Check for CORS issues

### 3. Trial System
- [ ] Test referral code functionality
- [ ] Verify trial status checking
- [ ] Test device logging

## Common Issues & Solutions

### Build Errors
- Check TypeScript errors: `npm run build`
- Verify all imports are correct
- Ensure environment variables are properly set

### Runtime Errors
- Check Vercel function logs
- Verify Supabase connection
- Test API endpoints individually

### CORS Issues
- Verify `vercel.json` configuration
- Check API route headers
- Ensure proper domain configuration in Supabase

## Performance Optimization

- [ ] Enable Vercel Analytics
- [ ] Configure proper caching headers
- [ ] Optimize images and assets
- [ ] Monitor function execution times