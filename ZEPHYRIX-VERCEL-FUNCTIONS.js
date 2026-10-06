// ============================================================================
// ZEPHYRIX - Vercel Functions (Backend API)
// ============================================================================
// Deploy these as Vercel Functions in /api/ directory
// Each function becomes an endpoint: /api/[function-name]
// ============================================================================

// ============================================================================
// 1. AUTHENTICATION - /api/auth.js
// ============================================================================
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function createToken(userId) {
  return jwt.sign(
    { userId, iat: Date.now() },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { action, email, password, fullName } = req.body;

    if (action === 'signup') {
      try {
        const hashedPassword = hashPassword(password);
        const { data, error } = await supabase
          .from('users')
          .insert([{
            email,
            password_hash: hashedPassword,
            full_name: fullName,
            plan: 'free'
          }])
          .select();

        if (error) throw error;

        const token = createToken(data[0].id);
        res.status(201).json({
          success: true,
          user: data[0],
          token
        });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }

    if (action === 'login') {
      try {
        const hashedPassword = hashPassword(password);
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .eq('password_hash', hashedPassword)
          .single();

        if (error || !data) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        await supabase
          .from('users')
          .update({ last_login: new Date() })
          .eq('id', data.id);

        const token = createToken(data.id);
        res.status(200).json({
          success: true,
          user: data,
          token
        });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// ============================================================================
// 2. TASKS CRUD - /api/tasks.js
// ============================================================================
export default async function handler(req, res) {
  const authToken = req.headers.authorization?.split(' ')[1];
  let userId;

  try {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    userId = decoded.userId;
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    // Get all tasks for user
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('next_run_at', { ascending: true });

      if (error) throw error;
      res.status(200).json({ tasks: data });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    // Create new task
    try {
      const {
        name, description, frequency, scheduledTime, days,
        inputFiles, outputFiles, successCriteria, requiresApproval,
        prompt, templateId
      } = req.body;

      // Calculate next run
      const nextRun = calculateNextRun(frequency, days, scheduledTime);

      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          user_id: userId,
          name,
          description,
          frequency,
          days_of_week: days || [0,1,2,3,4,5,6],
          scheduled_time: scheduledTime,
          input_files: inputFiles || [],
          output_files: outputFiles || [],
          success_criteria: successCriteria,
          requires_approval: requiresApproval || false,
          prompt,
          template_id: templateId,
          next_run_at: nextRun,
          status: 'active'
        }])
        .select();

      if (error) throw error;
      res.status(201).json({ task: data[0] });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    // Update task
    try {
      const { id, ...updates } = req.body;

      // Verify ownership
      const { data: task } = await supabase
        .from('tasks')
        .select('user_id')
        .eq('id', id)
        .single();

      if (task.user_id !== userId) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      // Recalculate next run if schedule changed
      if (updates.frequency || updates.days_of_week || updates.scheduled_time) {
        updates.next_run_at = calculateNextRun(
          updates.frequency || task.frequency,
          updates.days_of_week,
          updates.scheduled_time
        );
      }

      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      res.status(200).json({ task: data[0] });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    // Delete task
    try {
      const { id } = req.body;

      // Verify ownership
      const { data: task } = await supabase
        .from('tasks')
        .select('user_id')
        .eq('id', id)
        .single();

      if (task.user_id !== userId) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

// ============================================================================
// 3. TASK EXECUTION - /api/execute.js
// ============================================================================
export default async function handler(req, res) {
  const authToken = req.headers.authorization?.split(' ')[1];
  let userId;

  try {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    userId = decoded.userId;
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const { taskId, executionType = 'manual' } = req.body;

      // Get task
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .eq('user_id', userId)
        .single();

      if (taskError || !task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Get API key
      const { data: apiKey, error: keyError } = await supabase
        .from('api_keys')
        .select('encrypted_key')
        .eq('id', task.api_key_id)
        .single();

      if (keyError || !apiKey) {
        return res.status(400).json({ error: 'API key not configured' });
      }

      // Decrypt API key
      const claudeApiKey = decryptKey(apiKey.encrypted_key);

      // Call Claude API
      const claudeResponse = await callClaudeAPI(
        claudeApiKey,
        task.prompt,
        task.input_files
      );

      // Log execution
      const { data: log, error: logError } = await supabase
        .from('execution_logs')
        .insert([{
          task_id: taskId,
          user_id: userId,
          execution_type: executionType,
          status: 'success',
          output: claudeResponse,
          files_created: task.output_files,
          completed_at: new Date()
        }])
        .select();

      // Update task with last run info
      await supabase
        .from('tasks')
        .update({
          last_run_at: new Date(),
          last_run_status: 'success',
          last_run_output: claudeResponse,
          next_run_at: calculateNextRun(task.frequency, task.days_of_week, task.scheduled_time)
        })
        .eq('id', taskId);

      res.status(200).json({
        success: true,
        output: claudeResponse,
        executionId: log[0].id
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

// ============================================================================
// 4. GENERATE SCRIPT - /api/generate.js
// ============================================================================
export default async function handler(req, res) {
  const authToken = req.headers.authorization?.split(' ')[1];
  let userId;

  try {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    userId = decoded.userId;
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const { taskId } = req.body;

      // Get task
      const { data: task } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .eq('user_id', userId)
        .single();

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Generate script template
      const script = generateClaudeScript(task);

      // Encrypt script
      const encryptedScript = encryptScript(script, process.env.ENCRYPTION_KEY);

      res.status(200).json({
        success: true,
        script: script,
        encryptedScript: encryptedScript,
        taskId: taskId
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

// ============================================================================
// 5. STRIPE WEBHOOKS - /api/stripe.js
// ============================================================================
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const sig = req.headers['stripe-signature'];

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.client_reference_id;
        const planName = session.metadata.plan;

        // Update subscription
        await supabase
          .from('subscriptions')
          .update({
            plan: planName,
            stripe_subscription_id: session.subscription,
            current_period_start: new Date(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'active'
          })
          .eq('user_id', userId);

        // Update user plan
        await supabase
          .from('users')
          .update({ plan: planName })
          .eq('id', userId);
      }

      res.status(200).json({ received: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

// ============================================================================
// 6. ADMIN PANEL - /api/admin.js
// ============================================================================
export default async function handler(req, res) {
  const authToken = req.headers.authorization?.split(' ')[1];
  let userId;

  try {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    userId = decoded.userId;
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Verify system owner
  const { data: user } = await supabase
    .from('users')
    .select('is_system_owner')
    .eq('id', userId)
    .single();

  if (!user.is_system_owner) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  if (req.method === 'GET') {
    // Get all users, plans, templates
    if (req.query.resource === 'users') {
      const { data } = await supabase.from('users').select('*');
      res.status(200).json({ users: data });
    }

    if (req.query.resource === 'plans') {
      const { data } = await supabase.from('plan_settings').select('*');
      res.status(200).json({ plans: data });
    }

    if (req.query.resource === 'templates') {
      const { data } = await supabase.from('templates').select('*');
      res.status(200).json({ templates: data });
    }
  }

  if (req.method === 'PUT') {
    // Update plan pricing, task limits, etc
    if (req.body.resource === 'plan') {
      const { planName, ...updates } = req.body;
      const { data, error } = await supabase
        .from('plan_settings')
        .update(updates)
        .eq('plan_name', planName)
        .select();

      if (error) return res.status(400).json({ error: error.message });
      res.status(200).json({ plan: data[0] });
    }

    // Create/update template
    if (req.body.resource === 'template') {
      const { ...templateData } = req.body;
      const { data, error } = await supabase
        .from('templates')
        .upsert(templateData)
        .select();

      if (error) return res.status(400).json({ error: error.message });
      res.status(200).json({ template: data[0] });
    }
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculateNextRun(frequency, days, time) {
  // Calculate next scheduled run time based on frequency
  const now = new Date();
  const [hours, minutes] = time.split(':');

  if (frequency === 'daily') {
    const next = new Date(now);
    next.setHours(parseInt(hours), parseInt(minutes), 0);
    if (next < now) next.setDate(next.getDate() + 1);
    return next;
  }

  if (frequency === 'weekly') {
    const next = new Date(now);
    const dayOfWeek = next.getDay();
    const daysArray = days || [0,1,2,3,4,5,6];

    for (let i = 0; i < 7; i++) {
      const checkDay = (dayOfWeek + i) % 7;
      if (daysArray.includes(checkDay)) {
        next.setDate(next.getDate() + i);
        next.setHours(parseInt(hours), parseInt(minutes), 0);
        return next;
      }
    }
  }

  if (frequency === 'monthly') {
    const next = new Date(now);
    next.setDate(1);
    next.setMonth(next.getMonth() + 1);
    next.setHours(parseInt(hours), parseInt(minutes), 0);
    return next;
  }

  return now;
}

function encryptKey(key, encryptionKey) {
  const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
  let encrypted = cipher.update(key, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptKey(encryptedKey) {
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let decrypted = decipher.update(encryptedKey, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function encryptScript(script, key) {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(script, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function generateClaudeScript(task) {
  return `#!/usr/bin/env claude
# Task: ${task.name}
# Task ID: ${task.id}
# Frequency: ${task.frequency}

"""
${task.name}

What it does:
${task.description}

Input files:
${task.input_files.join('\n')}

Output files:
${task.output_files.join('\n')}

Success criteria:
${task.success_criteria}
"""

def main():
    print(f"🚀 Running: ${task.name}")
    print(f"   Scheduled: {datetime.now().isoformat()}")

    # TODO: Implement task logic
    # 1. Read input files
    # 2. Process according to task description
    # 3. Write outputs
    # 4. Return status

    print(f"✅ Task completed")
    return True

if __name__ == "__main__":
    main()
`;
}

async function callClaudeAPI(apiKey, prompt, inputFiles) {
  // Call Claude API with user's key
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-opus-5',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })
  });

  const data = await response.json();
  return data.content[0].text;
}

// ============================================================================
// END OF VERCEL FUNCTIONS
// ============================================================================
