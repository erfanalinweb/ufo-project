# Deployment Guide

## Production Deployment Options

### 1. Vercel (Recommended for Next.js)

#### Database Setup
1. **Neon PostgreSQL** (Free tier available):
   ```bash
   # Sign up at https://neon.tech
   # Create a new project
   # Copy the connection string
   ```

2. **Supabase PostgreSQL**:
   ```bash
   # Sign up at https://supabase.com
   # Create a new project
   # Go to Settings > Database
   # Copy the connection string
   ```

#### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# - DATABASE_URL
# - BKASH_APP_KEY
# - BKASH_APP_SECRET
# - BKASH_USERNAME
# - BKASH_PASSWORD
# - BKASH_BASE_URL (production)
# - NEXT_PUBLIC_BASE_URL (your domain)
```

### 2. Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up

# Add PostgreSQL service
railway add postgresql

# Set environment variables in Railway dashboard
```

### 3. DigitalOcean App Platform

1. Connect your GitHub repository
2. Add PostgreSQL database addon
3. Set environment variables
4. Deploy

## Environment Variables for Production

```env
# Database (use your production PostgreSQL URL)
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# bKash Production Credentials
BKASH_APP_KEY=your_production_app_key
BKASH_APP_SECRET=your_production_app_secret
BKASH_USERNAME=your_production_username
BKASH_PASSWORD=your_production_password
BKASH_BASE_URL=https://tokenized.pay.bka.sh/v1.2.0-beta

# Your production domain
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## Pre-deployment Checklist

- [ ] Test payment flow in sandbox environment
- [ ] Update bKash credentials to production
- [ ] Set up production PostgreSQL database
- [ ] Configure all environment variables
- [ ] Test form submission and payment
- [ ] Test admin dashboard
- [ ] Set up monitoring/logging
- [ ] Configure domain and SSL

## Post-deployment

1. **Test the complete flow**:
   - Submit a form
   - Complete bKash payment
   - Verify data in admin dashboard

2. **Monitor logs** for any errors

3. **Set up backups** for your database

4. **Configure alerts** for failed payments