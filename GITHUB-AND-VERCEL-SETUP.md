---
title: ZEPHYRIX - GitHub & Vercel Quick Setup
date: 2026-10-06
---

# 🚀 GitHub & Vercel Setup (You're Almost There!)

**Status:** Supabase is ready ✅  
**Next:** Push to GitHub → Deploy to Vercel  
**Time:** 15 minutes

---

## 📍 Where You Are

✅ Supabase account created  
✅ Environment variables in `.env.local.example`  
✅ All code ready to deploy  
👉 **You are here:** Push to GitHub & configure Vercel

---

## 🐙 Step 1: GitHub Repository Setup (5 min)

### Create the Repository

1. Go to **https://github.com**
2. Click **+** (top right) → **New repository**
3. Enter:
   - **Repository name:** `zephyrix`
   - **Description:** `Swift Automation - AI-powered task scheduling`
   - **Visibility:** **Public** ← Important for Vercel
4. **DO NOT check** "Initialize this repository with a README"
5. Click **Create repository**

---

## 📤 Step 2: Push Code to GitHub (10 min)

Open Terminal and run these commands (one at a time):

```bash
cd ~/ClaudeCowork/Tara-second-Brain/task-management-system
```

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Initial ZEPHYRIX MVP commit"
```

**Replace YOUR-USERNAME with your actual GitHub username:**
```bash
git remote add origin https://github.com/YOUR-USERNAME/zephyrix.git
```

Example (if username is `jane-doe`):
```bash
git remote add origin https://github.com/jane-doe/zephyrix.git
```

```bash
git branch -M main
```

```bash
git push -u origin main
```

**When prompted for password:** Use your GitHub personal access token (or password)

---

## ⚡ Step 3: Vercel Deployment (5 min)

### Connect GitHub to Vercel

1. Go to **https://vercel.com**
2. Click **Add New** → **Project**
3. Click **Continue with GitHub** (if not already connected)
4. Select your **zephyrix** repository
5. Click **Import**

### Add Environment Variables

On the configuration page, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key
SUPABASE_SERVICE_KEY = your_service_role_key
JWT_SECRET = your_generated_random_string
ENCRYPTION_KEY = your_generated_random_string
NEXT_PUBLIC_APP_NAME = ZEPHYRIX
NODE_ENV = production
```

**Get these values from your `.env.local.example` file**

For **JWT_SECRET** and **ENCRYPTION_KEY**, use the random strings you generated earlier.

### Deploy

1. Click **Deploy**
2. Wait 2-3 minutes
3. You'll see a success message when done

---

## 🎯 Connect Custom Domain (Optional Now)

After deployment is complete:

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add: `zephyrix.platinumbusinessteams.com`
3. Follow the DNS instructions (add CNAME record)

---

## ✅ You're Live!

Once deployment completes:

1. Visit your Vercel deployment URL (or custom domain)
2. Sign up with: `info@platinumbusinessteams.com`
3. Test creating a task
4. Test calendar drag-reschedule
5. Test admin panel

---

## 🔧 Using This Claude Account for Task Execution

Your system is ready. When you want to enable task execution using this Claude account:

1. You already have your Claude API key from console.anthropic.com
2. Add it to Vercel as: `CLAUDE_API_KEY`
3. Tasks will execute using this account automatically

**The code is ready.** Just add the API key when you're ready.

---

## 🐛 Troubleshooting GitHub Push

**Error: "fatal: not a git repository"**
→ Make sure you're in the right directory:
```bash
pwd
```

**Error: "Please tell me who you are"**
→ Configure Git:
```bash
git config --global user.name "Your Name"
git config --global user.email "info@platinumbusinessteams.com"
```

**Error: "Permission denied"**
→ Use GitHub personal access token instead of password

---

## 📋 Vercel Environment Variables Reference

Copy-paste these variable names into Vercel (they must match exactly):

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY
JWT_SECRET
ENCRYPTION_KEY
NEXT_PUBLIC_APP_NAME
NODE_ENV
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_SYSTEM_OWNER_EMAIL
CLAUDE_API_KEY (optional for now)
STRIPE_SECRET_KEY (optional for now)
STRIPE_WEBHOOK_SECRET (optional for now)
HIGHLEVEL_API_KEY (optional for now)
```

---

## 🎉 You're Done!

Once Vercel shows ✅ Deployment successful:

**Your ZEPHYRIX platform is LIVE** 🚀

- URL: https://zephyrix.vercel.app (or your custom domain)
- Owner: info@platinumbusinessteams.com
- Database: Connected to Supabase
- Ready: For beta testing

---

**Next steps:**
1. Test the platform
2. Invite beta users
3. Add Claude API key when ready for task execution
4. Add Stripe keys when ready for payments

**Questions?** Everything is in the guides. You've got this! 🚀
