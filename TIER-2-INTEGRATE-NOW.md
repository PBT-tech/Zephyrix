---
title: TIER 2 - Quick Integration (Copy-Paste)
date: 2026-10-06
status: Ready to integrate
time: 10 minutes
---

# ✅ Copy-Paste Integration Guide

**All Tier 2 components are now in:** `components/tier2/`

---

## 🚀 Step 1: Import the Wizard (1 minute)

In your **ZEPHYRIX-REACT-DASHBOARD.jsx**, add at the top:

```javascript
import CreateTaskWithWizard from './components/tier2/CreateTaskWithWizard';
```

---

## 🔧 Step 2: Wire into CreateTaskForm (5 minutes)

Find your `CreateTaskForm` component and update it:

### **BEFORE:**
```javascript
const CreateTaskForm = ({ onTaskCreate, onCancel }) => {
  const [formData, setFormData] = useState({ ... });
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
};
```

### **AFTER:**
```javascript
const CreateTaskForm = ({ onTaskCreate, onCancel }) => {
  const [showWizard, setShowWizard] = useState(false);
  const [formData, setFormData] = useState({ ... });
  
  // Show wizard instead of form
  if (showWizard) {
    return (
      <CreateTaskWithWizard
        onTaskCreate={(wizardData) => {
          // Pass wizard data to your existing createTask function
          onTaskCreate(wizardData);
        }}
        onCancel={() => setShowWizard(false)}
      />
    );
  }
  
  // Original form
  return (
    <div className="space-y-4">
      {/* Add "Create with Wizard" button */}
      <button
        onClick={() => setShowWizard(true)}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
      >
        ✨ Create with Guided Wizard
      </button>
      
      {/* Original form below */}
      <form onSubmit={handleSubmit}>
        {/* form fields */}
      </form>
    </div>
  );
};
```

---

## 📋 Step 3: Test the Integration (5 minutes)

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to:** `http://localhost:3000` (or your dev URL)

3. **Test the wizard:**
   - Click "Create with Guided Wizard"
   - Select a task type
   - Walk through the steps
   - Click "Create Task"
   - Verify task appears in dashboard

4. **Test fallback:**
   - Click "Skip & Create Custom"
   - Should show original form
   - Create task the old way

---

## 🔄 Step 4: Update Your API Endpoint (2 minutes)

Your `/api/tasks` POST endpoint needs to accept the wizard data format.

### **Update ZEPHYRIX-VERCEL-FUNCTIONS.js:**

```javascript
export async function handleCreateTask(req, res) {
  const {
    // Wizard fields
    type,           // NEW: 'data-reports', 'file-systems', 'personal-productivity'
    taskName,       // NEW: From wizard
    inputFolder,    // NEW: For data-reports
    targetFolder,   // NEW: For file-systems
    sourceLocation, // NEW: For personal-productivity
    outputFormat,   // NEW
    action,         // NEW: For file-systems
    organizationMethod, // NEW: For personal-productivity
    successCriteria, // NEW
    
    // Existing fields
    schedule,
    ...rest
  } = req.body;

  // Validate wizard data
  if (!taskName) {
    return res.status(400).json({ error: 'Task name required' });
  }

  if (!type) {
    return res.status(400).json({ error: 'Task type required' });
  }

  // Map wizard data to database schema
  const task = {
    name: taskName,
    type: type,
    input_folder: inputFolder || null,
    target_folder: targetFolder || null,
    source_location: sourceLocation || null,
    output_format: outputFormat || null,
    action: action || null,
    organization_method: organizationMethod || null,
    success_criteria: successCriteria || null,
    schedule_frequency: schedule?.frequency || 'weekly',
    schedule_day: schedule?.day || 'monday',
    schedule_time: schedule?.time || '09:00',
    user_id: userId,
    ...rest
  };

  // Save to Supabase
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select();

  if (error) {
    console.error('Task creation error:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(data[0]);
}
```

---

## 📊 Step 5: Verify Database Schema (Optional)

If you need new columns in the tasks table:

```sql
-- Add these columns if missing
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS task_type VARCHAR(50);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS success_criteria TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS input_folder TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS target_folder TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS source_location TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS output_format VARCHAR(50);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS action VARCHAR(50);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS organization_method VARCHAR(50);
```

---

## ✅ Checklist

- [ ] Imported `CreateTaskWithWizard` in main component
- [ ] Added wizard state to `CreateTaskForm`
- [ ] Added "Create with Guided Wizard" button
- [ ] Wrapped wizard rendering logic
- [ ] Tested wizard flow end-to-end
- [ ] Updated API endpoint to handle wizard data
- [ ] Updated database schema (if needed)
- [ ] Deployed changes to Vercel

---

## 🧪 Quick Test Commands

```bash
# Start dev server
npm run dev

# Test wizard in browser
# Navigate to http://localhost:3000
# Click "Create with Guided Wizard"
# Follow the wizard
# Verify task created

# Check API logs
# npm run dev (shows console logs)
# Look for: "Wizard complete with data: { ... }"
```

---

## 📁 File Structure After Integration

```
components/
├── tier2/
│   ├── index.js                        (exports all components)
│   ├── TIER-2-TaskTypeSelector.jsx
│   ├── TIER-2-GuidedWizard.jsx
│   ├── TIER-2-DataReportsWizard.jsx
│   ├── TIER-2-FileSystemsWizard.jsx
│   ├── TIER-2-PersonalProductivityWizard.jsx
│   └── CreateTaskWithWizard.jsx        (integration wrapper)
└── [other existing components]
```

---

## 🎯 Expected Data Flow

```
User clicks "Create with Guided Wizard"
    ↓
CreateTaskWithWizard renders
    ↓
TaskTypeSelector (choose type)
    ↓
GuidedWizard (5-step form)
    ↓
ReviewStep (confirm data)
    ↓
onComplete({type, taskName, ...allData})
    ↓
onTaskCreate(wizardData)
    ↓
POST /api/tasks
    ↓
API saves to Supabase
    ↓
Task appears in dashboard
```

---

## 💡 Testing Tips

1. **Open browser DevTools** (F12)
2. **Go to Console tab**
3. **Start wizard**
4. **You'll see:** `Wizard complete with data: { ... }`
5. **Check Network tab** to verify API call succeeded

---

## 🚀 You're Done!

Once integrated:
- ✅ Users can choose guided wizard OR original form
- ✅ Wizard walks through task type-specific questions
- ✅ Data accumulates across steps
- ✅ ReviewStep shows all data before creating
- ✅ Task created with all wizard data
- ✅ Falls back to original form if needed

---

## ❓ Common Issues

**"Components not found"**
→ Check import path: `./components/tier2/CreateTaskWithWizard`

**"Styles missing"**
→ Ensure Tailwind CSS is configured in project

**"Icons missing"**
→ Ensure lucide-react is installed: `npm install lucide-react`

**"API error on create"**
→ Update endpoint to accept wizard fields (see Step 4 above)

---

**Integration time: 10 minutes**  
**Testing time: 5 minutes**  
**Deploy time: 5 minutes**

**Total: ~20 minutes to go live with Tier 2 wizard!** 🚀

Location: `/home/tara/ClaudeCowork/Tara-second-Brain/task-management-system/`
