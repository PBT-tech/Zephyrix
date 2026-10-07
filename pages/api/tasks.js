import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    console.log('No auth header');
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) {
      console.error('Auth error:', error);
      return null;
    }
    return user;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

export default async function handler(req, res) {
  try {
    console.log('=== TASK API ===', req.method);

    const user = await verifyAuth(req);
    if (!user) {
      console.log('Auth failed');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
      console.log('GET tasks for user:', user.id);
      try {
        // Optimize: select only necessary columns
        const { data, error } = await supabase
          .from('tasks')
          .select('id,name,description,frequency,created_at,status,scheduled_time,scheduled_date,days_of_week')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50); // Paginate: max 50 tasks per request

        if (error) {
          console.error('Query error:', error);
          throw error;
        }

        console.log('Tasks fetched:', data?.length || 0);

        // Add caching headers for 5 minutes
        res.setHeader('Cache-Control', 'private, max-age=300');
        return res.status(200).json({ tasks: data || [] });
      } catch (error) {
        console.error('GET error:', error.message);
        return res.status(500).json({ error: `Failed to fetch tasks: ${error.message}` });
      }
    }

    if (req.method === 'POST') {
      console.log('POST create task for user:', user.id);
      try {
        const { name, description, prompt, frequency, success_criteria, input_files, output_files } = req.body;

        console.log('Task data received:', { name, frequency, hasPrompt: !!prompt });

        if (!name) {
          return res.status(400).json({ error: 'Task name required' });
        }

        const taskData = {
          name: name.trim(),
          description: description ? description.trim() : null,
          prompt: prompt ? prompt.trim() : null,
          frequency: frequency || 'weekly',
          user_id: user.id,
          team_id: user.id,
          status: 'active',
          success_criteria: success_criteria ? success_criteria.trim() : null,
          input_files: input_files ? input_files.split(',').map(f => f.trim()).filter(f => f) : [],
          output_files: output_files ? output_files.split(',').map(f => f.trim()).filter(f => f) : []
        };

        console.log('Inserting task:', taskData.name);

        const { data, error } = await supabase
          .from('tasks')
          .insert([taskData])
          .select();

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }

        console.log('Task created:', data?.[0]?.id);
        return res.status(201).json({
          success: true,
          task: data[0]
        });
      } catch (error) {
        console.error('POST error:', error);
        return res.status(500).json({ error: `Failed to create task: ${error.message}` });
      }
    }

    if (req.method === 'PUT') {
      console.log('PUT update task for user:', user.id);
      try {
        const { id, name, description, prompt, frequency, success_criteria, input_files, output_files, scheduled_time, scheduled_date, days_of_week } = req.body;

        if (!id) {
          return res.status(400).json({ error: 'Task ID required' });
        }

        const updateData = {
          name: name ? name.trim() : undefined,
          description: description ? description.trim() : undefined,
          prompt: prompt ? prompt.trim() : undefined,
          frequency: frequency || undefined,
          success_criteria: success_criteria ? success_criteria.trim() : undefined,
          input_files: input_files ? input_files.split(',').map(f => f.trim()).filter(f => f) : undefined,
          output_files: output_files ? output_files.split(',').map(f => f.trim()).filter(f => f) : undefined,
          scheduled_time: scheduled_time || undefined,
          scheduled_date: scheduled_date || undefined,
          days_of_week: days_of_week || undefined
        };

        // Remove undefined fields
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        const { data, error } = await supabase
          .from('tasks')
          .update(updateData)
          .eq('id', id)
          .eq('user_id', user.id)
          .select();

        if (error) {
          console.error('Update error:', error);
          throw error;
        }

        console.log('Task updated:', id);
        return res.status(200).json({
          success: true,
          task: data[0]
        });
      } catch (error) {
        console.error('PUT error:', error);
        return res.status(500).json({ error: `Failed to update task: ${error.message}` });
      }
    }

    if (req.method === 'DELETE') {
      console.log('DELETE task for user:', user.id);
      try {
        const { id } = req.body;

        if (!id) {
          return res.status(400).json({ error: 'Task ID required' });
        }

        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Delete error:', error);
          throw error;
        }

        console.log('Task deleted:', id);
        return res.status(200).json({ success: true });
      } catch (error) {
        console.error('DELETE error:', error);
        return res.status(500).json({ error: `Failed to delete task: ${error.message}` });
      }
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: error.message });
  }
}
