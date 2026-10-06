---
title: ZEPHYRIX - Claude API Key Setup (Two Levels)
date: 2026-10-06
---

# 🔑 Claude API Key Setup - User vs System Owner

**Architecture:** Each user brings their own Claude API key. System owner has a fallback key for testing.

---

## 📊 How It Works

```
SYSTEM OWNER (You):
├─ Claude API Key: In Vercel environment variables
├─ Purpose: Testing, system-level task execution
└─ Access: Can test tasks with this key

YOUR USERS:
├─ Claude API Key: Added in their Settings page
├─ Purpose: Their tasks use their own API key
└─ Access: Each user enters their own key in Settings
```

---

## 🔧 Setup (Two Steps)

### **Step 1: System Owner Key (For Testing)**

1. Go to **https://console.anthropic.com**
2. Create/copy your Claude API key
3. In Vercel dashboard:
   - Go to **Settings** → **Environment Variables**
   - Add: `CLAUDE_API_KEY` = `your_claude_api_key_here`
4. Deploy

**Result:** You can test tasks using your account's key ✅

### **Step 2: User Keys (In Settings)**

When users sign up and log in:
1. They go to **Settings** page
2. Click **Add API Key**
3. Select service: **Claude (Anthropic)**
4. Enter their Claude API key
5. Click **Save**

**Result:** Their tasks execute with their own API key ✅

---

## 🎯 What Happens on Task Execution

### **Scenario 1: User Has Added Their Key**
```
User creates task
     ↓
Clicks "Run Now"
     ↓
System uses USER'S Claude API key (from their Settings)
     ↓
Task executes with their account
```

### **Scenario 2: User Hasn't Added Key Yet**
```
User creates task
     ↓
Clicks "Run Now"
     ↓
System checks: User has key? No.
     ↓
Falls back to: System owner key (from env variables)
     ↓
Task executes with YOUR account (temporary)
     ↓
User sees message: "Add your Claude API key in Settings for permanent access"
```

---

## 📝 Code Changes Needed

In `ZEPHYRIX-VERCEL-FUNCTIONS.js`, the execution function already handles this:

```javascript
// Get user's API key from database
const { data: apiKey } = await supabase
  .from('api_keys')
  .select('encrypted_key')
  .eq('user_id', userId)
  .eq('key_type', 'claude')
  .single();

// If user has a key, decrypt and use it
if (apiKey) {
  claudeApiKey = decryptKey(apiKey.encrypted_key);
}

// If not, fall back to system owner's key
if (!claudeApiKey) {
  claudeApiKey = process.env.CLAUDE_API_KEY;
}

// Execute with whichever key is available
await callClaudeAPI(claudeApiKey, task.prompt);
```

**The code already supports this!** ✅

---

## ✅ Your Vercel Setup

Add to Vercel environment variables:

```
CLAUDE_API_KEY = sk_... (your Claude API key)
```

That's it. Everything else is user-managed in Settings.

---

## 🎯 User Flow (What They See)

### **First Time**
1. User signs up
2. Creates a task
3. Clicks "Run Now"
4. Error: "No Claude API key configured"
5. Message: "Add your API key in Settings"

### **After Adding Key**
1. User goes to **Settings**
2. Clicks **Add API Key**
3. Pastes their Claude API key
4. Clicks **Save**
5. Creates task
6. Clicks "Run Now"
7. ✅ Task executes with their key

---

## 🔐 Security

✅ User keys are encrypted in database (AES-256)  
✅ System owner key in env (never exposed)  
✅ Each user's key is isolated to their account  
✅ Keys are never logged or displayed  

---

## 📋 Vercel Environment Variables (Complete List)

```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key
SUPABASE_SERVICE_KEY = your_service_role_key
JWT_SECRET = your_random_string
ENCRYPTION_KEY = your_random_string
CLAUDE_API_KEY = sk_... (YOUR key for testing)
NEXT_PUBLIC_APP_NAME = ZEPHYRIX
NODE_ENV = production
```

---

## 🧪 Testing Flow

1. **System Owner Testing:**
   - Log in as: info@platinumbusinessteams.com
   - Create task
   - Click "Run Now"
   - Uses your CLAUDE_API_KEY from env ✅

2. **User Testing:**
   - New user signs up
   - Adds their Claude API key in Settings
   - Create task
   - Click "Run Now"
   - Uses their key ✅

---

## 🎉 Architecture Complete

Users bring their own keys. Your account is the safety net.

**Ready to deploy!** 🚀

---

**Next:** Follow GITHUB-AND-VERCEL-SETUP.md to go live.
