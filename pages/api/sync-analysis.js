import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

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

// Find related tasks by analyzing task name, prompt similarity, and domain
async function findRelatedTasks(userId, sourceTaskId, sourceTask) {
  try {
    // Get all user tasks
    const { data: allTasks, error } = await supabase
      .from('tasks')
      .select('id,name,description,prompt,success_criteria,scheduled_time,days_of_week')
      .eq('user_id', userId)
      .neq('id', sourceTaskId);

    if (error || !allTasks) return [];

    // Find related tasks by analyzing:
    // 1. Name similarity (e.g., "RLF buying-signal scan (LinkedIn)" and "RLF buying-signal scan (Twitter)")
    // 2. Prompt/success criteria similarity (same logic, different platforms)
    // 3. Same domain/topic

    const relatedTasks = allTasks.filter(task => {
      // Extract base task name (remove platform names)
      const sourceBase = sourceTask.name
        .replace(/\((LinkedIn|Twitter|Facebook|Discord|Slack|Gmail|Instagram|TikTok|YouTube)\)/gi, '')
        .toLowerCase()
        .trim();

      const taskBase = task.name
        .replace(/\((LinkedIn|Twitter|Facebook|Discord|Slack|Gmail|Instagram|TikTok|YouTube)\)/gi, '')
        .toLowerCase()
        .trim();

      // Match 1: Same base task name (e.g., both are "RLF buying-signal scan")
      if (sourceBase === taskBase && sourceBase.length > 0) return true;

      // Match 2: Similar keywords in prompt (same scanning/automation logic)
      if (sourceTask.prompt && task.prompt) {
        const sourceWords = sourceTask.prompt.toLowerCase().split(/\s+/);
        const taskWords = task.prompt.toLowerCase().split(/\s+/);
        const matchedWords = sourceWords.filter(w => taskWords.includes(w) && w.length > 4);
        if (matchedWords.length >= 3) return true;
      }

      return false;
    });

    return relatedTasks;
  } catch (error) {
    console.error('Error finding related tasks:', error);
    return [];
  }
}

// Generate intelligent questions using Claude
async function generateSyncQuestions(sourceTask, changes, relatedTasks) {
  try {
    const changedFields = Object.keys(changes).join(', ');
    const relatedTasksList = relatedTasks
      .map(t => `- ${t.name} (scheduled: ${t.scheduled_time})`)
      .join('\n');

    const prompt = `You are a task automation advisor. A user just edited a task and now needs to sync changes to related tasks.

Source Task: "${sourceTask.name}"
Changed fields: ${changedFields}
Old prompt: ${changes.prompt?.old || 'N/A'}
New prompt: ${changes.prompt?.new || 'N/A'}
Old criteria: ${changes.success_criteria?.old || 'N/A'}
New criteria: ${changes.success_criteria?.new || 'N/A'}
Time changed from: ${changes.scheduled_time?.old || 'N/A'} to ${changes.scheduled_time?.new || 'N/A'}

Related tasks that might need the same changes:
${relatedTasksList}

Generate 2-3 intelligent, analytical questions to help the user decide how to adapt these changes for each related task.

Format your response as JSON array with this structure:
[
  {
    "text": "Question text?",
    "explanation": "Why this matters for task automation across platforms",
    "options": ["Option A", "Option B", "Option C"]
  }
]

Make questions contextual, not generic. Consider:
- Platform differences if detectable from task names
- Timing differences (peak hours vary by platform)
- Audience engagement patterns
- How the change affects each task's automation logic

Return ONLY the JSON array, no other text.`;

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-opus-4-1-20250805',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        }
      }
    );

    const content = response.data.content[0].text;
    const questions = JSON.parse(content);
    return questions;
  } catch (error) {
    console.error('Error generating sync questions:', error);
    return [];
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

    const { taskId, taskName, changes, taskData } = req.body;

    if (!taskId || !changes) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find related tasks
    const relatedTasks = await findRelatedTasks(user.id, taskId, { name: taskName, prompt: taskData.prompt });

    if (relatedTasks.length === 0) {
      return res.status(200).json({ relatedTasks: [] });
    }

    // Generate intelligent questions
    const questions = await generateSyncQuestions(
      { name: taskName, ...taskData },
      changes,
      relatedTasks
    );

    return res.status(200).json({
      relatedTasks: relatedTasks.map(t => ({
        id: t.id,
        name: t.name,
        scheduled_time: t.scheduled_time,
        platform: t.name.match(/\((LinkedIn|Twitter|Facebook|Discord|Slack|Gmail|Instagram|TikTok|YouTube)\)/i)?.[1] || null
      })),
      questions: questions || []
    });
  } catch (error) {
    console.error('Sync analysis error:', error);
    return res.status(500).json({ error: error.message });
  }
}
