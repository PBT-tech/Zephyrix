---
type: reference
entity: vault
purpose: task-calendar-and-management-interface
last_updated: 2026-10-03
---

# Task Calendar & Management Dashboard

**Purpose:** Visual calendar showing all scheduled tasks + quick-edit interface.

**Status:** This is your single point for viewing and managing all 7 Claude Code tasks.

---

## OCTOBER 2026 CALENDAR

```
                    OCTOBER 2026
     SUN   MON   TUE   WED   THU   FRI   SAT
                            1*    2     3
      4     5     6     7*    8*    9    10
     11    12*   13    14    15*   16   17*
     18    19*   20    21    22*   23   24*
     25    26*   27    28    29*   30   31*

Legend: * = Scheduled task runs on this date
```

---

## WEEKLY TASK SCHEDULE (Recurring)

### **MONDAY**
- **8:03 AM** — Forum Australia Rollout Watch (Task #4)
  - Status: PENDING MIGRATION
  - Type: Informational (no approval needed)
  - Output: `/outputs/algorithm-refresh/forum-au-watch-log.md`
  - [EDIT TASK #4](#edit-task-4)

- **8:32 AM** — LinkedIn RLF Signal Scan (Task #2)
  - Status: PENDING MIGRATION
  - Type: Lead generation (critical)
  - Output: `/outputs/pbt-rlf/signals/`
  - [EDIT TASK #2](#edit-task-2)

---

### **TUESDAY**
- **8:32 AM** — LinkedIn RLF Signal Scan (Task #2)
  - [Same as Monday]

---

### **WEDNESDAY**
- **8:32 AM** — LinkedIn RLF Signal Scan (Task #2)
  - [Same as Monday]

---

### **THURSDAY**
- **8:32 AM** — LinkedIn RLF Signal Scan (Task #2)
  - [Same as Monday]

- **9:33 AM** — Vault Weekly Update (Task #1) ⚠️ **MIGRATE FIRST**
  - Status: MIGRATE TO CLAUDE CODE (Oct 6)
  - Type: Vault maintenance
  - Files: Reads raw notes → Updates wiki
  - Output: `/_aibos/task-logs/vault-update-YYYY-MM-DD.md`
  - [EDIT TASK #1](#edit-task-1)

---

### **FRIDAY**
- **8:32 AM** — LinkedIn RLF Signal Scan (Task #2)
  - [Same as Monday]

---

### **SATURDAY (1st of month)**
- **9:00 AM** — Memory Audit (Task #5)
  - Status: ENABLED ✓
  - Type: Monthly maintenance
  - Output: `/outputs/memory-audit/YYYY-MM-DD-audit.md`
  - [EDIT TASK #5](#edit-task-5)

---

### **SUNDAY** — No scheduled tasks

---

## MONTHLY TASK SCHEDULE

| Date | Time | Task | Status | Priority |
|------|------|------|--------|----------|
| **1st** | 9:00 AM | Algorithm Refresh (Task #3) | ENABLED ✓ | High |
| **1st Saturday** | 9:00 AM | Memory Audit (Task #5) | ENABLED ✓ | Medium |
| **Every Thursday** | 9:33 AM | Vault Weekly Update (Task #1) | MIGRATE | High |
| **Every Weekday** | 8:32 AM | RLF Signal Scan (Task #2) | PENDING | High |
| **Every Monday** | 8:03 AM | Forum Watch (Task #4) | PENDING | Low |

---

## EDIT TASK INTERFACE

### **EDIT TASK #1: Vault Weekly Update**

**Current Status:** MIGRATE TO CLAUDE CODE by Oct 6  
**Deadline:** 3 days  

**To edit this task, update these fields in TASKS-SPECIFICATIONS.md:**

```
## TASK 1: Vault Weekly Update

### What It Does
Currently marked [INSTRUCTION NEEDED]
→ Update with: What does this task actually do?

### Files Read
Currently marked [INSTRUCTION NEEDED]
→ Update with: Which raw notes folders? Which wiki folders?

### Files Written
Currently marked [INSTRUCTION NEEDED]
→ Update with: Which files get updated?

### Success Criteria
Currently marked [INSTRUCTION NEEDED]
→ Update with: How do you know it succeeded?

### Approval Flow
Currently marked [INSTRUCTION NEEDED]
→ Update with: Does it need approval? Who approves? How?
```

**Quick Questions to Answer:**

1. What's the exact input (raw notes)?
2. What's the exact output (updated wiki files)?
3. Does it rebuild indexes? Refresh hot.md?
4. Does it need approval before running?
5. What's the log file path?

**Next Step:** Fill in TASKS-SPECIFICATIONS.md Task #1, then send to Claude Code migration.

---

### **EDIT TASK #2: LinkedIn RLF Signal Scan**

**Current Status:** PENDING MIGRATION  
**Deadline:** 3 days

**To edit this task, update:**

```
## TASK 2: LinkedIn RLF Signal Scan

### What It Does
Currently [INSTRUCTION NEEDED]
→ Update with: Exact workflow (scan LinkedIn, extract signals, score, queue)

### Files Written
Currently [INSTRUCTION NEEDED]
→ Update with: Where should daily signals go?

### Approval Flow
Currently [INSTRUCTION NEEDED]
→ Update with: Auto-post to Slack? Email summary? Both?
```

**Quick Questions:**

1. What's the ICP profile to match against?
2. What scoring method (1-5, percentage)?
3. How many signals minimum per day?
4. Auto-post to Slack or hold for review?
5. What's the output file format?

---

### **EDIT TASK #3: Algorithm Refresh**

**Current Status:** ENABLED ✓  
**Deadline:** No immediate action needed

**This task is well-defined. No changes needed unless you want to:**
- Change the schedule from 1st of month
- Add/remove algorithm sources
- Change update method for writing-rules.md

---

### **EDIT TASK #4: Forum Australia Watch**

**Current Status:** PENDING MIGRATION  
**Deadline:** 3 days

**To edit this task, update:**

```
## TASK 4: Forum Australia Rollout Watch

### What It Does
Currently [INSTRUCTION NEEDED]
→ Update with: What URLs/sources to check?

### Success Criteria
Currently [INSTRUCTION NEEDED]
→ Update with: What counts as "news"?
```

**Quick Questions:**

1. Which Meta status pages to monitor?
2. Which competitor pages to watch?
3. What counts as "rollout news"?
4. How detailed should the weekly log be?

---

### **EDIT TASK #5: Memory Audit**

**Current Status:** ENABLED ✓  
**Deadline:** No immediate action needed

**This task runs. Define what "success" means:**

```
## TASK 5: Memory Audit

### Success Criteria
Currently [INSTRUCTION NEEDED]
→ Update with: What gets audited? Staleness? Accuracy? Duplicates?
```

**Quick Questions:**

1. Check for files modified >90 days ago?
2. Check for duplicate facts across files?
3. Verify accuracy of stored business info?
4. Auto-fix issues or just report?

---

### **EDIT TASK #6: Annual Quarterly Review**

**Current Status:** ENABLED ✓ (annual, June 2027)  
**Deadline:** Next: June 2027

**This is high-stakes. Define now:**

```
## TASK 6: Annual Quarterly Review

### What It Does
Currently [INSTRUCTION NEEDED]
→ Update with: Scope (all entities? metrics? gaps?)

### Success Criteria
Currently [INSTRUCTION NEEDED]
→ Update with: Report structure, recommendation count, deliverables
```

**Quick Questions:**

1. What metrics to review (revenue, engagement, etc.)?
2. What gets measured per entity (PBT/PIBS/SE/personal)?
3. Who signs off on the review?
4. What's the output document structure?

---

### **EDIT TASK #7: Personal Ideas Generation**

**Current Status:** PENDING (new implementation)  
**Deadline:** 3 days

**Fill in the full spec:**

```
## TASK 7: Personal Social Media Ideas Generation

### What It Does
Currently [INSTRUCTION NEEDED]
→ Update with: Similar to PIBS? Different scope?

### Files Read
Currently [INSTRUCTION NEEDED]
→ Update with: Brand brief, examples, trend sources

### Files Written
Currently [INSTRUCTION NEEDED]
→ Update with: Output path and file format

### Schedule
Currently inferred as Saturday 8:02 AM
→ Confirm or correct
```

**Quick Questions:**

1. Same process as PIBS ideas (research trends, score ideas)?
2. How many ideas per week? What's "high quality" for personal brand?
3. What sources (news, trends, personal network)?
4. Should it auto-notify when ideas are ready?

---

## MIGRATION CHECKLIST (Oct 3-6)

### Priority 1: Must Migrate by Oct 6
- [ ] Task #1: Vault Weekly Update
  - [ ] Specification complete (TASKS-SPECIFICATIONS.md)
  - [ ] Claude Code script written and tested
  - [ ] Schedule confirmed (Thursday 9:33 AM)
  - [ ] Test run successful

- [ ] Task #2: LinkedIn RLF Signal Scan
  - [ ] Specification complete
  - [ ] LinkedIn MCP connector available
  - [ ] Claude Code script written
  - [ ] Test run with sample data

### Priority 2: Can Migrate Week of Oct 6
- [ ] Task #3: Algorithm Refresh (already works, just port)
- [ ] Task #4: Forum Australia Watch
- [ ] Task #5: Memory Audit (already works, just port)

### Priority 3: Implement Post-Oct 6
- [ ] Task #6: Annual Quarterly Review (June 2027 deadline)
- [ ] Task #7: Personal Ideas Generation (new implementation)

---

## HOW TO USE THIS DASHBOARD

**Every week:**
1. Open this file
2. Scan the weekly schedule
3. Note which tasks run on which days
4. Check their status (ENABLED, PENDING, MIGRATE, etc.)

**To edit a task:**
1. Click the [EDIT TASK #N] link above
2. Go to TASKS-SPECIFICATIONS.md
3. Find the task section
4. Fill in the [INSTRUCTION NEEDED] sections
5. Save and notify that task is ready for Claude Code

**To check task health:**
1. Open master-state.md
2. Review "Recent Activity Log"
3. Check "Vault Health Checks" status

**To add a new task:**
1. Add entry to master-state.md
2. Create task section in TASKS-SPECIFICATIONS.md
3. Add to this calendar
4. Write Claude Code script

---

Last updated: October 3, 2026  
Next review: When each task is migrated to Claude Code  
Status: 3 days until Cowork deprecation deadline
