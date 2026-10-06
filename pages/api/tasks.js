import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('API Config:', {
  supabaseUrl: supabaseUrl ? 'Set' : 'Missing',
  supabaseAnonKey: supabaseAnonKey ? 'Set' : 'Missing'
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration!');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Verify JWT token
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
    console.log('User authenticated:', user?.id);
    return user;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

export default async function handler(req, res) {
  try {
    console.log('=== TASK API ===');
    console.log('Method:', req.method);
    console.log('Path:', req.path);

    const user = await verifyAuth(req);
    if (!user) {
      console.log('Auth failed');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
      console.log('GET tasks for user:', user.id);
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Query error:', error);
          throw error;
        }

        console.log('Tasks fetched:', data?.length || 0);
        return res.status(200).json({ tasks: data || [] });
      } catch (error) {
        console.error('GET tasks error:', error.message);
        return res.status(500).json({ error: `Failed to fetch tasks: ${error.message}` });
      }
    }

    if (req.method === 'POST') {
      console.log('POST create task for user:', user.id);
      try {
        const { name, frequency } = req.body;
        console.log('Task data:', { name, frequency });

        if (!name) {
          return res.status(400).json({ error: 'Task name required' });
        }

        console.log('Inserting task...');
        const { data, error } = await supabase
          .from('tasks')
          .insert([{
            name,
            frequency: frequency || 'weekly',
            user_id: user.id,
            team_id: user.id,
            status: 'active'
          }])
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

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: error.message });
  }
}
