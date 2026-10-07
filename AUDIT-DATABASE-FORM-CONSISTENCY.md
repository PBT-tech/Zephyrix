# Database & Form Consistency Audit - 2026-10-07

## CRITICAL ISSUES FOUND

### 1. Missing Form Fields (Database columns not in Create/Edit forms)
| Field | Type | In Create Form | In Edit Form | Should Be Editable? | Priority |
|-------|------|---|---|---|---|
| priority | VARCHAR(50) | ❌ | ❌ | MAYBE - low urgency | LOW |
| status | VARCHAR(50) | ✅ (hardcoded 'active') | ✅ (shows 'active') | YES - need toggle | HIGH |
| requires_approval | BOOLEAN | ❌ | ❌ | YES - MVP feature | HIGH |
| approval_users | UUID[] | ❌ | ❌ | YES - for approval workflow | HIGH |
| template_id | UUID | ❌ | ❌ | MAYBE - Phase 2 feature | LOW |

### 2. Data Type Inconsistencies
| Field | DB Type | Form Handling | Issue | Risk |
|-------|---------|---|---|---|
| input_files | TEXT[] | Comma-separated string | Serialization mismatch | MEDIUM |
| output_files | TEXT[] | Comma-separated string | Serialization mismatch | MEDIUM |
| days_of_week | INTEGER[] | Array | ✅ Correct | LOW |

### 3. API Endpoint Coverage
| Endpoint | Issues |
|----------|--------|
| GET /api/tasks | ✅ Now includes: id,name,description,prompt,success_criteria,frequency,status,scheduled_time,scheduled_date,days_of_week,input_files,output_files. Missing: priority, requires_approval, approval_users |
| POST /api/tasks | ✅ Accepts user-editable fields. Missing: priority, requires_approval, approval_users |
| PUT /api/tasks | ✅ Accepts user-editable fields. Missing: priority, requires_approval, approval_users, status |
| DELETE /api/tasks | ✅ Works |

### 4. Missing from Dashboard Display
- No status indicator (is task active/paused/archived?)
- No priority indicator
- No approval status indicator

---

## RECOMMENDATIONS (Priority Order)

### IMMEDIATE (Block MVP release)
1. **Add `status` toggle to forms** - users need ability to pause/resume tasks
   - Add to Create form (default: 'active')
   - Add to Edit form (dropdown: active/paused/archived)
   - Update API POST/PUT to handle status

2. **Add `requires_approval` checkbox to forms** - already in testing notes as HIGH priority
   - Add to Create form
   - Add to Edit form
   - Update API POST/PUT to handle it

3. **Fix input_files/output_files serialization** - inconsistent array handling
   - Verify form sends as array, not string
   - Verify API stores as array correctly
   - Verify retrieval from database is array

### MEDIUM (Before Tier 2)
4. **Add approval_users field** - for approval workflow
5. **Add priority field** - task prioritization
6. **Update Dashboard display** - show status, priority, approval status

### LOW (Phase 2+)
7. **Template support** - template_id usage
8. **Advanced filtering** - by status, priority, approval status

---

## Testing Checklist

- [ ] Create task with status → verify stored correctly
- [ ] Edit task status → verify updates correctly
- [ ] Create task with requires_approval → verify stored
- [ ] Edit requires_approval → verify updates
- [ ] input_files as array → verify not string
- [ ] output_files as array → verify not string
- [ ] Create form has same fields as Edit form
- [ ] All database columns either: in forms, system-set, or read-only (documented)

