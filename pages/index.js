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
  const [executingTaskId,
