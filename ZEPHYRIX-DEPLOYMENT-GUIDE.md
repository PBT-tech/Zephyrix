---
title: ZEPHYRIX - Deployment & Setup Guide
date: 2026-10-05
version: 1.0.0
---

# 🚀 ZEPHYRIX MVP - Complete Deployment Guide

**Timeline:** Friday Oct 5 → Production by Oct 9  
**Status:** All code ready, deployment instructions below  
**Live URL:** zephyrix.platinumbusinessteams.com

---

## 📋 Prerequisites

You should have:
- ✅ Vercel project: "zephyrix - AI system scheduled tasks"
- ✅ Supabase project: https://mtmfdluwdqwnekswvyfl.supabase.co
- ✅ Stripe test account (or create one)
- ✅ HighLevel API key
- ✅ This repository cloned locally

---

## 🔧 Step 1: Supabase Setup (15 minutes)

### 1.1 Create Database Schema

1. Go to your Supabase project: https://mtmfdluwdqwnekswvyfl.supabase.co
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the entire contents of `ZEPHYRIX-SUPABASE-SCHEMA.sql`
5. Paste into the SQL editor
6. Click **Run** (green play button)
7. Wait for completion (should see "✓ Success")

**Expected tables created:**
- users
- teams
- tasks
- api_keys
- subscriptions
- execution_logs
- templates
- plan_settings
- admin_settings

### 1.2 Get Supabase Credentials

From Supabase dashboard:
1. Click **Settings** (bottom left)
2. Click **API**
3. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_KEY`

Store these safely - you'll need them in Step 2.

---

## 🔑 Step 2: Stripe Setup (10 minutes)

### 2.1 Get Stripe Keys

1. Go to https://dashboard.stripe.com
2. Sign in or create account
3. In Dashboard, click **Developers** → **API Keys**
4. Copy:
   - `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `Secret key` → `STRIPE_SECRET_KEY`

### 2.2 Create Webhook (For later)

*You'll set this up after deployment*

---

## 📝 Step 3: Environment Variables (5 minutes)

### 3.1 Create `.env.local` file

In your project root, create a file called `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://mtmfdluwdqwnekswvyfl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_test_xxxxx

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Encryption
ENCRYPTION_KEY=your_encryption_key_here

# HighLevel (Optional for MVP)
HIGHLEVEL_API_KEY=your_hl_api_key

# Claude API (For testing tasks)
CLAUDE_API_KEY=your_claude_api_key
```

**Where to get each:**
- **Supabase keys:** Step 1.2 above
- **Stripe keys:** Step 2.1 above
- **JWT_SECRET:** Generate random: `openssl rand -base64 32`
- **ENCRYPTION_KEY:** Generate random: `openssl rand -base64 32`
- **HIGHLEVEL_API_KEY:** From your HighLevel account
- **CLAUDE_API_KEY:** From your Claude account (Anthropic)

---

## 📦 Step 4: Install Dependencies (5 minutes)

```bash
# In your project directory
npm install

# Required packages (if not already installed):
npm install next react react-dom axios jsonwebtoken stripe @supabase/supabase-js crypto
```

---

## 🏗️ Step 5: Project Structure Setup (5 minutes)

Ensure your project has this structure:

```
zephyrix-project/
├── pages/
│   ├── index.jsx (main dashboard)
│   ├── api/
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   ├── execute.js
│   │   ├── generate.js
│   │   ├── stripe.js
│   │   └── admin.js
│   └── _app.jsx
├── components/
│   └── (your components)
├── styles/
│   └── globals.css
├── .env.local (created in Step 3)
├── vercel.json
├── package.json
└── ZEPHYRIX-*-GUIDE.md (this file)
```

**If not already structured:**
1. Copy `ZEPHYRIX-REACT-DASHBOARD.jsx` to `pages/index.jsx`
2. Copy API functions from `ZEPHYRIX-VERCEL-FUNCTIONS.js` into `pages/api/` directory
3. Save CSS into `styles/dashboard.css`

---

## 🌐 Step 6: Deploy to Vercel (10 minutes)

### 6.1 Connect Repository

1. Go to https://vercel.com
2. Sign in with your account
3. Click **Add New** → **Project**
4. Select your GitHub repository
5. Click **Import**

### 6.2 Configure Environment Variables

In the Vercel deployment settings:

1. Go to **Settings** → **Environment Variables**
2. Add all variables from your `.env.local` file:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_KEY
   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   - STRIPE_SECRET_KEY
   - JWT_SECRET
   - ENCRYPTION_KEY
   - HIGHLEVEL_API_KEY
   - CLAUDE_API_KEY

3. Click **Deploy**

### 6.3 Wait for Deployment

- Green checkmark = Success ✅
- Red X = Error (check logs)

**Build time:** ~2-3 minutes

---

## 🔗 Step 7: Connect Custom Domain (5 minutes)

### 7.1 In Vercel Dashboard

1. Go to your project settings
2. Click **Domains**
3. Click **Add**
4. Enter: `zephyrix.platinumbusinessteams.com`

### 7.2 In Your Domain DNS Settings

(platinumbusinessteams.com provider)

1. Add CNAME record:
   - **Name:** `zephyrix`
   - **Value:** `cname.vercel-dns.com`

2. Verify in Vercel (may take 5-60 minutes for DNS to propagate)

---

## ✅ Step 8: Test Deployment (10 minutes)

### 8.1 Access Your App

1. Go to: https://zephyrix.platinumbusinessteams.com
2. You should see the ZEPHYRIX login page

### 8.2 Create Account & Test

```
Email: test@example.com
Password: testpass123
Full Name: Test User
```

### 8.3 Test Flow

1. Sign up
2. Login
3. Create a test task
4. Click "Run Now"
5. Check if it executes (should succeed)

### 8.4 Check Logs

If something fails:
1. In Vercel: **Deployments** → **Logs**
2. In Supabase: **Logs** (bottom of sidebar)
3. Look for error messages

---

## 🎯 Step 9: Stripe Webhooks (10 minutes)

### 9.1 Create Webhook Endpoint

1. In Stripe Dashboard: **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter URL: `https://zephyrix.platinumbusinessteams.com/api/stripe`
4. Select events:
   - `checkout.session.completed`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
5. Click **Create endpoint**
6. Copy the **Signing secret**
7. Add to Vercel env variables as `STRIPE_WEBHOOK_SECRET`

---

## 🚨 Step 10: Troubleshooting

### Issue: Login fails

```
Error: "Invalid credentials"
```

**Solution:**
- Check Supabase connection is working
- Verify SUPABASE_SERVICE_KEY is correct
- Check database tables exist (Step 1)

### Issue: Tasks don't execute

```
Error: "API key not configured"
```

**Solution:**
- Add Claude API key in Settings
- Verify API key is correct
- Check encryption/decryption works

### Issue: Stripe payment fails

```
Error: "Invalid Stripe key"
```

**Solution:**
- Use test keys, not live keys
- Verify STRIPE_SECRET_KEY is correct
- Check webhook secret is added

### Issue: Vercel build fails

**Solution:**
1. Check build logs in Vercel
2. Look for missing dependencies
3. Run locally: `npm run dev`
4. Fix errors, then push to GitHub
5. Vercel will auto-rebuild

---

## 📊 Step 11: Post-Launch Setup (15 minutes)

### 11.1 Create System Owner Account

You should create your own admin account:

1. Sign up with your email
2. In Supabase SQL Editor:

```sql
UPDATE users
SET is_system_owner = TRUE
WHERE email = 'your@email.com';
```

### 11.2 Invite Beta Users

1. Share link: https://zephyrix.platinumbusinessteams.com
2. Have them sign up
3. Monitor usage and bugs

### 11.3 Monitor HighLevel Integration

1. Test email notifications
2. Verify HighLevel webhooks fire
3. Check email delivery

---

## 🎉 You're Live!

```
✅ Frontend: zephyrix.platinumbusinessteams.com
✅ Database: Supabase
✅ Backend: Vercel Functions
✅ Payments: Stripe
✅ Emails: HighLevel
```

---

## 🔄 Next Steps (Week 2)

### Monday Oct 7
- [ ] Test with 5 beta users
- [ ] Collect feedback
- [ ] Fix critical bugs

### Tuesday Oct 8
- [ ] Add more templates
- [ ] Improve UI based on feedback
- [ ] Test reporting features

### Wednesday Oct 9
- [ ] Load test (simulate 100+ concurrent users)
- [ ] Security audit
- [ ] Optimize database queries

### Thursday Oct 10
- [ ] Launch marketing site
- [ ] Send pre-launch emails
- [ ] Set up analytics

---

## 📞 Support

**If something goes wrong:**

1. Check Vercel logs: **Deployments** → **Logs**
2. Check Supabase logs: **Logs** sidebar
3. Check browser console: F12 → **Console** tab
4. Search error message in code

---

## 🎯 Final Checklist

- [ ] Supabase schema created
- [ ] Environment variables set in Vercel
- [ ] Domain connected
- [ ] Deployed and live
- [ ] Can login and create tasks
- [ ] Tasks can execute
- [ ] Stripe webhooks working
- [ ] System owner account created
- [ ] Beta users invited
- [ ] Monitoring dashboard set up

---

**Deployment Complete!** 🚀

You now have a fully functional ZEPHYRIX MVP running at:
## 🌐 https://zephyrix.platinumbusinessteams.com

Ready to onboard beta users and gather feedback!

---

**Created:** October 5, 2026  
**Version:** 1.0.0 (MVP)  
**Status:** ✅ Production Ready
