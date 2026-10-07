# Testing notes - items to be changed / fixed


#Issues, errors and items to be addressed (in priority order) - 07 October 2026
1. priority = HIGH. Task execution results need approval workflow refinement, where approval is required.
2. priority = MEDIUM. Takes a little while to load tasks (performance optimization).
3. priority = MEDIUM. Calendar view is not working.
4. priority = MEDIUM. Mobile-responsive design.
5. priority = MEDIUM. Execution history/logs not displayed to user.
6. priority = MEDIUM. Modal need x to close the modal in the top right corner.



#Functionality to add at a later date (in priority order)- 06 October 2026
**MVP**
0. Complete AES-256 encryption integration for prompts & sensitive data (infrastructure exists, needs full rollout)
1. Works with Claude
2. frequency on task creation screen should include time and options to select multiple days a week and make one off (from calendar), or recurring.  Which auto-generates, deploys Claude Code scripts and auto-updates of all the linked references/indexes, Status tracking and Calendar entries.  Updates master-state.md after each run.  Understands success criteria.
3. Task queue persistence so users don't lose tasks if they refresh.
4. Schedule Builder:  Click a Recurrence Pattern (Weekly, Weekday, Daily, etc.)
Select Days — Click day buttons to toggle them on/off, Set Time — Enter hour (0-23) and minute (0-59).  Can select multiple days in the week or days on the calendar. No Dropdown Limits — Create any schedule you want.
5. Visual weekly and monthly calendar view - show on calendar if recurring, selecting opens task to edit. Date + Time Picker Interface - Click to select/deselect days, Active days highlighted in blue, Pre-selected defaults for common patterns. Time Input Fields - Hour selector (0-23), Minute selector (0-59), Shows as 24-hour format based on local user.
6. User login (Google OAuth + email)
7. user profile section where they can update and manage their user, time zone selection, personal and payment details, or request to close their account.
8. Manual "Run Now" Button
9. must be able to access other local files or online vault for reference or to update.
10. System owner - success metrics (adoption - downloads, active users, tass per user, task per account; Engagement - completion rate, average task frequencies, feature usage; Revenue - sign-ups, MRR, customer retention rate). Features: admin/edit all accounts, Edit pricing per plan, setup own free accounts, create own Accounts, create own tasks, create and manage templates, set pricing, Edit task count per plan, Edit schedule frequency per plan, Dashboard analytics, User management panel.
11. Different user pland and access levels for each plan.
12. API Data Sync.
13. Log Processing & Analysis.
  

**Phase 2**
1. Embedded quick-start guide in support menu.
2. Input validation with helpful feedback. Real-time + pre-creation Validation / prompts ("You said read /data but didn't specify output?").
3. Support - Example tasks to learn from on every field.
4. Also works with OpenAI / ChatGPT and Google Gemini (same dashboard any LLM)
5. Guided Task Creation - Suggest 2 types of business tasks and 1 personal task not already scheduled that can be automated / managed by Claude, Manus, etc; then let's build type button / option; Guided wizard (step-by-step questions); 
6. Smart suggestions (AI reads description → suggests files)
7. Export task list as CSV
8. ability to save current tasks as template, then edit template.
9. hint text over fields, and examples.
10. Set up payment processor.
11. Create simple landing page.
12. Soft launch on Twitter/HackerNews.
  

**Phase 3**
1. Also works with Viktor, Manus, Anthropic Bedrock  
2. request testimonials after 8 task creations / logins.  If don't give one, then keep asking every 8 logins.
3. TaskTypeSelector - Shows 5 task type cards + "Skip" option. a) DataReportsWizard - 5-step wizard for data automation; b) FileSystemsWizard - 4-step wizard for file management; c) SystemImprovementWizard - 8-step wizard for business tasks that improve systems; d) BusinessProductivityWizard - 5-step wizard for repeatable business tasks; e) PersonalProductivityWizard - 5-step wizard for personal tasks.
4. "Custom contracts" - Special pricing for 200+ team members, Custom SLA (uptime guarantee), Dedicated support person

---

# RESOLVED ITEMS - 07 October 2026

## ✅ Item 3: Prompt doesn't need to show in Task List
**Status:** COMPLETED
**What was done:** 
- Removed prompt snippet display from Dashboard task cards
- Prompt is now only visible in edit modal, not in task list view
- Keeps task list clean and focused on name, description, and frequency

## ✅ Item 4: No date and time selection of task scheduling, no run-once ability
**Status:** COMPLETED  
**What was done:**
- Added time picker (24-hour format HH:MM) to task creation form
- Added "Run Once" frequency option with date picker
- Added day-of-week selector for weekly tasks (click buttons to toggle days)
- Form shows appropriate fields based on frequency selected:
  - Time picker: Always visible
  - Date picker: Only visible for "Run Once" tasks
  - Day selector: Only visible for "Weekly" tasks
- Users can now schedule: daily, weekly (specific days), monthly, or one-time tasks

