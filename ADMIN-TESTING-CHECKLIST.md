---
title: ZEPHYRIX Admin Features - Testing Checklist
date: 2026-10-06
type: QA Checklist
---

# ✅ ZEPHYRIX Admin Testing Checklist

**Status:** MVP Deployed  
**Focus:** Test admin panel while waiting for full deployment  
**Time:** 15-30 minutes

---

## 🔐 Admin Panel Access

**URL:** `https://zephyrix.vercel.app/admin` (or your custom domain)  
**Login:** `info@platinumbusinessteams.com`  
**Role:** System Owner

---

## 📋 Testing Workflow

### **Phase 1: Admin Login & Dashboard**

- [ ] Login with owner email
- [ ] Verify admin panel loads
- [ ] See "System Owner" badge/indicator
- [ ] Navigation menu shows admin options
- [ ] Logout and login again (verify session persistence)

---

### **Phase 2: Plan Management**

#### **View Plans**
- [ ] See all pricing plans (Starter, Pro, Enterprise)
- [ ] View plan details:
  - [ ] Task limit per plan
  - [ ] Template count per plan
  - [ ] Feature list per plan
- [ ] Plans are read-only (cannot accidentally delete)

#### **Edit Plan Settings** (if supported)
- [ ] Click "Edit" on a plan
- [ ] Modify task limit (e.g., 20 → 30)
- [ ] Modify template count
- [ ] Click "Save"
- [ ] Verify change persisted (refresh page)
- [ ] Revert to original (to not affect real users)

---

### **Phase 3: Template Management**

#### **View Templates**
- [ ] See all available templates
- [ ] Filter by plan (Starter, Pro, Enterprise)
- [ ] View template details:
  - [ ] Name (e.g., "Weekly Sales Report")
  - [ ] Description
  - [ ] Task type (Data, File, Personal)
  - [ ] Default schedule
  - [ ] Which plans include it

#### **Create Test Template** (if supported)
- [ ] Click "Add Template"
- [ ] Fill in:
  - [ ] Name: "Admin Test Template"
  - [ ] Description: "Test template for QA"
  - [ ] Task type: Data & Report
  - [ ] Default prompt
  - [ ] Assign to plan: Starter
- [ ] Click "Create"
- [ ] Verify it appears in template list
- [ ] **Delete it after testing** (don't leave test data)

#### **Disable a Template**
- [ ] Click "Disable" on a template
- [ ] Verify it's marked as inactive
- [ ] Users shouldn't see it in task creation
- [ ] Re-enable it

---

### **Phase 4: User Management** (if available)

#### **View Users**
- [ ] See list of all accounts created
- [ ] See user details:
  - [ ] Email
  - [ ] Signup date
  - [ ] Subscription plan
  - [ ] Task count
  - [ ] Last login

#### **Create Test User** (if admin can create)
- [ ] Click "Add User"
- [ ] Email: `testuser@example.com`
- [ ] Plan: Starter
- [ ] Click "Create"
- [ ] Verify test user appears in list
- [ ] **Delete test user after** (keep DB clean)

#### **View User Details**
- [ ] Click on a user
- [ ] See:
  - [ ] Email & signup date
  - [ ] Current plan & status
  - [ ] Active tasks
  - [ ] API key status (added or not)
  - [ ] Execution history (if available)

---

### **Phase 5: System Settings**

#### **General Settings**
- [ ] View current system owner email
- [ ] See app version/build info
- [ ] View Vercel deployment status

#### **Email Settings** (if configured)
- [ ] Check if HighLevel integration is enabled
- [ ] View email template settings (if available)

#### **API Keys**
- [ ] View system owner API key status
- [ ] See which services are configured:
  - [ ] Claude API - Enabled/Disabled
  - [ ] Stripe - Enabled/Disabled
  - [ ] HighLevel - Enabled/Disabled
- [ ] ℹ️ Do NOT display actual keys (security)

---

### **Phase 6: Admin-Only Task Management**

#### **View All Tasks** (admin view)
- [ ] See tasks from ALL users (not just owned)
- [ ] Filter options:
  - [ ] By user
  - [ ] By status (scheduled, running, completed, failed)
  - [ ] By type (Data, File, Personal)
- [ ] Click task to see details
  - [ ] Task name, description
  - [ ] Owner (which user)
  - [ ] Schedule
  - [ ] Execution history
  - [ ] Last run result

#### **Run a Task as Admin** (if allowed)
- [ ] Select a task from any user
- [ ] Click "Run Now"
- [ ] Task executes using system owner's Claude API key
- [ ] View execution result
- [ ] Verify it logged correctly

#### **Disable/Enable User Task** (if allowed)
- [ ] Find a user's task
- [ ] Click "Disable"
- [ ] Verify it stops executing
- [ ] Re-enable it

---

### **Phase 7: Reporting & Analytics** (if available)

#### **System Overview**
- [ ] Total users created
- [ ] Total tasks created
- [ ] Total successful executions
- [ ] Total failed executions
- [ ] API usage (if tracked)

#### **Usage by Plan**
- [ ] Starter: X users, Y tasks
- [ ] Pro: X users, Y tasks
- [ ] Enterprise: X users, Y tasks

#### **Recent Activity Log**
- [ ] See last 20 actions:
  - [ ] New signups
  - [ ] New tasks
  - [ ] Executions
  - [ ] Errors
- [ ] Timestamps on each entry

---

### **Phase 8: System Monitoring** (if available)

#### **Health Status**
- [ ] Supabase connection: ✅ Connected
- [ ] Claude API: ✅ Ready (if key added)
- [ ] Stripe: ✅ Ready (if configured)
- [ ] HighLevel: ✅ Ready (if configured)

#### **Error Logs**
- [ ] View recent errors (if any)
- [ ] Filter by component:
  - [ ] Authentication
  - [ ] Task execution
  - [ ] API calls
  - [ ] Database

#### **Performance Metrics** (if available)
- [ ] Avg task execution time
- [ ] Success rate (%)
- [ ] Failed tasks this week
- [ ] Peak usage time

---

### **Phase 9: Security & Access Control**

#### **Admin-Only Features**
- [ ] Verify regular users CANNOT see admin panel
- [ ] Regular user navigates to `/admin` → Redirected to dashboard
- [ ] Regular user has no "Settings" or "Admin" menu items

#### **Data Isolation**
- [ ] User A cannot see User B's tasks
- [ ] Admin CAN see all tasks (expected)
- [ ] User API key is encrypted (not visible in plain text)

#### **Session Security**
- [ ] Logout clears session
- [ ] After logout, cannot access admin panel
- [ ] Refresh token works (if implemented)

---

### **Phase 10: Navigation & UI**

#### **Menu Structure**
- [ ] Admin dashboard link visible
- [ ] Plans section accessible
- [ ] Templates section accessible
- [ ] Users section accessible (if available)
- [ ] Tasks section accessible
- [ ] Settings accessible
- [ ] Logout button visible

#### **Responsive Design**
- [ ] Admin panel works on desktop (1920x1080)
- [ ] Works on tablet (768x1024)
- [ ] Menu collapses on mobile (375x812)
- [ ] All buttons clickable on mobile

#### **Loading States**
- [ ] Tables show loading spinner while fetching
- [ ] Buttons disable during save
- [ ] Error messages display clearly

---

## 🐛 Bug Report Template

**If you find an issue:**

```
Title: [Brief description]
Steps to Reproduce:
1. ...
2. ...
3. ...

Expected Result:
[What should happen]

Actual Result:
[What actually happened]

Screenshot/Error:
[Include if possible]

Environment:
- Browser: Chrome / Safari / Firefox
- Device: Desktop / Mobile
- URL: https://...
```

---

## 📝 Notes While Testing

Use this space to document:

```
Issue 1: [Description]
Severity: Low/Medium/High
Status: [Open/Fixed]

Issue 2: [Description]
Severity: Low/Medium/High
Status: [Open/Fixed]
```

---

## ✅ Sign-Off

Once you've completed the checklist:

- [ ] All critical features working
- [ ] No major bugs found
- [ ] Admin panel is usable
- [ ] Ready for Tier 2 integration

**Signed off by:** ________________  
**Date:** ________________  
**Notes:** _____________________________________________

---

## 📊 Quick Test Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Admin Login | ✓/✗ | |
| Plan View | ✓/✗ | |
| Template View | ✓/✗ | |
| User View | ✓/✗ | |
| Task View | ✓/✗ | |
| System Settings | ✓/✗ | |
| Analytics | ✓/✗ | |
| Mobile Response | ✓/✗ | |
| Security | ✓/✗ | |

---

## 🚀 Next Steps After Testing

1. **If all working:** ✅ Proceed to Tier 2 integration
2. **If bugs found:** 📝 Document in section above, prioritize fixes
3. **If features missing:** 📋 Add to roadmap for Tier 2+

---

**Time Estimated: 30 min**  
**Difficulty: Easy**  
**Required Knowledge: None (just click and explore)**

**Go test the admin panel!** 🎯

---

**Location:** `/home/tara/ClaudeCowork/Tara-second-Brain/task-management-system/ADMIN-TESTING-CHECKLIST.md`
