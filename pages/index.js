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

  if (isLoading) return <div>Loading tasks...</div>;

  return (
    <div>
      <h2>Your Tasks ({tasks.length})</h2>
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
                  <p style={{ color: '#666', margin: '5px 0', fontSize: '13px' }}>Frequency: {task.frequency}</p>
                  {task.prompt && <p style={{ color: '#666', margin: '5px 0', fontSize: '13px', fontStyle: 'italic' }}>Prompt: {task.prompt.substring(0, 100)}...</p>}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setEditingTask(task)} style={{ padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>✏️ Edit</button>
                  <button onClick={() => handleDelete(task.id)} style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>🗑️ Delete</button>
                  <button style={{ padding: '8px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>▶️ Run</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingTask && (
        <EditTaskModal task={editingTask} onClose={() => setEditingTask(null)} onSave={async () => { setEditingTask(null); loadTasks(); }} />
      )}
    </div>
  );
}

function EditTaskModal({ task, onClose, onSave }) {
  const [formData, setFormData] = useState(task);
  const [isLoading, setIsLoading] = useState(false);

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
      alert('Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2>Edit Task</h2>
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
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Success Criteria</label>
            <textarea value={formData.success_criteria || ''} onChange={(e) => setFormData({...formData, success_criteria: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box', minHeight: '80px' }} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Frequency</label>
            <select value={formData.frequency} onChange={(e) => setFormData({...formData, frequency: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
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
    output_files: ''
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
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Input Files/Paths</label>
          <input type="text" value={formData.input_files} onChange={(e) => setFormData({...formData, input_files: e.target.value})} placeholder="/path/to/input" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Output Files/Paths</label>
          <input type="text" value={formData.output_files} onChange={(e) => setFormData({...formData, output_files: e.target.value})} placeholder="/path/to/output" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Success Criteria</label>
          <textarea value={formData.success_criteria} onChange={(e) => setFormData({...formData, success_criteria: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box', minHeight: '80px' }} placeholder="How will you know this task succeeded?" />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Frequency</label>
          <select value={formData.frequency} onChange={(e) => setFormData({...formData, frequency: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
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
  return <div><h2>📅 Calendar View</h2><p>Coming soon...</p></div>;
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
