import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const claudeApiKey = process.env.CLAUDE_API_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

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
    console.log('=== EXECUTE API ===', req.method);

    const user = await verifyAuth(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'POST') {
      console.log('POST execute task for user:', user.id);

      const { taskId } = req.body;

      if (!taskId) {
        return res.status(400).json({ error: 'Task ID required' });
      }

      try {
        // Fetch task
        const { data: task, error: taskError } = await supabase
          .from('tasks')
          .select('*')
          .eq('id', taskId)
          .eq('user_id', user.id)
          .single();

        if (taskError || !task) {
          return res.status(404).json({ error: 'Task not found' });
        }

        console.log('Task found:', task.name);

        // Prepare prompt
        const prompt = task.prompt || `Execute this task: ${task.name}\n\nDescription: ${task.description || 'N/A'}\n\nSuccess criteria: ${task.success_criteria || 'Complete the task'}`;

        console.log('Calling Claude API...');

        // Call Claude API
        const claudeResponse = await axios.post(
          'https://api.anthropic.com/v1/messages',
          {
            model: 'claude-opus-4-1-20250805',
            max_tokens: 2048,
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ]
          },
          {
            headers: {
              'x-api-key': claudeApiKey,
              'anthropic-version': '2023-06-01',
              'content-type': 'application/json'
            }
          }
        );

        const result = claudeResponse.data.content[0].text;
        console.log('Claude response received:', result.substring(0, 100) + '...');

        // Store execution result
        const { data: log, error: logError } = await supabase
          .from('execution_logs')
          .insert([{
            task_id: taskId,
            user_id: user.id,
            status: 'success',
            output: result,
            execution_type: 'manual'
          }])
          .select();

        if (logError) {
          console.error('Error storing execution log:', logError);
          // Still return the result even if logging fails
          return res.status(200).json({
            success: true,
            result: result,
            warning: 'Result generated but logging failed'
          });
        }

        return res.status(200).json({
          success: true,
          result: result,
          executionId: log[0].id
        });

      } catch (error) {
        console.error('Execution error:', error.message);
        return res.status(500).json({ error: `Task execution failed: ${error.message}` });
      }
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: error.message });
  }
}
