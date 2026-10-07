import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) return null;
    return user;
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { sourceTaskId, selectedTaskIds, changes, answers, updateDescription } = req.body;

    if (!sourceTaskId || !selectedTaskIds || selectedTaskIds.length === 0 || !changes) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get the source task to understand the context
    const { data: sourceTask, error: sourceError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', sourceTaskId)
      .eq('user_id', user.id)
      .single();

    if (sourceError || !sourceTask) {
      return res.status(404).json({ error: 'Source task not found' });
    }

    // Apply changes to selected tasks based on user answers
    const updatePromises = selectedTaskIds.map(async (taskId) => {
      const { data: task, error: getError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .eq('user_id', user.id)
        .single();

      if (getError || !task) return null;

      // Build update object based on changes and answers
      const updateData = {};

      // Always apply prompt/criteria changes
      if (changes.prompt) updateData.prompt = changes.prompt.new;
      if (changes.success_criteria) updateData.success_criteria = changes.success_criteria.new;

      // Apply time changes with user-provided adjustments
      if (changes.scheduled_time) {
        // If user answered about timing, adjust for platform differences
        const timingAnswer = answers[0]; // First question is usually about timing
        if (timingAnswer === 'Keep same time') {
          updateData.scheduled_time = changes.scheduled_time.new;
        } else if (timingAnswer === 'Adjust for peak hours') {
          // Detect platform and adjust time accordingly
          const platform = task.name.match(/\((LinkedIn|Twitter|Facebook|Discord)\)/i)?.[1];
          const adjustedTime = adjustTimeForPlatform(changes.scheduled_time.new, platform);
          updateData.scheduled_time = adjustedTime;
        }
      }

      // Apply other changes
      if (changes.description) updateData.description = changes.description.new;
      if (changes.priority) updateData.priority = changes.priority.new;
      if (changes.status) updateData.status = changes.status.new;

      // Update the task
      const { error: updateError } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .eq('user_id', user.id);

      return { taskId, success: !updateError, error: updateError };
    });

    const results = await Promise.all(updatePromises);
    const successful = results.filter(r => r?.success).length;
    const failed = results.filter(r => !r?.success).length;

    // Log the sync update to execution_logs for audit trail
    if (successful > 0 && updateDescription) {
      const executionLog = {
        task_id: sourceTaskId,
        user_id: user.id,
        status: 'success',
        execution_type: 'sync',
        output: `SYNC UPDATE: ${updateDescription}\n\nApplied to ${successful} related task(s)\n\nAffected tasks: ${results.filter(r => r?.success).map(r => r.taskId).join(', ')}`,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      };

      await supabase
        .from('execution_logs')
        .insert([executionLog])
        .catch(error => console.error('Error logging sync update:', error));
    }

    return res.status(200).json({
      success: true,
      message: `Applied changes to ${successful} task(s)${failed > 0 ? `, ${failed} failed` : ''}`,
      results: results
    });
  } catch (error) {
    console.error('Sync apply error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Adjust time based on platform peak hours
function adjustTimeForPlatform(baseTime, platform) {
  const [hours, minutes] = baseTime.split(':').map(Number);

  const platformAdjustments = {
    'LinkedIn': 0,    // Base time (9 AM peak)
    'Twitter': 5,     // +5 hours (2 PM peak)
    'Facebook': -2,   // -2 hours (7 AM peak)
    'Discord': 1      // +1 hour (10 AM peak)
  };

  const offset = platformAdjustments[platform] || 0;
  const adjustedHours = (hours + offset + 24) % 24;

  return `${String(adjustedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
