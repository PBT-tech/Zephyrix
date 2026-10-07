import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ZephyrexApp() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          setPage('dashboard');
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        setPage('dashboard');
      } else {
        setUser(null);
        setPage('login');
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setPage('login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!user) {
    return <LoginPage setUser={setUser} />;
  }

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header user={user} onLogout={handleLogout} setPage={setPage} />
      <Navigation currentPage={page} setPage={setPage} />
      <main style={{ padding: '20px', flex: 1 }}>
        {page === 'dashboard' && <Dashboard user={user} setPage={setPage} />}
        {page === 'create-task' && <CreateTaskForm user={user} setPage={setPage} />}
        {page === 'calendar' && <CalendarView user={user} />}
        {page === 'reporting' && <Reporting user={user} />}
        {page === 'settings' && <Settings user={user} />}
        {user.user_metadata?.is_system_owner && page === 'admin' && <AdminPanel user={user} />}
      </main>
    </div>
  );
}

function LoginPage({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignup) {
        const { error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { is_system_owner: false } }
        });
        if (signupError) throw signupError;
        setError('Check your email to confirm signup!');
      } else {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (loginError) throw loginError;
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>⚡ ZEPHYRIX</h1>
      <p style={{ color: '#666' }}>Swift Automation</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
          />
        </div>

        {error && <div style={{ color: error.includes('Check your email') ? 'green' : 'red', marginBottom: '15px' }}>{error}</div>}

        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1 }}>
          {isLoading ? 'Loading...' : (isSignup ? 'Create Account' : 'Sign In')}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>
          {isSignup ? 'Have an account?' : "Don't have an account?"}
          <button type="button" onClick={() => { setIsSignup(!isSignup); setError(''); }} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', marginLeft: '5px', textDecoration: 'underline' }}>
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}

function Header({ user, onLogout, setPage }) {
  return (
    <header style={{ backgroundColor: '#f8f9fa', padding: '15px 20px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1 style={{ margin: '0', fontSize: '24px' }}>⚡ ZEPHYRIX</h1>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span>{user?.email}</span>
        <button onClick={() => setPage('settings')} style={{ padding: '8px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Settings</button>
        <button onClick={onLogout} style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
      </div>
    </header>
  );
}

function Navigation({ currentPage, setPage }) {
  return (
    <nav style={{ backgroundColor: '#e9ecef', padding: '10px 20px', display: 'flex', gap: '10px', borderBottom: '1px solid #ddd' }}>
      <button onClick={() => setPage('dashboard')} style={{ backgroundColor: currentPage === 'dashboard' ? '#007bff' : '#6c757d', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>📋 Tasks</button>
      <button onClick={() => setPage('calendar')} style={{ backgroundColor: currentPage === 'calendar' ? '#007bff' : '#6c757d', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>📅 Calendar</button>
      <button onClick={() => setPage('reporting')} style={{ backgroundColor: currentPage === 'reporting' ? '#007bff' : '#6c757d', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>📊 Reporting</button>
      <button onClick={() => setPage('create-task')} style={{ backgroundColor: currentPage === 'create-task' ? '#007bff' : '#6c757d', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>➕ New Task</button>
    </nav>
  );
}

function Dashboard({ user, setPage }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [executingTaskId, setExecutingTaskId] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [cacheTime, setCacheTime] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Only load on mount if cache is empty
    if (tasks.length === 0) {
      loadTasks();
    }
  }, []);

  const loadTasks = async (forceRefresh = false) => {
    // Skip if cache is fresh (less than 5 minutes old)
    if (!forceRefresh && cacheTime && Date.now() - cacheTime < 300000) {
      console.log('Using cached tasks');
      setIsLoading(false);
      return;
    }

    if (forceRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      setTasks(response.data.tasks || []);
      setCacheTime(Date.now());
      console.log('Tasks loaded and cached:', response.data.tasks?.length || 0);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Delete this task?')) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      await axios.delete('/api/tasks', {
        headers: { Authorization: `Bearer ${session.access_token}` },
        data: { id: taskId }
      });
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (error) {
      alert('Failed to delete task');
    }
  };

  const handleRunTask = async (taskId) => {
    setExecutingTaskId(taskId);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await axios.post('/api/execute',
        { taskId },
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );

      const task = tasks.find(t => t.id === taskId);
      setExecutionResult({
        taskId,
        result: response.data.result,
        executionId: response.data.executionId,
        timestamp: new Date().toISOString(),
        approval_status: 'pending',
        task: task
      });
    } catch (error) {
      alert('Task execution failed: ' + error.response?.data?.error || error.message);
    } finally {
      setExecutingTaskId(null);
    }
  };

  if (isLoading) {
    return (
      <div>
        <h2>Your Tasks</h2>
        <div style={{ display: 'grid', gap: '15px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f8f9fa', animation: 'pulse 1.5s ease-in-out infinite' }}>
              <div style={{ height: '20px', backgroundColor: '#e0e0e0', borderRadius: '4px', marginBottom: '10px', width: '60%' }}></div>
              <div style={{ height: '14px', backgroundColor: '#e0e0e0', borderRadius: '4px', marginBottom: '8px', width: '40%' }}></div>
              <div style={{ height: '14px', backgroundColor: '#e0e0e0', borderRadius: '4px', width: '30%' }}></div>
            </div>
          ))}
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Your Tasks ({tasks.length})</h2>
        <button onClick={() => loadTasks(true)} disabled={isRefreshing} style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: isRefreshing ? 'not-allowed' : 'pointer', opacity: isRefreshing ? 0.6 : 1 }}>
          {isRefreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
        </button>
      </div>
      {tasks.length === 0 ? (
        <p>No tasks yet. Create one to get started!</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {tasks.map((task) => (
            <div key={task.id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 5px 0' }}>{task.name}</h3>
                  {task.description && <p style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>{task.description}</p>}
                  <div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: '#666', margin: '5px 0', flexWrap: 'wrap' }}>
                    <span>📅 {task.frequency.charAt(0).toUpperCase() + task.frequency.slice(1)}</span>
                    {task.scheduled_time && <span>🕐 {task.scheduled_time}</span>}
                    {task.frequency === 'once' && task.scheduled_date && <span>📆 {task.scheduled_date}</span>}
                    {task.frequency === 'weekly' && task.days_of_week && (
                      <span>📆 {
                        (() => {
                          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                          const days = Array.isArray(task.days_of_week) ? task.days_of_week : [];
                          return days.map(d => dayNames[d]).join(', ');
                        })()
                      }</span>
                    )}
                    {task.status && <span>🟢 {task.status === 'active' ? 'Active' : task.status === 'paused' ? 'Paused' : 'Archived'}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setEditingTask(task)} style={{ padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>✏️ Edit</button>
                  <button onClick={() => handleDelete(task.id)} style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>🗑️ Delete</button>
                  <button onClick={() => handleRunTask(task.id)} disabled={executingTaskId === task.id} style={{ padding: '8px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: executingTaskId === task.id ? 'not-allowed' : 'pointer', fontSize: '12px', opacity: executingTaskId === task.id ? 0.6 : 1 }}>
                    {executingTaskId === task.id ? '⏳ Running...' : '▶️ Run Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingTask && (
        <EditTaskModal task={editingTask} onClose={() => setEditingTask(null)} onSave={async () => { setEditingTask(null); loadTasks(true); }} />
      )}

      {executionResult && (
        <ExecutionResultModal result={executionResult} task={executionResult.task} onClose={() => setExecutionResult(null)} />
      )}
    </div>
  );
}

function ExecutionResultModal({ result, onClose, task }) {
  const [approvalNotes, setApprovalNotes] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(result.approval_status || 'pending');
  const [message, setMessage] = useState('');

  const handleBackdropClick = (e) => {
    if (e.target.style.backgroundColor === 'rgba(0,0,0,0.5)') {
      onClose();
    }
  };

  const handleApprove = async (approved) => {
    setIsApproving(true);
    setMessage('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await axios.post('/api/approve',
        {
          executionId: result.executionId,
          approved: approved,
          approvalNotes: approvalNotes
        },
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );

      setApprovalStatus(approved ? 'approved' : 'rejected');
      setMessage(response.data.message);
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div onClick={handleBackdropClick} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, cursor: 'pointer' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', cursor: 'default' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', padding: '0', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        <h2 style={{ marginTop: '0' }}>Task Execution Result</h2>
        <p style={{ color: '#666', marginBottom: '5px' }}>Execution ID: {result.executionId}</p>
        <p style={{ color: '#666', marginBottom: '15px' }}>Status: <strong>{approvalStatus === 'pending' ? '⏳ Pending Approval' : approvalStatus === 'approved' ? '✅ Approved' : '❌ Rejected'}</strong></p>

        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '4px', marginBottom: '15px', maxHeight: '300px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '13px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {result.result}
        </div>

        {task?.requires_approval && approvalStatus === 'pending' && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Approval Notes (optional)</label>
            <textarea value={approvalNotes} onChange={(e) => setApprovalNotes(e.target.value)} placeholder="Add any notes about this approval..." style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box', minHeight: '60px' }} />
          </div>
        )}

        {message && (
          <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: approvalStatus === 'approved' ? '#d4edda' : '#f8d7da', color: approvalStatus === 'approved' ? '#155724' : '#721c24', borderRadius: '4px' }}>
            {message}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} disabled={isApproving} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: isApproving ? 'not-allowed' : 'pointer', opacity: isApproving ? 0.6 : 1 }}>Close</button>
          <button type="button" onClick={() => { navigator.clipboard.writeText(result.result); alert('Result copied!'); }} disabled={isApproving} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: isApproving ? 'not-allowed' : 'pointer', opacity: isApproving ? 0.6 : 1 }}>Copy Result</button>

          {task?.requires_approval && approvalStatus === 'pending' && (
            <>
              <button type="button" onClick={() => handleApprove(false)} disabled={isApproving} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: isApproving ? 'not-allowed' : 'pointer', opacity: isApproving ? 0.6 : 1 }}>
                {isApproving ? '⏳ Processing...' : '❌ Reject'}
              </button>
              <button type="button" onClick={() => handleApprove(true)} disabled={isApproving} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: isApproving ? 'not-allowed' : 'pointer', opacity: isApproving ? 0.6 : 1 }}>
                {isApproving ? '⏳ Processing...' : '✅ Approve'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EditTaskModal({ task, onClose, onSave }) {
  const [formData, setFormData] = useState({
    ...task,
    input_files: task.input_files || '',
    output_files: task.output_files || '',
    scheduled_time: task.scheduled_time || '09:00',
    scheduled_date: task.scheduled_date || new Date().toISOString().split('T')[0],
    days_of_week: Array.isArray(task.days_of_week) ? task.days_of_week : [1, 2, 3, 4, 5],
    status: task.status || 'active',
    requires_approval: task.requires_approval || false,
    priority: task.priority || 'medium'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleBackdropClick = (e) => {
    if (e.target.style.backgroundColor === 'rgba(0,0,0,0.5)') {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      await axios.put('/api/tasks', formData, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      alert('Task updated successfully!');
      onSave();
    } catch (error) {
      console.error('Update error:', error.response?.data || error.message);
      alert('Failed to update task: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div onClick={handleBackdropClick} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, cursor: 'pointer' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', cursor: 'default' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', padding: '0', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        <h2 style={{ marginTop: '0' }}>Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Task Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
            <textarea value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box', minHeight: '80px' }} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Prompt/Instructions</label>
            <textarea value={formData.prompt || ''} onChange={(e) => setFormData({...formData, prompt: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box', minHeight: '100px' }} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Input Files/Paths (comma-separated)</label>
            <input type="text" value={formData.input_files || ''} onChange={(e) => setFormData({...formData, input_files: e.target.value})} placeholder="/path/to/file1, /path/to/file2, /data/input.csv" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>Example: /home/data/input.txt, /data/config.json</small>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Output Files/Paths (comma-separated)</label>
            <input type="text" value={formData.output_files || ''} onChange={(e) => setFormData({...formData, output_files: e.target.value})} placeholder="/path/to/output1, /path/to/output2" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>Example: /home/results/report.txt, /data/output.json</small>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Success Criteria</label>
            <textarea value={formData.success_criteria || ''} onChange={(e) => setFormData({...formData, success_criteria: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box', minHeight: '80px' }} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Frequency</label>
            <select value={formData.frequency} onChange={(e) => setFormData({...formData, frequency: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}>
              <option value="once">Run Once</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Time (24-hour format)</label>
            <input type="time" value={formData.scheduled_time} onChange={(e) => setFormData({...formData, scheduled_time: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
          </div>

          {formData.frequency === 'once' && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date</label>
              <input type="date" value={formData.scheduled_date} onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            </div>
          )}

          {formData.frequency === 'weekly' && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Days of Week</label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const days = [...formData.days_of_week];
                      if (days.includes(idx)) {
                        days.splice(days.indexOf(idx), 1);
                      } else {
                        days.push(idx);
                      }
                      setFormData({...formData, days_of_week: days.sort()});
                    }}
                    style={{ padding: '8px 12px', backgroundColor: formData.days_of_week.includes(idx) ? '#007bff' : '#ddd', color: formData.days_of_week.includes(idx) ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Priority</label>
            <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
              <input type="checkbox" checked={formData.requires_approval} onChange={(e) => setFormData({...formData, requires_approval: e.target.checked})} />
              Requires Approval Before Running
            </label>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status</label>
            <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={isLoading} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1 }}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CreateTaskForm({ user, setPage }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prompt: '',
    frequency: 'weekly',
    success_criteria: '',
    input_files: '',
    output_files: '',
    scheduled_time: '09:00',
    scheduled_date: new Date().toISOString().split('T')[0],
    days_of_week: [1, 2, 3, 4, 5], // Monday-Friday by default
    status: 'active',
    requires_approval: false,
    priority: 'medium'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      await axios.post('/api/tasks', formData, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      alert('Task created successfully!');
      setPage('dashboard');
    } catch (error) {
      alert('Failed to create task: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <h2>Create New Task</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Task Name *</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
          <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box', minHeight: '80px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Prompt/Instructions</label>
          <textarea value={formData.prompt} onChange={(e) => setFormData({...formData, prompt: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box', minHeight: '100px' }} placeholder="What should this task do?" />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Input Files/Paths (comma-separated)</label>
          <input type="text" value={formData.input_files} onChange={(e) => setFormData({...formData, input_files: e.target.value})} placeholder="/path/to/file1, /path/to/file2, /data/input.csv" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>Example: /home/data/input.txt, /data/config.json</small>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Output Files/Paths (comma-separated)</label>
          <input type="text" value={formData.output_files} onChange={(e) => setFormData({...formData, output_files: e.target.value})} placeholder="/path/to/output1, /path/to/output2" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>Example: /home/results/report.txt, /data/output.json</small>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Success Criteria</label>
          <textarea value={formData.success_criteria} onChange={(e) => setFormData({...formData, success_criteria: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box', minHeight: '80px' }} placeholder="How will you know this task succeeded?" />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Frequency</label>
          <select value={formData.frequency} onChange={(e) => setFormData({...formData, frequency: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}>
            <option value="once">Run Once</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Time (24-hour format)</label>
          <input type="time" value={formData.scheduled_time} onChange={(e) => setFormData({...formData, scheduled_time: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
        </div>

        {formData.frequency === 'once' && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date</label>
            <input type="date" value={formData.scheduled_date} onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
          </div>
        )}

        {formData.frequency === 'weekly' && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Days of Week</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const days = [...formData.days_of_week];
                    if (days.includes(idx)) {
                      days.splice(days.indexOf(idx), 1);
                    } else {
                      days.push(idx);
                    }
                    setFormData({...formData, days_of_week: days.sort()});
                  }}
                  style={{ padding: '8px 12px', backgroundColor: formData.days_of_week.includes(idx) ? '#007bff' : '#ddd', color: formData.days_of_week.includes(idx) ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Priority</label>
          <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
            <input type="checkbox" checked={formData.requires_approval} onChange={(e) => setFormData({...formData, requires_approval: e.target.checked})} />
            Requires Approval Before Running
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status</label>
          <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={isLoading} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1 }}>
            {isLoading ? 'Creating...' : 'Create Task'}
          </button>
          <button type="button" onClick={() => setPage('dashboard')} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

function CalendarView({ user }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isTaskOnDate = (task, dateStr) => {
    if (task.frequency === 'once' && task.scheduled_date === dateStr) return true;

    if (task.frequency === 'daily') return true;

    if (task.frequency === 'weekly') {
      const dayOfWeek = new Date(dateStr).getDay();
      return task.days_of_week?.includes(dayOfWeek);
    }

    if (task.frequency === 'monthly') {
      const day = new Date(dateStr).getDate();
      const taskDay = task.scheduled_date ? new Date(task.scheduled_date).getDate() : 1;
      return day === taskDay;
    }

    return false;
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={{ padding: '10px', border: '1px solid #eee', backgroundColor: '#f9f9f9' }}></div>);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayTasks = tasks.filter(task => isTaskOnDate(task, dateStr) && task.status === 'active');

      days.push(
        <div key={day} style={{
          padding: '10px',
          border: '1px solid #ddd',
          backgroundColor: dayTasks.length > 0 ? '#e8f4f8' : 'white',
          minHeight: '80px',
          overflowY: 'auto'
        }}>
          <strong style={{ fontSize: '14px' }}>{day}</strong>
          <div style={{ fontSize: '11px', marginTop: '5px' }}>
            {dayTasks.slice(0, 2).map(task => (
              <div key={task.id} style={{ color: '#007bff', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                • {task.name}
              </div>
            ))}
            {dayTasks.length > 2 && <div style={{ color: '#666', fontSize: '10px' }}>+{dayTasks.length - 2} more</div>}
          </div>
        </div>
      );
    }

    return days;
  };

  if (isLoading) return <div><h2>📅 Calendar View</h2><p>Loading...</p></div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>📅 {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} style={{ padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>← Prev</button>
          <button onClick={() => setCurrentDate(new Date())} style={{ padding: '8px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Today</button>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} style={{ padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Next →</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#ddd', padding: '1px' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} style={{ padding: '10px', backgroundColor: '#f0f0f0', fontWeight: 'bold', textAlign: 'center' }}>{day}</div>
        ))}
        {renderCalendar()}
      </div>

      <p style={{ marginTop: '20px', color: '#666', fontSize: '13px' }}>
        💡 Shows active tasks scheduled for each day. Click a task to edit it.
      </p>
    </div>
  );
}

function Reporting({ user }) {
  return <div><h2>📊 Reporting</h2><p>Coming soon...</p></div>;
}

function Settings({ user }) {
  return <div><h2>⚙️ Settings</h2><p>API Key management coming soon...</p></div>;
}

function AdminPanel({ user }) {
  return <div><h2>⚙️ Admin Panel</h2><p>Admin controls coming soon...</p></div>;
}

export const getServerSideProps = async () => {
  return { props: {} };
};
