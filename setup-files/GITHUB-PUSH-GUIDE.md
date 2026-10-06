---
title: ZEPHYRIX - GitHub Push Guide
date: 2026-10-05
version: 1.0.0
---

# 📤 How to Push ZEPHYRIX to Your GitHub Account

**Time needed:** 10-15 minutes  
**Difficulty:** Easy (copy-paste the commands)

---

## 🎯 What This Does

Uploads all your ZEPHYRIX code to GitHub so Vercel can automatically deploy it.

---

## 📋 Prerequisites

- ✅ GitHub account (create at github.com if you don't have one)
- ✅ Git installed on your computer
- ✅ ZEPHYRIX project folder ready

---

## 🚀 Step-by-Step

### **Step 1: Create GitHub Repository** (5 min)

1. Go to **https://github.com**
2. Sign in to your account
3. Click **+** (top right) → **New repository**
4. Fill in:
   - **Repository name:** `zephyrix`
   - **Description:** `Swift Automation - AI-powered task scheduling`
   - **Visibility:** Select **Public** (Vercel needs to access it)
5. **DO NOT** check "Initialize this repository"
6. Click **Create repository**

**You'll see instructions.** Don't follow them yet - use the commands below instead.

---

### **Step 2: Open Terminal/Command Prompt**

**On Mac:**
- Press `Cmd + Space`
- Type `terminal`
- Press Enter

**On Windows:**
- Press `Win + R`
- Type `cmd`
- Press Enter

**On Linux:**
- Open your terminal application

---

### **Step 3: Navigate to Your Project**

Copy and paste this command (one at a time):

```bash
cd ~/ClaudeCowork/Tara-second-Brain/task-management-system
```

Press Enter.

---

### **Step 4: Initialize Git** 

```bash
git init
```

Press Enter.

---

### **Step 5: Add All Files**

```bash
git add .
```

Press Enter.

---

### **Step 6: Create Initial Commit**

```bash
git commit -m "Initial ZEPHYRIX MVP commit"
```

Press Enter.

---

### **Step 7: Add Remote Repository**

Replace `YOUR-USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR-USERNAME/zephyrix.git
```

Example (if your username is `john-doe`):
```bash
git remote add origin https://github.com/john-doe/zephyrix.git
```

Press Enter.

---

### **Step 8: Rename Branch**

```bash
git branch -M main
```

Press Enter.

---

### **Step 9: Push to GitHub** ⚡

```bash
git push -u origin main
```

Press Enter.

**If prompted for a password:**
- On Mac/Linux: Use your GitHub personal access token (or password)
- On Windows: Use your GitHub credentials

---

### **Step 10: Verify**

Go back to GitHub (refresh the page) - you should see all your files! ✅

---

## 🐛 Troubleshooting

### **Issue: "fatal: not a git repository"**
**Solution:** Make sure you're in the right directory. Run:
```bash
pwd
```
Should show: `.../task-management-system`

### **Issue: "Please tell me who you are"**
**Solution:** Configure Git first:
```bash
git config --global user.name "Your Name"
git config --global user.email "info@platinumbusinessteams.com"
```

Then try the commit again:
```bash
git commit -m "Initial ZEPHYRIX MVP commit"
```

### **Issue: "Permission denied"**
**Solution:** You may need to generate a personal access token:
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with `repo` and `admin:repo_hook` permissions
3. Copy the token
4. When Git asks for a password, paste the token instead

### **Issue: "fatal: remote origin already exists"**
**Solution:** Remove the old remote:
```bash
git remote remove origin
```
Then add it again with the correct URL.

---

## ✅ Success!

If you see:
```
Counting objects: ...
Compressing objects: ...
Writing objects: ...
```

**It's working!** Wait for it to finish. You should see:
```
* [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## 🎉 You're Done!

Your code is now on GitHub. Next step:

1. Go to **https://vercel.com**
2. Sign in
3. Click **Add New** → **Project**
4. Select your `zephyrix` repository
5. Click **Import**
6. Vercel will deploy automatically!

---

## 📝 Quick Reference (All Commands in One Block)

If you want to copy-paste everything at once:

```bash
cd ~/ClaudeCowork/Tara-second-Brain/task-management-system
git init
git add .
git commit -m "Initial ZEPHYRIX MVP commit"
git remote add origin https://github.com/YOUR-USERNAME/zephyrix.git
git branch -M main
git push -u origin main
```

**Just replace `YOUR-USERNAME` with your actual GitHub username!**

---

## 🆘 Still Stuck?

1. Check that you replaced `YOUR-USERNAME` with your actual username
2. Make sure your directory has all the ZEPHYRIX files
3. Make sure Git is installed (`git --version` should show a version number)
4. Check your GitHub account has the repository created

**If still stuck:** Copy the error message and let me know!

---

**Next:** Once pushed, set up Vercel deployment (I'll guide you through that)

**You've got this!** 🚀
