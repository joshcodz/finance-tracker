// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import FLogo from './assets/f-logo-white.jpg'; // white F logo on transparent background

// ---- ProtectedRoute ----
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// ---- HoverBoxLink (nav button with hover animation) ----
function HoverBoxLink({ to, base, hover, children }) {
  const [isHover, setIsHover] = useState(false);

  return (
    <Link
      to={to}
      style={isHover ? { ...base, ...hover } : base}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {children}
    </Link>
  );
}

// ---- Dropdown item for profile menu ----
function DropdownItem({ children, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '0.45rem 0.6rem',
        textAlign: 'left',
        borderRadius: '0.6rem',
        border: 'none',
        background: 'transparent',
        color: danger ? '#f97373' : '#e5e7eb',
        cursor: 'pointer',
        fontSize: '0.78rem',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(55,65,81,0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {children}
    </button>
  );
}

// ---- Layout with header ----
function AppLayout({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  const brandFont = '"Montserrat", system-ui, sans-serif';

  const navButtonBase = {
    padding: '0.45rem 1.1rem',
    borderRadius: '9999px',
    backgroundColor: 'rgba(15,23,42,0.9)',
    border: '1px solid #1f2937',
    color: '#abb6ceff',
    textDecoration: 'none',
    fontSize: '0.8rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    transition: 'all 150ms ease-out',
    boxShadow: '0 0 0 rgba(34,197,94,0)',
    cursor: 'pointer',
  };

  const hoverStyle = {
    backgroundColor: '#22c55e',
    color: '#020617',
    borderColor: '#22c55e',
    boxShadow: '0 0 18px rgba(34,197,94,0.8)',
    transform: 'translateY(-1px)',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f9fafb' }}>
      <header
        style={{
          borderBottom: '1px solid #1f2937',
          backgroundColor: 'rgba(15,23,42,0.9)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          style={{
            maxWidth: '72rem',
            margin: '0 auto',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          {/* Brand: green box with F + FINANCE TRACKER text */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                height: '2.4rem',
                width: '2.4rem',
                borderRadius: '0.8rem',
                backgroundColor: '#22c55e',
                boxShadow: '0 0 25px rgba(34,197,94,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <img
                src={FLogo}
                alt="F logo"
                style={{ height: '75%', width: '75%', objectFit: 'contain' }}
              />
            </div>
            <span
              style={{
                fontFamily: brandFont,
                fontSize: '1rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}
            >
              Finance Tracker
            </span>
          </div>

          {/* Nav buttons */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontFamily: brandFont,
            }}
          >
            <HoverBoxLink to="/dashboard" base={navButtonBase} hover={hoverStyle}>
              Dashboard
            </HoverBoxLink>
            <HoverBoxLink to="/transactions" base={navButtonBase} hover={hoverStyle}>
              Transactions
            </HoverBoxLink>
            <HoverBoxLink to="/budgets" base={navButtonBase} hover={hoverStyle}>
              Budgets
            </HoverBoxLink>
            <HoverBoxLink to="/goals" base={navButtonBase} hover={hoverStyle}>
              Goals
            </HoverBoxLink>
          </nav>

          {/* Profile icon + dropdown */}
          <div
            ref={menuRef}
            style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {user && (
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                {user.name}
              </span>
            )}

            <button
              onClick={() => setOpenMenu((v) => !v)}
              style={{
                height: '2rem',
                width: '2rem',
                borderRadius: '9999px',
                border: '1px solid #4b5563',
                background:
                  'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(56,189,248,0.2))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </span>
            </button>

            {openMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '2.6rem',
                  right: 0,
                  minWidth: '11rem',
                  borderRadius: '0.75rem',
                  backgroundColor: '#020617',
                  border: '1px solid #1f2937',
                  boxShadow: '0 18px 40px rgba(0,0,0,0.7)',
                  padding: '0.35rem',
                  fontSize: '0.8rem',
                  zIndex: 50,
                }}
              >
                <DropdownItem onClick={() => { setOpenMenu(false); navigate('/profile'); }}>
                  Profile
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setOpenMenu(false);
                    alert('FAQ coming soon');
                  }}
                >
                  FAQ
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setOpenMenu(false);
                    alert("Accessing Yatin's private pics…");
                  }}
                >
                  Yatin&apos;s private pics
                </DropdownItem>
                <div
                  style={{
                    margin: '0.25rem 0',
                    height: '1px',
                    backgroundColor: '#1f2937',
                  }}
                />
                <DropdownItem
                  danger
                  onClick={() => {
                    setOpenMenu(false);
                    handleLogout();
                  }}
                >
                  Logout
                </DropdownItem>
              </div>
            )}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '72rem', margin: '0 auto', padding: '1.5rem 1rem' }}>
        {children}
      </main>
    </div>
  );
}

// ---- App root ----
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* protected pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Transactions />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/budgets"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Budgets />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Goals />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* default and fallback */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
