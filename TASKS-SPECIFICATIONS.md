---
type: reference
entity: vault
purpose: task-specifications-and-instructions
last_updated: 2026-10-03
---

# Scheduled Tasks — Complete Specifications

**Purpose:** Single source of truth for what each Claude Code task does, what it reads/writes, success conditions, and approval flow.

**Format:** Structured specs for easy parsing by Claude Code and human updates.

---

## TASK 1: Vault Weekly Update

**Task ID:** `claude-vault-weekly-update` (renamed from claude-vault---local-weekly-update)  
**Schedule:** Every Thursday at 9:33 AM (UTC+10)  
**Status:** MIGRATE TO CLAUDE CODE (Oct 6, 2026)

### What It Does
*[INSTRUCTION NEEDED: Please describe what this task does. Does it:]*
- [ ] Update wiki from raw notes?
- [ ] Refresh hot cache (wiki/hot.md)?
- [ ] Rebuild indexes?
- [ ] Update knowledge about new Claude models?
- [ ] Other: ________________

### Files Read
*[INSTRUCTION NEEDED: What source files does it read?]*
- `/PIBS/raw/` — ?
- `/personal/raw/` — ?
- `/foundations/raw/` — ?
- Other sources: ________________

### Files Written
*[INSTRUCTION NEEDED: What files does it write/update?]*
- `/PIBS/wiki/hot.md` — ?
- `/personal/wiki/hot.md` — ?
- `/_aibos/master-state.md` — Status updates
- Other outputs: ________________

### Success Criteria
*[INSTRUCTION NEEDED: How do you know this task succeeded?]*
- Condition 1: ________________
- Condition 2: ________________
- Log file: `/_aibos/TASK-LOGS/2026-10-XX-vault-update.md`

### Approval Flow
- **Needs Approval Before Running?** YES / NO
- **Approval Method:** (email, Slack, manual check, none)
- **Approval Criteria:** ________________
- **Auto-approve if:** ________________

### Error Handling
- **On Failure:** (retry, skip, notify, log)
- **Retry Count:** ____
- **Notify if failed after:** ____ minutes

### Notes
- Previously on Cowork (deprecated Oct 6)
- Health status: Healthy ✓
- Last successful run: September 30, 2026

---

## TASK 2: LinkedIn RLF Signal Scan

**Task ID:** `li-rlf-signal-scan`  
**Schedule:** Weekdays (Mon-Fri) at 8:32 AM (UTC+10)  
**Status:** PENDING MIGRATION TO CLAUDE CODE

### What It Does
*[INSTRUCTION NEEDED: What does this task do?]*
- [ ] Scan LinkedIn for buying signals matching RLF ICP?
- [ ] Extract prospect names/companies?
- [ ] Score leads by fit (1-5)?
- [ ] Create daily signal queue?
- [ ] Other: ________________

### Files Read
- `/PBT/wiki/ideal-client-profile.md` — ICP definition
- LinkedIn feed (via MCP connector) — TBD
- ________________

### Files Written
*[INSTRUCTION NEEDED: Where should outputs go?]*
- `/outputs/pbt-rlf/signals/YYYY-MM-DD-signals.md` — ?
- `/outputs/pbt-rlf/signal-queue.md` — ?
- Other: ________________

### Success Criteria
*[INSTRUCTION NEEDED]*
- Signals found: ____ minimum
- Scores calculated: ____ per prospect
- Condition: ________________

### Approval Flow
- **Needs Approval Before Running?** YES / NO
- **If YES:** Who approves? ________________
- **Auto-post to Slack?** YES / NO

### Notes
- Business-critical for PBT lead generation
- Requires LinkedIn connector (MCP)
- Health status: Not yet active (pending migration)

---

## TASK 3: Monthly Algorithm Refresh

**Task ID:** `monthly-algorithm-refresh`  
**Schedule:** 1st of every month at 9:00 AM (UTC+10)  
**Status:** ENABLED ✓ (will migrate to Claude Code)

### What It Does
*[INSTRUCTION CONFIRMED]:*
- Research latest LinkedIn algorithm changes
- Research latest Facebook algorithm changes
- Update `/PIBS/about-me/writing-rules.md` with new rules
- Log findings in output file

### Files Read
- Web sources (Socialinsider, ViralBrain, AuthoredUp, MagicPost, etc.) — TBD URLs
- `/PIBS/about-me/writing-rules.md` — Current rules

### Files Written
- `/outputs/algorithm-refresh/YYYY-MM-DD-algorithm-refresh.md` — Research findings
- `/PIBS/about-me/writing-rules.md` — Updated rules (if changes found)

### Success Criteria
- Algorithm research completed
- Sources checked: ≥3 per platform
- Rules updated (if applicable)
- Log file created

### Approval Flow
- **Needs Approval?** YES (before updating writing-rules.md)
- **Approval Method:** Review in master-state.md or notify Tara
- **Auto-update if:** No changes found

### Notes
- Last run: October 1, 2026 (no algorithm changes)
- Health status: Healthy ✓
- Next run: November 1, 2026

---

## TASK 4: Forum Australia Rollout Watch

**Task ID:** `forum-au-rollout-watch`  
**Schedule:** Mondays at 8:03 AM (UTC+10)  
**Status:** PENDING MIGRATION TO CLAUDE CODE

### What It Does
*[INSTRUCTION NEEDED: What exactly does this monitor?]*
- [ ] Watch for Meta Forum app Australia launch?
- [ ] Check status pages for rollout updates?
- [ ] Monitor competitor posts about Forum AU?
- [ ] Other: ________________

### Files Read
- TBD (web sources for Forum AU rollout status)
- `/PIBS/wiki/01-brand-and-messaging.md` — Context

### Files Written
- `/outputs/algorithm-refresh/forum-au-watch-log.md` — Weekly log entry

### Success Criteria
*[INSTRUCTION NEEDED]*
- Check completed: YES/NO
- Update written: YES/NO
- Condition: ________________

### Approval Flow
- **Needs Approval?** NO (informational log only)
- **Auto-log findings?** YES

### Notes
- Monitors Meta Forum app Australia launch
- Health status: Not yet active (pending migration)
- Purpose: Early detection of new platform features

---

## TASK 5: Memory Audit

**Task ID:** `monthly-memory-audit`  
**Schedule:** 1st Saturday of each month at 9:00 AM (UTC+10)  
**Status:** ENABLED ✓ (will migrate to Claude Code)

### What It Does
*[INSTRUCTION NEEDED: What should be audited?]*
- [ ] Check memory files for staleness?
- [ ] Identify duplicates?
- [ ] Verify accuracy of stored facts?
- [ ] Check for deprecated info?
- [ ] Other: ________________

### Files Read
- `/about-me/` — All files
- `/_aibos/` — All state files
- Claude's persistent memory — Read via memory API

### Files Written
- `/outputs/memory-audit/YYYY-MM-DD-audit.md` — Audit report
- `/_aibos/master-state.md` — Status update

### Success Criteria
*[INSTRUCTION NEEDED]*
- Audit completed: YES/NO
- Issues found: ____ (critical, major, minor)
- Report filed: YES/NO

### Approval Flow
- **Needs Approval?** NO (reporting only)
- **Auto-remediate issues?** (ask Tara first)

### Notes
- Last run: October 2, 2026 (today!)
- Health status: Healthy ✓
- Next run: November 1, 2026

---

## TASK 6: Annual Quarterly Review

**Task ID:** `annual-quarterly-review`  
**Schedule:** June 30 annually + as-needed  
**Status:** ENABLED ✓ (annual, next June 2027)

### What It Does
*[INSTRUCTION NEEDED]*
- [ ] Strategic review across all entities (PBT, PIBS, SE, personal)?
- [ ] Review performance metrics?
- [ ] Identify gaps/opportunities?
- [ ] Plan next quarter?
- [ ] Other: ________________

### Files Read
- `/PIBS/about-me/business-brain.md` — Business context
- `/personal/wiki/` — Personal goals
- Calendar logs and metrics — TBD

### Files Written
- `/outputs/quarterly-reviews/YYYY-Q-review.md` — Comprehensive review
- Strategic recommendations document

### Success Criteria
*[INSTRUCTION NEEDED]*
- Review completed: ____ hours
- Recommendations: ≥5
- Action items identified: ≥3

### Approval Flow
- **Needs Approval?** YES (major strategic document)
- **Approval Method:** Tara reviews and signs off
- **Timeline:** 2-3 days review window

### Notes
- Next scheduled: June 29, 2027
- Can be triggered as-needed for mid-year reviews
- High-stakes output (guides business direction)

---

## TASK 7: Personal Social Media Ideas Generation

**Task ID:** `personal-generate-weekly-ideas` (implied from structure)  
**Schedule:** Saturdays at 8:02 AM (UTC+10) [INFERRED - NEEDS CONFIRMATION]  
**Status:** PENDING (awaiting implementation details)

### What It Does
*[INSTRUCTION NEEDED: Similar to PIBS ideas generation?]*
- [ ] Generate weekly post ideas for personal brand?
- [ ] Research trending topics in personal brand niche?
- [ ] Score ideas by virality/fit potential?
- [ ] Write idea files in `/personal/social-media-content/ideas/`?
- [ ] Other: ________________

### Files Read
- `/personal/social-media-content/personal-brand-brief.md` — Brand positioning
- `/personal/social-media-content/personal-lived-examples.md` — Story bank
- Web sources (news, trends) — TBD

### Files Written
- `/personal/social-media-content/ideas/YYYY-MM-DD-ideas.md` — Weekly ideas file
- `/_aibos/master-state.md` — Status update

### Success Criteria
*[INSTRUCTION NEEDED]*
- Ideas generated: ≥5-8
- Ideas scored: YES
- File created with frontmatter: YES

### Approval Flow
- **Needs Approval?** NO (raw ideas only)
- **Auto-post to calendar?** YES (notify of ready ideas)

### Notes
- Last run: August 24, 2026 (needs resuming)
- Health status: Awaiting content generation
- Format: Match PIBS ideas structure (frontmatter + scoring + hooks)

---

## LEGEND & FORMAT NOTES

**File Path Format:** Use absolute vault paths starting with `/`  
**Time Format:** HH:MM in 24h, always UTC+10 (Melbourne)  
**Date Format:** YYYY-MM-DD (ISO)  
**Success Criteria:** Measurable, testable conditions  
**Approval Flow:** Define who, how, and when

---

## How to Update This File

When you know the details for a task:
1. Find the task section (1-7)
2. Replace `[INSTRUCTION NEEDED]` with actual details
3. Check the boxes that apply
4. Fill in all underscores
5. Update the status at the top
6. Update `last_updated` date

---

**This file is the specification sheet for Claude Code task migration.**  
**It drives the task calendar interface.**  
**Keep it complete and accurate.**

Last updated: October 3, 2026 — 3 days until migration deadline
