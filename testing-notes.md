# Testing notes - items to be changed / fixed


#Issues, errors and items to be addressed (in priority order) - 06 October 2026
1. only saving client name, no instructions or anything else.
2. Calendar view is not working.
3. No edit options on tasks.




#Functionality to add at a later date (in priority order)- 06 October 2026
1. frequency on task creation screen should include time and options to select multiple days a week and make one off (from calendar), or recurring
2. user profile section where they can update and manage their user, personal and payment details, or request to close their account.




#Issues, errors and items resolved
**Resolved 06 October 2026**

1. **Severity:** High 
**Details:**
- Clicked "Create Task"
- Got: "Failed to create task: Request failed with status code 404"
- The `/api/tasks` endpoint doesn't exist or isn't deployed

2. **Severity:** High 
**Details:**
- Clicked "Create Task"
- Got: "Failed to create task: Request failed with status code 500"
- SUPABASE_SERVICE_KEY not set in Vercel?
Task Creation Endpoint - Status Code 500**
**Issue:** POST /api/tasks returning 500 error
**Root Cause:** Foreign key constraints on tasks table referenced empty tables (users, teams, api_keys). Supabase Auth creates users in auth.users, not in the custom users table, causing foreign key constraint violations (error code 23503).
**Solution:** Removed foreign key constraints from tasks table:
   - `ALTER TABLE tasks DROP CONSTRAINT tasks_user_id_fkey;`
   - `ALTER TABLE tasks DROP CONSTRAINT tasks_team_id_fkey;`
   - `ALTER TABLE tasks DROP CONSTRAINT tasks_api_key_id_fkey;`
**Status:** ✅ FIXED - Tasks now create and appear in dashboard
**Technical Notes:** Long-term fix needed: create users/teams in custom tables when users authenticate via Supabase Auth, or use Supabase auth.users directly
