---
title: ZEPHYRIX - Simplified Setup Wizard
date: 2026-10-05
version: 1.0.0
---

# 🚀 ZEPHYRIX - Simplified Setup (No API Keys Required Yet)

**Status:** Works without Stripe, HighLevel, or Claude API keys initially  
**Owner Email:** info@platinumbusinessteams.com  
**Timeline:** Launch with basic functionality, add features as keys become available

---

## ✅ What Works NOW (No Keys)

- ✅ User authentication (signup/login)
- ✅ Task creation & management
- ✅ Calendar view with drag-to-reschedule
- ✅ Task scheduling
- ✅ Admin panel
- ✅ Plan tiers (Free/Starter/Pro/Enterprise)
- ✅ Database & storage
- ✅ User management

## ⏳ What Requires Keys (Add Later)

- ⏳ Task execution (needs Claude API key)
- ⏳ Payments (needs Stripe)
- ⏳ Email notifications (needs HighLevel)

---

## 🎯 Phase 1: Launch (This Week - No Keys)

You can launch and test the full system without any API keys. Tasks won't execute yet, but you'll have the entire platform working.

**By Oct 9:** 
- Platform live
- Users can create accounts
- Users can create tasks
- Calendar fully functional
- Admin panel working

## 🎯 Phase 2: Full Features (Next Week - With Keys)

Once you have the keys, uncomment the code and enable:
- Task execution
- Payments
- Email notifications

---

## 📋 One-Time Setup Steps

### **Step 1: Create Supabase Account** (5 min)
1. Go to https://supabase.com
2. Sign up with: **info@platinumbusinessteams.com**
3. Create new project
4. Copy **Project URL** (looks like: `https://xxxxx.supabase.co`)

### **Step 2: Create GitHub Repository** (5 min)
1. Go to https://github.com
2. Sign in to your account
3. Click **+** → **New repository**
4. Name: `zephyrix`
5. Description: "Swift Automation - AI-powered task scheduling"
6. Make it **Public** (for Vercel)
7. Click **Create repository**
8. Copy the repository URL (like: `https://github.com/yourname/zephyrix`)

### **Step 3: Push Code to GitHub** (10 min)

Open Terminal/Command Prompt and run:

```bash
# Navigate to your project
cd ~/ClaudeCowork/Tara-second-Brain/task-management-system

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial ZEPHYRIX MVP commit"

# Add remote
git remote add origin https://github.com/yourname/zephyrix

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace:** `https://github.com/yourname/zephyrix` with your actual repo URL

### **Step 4: Connect to Vercel** (5 min)
1. Go to https://vercel.com
2. Click **Add New** → **Project**
3. Select your **zephyrix** repository from GitHub
4. Click **Import**
5. Vercel will ask for environment variables - **leave them for now** (or use placeholder values)
6. Click **Deploy**

**Wait 2-3 minutes for deployment to complete**

### **Step 5: Test the Platform** (10 min)
1. Once deployed, go to your Vercel URL (or custom domain)
2. Sign up with: `info@platinumbusinessteams.com`
3. Create a test task
4. Verify calendar, admin panel, etc.

---

## 🔑 How to Get API Keys Later (When Ready)

### **Claude API Key** (For task execution)
1. Go to https://console.anthropic.com
2. Sign in or create account
3. Click **API Keys**
4. Create new key
5. Copy it
6. Add to Vercel environment variables as `CLAUDE_API_KEY`

### **Stripe Keys** (For payments)
1. Go to https://dashboard.stripe.com
2. Create account or sign in
3. Click **Developers** → **API Keys**
4. Copy **Publishable key** and **Secret key**
5. Add to Vercel environment variables:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`

### **HighLevel API Key** (For emails)
1. Log into your HighLevel account
2. Go to **Settings** → **API Keys**
3. Create new key
4. Copy it
5. Add to Vercel as `HIGHLEVEL_API_KEY`

### **Supabase Keys** (Already have from signup)
1. Go to your Supabase project
2. Click **Settings** → **API**
3. Copy the keys shown
4. Add to Vercel environment variables

---

## 🚀 After You Push to GitHub

**Vercel will automatically:**
- ✅ Detect Next.js project
- ✅ Install dependencies
- ✅ Build the app
- ✅ Deploy to a URL
- ✅ Give you a public link

**You can then:**
1. Add custom domain
2. Set environment variables
3. Invite beta users
4. Collect feedback
5. Add more features

---

## 📊 Environment Variables (For Later)

When you're ready to add functionality, use this `.env.local` template:

```bash
# Supabase (get from your project settings)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
SUPABASE_SERVICE_KEY=your_key_here

# Stripe (optional, for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx

# Claude API (optional, for task execution)
CLAUDE_API_KEY=your_claude_key_here

# HighLevel (optional, for emails)
HIGHLEVEL_API_KEY=your_hl_key_here

# Security (generate random)
JWT_SECRET=generate_random_string_here
ENCRYPTION_KEY=generate_random_string_here
```

To generate random secrets:
```bash
# On Mac/Linux:
openssl rand -base64 32

# Or use online: https://www.uuidgenerator.net/
```

---

## ✅ Checklist: You're Ready to Launch

- [ ] Supabase account created
- [ ] GitHub account ready
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel project connected
- [ ] App deployed and live
- [ ] Can sign up with info@platinumbusinessteams.com
- [ ] Can create tasks
- [ ] Calendar works
- [ ] Admin panel accessible

---

## 🎯 Next Steps in Order

1. **Create Supabase account** (5 min)
2. **Create GitHub repository** (5 min)
3. **Push code to GitHub** (10 min) - use commands above
4. **Connect to Vercel** (5 min)
5. **Wait for deployment** (3 min)
6. **Test the platform** (10 min)
7. **Share link with beta users** (when ready)

**Total time: ~45 minutes to have a live platform**

---

## 💡 Pro Tips

### **GitHub Push Issues?**

If you're not familiar with Git, use GitHub Desktop:
1. Go to https://desktop.github.com
2. Install app
3. Sign in with your GitHub account
4. File → Clone Repository → select `zephyrix`
5. Drag your project files into the folder
6. Click "Commit to main"
7. Click "Push origin"

### **Vercel Deployment Issues?**

Check the logs:
1. Go to your Vercel project
2. Click **Deployments**
3. Look for errors in the build log
4. Common issue: Missing `.env` variables (that's OK for now)

### **Testing Before GitHub Push?**

Run locally first:
```bash
npm install
npm run dev
```

Then visit http://localhost:3000 to test before pushing.

---

## 🎉 You're All Set!

This setup gets you a **fully functional ZEPHYRIX platform** in ~45 minutes with ZERO API keys needed.

Once it's live, you can:
- Add your Supabase credentials
- Enable task execution (when you have Claude API key)
- Enable payments (when you have Stripe)
- Enable emails (when you have HighLevel)

**Start with Step 1 (Create Supabase) and let me know when you're ready for the next step!**

---

**Questions?** Each step has instructions. Just follow them in order.

**Ready to launch?** You're going to ship this in under an hour. 🚀
