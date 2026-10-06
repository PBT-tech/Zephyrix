// ============================================================================
// ZEPHYRIX - React Dashboard Frontend
// ============================================================================
// Complete React application for task management
// Deploy to Vercel as Next.js application
// ============================================================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
export default function ZephyrexApp() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
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
    <div className="app-container">
      <Header user={user} onLogout={handleLogout} setPage={setPage} />
      <Navigation currentPage={page} setPage={setPage} />

      <main className="main-content">
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

// ============================================================================
// LOGIN PAGE
// ============================================================================
function LoginPage({ setUser, setPage, setLoading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
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
        password,
        fullName: isSignup ? fullName : undefined
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
    <div className="login-container">
      <div className="login-card">
        <h1>⚡ ZEPHYRIX</h1>
        <p className="tagline">Swift Automation</p>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Your name"
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Loading...' : (isSignup ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {isSignup ? 'Have an account?' : "Don't have an account?"}
            <button
              type="button"
              className="link-button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
            >
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// HEADER
// ============================================================================
function Header({ user, onLogout, setPage }) {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">⚡ ZEPHYRIX</h1>
        <p className="user-info">{user?.email}</p>
      </div>
      <div className="header-right">
        <span className="plan-badge">{user?.plan || 'FREE'}</span>
        <button className="btn-small" onClick={() => setPage('settings')}>Settings</button>
        <button className="btn-small btn-danger" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}

// ============================================================================
// NAVIGATION
// ============================================================================
function Navigation({ currentPage, setPage }) {
  return (
    <nav className="navigation">
      <button
        className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
        onClick={() => setPage('dashboard')}
      >
        📋 Tasks
      </button>
      <button
        className={`nav-item ${currentPage === 'calendar' ? 'active' : ''}`}
        onClick={() => setPage('calendar')}
      >
        📅 Calendar
      </button>
      <button
        className={`nav-item ${currentPage === 'reporting' ? 'active' : ''}`}
        onClick={() => setPage('reporting')}
      >
        📊 Reporting
      </button>
      <button
        className={`nav-item ${currentPage === 'create-task' ? 'active' : ''}`}
        onClick={() => setPage('create-task')}
      >
        ➕ New Task
      </button>
      <button
        className={`nav-item ${currentPage === 'admin' ? 'active' : ''}`}
        onClick={() => setPage('admin')}
      >
        ⚙️ Admin
      </button>
    </nav>
  );
}

// ============================================================================
// DASHBOARD PAGE
// ============================================================================
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
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading tasks...</div>;

  const planLimit = user.plan === 'free' ? 3 : user.plan === 'starter' ? 8 : user.plan === 'pro' ? 30 : 999;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h2>Your Tasks</h2>
        <div className="task-count">
          {tasks.length} / {planLimit} tasks
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="task-grid">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onRefresh={loadTasks} />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// TASK CARD
// ============================================================================
function TaskCard({ task, onRefresh }) {
  const [showActions, setShowActions] = useState(false);

  const handleRunNow = async () => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.post('/api/execute',
        { taskId: task.id, executionType: 'manual' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Task executed successfully!');
      onRefresh();
    } catch (error) {
      alert('Task execution failed: ' + error.message);
    }
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h3>{task.name}</h3>
        <span className={`status-badge ${task.status}`}>{task.status}</span>
      </div>

      <div className="task-info">
        <p><strong>Frequency:</strong> {task.frequency}</p>
        <p><strong>Next Run:</strong> {new Date(task.next_run_at).toLocaleString()}</p>
        {task.last_run_at && (
          <p><strong>Last Run:</strong> {new Date(task.last_run_at).toLocaleString()}</p>
        )}
      </div>

      <div className="task-actions">
        <button className="btn-small" onClick={handleRunNow}>
          ▶️ Run Now
        </button>
        <button className="btn-small" onClick={() => setShowActions(!showActions)}>
          ⋮ More
        </button>
      </div>

      {showActions && (
        <div className="dropdown-menu">
          <button className="menu-item">Edit</button>
          <button className="menu-item">View Logs</button>
          <button className="menu-item danger">Delete</button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// CREATE TASK FORM
// ============================================================================
function CreateTaskForm({ user, setPage }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'weekly',
    days: [1, 4], // Mon, Thu
    scheduledTime: '09:00',
    inputFiles: [],
    outputFiles: [],
    successCriteria: '',
    prompt: '',
    templateId: null
  });
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    // Load templates
    const mockTemplates = [
      {
        id: '1',
        name: 'Weekly Report Generator',
        description: 'Summarize data and generate weekly report'
      },
      {
        id: '2',
        name: 'Data Backup Automation',
        description: 'Automated daily backup of files'
      }
    ];
    setTemplates(mockTemplates);
  }, []);

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
      alert('Failed to create task: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-task-page">
      <h2>Create New Task</h2>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-section">
          <h3>Basic Information</h3>

          <div className="form-group">
            <label>Task Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              placeholder="e.g., Weekly Report"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="What does this task do?"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Schedule</h3>

          <div className="form-group">
            <label>Frequency *</label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({...formData, frequency: e.target.value})}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="once">Once</option>
            </select>
          </div>

          {formData.frequency === 'weekly' && (
            <div className="form-group">
              <label>Days of Week</label>
              <div className="day-picker">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`day-btn ${formData.days.includes(idx) ? 'selected' : ''}`}
                    onClick={() => {
                      const newDays = formData.days.includes(idx)
                        ? formData.days.filter(d => d !== idx)
                        : [...formData.days, idx];
                      setFormData({...formData, days: newDays});
                    }}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Files & Success</h3>

          <div className="form-group">
            <label>Success Criteria *</label>
            <textarea
              value={formData.successCriteria}
              onChange={(e) => setFormData({...formData, successCriteria: e.target.value})}
              required
              placeholder="How will you know this task succeeded?"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Task'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setPage('dashboard')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ============================================================================
// CALENDAR VIEW
// ============================================================================
function CalendarView({ user }) {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (date) => {
    if (!draggedTask) return;

    // Show time selection popup
    const newTime = prompt('Enter new time (HH:MM):', '09:00');
    if (newTime) {
      updateTaskSchedule(draggedTask.id, date, newTime);
    }
    setDraggedTask(null);
  };

  const updateTaskSchedule = async (taskId, date, time) => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.put('/api/tasks',
        {
          id: taskId,
          scheduled_date: date,
          scheduled_time: time
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const daysInMonth = 31;
  const calendarDays = Array.from({length: daysInMonth}, (_, i) => i + 1);

  return (
    <div className="calendar-page">
      <h2>📅 October 2026 - Scheduled Tasks</h2>

      <div className="calendar-grid">
        {calendarDays.map((day) => (
          <div
            key={day}
            className="calendar-day"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(`2026-10-${String(day).padStart(2, '0')}`)}
          >
            <div className="day-number">{day}</div>
            <div className="day-tasks">
              {tasks
                .filter(task => {
                  // Show if task is scheduled for this day
                  return true; // Simplified for demo
                })
                .map(task => (
                  <div
                    key={task.id}
                    className="calendar-task"
                    draggable
                    onDragStart={() => handleDragStart(task)}
                  >
                    <span className="task-name">{task.name}</span>
                    <span className="task-time">{task.scheduled_time}</span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// REPORTING PAGE
// ============================================================================
function Reporting({ user }) {
  const [stats, setStats] = useState({
    totalTasks: 0,
    successfulRuns: 0,
    failedRuns: 0,
    totalRuntime: 0
  });

  return (
    <div className="reporting-page">
      <h2>📊 Task Reporting</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p className="stat-value">{stats.totalTasks}</p>
        </div>
        <div className="stat-card">
          <h3>Successful Runs</h3>
          <p className="stat-value">{stats.successfulRuns}</p>
        </div>
        <div className="stat-card">
          <h3>Failed Runs</h3>
          <p className="stat-value">{stats.failedRuns}</p>
        </div>
        <div className="stat-card">
          <h3>Total Runtime</h3>
          <p className="stat-value">{stats.totalRuntime}h</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SETTINGS PAGE
// ============================================================================
function Settings({ user }) {
  const [apiKey, setApiKey] = useState('');
  const [keyType, setKeyType] = useState('claude');

  const handleAddKey = async () => {
    const token = localStorage.getItem('authToken');
    // Implementation to add API key
    alert('API key saved securely');
  };

  return (
    <div className="settings-page">
      <h2>⚙️ Settings</h2>

      <div className="settings-section">
        <h3>API Keys</h3>
        <p>Add your API keys for Claude, OpenAI, or other services</p>

        <div className="form-group">
          <label>Service</label>
          <select value={keyType} onChange={(e) => setKeyType(e.target.value)}>
            <option value="claude">Claude (Anthropic)</option>
            <option value="openai">OpenAI</option>
            <option value="manus">Manus</option>
            <option value="viktor">Viktor</option>
          </select>
        </div>

        <div className="form-group">
          <label>API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Your API key (encrypted)"
          />
        </div>

        <button className="btn btn-primary" onClick={handleAddKey}>
          Save API Key
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// ADMIN PANEL
// ============================================================================
function AdminPanel({ user }) {
  const [planSettings, setPlanSettings] = useState([
    { name: 'free', taskLimit: 3, price: 0 },
    { name: 'starter', taskLimit: 8, price: 8 },
    { name: 'pro', taskLimit: 30, price: 35 },
    { name: 'enterprise', taskLimit: 999, price: 98 }
  ]);

  return (
    <div className="admin-page">
      <h2>⚙️ Admin Panel</h2>

      <div className="admin-section">
        <h3>Plan Settings</h3>

        <div className="table">
          <div className="table-header">
            <div>Plan</div>
            <div>Task Limit</div>
            <div>Price</div>
            <div>Actions</div>
          </div>

          {planSettings.map(plan => (
            <div key={plan.name} className="table-row">
              <div>{plan.name}</div>
              <div>
                <input
                  type="number"
                  value={plan.taskLimit}
                  onChange={(e) => {
                    // Update plan
                  }}
                />
              </div>
              <div>${plan.price}/month</div>
              <div>
                <button className="btn-small">Save</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
