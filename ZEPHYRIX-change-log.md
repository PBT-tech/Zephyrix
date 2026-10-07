---
title: ZEPHYRIX Change Log
date: 2026-10-07
---

# ZEPHYRIX Change Log

## Entry 1 (Initial MVP) - 2026-10-06
- Supabase Auth integration (signup/login)
- Task CRUD API endpoints
- Basic dashboard with task list
- Simple task creation form (name + frequency only)

---

## Entry 2 - 2026-10-06
- Fixed 404 errors on /api/tasks endpoint
- Created proper Vercel Functions structure
- Added JWT authentication to APIs
- Integrated environment variables (Supabase URL, Anon Key)

---

## Entry 3 - 2026-10-06 to 2026-10-07

### Auth & Architecture Fixes
- ✅ Migrated from localStorage to Supabase Auth (eliminated SSR errors)
- ✅ Fixed foreign key constraint violations (23503 errors)
- ✅ Created Supabase trigger to auto-sync auth.users → custom users table
- ✅ Dropped problematic FK constraints, then re-added with trigger support
- ✅ Database schema: Added description, execution_result, approval_status columns

### Form & UI Enhancements
- ✅ Expanded task creation form with:
  - Description field
  - Prompt/Instructions field
  - Input files paths
  - Output files paths
  - Success criteria field
- ✅ Added EditTaskModal component for task editing
- ✅ Added delete functionality for tasks
- ✅ Edit/Delete buttons on task cards in dashboard

### Backend API Updates
- ✅ Updated /api/tasks POST to accept all new fields
- ✅ Updated /api/tasks PUT to support task updates
- ✅ Updated /api/tasks GET to decrypt sensitive fields
- ✅ Updated /api/tasks DELETE for task removal
- ✅ Added detailed logging for debugging

### Security & Encryption
- ✅ Created encryption utility (lib/encryption.js) with AES-256-GCM
- ✅ Implemented encryptData/decryptData functions
- ✅ Prepared infrastructure for encrypting prompts & sensitive data
- ✅ (Deferred full rollout pending encryption refactor)

### Database
- ✅ Created clean schema migration (ZEPHYRIX-SUPABASE-SCHEMA-CLEAN.sql)
- ✅ Added 001-add-task-fields.sql migration
- ✅ Fixed NOT NULL constraint on password_hash for Supabase Auth users

### Testing & Documentation
- ✅ Created testing-notes.md for bug tracking
- ✅ Marked resolved issues with root cause analysis
- ✅ Created this changelog

---

## Entry 4 - 2026-10-07

### UI Improvements
- ✅ Hidden prompt snippet from Dashboard task list (kept only in edit modal)
- ✅ Added time picker to task creation form (24-hour format)
- ✅ Added "Run Once" frequency option with date picker
- ✅ Added day-of-week selector for weekly tasks (clickable day buttons)
- ✅ Conditional field display based on frequency selection

### Task Scheduling Features
- ✅ Time scheduling for all task types
- ✅ Single-run task support with date selection
- ✅ Weekly task with multi-day selection
- ✅ Daily/Monthly task with time selection

---

## Next Priority (Entry 5+)
1. Task execution engine (Run Now button integration with Claude)
2. Performance optimization (task loading speed)
3. Mobile-responsive design
4. Calendar view implementation
5. Task history/execution logs display

---

## Known Issues (As of 2026-10-07)
- ⚠️ Foreign key constraint required Supabase trigger workaround
- ⚠️ Task creation form expanded but prompt display needs refinement
- ⚠️ No advanced scheduling UI yet
- ⚠️ Encryption infrastructure ready but not fully integrated

---

## Technical Debt
- [ ] Refactor users table architecture (currently hybrid auth.users + custom users)
- [ ] Complete AES-256 encryption integration for prompts
- [ ] Add comprehensive error handling to API
- [ ] Performance optimization for task loading
- [ ] Mobile-responsive CSS overhaul
