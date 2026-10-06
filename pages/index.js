import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ZephyrexApp() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setPage('dashboard');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setPage('login');
  };

  if (!user) {
    return <LoginPage setUser={setUser} setPage={setPage} setLoading={setLoading} />;
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <Header user={user} onLogout={handleLogout} setPage={setPage} />
      <Navigation currentPage={page} setPage={setPage} />
      <main style={{ padding: '20px' }}>
        {page === 'dashboard' && <Dashboard user={user} />}
        {page === 'create-task' && <CreateTaskForm user={user} setPage={setPage} />}
        {page === 'calendar' && <CalendarView user={user} />}
        {page === 'reporting' && <Reporting user={user} />}
        {page === 'settings' && <Settings user={user} />}
        {user.is_system_owner && page === 'admin' && <AdminPanel user={user} />}
      </main>
    </div>
  );
}

function LoginPage({ setUser, setPage, setLoading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth', {
        action: isSignup ? 'signup' : 'login',
        email,
        password
      });

      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      setPage('dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
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
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
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
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Loading...' : (isSignup ? 'Create Account' : 'Sign In')}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>
          {isSignup ? 'Have an account?' : "Don't have an account?"}
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
            }}
            style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', marginLeft: '5px', textDecoration: 'underline' }}
          >
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
      <div>
        <h1 style={{ margin: '0', fontSize: '24px' }}>⚡ ZEPHYRIX</h1>
      </div>
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

function Dashboard({ user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div>
      <h2>Your Tasks ({tasks.length})</h2>
      {tasks.length === 0 ? (
        <p>No tasks yet. Create one to get started!</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {tasks.map((task) => (
            <div key={task.id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
              <h3>{task.name}</h3>
              <p>Frequency: {task.frequency}</p>
              <button style={{ padding: '8px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>▶️ Run Now</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CreateTaskForm({ user, setPage }) {
  const [formData, setFormData] = useState({ name: '', frequency: 'weekly' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      await axios.post('/api/tasks', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Task created successfully!');
      setPage('dashboard');
    } catch (error) {
      alert('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px' }}>
      <h2>Create New Task</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Task Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Frequency</label>
          <select
            value={formData.frequency}
            onChange={(e) => setFormData({...formData, frequency: e.target.value})}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Creating...' : 'Create Task'}
        </button>
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
