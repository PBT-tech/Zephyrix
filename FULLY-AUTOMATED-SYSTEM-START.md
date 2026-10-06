---
type: reference
entity: vault
purpose: quick-start-automated-task-system
last_updated: 2026-10-04
---

# ✨ Fully Automated Task Management System - Quick Start

**You only touch the dashboard. Everything else is automated.**

---

## 🚀 The Complete Workflow (3 Steps)

### **Step 1: Design Your Tasks** (5 min per task)
1. Open: `/_aibos/task-management-dashboard.html`
2. Click **"+ Create New Task"**
3. Fill in:
   - Task Name (e.g., "Vault Weekly Update")
   - Task ID (e.g., "claude-vault-weekly-update")
   - Status (MIGRATE, PENDING, or ENABLED)
   - Priority (HIGH, MEDIUM, LOW)
4. Use **Schedule Builder** to pick:
   - Recurrence (Daily, Weekly, Monthly, Once)
   - Days (click day buttons)
   - Time (hour + minute)
5. Fill in description, files, success criteria
6. **Click "Save Task & Generate Script"**
   - ✅ Task saved to queue
   - ✅ Ready for automation

### **Step 2: Run Automation** (1 minute)
```bash
cd ~/ClaudeCowork/Tara-second-Brain/_aibos
claude run task-automation.claude
```

**What it does automatically:**
- ✅ Creates task specifications (TASKS-SPECIFICATIONS.md)
- ✅ Adds to calendar (TASKS-CALENDAR-AND-EDITOR.md)
- ✅ Updates status tracking (master-state.md)
- ✅ Generates Claude Code scripts (production + test)
- ✅ Updates entity indexes (PIBS, personal, PBT, etc.)
- ✅ Creates script catalog (00-SCRIPT-INDEX.md)

### **Step 3: Tasks are Ready** ✅
Your tasks are now:
- ✅ Fully specified and documented
- ✅ Have Claude Code scripts ready to run
- ✅ Scheduled to run on their configured times
- ✅ Tracked in master-state.md

---

## 📋 Workflow Summary

```
YOU                          AUTOMATION                    CLAUDE CODE
─────────────────────────────────────────────────────────────────────

Open Dashboard        →    Show task form
Fill in task details  →    Store in queue
Click "Save"          →    Save to localStorage
                           (ready for processing)
                      
Run automation       →    claude run task-automation.claude
                     →    Read queue
                     →    Generate all files
                     →    Create scripts
                     →    Update indexes
                     →    Return: "All tasks ready"
                                                    →    Tasks scheduled
                                                    →    Ready to execute
```

---

## 🎯 Right Now: Get Started

### **For Task #1 (Vault Weekly Update):**

1. **Open dashboard:**
   ```
   /_aibos/task-management-dashboard.html
   ```

2. **Click "Create New Task"** and fill in:
   - Name: `Vault Weekly Update`
   - ID: `claude-vault-weekly-update`
   - Status: `MIGRATE`
   - Priority: `HIGH`
   - Schedule: Weekly, Monday + Thursday, 9:33 AM
   - Description: "Updates vault from raw notes to wiki"
   - Files read: `/PIBS/raw/, /personal/raw/`
   - Files written: `/PIBS/wiki/hot.md, /_aibos/master-state.md`
   - Success: "Wiki updated with latest notes"
   - Approval: `NO`

3. **Click "Save Task & Generate Script"**
   - You'll see: "Task saved to queue"

4. **Repeat for Tasks #2, #4, #7** (the urgent ones)

5. **Run automation once:**
   ```bash
   cd ~/ClaudeCowork/Tara-second-Brain/_aibos
   claude run task-automation.claude
   ```

6. **Done!** All tasks are now:
   - ✅ Specified
   - ✅ Have scripts
   - ✅ Scheduled
   - ✅ Ready to run

---

## 📁 What Gets Created

After running automation, you'll have:

```
/_aibos/
├── TASKS-SPECIFICATIONS.md      ← Full task specifications
├── TASKS-CALENDAR-AND-EDITOR.md ← Calendar view
├── master-state.md              ← Status tracking
├── tasks.json                   ← Your task queue (from dashboard)
│
└── claude-code-scripts/
    ├── 00-SCRIPT-INDEX.md       ← Script catalog
    ├── claude-vault-weekly-update.claude
    ├── claude-vault-weekly-update-TEST.claude
    ├── li-rlf-signal-scan.claude
    ├── li-rlf-signal-scan-TEST.claude
    └── ... (one pair per task)
```

---

## ✅ Checklist for Oct 4-6

- [ ] **Oct 4:** Create Task #1 in dashboard (10 min)
- [ ] **Oct 4:** Create Task #2 in dashboard (10 min)
- [ ] **Oct 4:** Create Task #4 in dashboard (10 min)
- [ ] **Oct 4:** Create Task #7 in dashboard (10 min)
- [ ] **Oct 4:** Run `claude run task-automation.claude` (1 min)
- [ ] **Oct 4:** Verify scripts created in `/_aibos/claude-code-scripts/` (2 min)
- [ ] **Oct 5:** Test one script: `claude run _aibos/claude-vault-weekly-update-TEST.claude` (5 min)
- [ ] **Oct 6:** Deploy - all tasks active and scheduled ✅

**Total time: ~1 hour for all 4 priority tasks**

---

## 🔄 Making Changes Later

If you need to change a task:

1. Open dashboard
2. Find the task in the list
3. Click "Edit"
4. Make changes
5. Click "Save"
6. Run automation again:
   ```bash
   claude run task-automation.claude
   ```

Everything updates automatically.

---

## 🎓 Understanding the System

**Dashboard (HTML file)**
- Your interface to create/edit tasks
- Saves task JSON to queue
- Shows current task status
- That's it! Nothing else to do here.

**Task Automation (Claude Code)**
- Reads task queue
- Creates specifications
- Generates scripts
- Updates all files
- Completely automated
- You just run it once

**Claude Code Scripts (Generated)**
- One script per task
- Auto-generated from your specifications
- Scheduled by Claude Code scheduler
- Ready to run on Oct 6

---

## 🚨 If Something Goes Wrong

1. Check the automation output:
   ```bash
   claude run task-automation.claude 2>&1 | head -50
   ```

2. Verify tasks.json has correct format:
   ```bash
   cat /_aibos/tasks.json | jq '.'
   ```

3. Check that files were created:
   ```bash
   ls -la /_aibos/TASKS-*.md
   ls -la /_aibos/claude-code-scripts/
   ```

4. If stuck: Re-run automation
   ```bash
   claude run task-automation.claude
   ```

---

## 💡 Key Points

✅ **Touch only the dashboard** — that's your UI  
✅ **Run automation** — all files auto-generate  
✅ **Tasks are ready** — no manual editing needed  
✅ **Works on Oct 6** — scheduled and running  

**You're done!** No file editing, no manual updates, no complexity.

---

## 📞 Next Steps

1. **Now:** Open dashboard and create first task
2. **After tasks created:** Run `claude run task-automation.claude`
3. **Oct 6:** Tasks are live and running automatically

**Questions?** Check TASK-MANAGEMENT-SYSTEM-OVERVIEW.md for deeper details.

---

**Status:** ✅ System ready  
**Updated:** October 4, 2026  
**Deadline:** October 6, 2026
