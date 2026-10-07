import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
    console.log('=== APPROVE API ===', req.method);

    const user = await verifyAuth(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'POST') {
      console.log('POST approve execution for user:', user.id);

      const { executionId, approved, approvalNotes } = req.body;

      if (!executionId) {
        return res.status(400).json({ error: 'Execution ID required' });
      }

      if (approved === undefined) {
        return res.status(400).json({ error: 'Approval status required' });
      }

      try {
        // Verify execution belongs to user's task
        const { data: execution, error: execError } = await supabase
          .from('execution_logs')
          .select('task_id, user_id')
          .eq('id', executionId)
          .single();

        if (execError || !execution || execution.user_id !== user.id) {
          return res.status(404).json({ error: 'Execution not found or unauthorized' });
        }

        // Update execution with approval status
        const { data: updated, error: updateError } = await supabase
          .from('execution_logs')
          .update({
            approval_status: approved ? 'approved' : 'rejected',
            approved_by: user.id,
            approved_at: new Date().toISOString(),
            approval_notes: approvalNotes || null
          })
          .eq('id', executionId)
          .select();

        if (updateError) {
          console.error('Update error:', updateError);
          throw updateError;
        }

        console.log('Execution approved:', executionId);
        return res.status(200).json({
          success: true,
          message: approved ? 'Execution approved' : 'Execution rejected',
          execution: updated[0]
        });

      } catch (error) {
        console.error('Approval error:', error.message);
        return res.status(500).json({ error: `Approval failed: ${error.message}` });
      }
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: error.message });
  }
}
