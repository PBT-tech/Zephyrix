---
title: ZEPHYRIX Tier 2 - Guided Task Creation (Week 2)
date: 2026-10-06
version: 1.0.0
---

# 🎯 ZEPHYRIX Tier 2 - Guided Task Creation

**Phase:** Week 2 (After MVP launch)  
**Goal:** Make task creation intuitive for non-technical users  
**Impact:** Increase user adoption by 3-5x through guided workflows

---

## 📋 Task Type Categories

### **BUSINESS TASKS (2 Types)**

#### **Type 1: Data & Report Automation**
**Description:** Read data files, process, generate reports/summaries

**Examples:**
- Weekly sales report (read: /sales/data, output: /reports/weekly.md)
- Daily expense summary (read: /expenses/, output: email + /archive/)
- Monthly inventory check (read: /inventory/, output: /reports/stock.md)
- Customer metrics dashboard (read: /crm/, output: /dashboards/)

**What Users Input:**
- "What data do you want to read?"
- "What format should the output be?"
- "When should this run?"
- "Who should get it?"

**AI Suggests:**
- Input files: `/sales/`, `/data/`, `/crm/`
- Output format: PDF report, CSV, Markdown, Email
- Schedule: Daily, Weekly (Monday), Monthly

---

#### **Type 2: File & System Automation**
**Description:** Organize, backup, clean up, sync files automatically

**Examples:**
- Daily file backup (read: /important-docs/, output: /backups/, schedule: daily 11pm)
- Weekly cleanup (read: /downloads/, delete old, archive to /archive/)
- File conversion (read: /images/raw/, convert to PNG, output: /images/processed/)
- Email to database (read: inbox, parse, output: /database/)

**What Users Input:**
- "Which folder should I manage?"
- "What should I do with old files?"
- "How should files be organized?"
- "When should this run?"

**AI Suggests:**
- Actions: Backup, Clean up, Convert, Archive, Sync
- Schedule: Daily, Weekly, Monthly
- Retention: Keep 30/60/90 days

---

### **PERSONAL TASK (1 Type)**

#### **Type 3: Personal Productivity & Ideas**
**Description:** Capture ideas, organize thoughts, generate insights

**Examples:**
- Daily idea capture (read: notes from /ideas/, organize by topic, output: /journal/)
- Weekly review (read: /notes/, summarize learnings, output: /reviews/)
- Blog post scheduler (read: /drafts/, prepare for publication, output: /queue/)
- Personal goals tracker (read: /goals/, check progress, output: /tracking/)

**What Users Input:**
- "What are you tracking or organizing?"
- "How often should this run?"
- "What's the output format?"
- "Any specific organization rules?"

**AI Suggests:**
- Outputs: Daily summary, Weekly digest, Monthly report
- Organization: By date, by topic, by priority
- Format: Journal entry, Blog post, Newsletter, Dashboard

---

## 🎨 UI: Task Type Selection Screen

```
═══════════════════════════════════════════════════
              📋 Choose Task Type
═══════════════════════════════════════════════════

Which type of task do you want to automate?


┌─────────────────────────────────────────────────┐
│  📊 Data & Report Automation                    │
│  ═════════════════════════════════              │
│  Read data files, analyze, generate reports    │
│                                                 │
│  Examples:                                      │
│  • Weekly sales report                          │
│  • Monthly expense summary                      │
│  • Customer metrics dashboard                   │
│                                                 │
│                              [Choose] [Learn]   │
└─────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────┐
│  🗂️  File & System Automation                   │
│  ════════════════════════════════               │
│  Organize, backup, clean up files              │
│                                                 │
│  Examples:                                      │
│  • Daily file backup                            │
│  • Weekly cleanup & archive                     │
│  • Auto file conversion                         │
│                                                 │
│                              [Choose] [Learn]   │
└─────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────┐
│  💡 Personal Productivity                       │
│  ════════════════════════════════               │
│  Capture ideas, organize thoughts              │
│                                                 │
│  Examples:                                      │
│  • Daily idea capture & organize                │
│  • Weekly review & summary                      │
│  • Blog post scheduler                          │
│                                                 │
│                              [Choose] [Learn]   │
└─────────────────────────────────────────────────┘


                    [Skip & Create Custom]
═══════════════════════════════════════════════════
```

---

## 🧙 Guided Wizard Flow

### **Step-by-Step Questions (Changes per Type)**

#### **For Data & Report Automation:**

```
STEP 1: Name Your Task
├─ "What should we call this?"
├─ Example: "Weekly Sales Report"
└─ Help text: "Short, descriptive name"

STEP 2: What Data?
├─ "Which folder/files should I read?"
├─ File browser: /
├─ Smart suggest: [/sales/] [/data/] [/crm/] [/reports/]
└─ Help: "Leave empty to specify in advanced settings"

STEP 3: What Output?
├─ "What format should the output be?"
├─ Options: [📄 Markdown] [📊 CSV] [📈 PDF] [📧 Email]
├─ Output path: /reports/
└─ Help: "Where should the file be saved?"

STEP 4: When Should This Run?
├─ Frequency: [Daily] [Weekly] [Monthly]
├─ If Weekly: [Mon] [Tue] [Wed] [Thu] [Fri] [Sat] [Sun]
├─ Time: 09:00 AM
└─ Help: "Set when you want this to run"

STEP 5: Success Looks Like...
├─ "How will you know this worked?"
├─ Examples: 
│   ├─ "Report generated with 50+ rows"
│   ├─ "File saved with no errors"
│   └─ "Email sent to team"
└─ Help: "Be specific so we can validate"

STEP 6: Review & Create
├─ Summary of all settings
├─ [← Back] [Create Task]
└─ Help: "Review before we automate"
```

#### **For File & System Automation:**

```
STEP 1: Name Your Task
├─ "What should we call this?"
├─ Example: "Daily Backup"

STEP 2: Which Folder?
├─ "Which folder do you want to manage?"
├─ Smart suggest: [/Downloads/] [/Documents/] [/Photos/]

STEP 3: What Action?
├─ "What should we do with these files?"
├─ Options: 
│   ├─ [🔄 Backup] → Then "Backup to:" /backups/
│   ├─ [🗑️  Clean up] → Then "Delete older than:" 30 days
│   ├─ [🔄 Convert] → Then "Convert to:" PNG/PDF/etc
│   └─ [📂 Organize] → Then "Sort by:" Date/Name/Size

STEP 4: When Should This Run?
├─ Frequency: [Daily] [Weekly] [Monthly]
├─ Time: 11:00 PM
└─ Help: "Off-peak hours recommended"

STEP 5: Dry Run (Test First)
├─ "Test this first?" [Yes] [No]
├─ Shows: "Would affect X files"
└─ Help: "Always test before automating"

STEP 6: Review & Create
├─ Summary
├─ [← Back] [Create Task]
```

#### **For Personal Productivity:**

```
STEP 1: Name Your Task
├─ "What should we call this?"
├─ Example: "Weekly Review"

STEP 2: What Are You Capturing?
├─ "What are you tracking/organizing?"
├─ Options: [💡 Ideas] [📓 Notes] [🎯 Goals] [📝 Writing]

STEP 3: Where Are They Now?
├─ "Where do you keep these?" (folder path)
├─ Smart suggest: [/Ideas/] [/Notes/] [/Drafts/]

STEP 4: What Should We Do?
├─ "How should we organize them?"
├─ Options: [📅 By date] [🏷️  By topic] [⭐ By priority]
├─ Output: "Create a summary" / "Organize into folders" / "Generate report"

STEP 5: When Should This Run?
├─ Frequency: [Daily] [Weekly] [Monthly]
├─ Time: Your preference
└─ Output format: [📝 Summary] [📊 Report] [📧 Email]

STEP 6: Review & Create
├─ Summary
├─ [← Back] [Create Task]
```

---

## 🤖 Smart Suggestions (AI-Powered)

### **File Path Suggestions**

When user says: "I want to backup my documents"

AI analyzes and suggests:
```
Common folders in your account:
├─ /Documents/
├─ /Downloads/
├─ /Desktop/
├─ /Projects/
├─ /Important/

Or browse: [File selector]
```

### **Output Format Suggestions**

When user says: "Generate a weekly report"

AI suggests based on task type:
```
For Data tasks:
├─ 📄 Markdown (most common)
├─ 📊 CSV (for spreadsheets)
├─ 📈 PDF (for sharing)
└─ 📧 Email (send directly)

For File tasks:
├─ 📂 Organized folders
├─ 📦 Compressed backup
└─ ☁️  Cloud backup
```

### **Schedule Suggestions**

When user says: "I need this weekly"

AI asks:
```
When is best for this to run?

🕐 Morning (6-9 AM) - Good for reports
🕐 Midday (12-2 PM) - Good for syncs
🕐 Evening (5-8 PM) - Good for cleanup
🕐 Night (11 PM-1 AM) - Best for backups

Recommended: [Evening ✓]
```

---

## ✅ Validation Prompts

### **Real-time Validation**

As user fills the form:

```
✓ VALID - Input folder: /sales/data/
✗ WARNING - No output specified yet. Where should files go?
✗ ERROR - Output path /invalid/ doesn't exist. Create it?

When user says they'll "read /data" but don't specify output:
┌─────────────────────────────┐
│  ⚠️  Missing Output Path     │
├─────────────────────────────┤
│ You said you'll read:        │
│ /data/                       │
│                              │
│ But where should the        │
│ results go?                 │
│                              │
│ Output path: [________]      │
│                              │
│ Suggestions:                 │
│ • /reports/                  │
│ • /processed/                │
│ • /output/                   │
└─────────────────────────────┘
```

### **Pre-Creation Validation**

Before creating task:

```
✓ Task name: "Weekly Sales Report"
✓ Input files: /sales/data/
✓ Output: /reports/weekly.md
✓ Schedule: Weekly, Monday, 9 AM
✓ Success criteria: "Report has data"

⚠️  2 warnings:
  1. Output folder doesn't exist - we'll create it
  2. Haven't tested this with sample data yet

[← Back] [Create Anyway] [Test First]
```

---

## 🔧 Implementation Roadmap

### **Week 2 Sprint**

**Day 1-2: Task Type Selection Screen**
- [ ] Create TaskTypeSelector component
- [ ] Add 3 type options with descriptions
- [ ] Route to correct wizard based on selection
- [ ] Add "Custom task" bypass option

**Day 3-4: Guided Wizard Framework**
- [ ] Build WizardStep component (reusable)
- [ ] Implement step navigation (back/next)
- [ ] Add progress indicator
- [ ] Create state management for form data

**Day 5-6: Smart Suggestions**
- [ ] File path suggester (scan /user/ folders)
- [ ] Output format suggester (based on task type)
- [ ] Schedule suggester (based on task type)
- [ ] AI-powered prompts (optional fields)

**Day 7: Validation & Polish**
- [ ] Real-time validation logic
- [ ] Error/warning messages
- [ ] Pre-creation validation
- [ ] Testing & bug fixes

---

## 📊 Expected Impact

**Before Tier 2:**
- Users see blank form
- ~20% complete task setup
- High abandonment rate

**After Tier 2:**
- Users guided step-by-step
- ~80% complete task setup
- Validation prevents errors
- AI suggestions save time

**Projected:**
- 3-5x increase in task creation
- 50% reduction in support questions
- Higher user retention

---

## 🎯 Success Metrics

Track these during Week 2:

- % of users who create a task (target: 60%+)
- Avg time to create first task (target: < 5 min)
- Task completion rate (target: 85%+)
- Support tickets about task setup (target: -70%)
- User feedback on "ease of creating tasks" (target: 4.5/5)

---

## 🚀 Ready When MVP Launches

Once ZEPHYRIX MVP is live and stable:
1. Gather 1 week of user feedback
2. Identify top pain points in task creation
3. Prioritize features for Tier 2
4. Begin Week 2 sprint

---

**This plan scales ZEPHYRIX from "for technical users" to "for everyone."** 🎯

Next week: Execute and iterate! 🚀
