import React, { useState } from 'react';

const loginBoxStyle: React.CSSProperties = {
  background: '#0d2233',
  borderRadius: 16,
  boxShadow: '0 4px 24px #0004',
  padding: '36px 32px 28px 32px',
  minWidth: 340,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  color: 'white',
  position: 'relative',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: 8,
  border: 'none',
  margin: '10px 0',
  fontSize: '1.1rem',
  fontFamily: 'inherit',
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: 8,
  border: 'none',
  background: 'linear-gradient(90deg, #00A8FF 0%, #06A900 100%)',
  color: 'white',
  fontWeight: 600,
  fontSize: '1.1rem',
  marginTop: 16,
  cursor: 'pointer',
  boxShadow: '0 2px 8px #00968844',
};

const errorStyle: React.CSSProperties = {
  color: '#ff5252',
  background: 'rgba(255,82,82,0.08)',
  borderRadius: 6,
  padding: '6px 12px',
  margin: '8px 0',
  fontSize: '0.98rem',
};

const forgotStyle: React.CSSProperties = {
  color: '#00e676',
  fontSize: '0.95rem',
  marginTop: 8,
  marginBottom: 8,
  cursor: 'pointer',
  textDecoration: 'underline',
  background: 'none',
  border: 'none',
};

const rememberStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginTop: 8,
  marginBottom: 8,
  width: '100%',
};

const closeStyle: React.CSSProperties = {
  position: 'absolute',
  top: 12,
  right: 16,
  color: '#fff',
  fontSize: 22,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
};

const iconStyle: React.CSSProperties = {
  fontSize: 48,
  marginBottom: 8,
};

export default function Login({ onLogin, onClose }: { onLogin: (email: string, isGuest?: boolean) => void, onClose?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  React.useEffect(() => {
    // Auto-fill if remembered
    const remembered = localStorage.getItem('rememberedEmail');
    if (remembered) setEmail(remembered);
  }, []);

  function validateEmail(email: string) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Dummy check: email = test@test.com, password = password123
      if (email === 'test@test.com' && password === 'password123') {
        if (remember) localStorage.setItem('rememberedEmail', email);
        else localStorage.removeItem('rememberedEmail');
        localStorage.setItem('isLoggedIn', 'true');
        onLogin(email);
      } else {
        setError('Invalid email or password.');
      }
    }, 900);
  }

  function handleForgot() {
    setForgotSent(true);
    setTimeout(() => setForgotSent(false), 2000);
  }

  function handleGuest() {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('isGuest', 'true');
    onLogin('guest', true);
  }

  return (
    <div style={{
      minHeight: '100vh',
      minWidth: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #FFE3B2 0%, #660020 100%)',
      backgroundAttachment: 'fixed',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Linksboven blok */}
      <div style={{
        position: 'absolute',
        top: '-150px',
        left: '-450px',
        width: '740px',
        height: '740px',
        background: 'linear-gradient(135deg, #E20248 0%, #F6A71B 100%)',
        borderRadius: '100px',
        zIndex: 1,
        transform: 'rotate(-125deg)',
      }} />
      {/* Rechtsonder blok */}
      <div style={{
        position: 'absolute',
        bottom: '-30px',
        right: '-450px',
        width: '740px',
        height: '740px',
        background: 'linear-gradient(135deg, #E20248 0%, #F6A71B 100%)',
        borderRadius: '100px',
        zIndex: 1,
        transform: 'rotate(-45deg)',
      }} />
      {/* Titel */}
      <div style={{
        zIndex: 2,
        color: 'white',
        fontWeight: 800,
        fontSize: '3.8rem',
        textAlign: 'center',
        letterSpacing: '0.02em',
        marginBottom: 32,
        marginTop: 32,
        textShadow: '0 2px 8px #0002',
        fontFamily: 'Poppins, Arial, sans-serif',
        lineHeight: 1.1,
        maxWidth: 600,
      }}>
        NO PREP<br />INTERACTIVE<br />QUIZZES / POLLS
      </div>
      <form style={{ ...loginBoxStyle, zIndex: 2 }} onSubmit={handleLogin}>
        {onClose && <button style={closeStyle} type="button" onClick={onClose} aria-label="Close">×</button>}
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <span style={iconStyle}>🔒</span>
          <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 6 }}>Teacher Log In</div>
        </div>
        <input
          style={inputStyle}
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoFocus
        />
        <input
          style={inputStyle}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <div style={rememberStyle}>
          <input type="checkbox" id="remember" checked={remember} onChange={e => setRemember(e.target.checked)} />
          <label htmlFor="remember" style={{ color: '#fff', fontSize: '0.98rem', cursor: 'pointer' }}>Remember me</label>
        </div>
        <button type="button" style={forgotStyle} onClick={handleForgot} tabIndex={-1}>
          Forgot password?
        </button>
        {forgotSent && <div style={{ color: '#00e676', fontSize: '0.95rem', marginBottom: 8 }}>Reset link sent!</div>}
        {error && <div style={errorStyle}>{error}</div>}
        <button type="submit" style={buttonStyle} disabled={loading}>{loading ? 'Logging in...' : 'Log in'}</button>
        <button
          type="button"
          style={{
            ...buttonStyle,
            width: '60%',
            margin: '18px auto 0 auto',
            fontSize: '0.98rem',
            padding: '7px 0',
            background: 'linear-gradient(90deg, #00b4ff 0%, #00c853 100%)',
            minWidth: 120,
            maxWidth: 180,
            display: 'block',
          }}
          onClick={handleGuest}
        >
          Proceed As Guest
        </button>
      </form>
    </div>
  );
} 