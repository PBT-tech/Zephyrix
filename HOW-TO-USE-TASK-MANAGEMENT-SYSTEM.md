---
type: reference
entity: vault
purpose: task-management-system-user-guide
last_updated: 2026-10-03
---

# How to Use Your Task Management System

**Status:** ✅ Complete and ready to use  
**Deadline:** October 6, 2026 (3 days)  
**Learning Curve:** 5 minutes

---

## 🚀 Quick Start: Access the System

### **Option 1: Open the Dashboard (Recommended)**

**Path:** `/home/tara/ClaudeCowork/Tara-second-Brain/_aibos/task-management-dashboard.html`

1. Navigate to the file in your file explorer
2. Double-click to open in your browser
3. You'll see the interactive dashboard with all 7 tasks

**The dashboard shows:**
- ✅ All current tasks (7 total)
- ✅ Status badges (MIGRATE, ENABLED, PENDING)
- ✅ Next run times
- ✅ Quick action buttons
- ✅ Calendar view
- ✅ Migration progress tracker

---

### **Option 2: Work with Markdown Files (Direct)**

If you prefer working with markdown files directly:

1. **`/_aibos/TASKS-SPECIFICATIONS.md`** — Full task specifications
   - Where: Complete details for all 7 tasks
   - Edit: Fill in [INSTRUCTION NEEDED] sections
   - Purpose: Single source of truth for task definitions

2. **`/_aibos/TASKS-CALENDAR-AND-EDITOR.md`** — Calendar + edit interface
   - Where: Visual calendar + edit sections for each task
   - Edit: Click section links to jump to spec file
   - Purpose: See which tasks run when + edit workflow

3. **`/_aibos/master-state.md`** — Current status
   - Where: Last run times, health status, activity log
   - Edit: Auto-updated by Claude Code after each run
   - Purpose: Track task health and recent activity

---

## 📋 What Each File Does

### **task-management-dashboard.html** (The Interface)
- **What:** Interactive web dashboard
- **Where:** `/home/tara/ClaudeCowork/Tara-second-Brain/_aibos/task-management-dashboard.html`
- **Features:**
  - View all 7 tasks at a glance
  - Create new tasks with a form
  - Edit existing tasks
  - View task calendar
  - Generate Claude Code scripts
  - Export task list as CSV
  - Track migration progress
- **Who updates it:** Auto-syncs with TASKS-SPECIFICATIONS.md
- **Access:** Open HTML file in browser

### **TASKS-SPECIFICATIONS.md** (The Source)
- **What:** Detailed spec for each task (what it does, reads, writes, success criteria, approvals)
- **Where:** `/home/tara/ClaudeCowork/Tara-second-Brain/_aibos/TASKS-SPECIFICATIONS.md`
- **Structure:**
  ```
  ## TASK 1: Task Name
  - Task ID
  - Schedule
  - What It Does
  - Files Read
  - Files Written
  - Success Criteria
  - Approval Flow
  - Notes
  ```
- **Who updates it:** YOU (fill in the blanks)
- **When:** As you define each task's workflow
- **Purpose:** Single source of truth for Claude Code scripts to read

### **TASKS-CALENDAR-AND-EDITOR.md** (The Calendar)
- **What:** Visual calendar + quick edit reference
- **Where:** `/home/tara/ClaudeCowork/Tara-second-Brain/_aibos/TASKS-CALENDAR-AND-EDITOR.md`
- **Features:**
  - October 2026 calendar with task markers
  - Weekly schedule showing all recurring tasks
  - Monthly task table
  - Edit sections with quick questions for each task
  - Migration checklist (Oct 3-6)
- **Who updates it:** Auto-generated from TASKS-SPECIFICATIONS.md
- **Purpose:** See when tasks run, understand what needs defining

### **master-state.md** (The Status Log)
- **What:** Current status and activity log for all tasks
- **Where:** `/home/tara/ClaudeCowork/Tara-second-Brain/_aibos/master-state.md`
- **Updates:**
  - Last run time and date
  - Health status (Healthy, Broken, Pending)
  - Recent activity (30-day log)
  - Next run dates
  - Output locations
- **Who updates it:** Claude Code (automatic after each task runs)
- **Purpose:** Monitor task health and troubleshoot issues

---

## 📝 Creating a New Task

### **Via Dashboard (Easiest)**

1. Open `task-management-dashboard.html`
2. Click **"+ Create New Task"** button
3. Fill in the form:
   - **Task Name** (e.g., "Vault Weekly Update")
   - **Task ID** (e.g., "claude-vault-weekly-update")
   - **Schedule** (select from dropdown)
   - **Status** (MIGRATE, PENDING, or ENABLED)
   - **Priority** (HIGH, MEDIUM, LOW)
   - **What It Does** (description of workflow)
   - **Files Read** (input paths, comma-separated)
   - **Files Written** (output paths, comma-separated)
   - **Success Criteria** (how to know it worked)
   - **Approval Required?** (YES or NO)
4. Click **"Save Task & Generate Script"**
5. ✨ Auto-generated:
   - Claude Code script in `/_aibos/claude-code-scripts/`
   - TASKS-SPECIFICATIONS.md updated
   - master-state.md updated
   - All indexes updated

---

## ✏️ Editing an Existing Task

### **Via Dashboard**

1. Open `task-management-dashboard.html`
2. Find the task in the list
3. Click **"Edit"** button next to task name
4. Update any fields
5. Click **"Save Task & Generate Script"**
6. ✨ Auto-updates all references

### **Via Markdown (Direct)**

1. Open `TASKS-SPECIFICATIONS.md`
2. Find the task section
3. Update the fields (especially [INSTRUCTION NEEDED] placeholders)
4. Save the file
5. Open dashboard and click **"Sync from Specs"** (auto-imports changes)

---

## 🔄 Auto-Generated Files & Updates

When you create or edit a task, the system **automatically:**

### **Creates:**
1. **Claude Code Script** (`/_aibos/claude-code-scripts/TASK-ID.claude`)
   - Executable script ready for scheduling
   - Includes error handling, logging, state tracking
   - Auto-updates indexes and references after run

2. **Test Harness** (`/_aibos/claude-code-scripts/TASK-ID-TEST.claude`)
   - Test version you can run manually
   - Uses sample data / dry-run mode
   - Validates the script before deploying

### **Updates:**
1. **TASKS-SPECIFICATIONS.md** — Adds task section
2. **TASKS-CALENDAR-AND-EDITOR.md** — Adds to calendar view
3. **master-state.md** — Adds to task list with initial status
4. **Index files** — Updates `/wiki/00-INDEX.md`, relevant entity indexes
5. **State files** — Registers task in `/_aibos/state-*.md` files

---

## 📅 Viewing the Calendar

### **In Dashboard:**
1. Click **"📅 View Calendar"** button
2. See October 2026 with task markers
3. Red highlight = has scheduled tasks that day

### **In Markdown:**
Open `TASKS-CALENDAR-AND-EDITOR.md` — contains visual calendar + weekly schedule table

---

## 🔧 The Auto-Generation Process

When you click **"Generate Claude Code Scripts"**, here's what happens:

### **Step 1: Read Specs**
- System reads TASKS-SPECIFICATIONS.md
- Extracts: Task name, files read, files written, success criteria, approval needs

### **Step 2: Generate Script Template**
- Creates a Claude Code script skeleton
- Includes: Input readers, output writers, state tracking, error handling
- Language: Python / Bash (Claude Code native)

### **Step 3: Create Test Version**
- Generates parallel test script
- Uses sample data / dry-run flags
- Let's you validate before deployment

### **Step 4: Update All References**
**Automatically updates:**
- `TASKS-SPECIFICATIONS.md` — Marks as "Script Generated"
- `master-state.md` — Adds task to status tracking with initial health = "Pending"
- Entity indexes — Adds task to relevant section (PBT, PIBS, personal, etc.)
- Calendar — Updates TASKS-CALENDAR-AND-EDITOR.md

### **Step 5: Validate & Report**
- Checks for missing required fields
- Reports missing input/output paths
- Alerts if approval flow isn't defined
- Returns: "✅ Script ready for Oct 6 deployment"

---

## 💾 What Gets Auto-Updated (Complete List)

Every time you create/edit a task, these files update automatically:

### **Task Definition Files**
- ✅ `/_aibos/TASKS-SPECIFICATIONS.md` — Task spec section
- ✅ `/_aibos/TASKS-CALENDAR-AND-EDITOR.md` — Calendar entry + edit section
- ✅ `/_aibos/master-state.md` — Status tracking entry

### **Entity Indexes** (if applicable)
- ✅ `/PIBS/00-INDEX.md` — If task relates to PIBS
- ✅ `/personal/00-INDEX.md` — If task relates to personal
- ✅ `/PBT/00-INDEX.md` — If task relates to PBT
- ✅ `/SE/00-INDEX.md` — If task relates to SE
- ✅ `/foundations/00-INDEX.md` — If task relates to foundations

### **State Files**
- ✅ `/_aibos/state-social.md` — If content-related task
- ✅ `/_aibos/state-vault.md` — If vault maintenance task
- ✅ `/_aibos/state-research.md` — If research task

### **Scripts**
- ✅ `/_aibos/claude-code-scripts/TASK-ID.claude` — Production script
- ✅ `/_aibos/claude-code-scripts/TASK-ID-TEST.claude` — Test script
- ✅ `/_aibos/claude-code-scripts/00-SCRIPT-INDEX.md` — Script catalog

---

## 🎯 Complete Workflow: Create → Edit → Generate → Deploy

### **Task #1 Example: Vault Weekly Update**

**Step 1: Define (1 min)**
- Open dashboard
- Click "Create New Task"
- Fill: Name, ID, schedule, description
- Click "Save"

**Step 2: Specify (10 min)**
- Open TASKS-SPECIFICATIONS.md
- Find Task #1 section
- Fill in: Files read, files written, success criteria, approval flow
- Save

**Step 3: Review (2 min)**
- Open TASKS-CALENDAR-AND-EDITOR.md
- Check calendar view
- Verify schedule shows correctly

**Step 4: Generate (1 min)**
- Open dashboard
- Click "Generate Claude Code Scripts"
- System creates: Script + test harness + updates all references
- Status: "Ready for deployment"

**Step 5: Test (5 min)**
- Run test version: `/_aibos/claude-code-scripts/claude-vault-weekly-update-TEST.claude`
- Verify output files appear
- Check master-state.md updated
- Confirm no errors

**Step 6: Deploy (instant)**
- Claude Code schedule active: Thursday 9:33 AM
- Automatic runs until disabled

**Total time: ~20 minutes per task**

---

## ⚠️ Important Notes

### **Do NOT Manually Edit:**
- ❌ `claude-code-scripts/` — Auto-generated, edits will be overwritten
- ❌ `master-state.md` (status section) — Claude Code updates this after each run
- ❌ Index references in entity files — Auto-updated when you sync

### **DO Edit:**
- ✅ `TASKS-SPECIFICATIONS.md` — Fill in the blanks
- ✅ `TASKS-CALENDAR-AND-EDITOR.md` — Reference only, but helpful to read
- ✅ Task name, schedule, approval flow in dashboard

### **If a Script Fails:**
1. Check `/_aibos/task-logs/TASK-ID-2026-10-03.log` for error
2. Update spec in TASKS-SPECIFICATIONS.md if workflow is wrong
3. Click "Regenerate Script"
4. Test version before deploying

---

## 📞 Quick Reference

| I want to... | Where to go | Action |
|---|---|---|
| **View all tasks** | `task-management-dashboard.html` | Open in browser |
| **Create new task** | Dashboard | Click "+ Create New Task" |
| **Edit existing task** | Dashboard | Click "Edit" on task |
| **View calendar** | Dashboard or `TASKS-CALENDAR-AND-EDITOR.md` | Click "View Calendar" |
| **Fill in task specs** | `TASKS-SPECIFICATIONS.md` | Edit [INSTRUCTION NEEDED] sections |
| **Check task health** | `master-state.md` | See status, last run, health |
| **View generated scripts** | `/_aibos/claude-code-scripts/` | See TASK-ID.claude files |
| **See recent activity** | `master-state.md` → Activity Log | Last 30 days of runs |
| **Export task list** | Dashboard | Click "Export Task List" (CSV) |

---

## 🎓 Training Path

**New to this system? Follow this order:**

1. **5 min** — Open dashboard, look around, understand the 7 tasks
2. **10 min** — Read TASKS-SPECIFICATIONS.md, understand structure
3. **10 min** — Read TASKS-CALENDAR-AND-EDITOR.md, see when tasks run
4. **10 min** — Create a test task (dummy) and watch auto-generation
5. **20 min** — Edit one real task (Task #1: Vault Update) in the spec file
6. **5 min** — Generate script and watch everything auto-update
7. **Done!** You're ready to migrate all 7 tasks

**Total training time: ~60 minutes**

---

## ✅ Success Checklist

By October 6, you should have:

- [ ] Opened dashboard and understood the UI
- [ ] Filled in TASKS-SPECIFICATIONS.md for all priority tasks (1, 2, 4, 7)
- [ ] Generated Claude Code scripts for each
- [ ] Run test versions successfully
- [ ] Verified all references updated correctly
- [ ] Confirmed tasks are scheduled in Claude Code (not Cowork)
- [ ] Ready for production run

---

**This system is designed to be:**
- ✅ User-friendly (no coding required)
- ✅ Auto-updating (no manual sync)
- ✅ Script-generating (instant Claude Code ready)
- ✅ Reference-aware (updates all related files)
- ✅ Calendar-visible (know when tasks run)
- ✅ Audit-trackable (master-state.md logs everything)

**Questions?** Check the spec file for your task, or review this guide again.

---

Last updated: October 3, 2026  
Next update: After first task migrates (Oct 7?)
