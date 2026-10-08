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

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header user={user} onLogout={handleLogout} setPage={setPage} isMobile={isMobile} />
      <Navigation currentPage={page} setPage={setPage} isMobile={isMobile} />
      <main style={{
        padding: isMobile ? '12px' : '20px',
        flex: 1,
        overflowY: 'auto'
      }}>
        {page === 'dashboard' && <Dashboard user={user} setPage={setPage} isMobile={isMobile} />}
        {page === 'create-task' && <CreateTaskForm user={user} setPage={setPage} isMobile={isMobile} />}
        {page === 'calendar' && <CalendarView user={user} isMobile={isMobile} />}
        {page === 'reporting' && <Reporting user={user} isMobile={isMobile} />}
        {page === 'settings' && <Settings user={user} isMobile={isMobile} />}
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

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div style={{
      maxWidth: isMobile ? '95vw' : '400px',
      margin: '50px auto',
      padding: isMobile ? '15px' : '20px',
      border: '1px solid #ccc',
      borderRadius: '8px'
    }}>
      <h1 style={{ fontSize: isMobile ? '24px' : '32px' }}>⚡ ZEPHYRIX</h1>
      <p style={{ color: '#666', fontSize: isMobile ? '13px' : '14px' }}>Swift Automation</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: isMobile ? '12px' : '15px' }}>
          <label style={{
            display: 'block',
            marginBottom: isMobile ? '4px' : '5px',
            fontWeight: 'bold',
            fontSize: isMobile ? '13px' : '14px'
          }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
            style={{
              width: '100%',
              padding: isMobile ? '10px' : '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              boxSizing: 'border-box',
              fontSize: isMobile ? '16px' : '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: isMobile ? '12px' : '15px' }}>
          <label style={{
            display: 'block',
            marginBottom: isMobile ? '4px' : '5px',
            fontWeight: 'bold',
            fontSize: isMobile ? '13px' : '14px'
          }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: isMobile ? '10px' : '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              boxSizing: 'border-box',
              fontSize: isMobile ? '16px' : '14px'
            }}
          />
        </div>

        {error && <div style={{
          color: error.includes('Check your email') ? 'green' : 'red',
          marginBottom: isMobile ? '12px' : '15px',
          fontSize: isMobile ? '13px' : '14px'
        }}>{error}</div>}

        <button type="submit" disabled={isLoading} style={{
          width: '100%',
          padding: isMobile ? '12px' : '10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.6 : 1,
          fontSize: isMobile ? '14px' : '15px',
          fontWeight: 'bold'
        }}>
          {isLoading ? 'Loading...' : (isSignup ? 'Create Account' : 'Sign In')}
        </button>
      </form>

      <div style={{
        marginTop: isMobile ? '15px' : '20px',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: isMobile ? '13px' : '14px' }}>
          {isSignup ? 'Have an account?' : "Don't have an account?"}
          <button type="button" onClick={() => { setIsSignup(!isSignup); setError(''); }} style={{
            background: 'none',
            border: 'none',
            color: '#007bff',
            cursor: 'pointer',
            marginLeft: '5px',
            textDecoration: 'underline',
            fontSize: isMobile ? '13px' : '14px'
          }}>
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}

function Header({ user, onLogout, setPage, isMobile }) {
  return (
    <header style={{
      backgroundColor: '#f8f9fa',
      padding: isMobile ? '12px 10px' : '15px 20px',
      borderBottom: '1px solid #ddd',
      display: 'flex',
      justifyContent: isMobile ? 'space-around' : 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: isMobile ? '8px' : '10px'
    }}>
      <h1 style={{ margin: '0', fontSize: isMobile ? '18px' : '24px', width: isMobile ? '100%' : 'auto', textAlign: isMobile ? 'center' : 'left' }}>⚡ ZEPHYRIX</h1>
      <div style={{
        display: 'flex',
        gap: isMobile ? '6px' : '10px',
        alignItems: 'center',
        width: isMobile ? '100%' : 'auto',
        justifyContent: isMobile ? 'center' : 'flex-end'
      }}>
        <span style={{ fontSize: isMobile ? '11px' : '14px', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</span>
        <button onClick={() => setPage('settings')} style={{
          padding: isMobile ? '6px 8px' : '8px 12px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: isMobile ? '11px' : '13px',
          whiteSpace: 'nowrap'
        }}>{isMobile ? '⚙️' : 'Settings'}</button>
        <button onClick={onLogout} style={{
          padding: isMobile ? '6px 8px' : '8px 12px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: isMobile ? '11px' : '13px',
          whiteSpace: 'nowrap'
        }}>{isMobile ? '↪️' : 'Logout'}</button>
      </div>
    </header>
  );
}

function Navigation({ currentPage, setPage, isMobile }) {
  const navButtons = [
    { page: 'dashboard', label: 'Tasks', emoji: '📋' },
    { page: 'calendar', label: 'Calendar', emoji: '📅' },
    { page: 'reporting', label: 'Reporting', emoji: '📊' },
    { page: 'create-task', label: 'New Task', emoji: '➕' }
  ];

  return (
    <nav style={{
      backgroundColor: '#e9ecef',
      padding: isMobile ? '8px 5px' : '10px 20px',
      display: 'flex',
      gap: isMobile ? '4px' : '10px',
      borderBottom: '1px solid #ddd',
      flexWrap: 'wrap',
      justifyContent: isMobile ? 'space-around' : 'flex-start'
    }}>
      {navButtons.map(btn => (
        <button
          key={btn.page}
          onClick={() => setPage(btn.page)}
          style={{
            backgroundColor: currentPage === btn.page ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            padding: isMobile ? '6px 8px' : '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: isMobile ? '11px' : '13px',
            flex: isMobile ? '1 1 calc(25% - 4px)' : '0 1 auto',
            minWidth: isMobile ? '50px' : 'auto',
            whiteSpace: 'nowrap'
          }}
        >
          {isMobile ? btn.emoji : `${btn.emoji} ${btn.label}`}
        </button>
      ))}
    </nav>
  );
}

function Dashboard({ user, setPage, isMobile }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [executingTaskId, setExecutingTaskId] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [syncData, setSyncData] = useState(null);
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
        <div style={{
          display: 'grid',
          gap: isMobile ? '10px' : '15px',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))'
        }}>
          {tasks.map((task) => (
            <div key={task.id} style={{
              padding: isMobile ? '12px' : '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f8f9fa'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'start',
                flexWrap: isMobile ? 'wrap' : 'nowrap',
                gap: isMobile ? '8px' : '0'
              }}>
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
                <div style={{
                  display: 'flex',
                  gap: isMobile ? '6px' : '10px',
                  flexWrap: isMobile ? 'wrap' : 'nowrap'
                }}>
                  <button onClick={() => setEditingTask(task)} style={{
                    padding: isMobile ? '6px 8px' : '8px 12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: isMobile ? '11px' : '12px',
                    flex: isMobile ? '1 1 calc(33% - 4px)' : '0 1 auto'
                  }}>✏️ {isMobile ? '' : 'Edit'}</button>
                  <button onClick={() => handleDelete(task.id)} style={{
                    padding: isMobile ? '6px 8px' : '8px 12px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: isMobile ? '11px' : '12px',
                    flex: isMobile ? '1 1 calc(33% - 4px)' : '0 1 auto'
                  }}>🗑️ {isMobile ? '' : 'Delete'}</button>
                  <button onClick={() => handleRunTask(task.id)} disabled={executingTaskId === task.id} style={{
                    padding: isMobile ? '6px 8px' : '8px 12px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: executingTaskId === task.id ? 'not-allowed' : 'pointer',
                    fontSize: isMobile ? '11px' : '12px',
                    opacity: executingTaskId === task.id ? 0.6 : 1,
                    flex: isMobile ? '1 1 calc(34% - 4px)' : '0 1 auto'
                  }}>
                    {executingTaskId === task.id ? '⏳' : '▶️'} {isMobile ? '' : 'Run Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingTask && (
        <EditTaskModal task={editingTask} onClose={() => setEditingTask(null)} onSave={async (syncPayload) => {
          if (syncPayload && syncPayload.relatedTasks && syncPayload.relatedTasks.length > 0) {
            setSyncData(syncPayload);
          } else {
            setEditingTask(null);
            loadTasks(true);
          }
        }} />
      )}

      {syncData && (
        <TaskSyncModal
          syncData={syncData}
          onClose={() => { setSyncData(null); setEditingTask(null); loadTasks(true); }}
          onApply={async (approval) => {
            try {
              const { data: { session } } = await supabase.auth.getSession();
              await axios.post('/api/sync-apply',
                {
                  sourceTaskId: editingTask.id,
                  selectedTaskIds: approval.selectedTasks,
                  changes: syncData.changes,
                  answers: approval.answers
                },
                { headers: { Authorization: `Bearer ${session.access_token}` } }
              );
              alert('Changes applied to related tasks!');
              setSyncData(null);
              setEditingTask(null);
              loadTasks(true);
            } catch (error) {
              alert('Error applying changes: ' + error.message);
            }
          }}
        />
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
    // Only close if clicking directly on the backdrop (the fixed overlay itself)
    if (e.target.getAttribute('data-backdrop') === 'true') {
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
          executionId: result.id,
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
    <div data-backdrop="true" onClick={handleBackdropClick} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, cursor: 'pointer', pointerEvents: 'auto' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', cursor: 'default', pointerEvents: 'auto' }}>
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
  const [updateDescription, setUpdateDescription] = useState('');
  const [analysisData, setAnalysisData] = useState(null);

  const handleBackdropClick = (e) => {
    // Only close if clicking directly on the backdrop (the fixed overlay itself)
    if (e.target.getAttribute('data-backdrop') === 'true') {
      onClose();
    }
  };

  const handleAnalyzeChanges = async (e) => {
    e.preventDefault();
    if (!updateDescription.trim()) {
      alert('Please describe what changes you are making.');
      return;
    }
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const changes = {};
      Object.keys(formData).forEach(key => {
        if (JSON.stringify(task[key]) !== JSON.stringify(formData[key])) {
          changes[key] = { old: task[key], new: formData[key] };
        }
      });
      if (Object.keys(changes).length === 0) {
        alert('No changes detected.');
        setIsLoading(false);
        return;
      }
      const syncResponse = await axios.post('/api/sync-analysis', {
        taskId: task.id, taskName: task.name, changes, taskData: formData, updateDescription
      }, { headers: { Authorization: `Bearer ${session.access_token}` } });
      const analysisPayload = { changes, relatedTasks: syncResponse.data.relatedTasks || [], questions: syncResponse.data.questions || [], updateDescription };
      setAnalysisData(analysisPayload);
      onSave(analysisPayload);
    } catch (error) {
      alert('Analysis error: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      // Calculate what changed
      const changes = {};
      Object.keys(formData).forEach(key => {
        if (JSON.stringify(task[key]) !== JSON.stringify(formData[key])) {
          changes[key] = { old: task[key], new: formData[key] };
        }
      });

      // Save the task
      await axios.put('/api/tasks', formData, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      // If there are significant changes, check for related tasks to sync
      if (Object.keys(changes).length > 0 && (changes.prompt || changes.success_criteria || changes.scheduled_time)) {
        try {
          const syncResponse = await axios.post('/api/sync-analysis',
            {
              taskId: task.id,
              taskName: task.name,
              changes: changes,
              taskData: formData
            },
            { headers: { Authorization: `Bearer ${session.access_token}` } }
          );

          if (syncResponse.data.relatedTasks && syncResponse.data.relatedTasks.length > 0) {
            // Show sync modal instead of closing
            onSave(syncResponse.data); // Pass sync data to parent
            return;
          }
        } catch (syncError) {
          console.log('Sync analysis skipped:', syncError.message);
        }
      }

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
    <div data-backdrop="true" onClick={handleBackdropClick} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, cursor: 'pointer', pointerEvents: 'auto' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', cursor: 'default', pointerEvents: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', padding: '0', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        <h2 style={{ marginTop: '0' }}>Edit Task</h2>
        <form onSubmit={analysisData ? (e) => { e.preventDefault(); } : handleAnalyzeChanges}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Task Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
            <textarea value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box', minHeight: '80px' }} />
          </div>

          <div style={{ marginBottom: '15px', backgroundColor: '#fff3cd', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #ffc107' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>What changes are you making?</label>
            <textarea
              value={updateDescription}
              onChange={(e) => setUpdateDescription(e.target.value)}
              placeholder="E.g., 'Updated search criteria to focus on Series A companies. Changed timeframe from 30 to 60 days.'"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                boxSizing: 'border-box',
                minHeight: '70px',
                fontSize: '13px',
                fontFamily: 'Arial, sans-serif'
              }}
            /> 
            />
      /form>
            <p style={{ fontSize: '11px', color: '#666', margin: '6px 0 0 0' }}>Describe your changes - will be logged for audit trail and help sync to related tasks.</p>
           </div>
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
              {isLoading ? 'Analyzing...' : 'Analyze Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CreateTaskForm({ user, setPage, isMobile }) {
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

function CalendarView({ user, isMobile }) {
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
          padding: isMobile ? '8px' : '12px',
          border: '1px solid #ddd',
          backgroundColor: dayTasks.length > 0 ? '#e8f4f8' : 'white',
          minHeight: isMobile ? '100px' : '150px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          fontSize: isMobile ? '12px' : '14px'
        }}>
          <strong style={{
            fontSize: isMobile ? '13px' : '16px',
            marginBottom: isMobile ? '4px' : '8px'
          }}>{day}</strong>
          <div style={{ fontSize: '12px', flex: 1 }}>
            {dayTasks.map(task => (
              <div key={task.id} style={{ color: '#007bff', marginBottom: '4px', wordBreak: 'break-word', lineHeight: '1.3' }}>
                • {task.name}
              </div>
            ))}
            {dayTasks.length === 0 && <div style={{ color: '#ccc', fontSize: '11px' }}>-</div>}
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

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: isMobile ? '0px' : '1px',
        backgroundColor: '#ddd',
        padding: isMobile ? '0px' : '1px',
        overflowX: isMobile ? 'auto' : 'visible'
      }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} style={{
            padding: isMobile ? '8px 5px' : '10px',
            backgroundColor: '#f0f0f0',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: isMobile ? '12px' : '14px'
          }}>
            {isMobile ? day.substring(0, 1) : day}
          </div>
        ))}
        {renderCalendar()}
      </div>

      <p style={{ marginTop: '20px', color: '#666', fontSize: '13px' }}>
        💡 Shows active tasks scheduled for each day. Click a task to edit it.
      </p>
    </div>
  );
}

function Reporting({ user, isMobile }) {
  const [executionLogs, setExecutionLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExecutionLogs();
  }, []);

  const loadExecutionLogs = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Fetch execution logs (using tasks endpoint to get associated task names)
      const { data: logs, error } = await supabase
        .from('execution_logs')
        .select('id, task_id, status, output, approval_status, started_at, completed_at, execution_type')
        .eq('user_id', session.user.id)
        .order('started_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Fetch tasks to get task names
      const tasksResponse = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      const taskMap = {};
      tasksResponse.data.tasks.forEach(task => {
        taskMap[task.id] = task.name;
      });

      // Combine logs with task names
      const enrichedLogs = logs.map(log => ({
        ...log,
        taskName: taskMap[log.task_id] || 'Unknown Task'
      }));

      setExecutionLogs(enrichedLogs);
    } catch (error) {
      console.error('Failed to load execution logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div><h2>📊 Execution History</h2><p>Loading...</p></div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>📊 Execution History</h2>
        <button onClick={loadExecutionLogs} style={{ padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>🔄 Refresh</button>
      </div>

      {executionLogs.length === 0 ? (
        <p style={{ color: '#666' }}>No execution logs yet.</p>
      ) : (
        <div style={{
          overflowX: 'auto',
          width: '100%',
          maxWidth: '100%'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: isMobile ? '12px' : '14px',
            minWidth: isMobile ? '400px' : 'auto'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Task Name</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Type</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Approval</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Started</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Duration</th>
              </tr>
            </thead>
            <tbody>
              {executionLogs.map(log => {
                const startTime = new Date(log.started_at);
                const endTime = log.completed_at ? new Date(log.completed_at) : new Date();
                const durationMs = endTime - startTime;
                const durationSec = (durationMs / 1000).toFixed(1);

                return (
                  <tr key={log.id} style={{ borderBottom: '1px solid #eee', backgroundColor: log.status === 'success' ? '#f0f8f0' : '#f8f0f0' }}>
                    <td style={{ padding: '10px', color: '#007bff' }}>{log.taskName}</td>
                    <td style={{ padding: '10px', fontSize: '12px', color: '#666' }}>{log.execution_type || 'scheduled'}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: log.status === 'success' ? '#d4edda' : '#f8d7da',
                        color: log.status === 'success' ? '#155724' : '#721c24'
                      }}>
                        {log.status === 'success' ? '✅' : '❌'} {log.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px', fontSize: '12px' }}>
                      {log.approval_status === 'approved' ? '✅ Approved' : log.approval_status === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
                    </td>
                    <td style={{ padding: '10px', fontSize: '12px', color: '#666' }}>{startTime.toLocaleString()}</td>
                    <td style={{ padding: '10px', fontSize: '12px', color: '#666' }}>{durationSec}s</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p style={{ marginTop: '20px', color: '#666', fontSize: '13px' }}>
        💡 Shows the last 50 execution history entries. Click Refresh to see latest runs.
      </p>
    </div>
  );
}

function TaskSyncModal({ syncData, onClose, onApply }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState({});
  const [answers, setAnswers] = useState({});
  const [updateDescription, setUpdateDescription] = useState('');

  const handleTaskToggle = (taskId) => {
    setSelectedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleAnswer = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleApply = async () => {
    setIsLoading(true);
    try {
      await onApply({
        selectedTasks: Object.keys(selectedTasks).filter(id => selectedTasks[id]),
        answers: answers,
        updateDescription: updateDescription
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div data-backdrop="true" onClick={(e) => e.target.getAttribute('data-backdrop') === 'true' && onClose()} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, cursor: 'pointer' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', maxWidth: '700px', width: '90%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', cursor: 'default' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✕</button>
        <h2 style={{ marginTop: '0' }}>Apply Changes to Related Tasks</h2>

        <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #ffc107' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>What changes are you making?</label>
          <textarea
            value={updateDescription}
            onChange={(e) => setUpdateDescription(e.target.value)}
            placeholder="E.g., 'Updated search criteria to focus on Series A companies with $10M+ funding. Changed timeframe from last 30 days to last 60 days.'"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              boxSizing: 'border-box',
              minHeight: '80px',
              fontFamily: 'Arial, sans-serif',
              fontSize: '13px',
              resize: 'vertical'
            }}
          />
          <p style={{ fontSize: '12px', color: '#666', margin: '8px 0 0 0' }}>This will be logged in execution history for audit trail.</p>
        </div>

        <p style={{ color: '#666', marginBottom: '20px' }}>
          Found {syncData.relatedTasks?.length || 0} related task(s). Answer these platform-specific questions:
        </p>

        {syncData.questions?.map((question, idx) => (
          <div key={idx} style={{ backgroundColor: '#f0f8ff', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '8px', color: '#003d7a' }}>Q{idx + 1}: {question.text}</p>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>{question.explanation}</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {question.options?.map(option => (
                <button
                  key={option}
                  onClick={() => handleAnswer(idx, option)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: answers[idx] === option ? '#007bff' : '#e9ecef',
                    color: answers[idx] === option ? 'white' : '#333',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}

        <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>Select tasks to update:</h3>
        {syncData.relatedTasks?.map(relTask => (
          <div key={relTask.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
            <input
              type="checkbox"
              checked={selectedTasks[relTask.id] || false}
              onChange={() => handleTaskToggle(relTask.id)}
              style={{ marginRight: '10px', cursor: 'pointer' }}
            />
            <div>
              <strong>{relTask.name}</strong>
              <p style={{ fontSize: '12px', color: '#666', margin: '2px 0' }}>{relTask.platform || 'N/A'} • {relTask.scheduled_time}</p>
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={onClose} disabled={isLoading} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleApply} disabled={isLoading || Object.keys(selectedTasks).filter(id => selectedTasks[id]).length === 0} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isLoading ? 0.6 : 1 }}>
            {isLoading ? '⏳ Syncing...' : 'Apply to Selected'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Settings({ user, isMobile }) {
  return (
    <div style={{
      maxWidth: isMobile ? '100%' : '600px',
      padding: isMobile ? '10px' : '20px'
    }}>
      <h2 style={{ fontSize: isMobile ? '18px' : '24px' }}>⚙️ Settings</h2>
      <p>API Key management coming soon...</p>
    </div>
  );
}

function AdminPanel({ user }) {
  return <div><h2>⚙️ Admin Panel</h2><p>Admin controls coming soon...</p></div>;
}

export const getServerSideProps = async () => {
  return { props: {} };
};
