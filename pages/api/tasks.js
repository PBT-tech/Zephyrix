import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Use service key if available, otherwise use anon key
const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey
);

// Verify JWT token from Supabase Auth
async function verifyAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    console.error('No auth header');
    return null;
  }

  const token = authHeader.substring(7);
  try {
    // Try Supabase auth verification first
    if (supabaseServiceKey) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error) {
        console.error('Supabase auth error:', error);
        return null;
      }
      return user;
    } else {
      // Fallback: decode JWT manually
      const decoded = jwt.decode(token);
      if (!decoded) {
        console.error('Invalid token');
        return null;
      }
      return { id: decoded.sub, email: decoded.email };
    }
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

export default async function handler(req, res) {
  const user = await verifyAuth(req);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    // Get all tasks for user
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.status(200).json({ tasks: data || [] });
    } catch (error) {
      console.error('Task fetch error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    // Create new task
    try {
      const { name, frequency } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Task name required' });
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          name,
          frequency: frequency || 'weekly',
          user_id: user.id,
          team_id: user.user_metadata?.team_id || user.id,
          status: 'active'
        }])
        .select();

      if (error) throw error;

      return res.status(201).json({
        success: true,
        task: data[0]
      });
    } catch (error) {
      console.error('Task creation error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    // Update task
    try {
      const { id, ...updates } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Task ID required' });
      }

      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        task: data[0]
      });
    } catch (error) {
      console.error('Task update error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    // Delete task
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

      if (error) throw error;

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Task deletion error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
