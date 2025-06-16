import React, { useState } from 'react';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

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
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
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

  async function handleLogin(e: React.FormEvent) {
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
    try {
      const response = await axios.post('/api/login', {
        email: email,
        password: password,
        remember_me: remember
      });

      if (response.data.user) {
        if (remember) {
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberMe');
        }
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        onLogin(response.data.user.email);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
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
    if (username.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/register', {
        email,
        name: username,
        password,
        username
      });

      if (response.data.message === "User registered successfully") {
        // Automatically log in after successful registration
        await handleLogin(e);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
      {/* Background elements */}
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

      {/* Title */}
      <div style={{
        zIndex: 2,
        color: 'white',
        fontWeight: 800,
        fontSize: '3.8rem',
        textAlign: 'center',
        letterSpacing: '0.02em',
        marginBottom: 32,
        marginTop: -90,
        textShadow: '0 2px 8px #0002',
        fontFamily: 'Poppins, Arial, sans-serif',
        lineHeight: 1.1,
        maxWidth: 600,
      }}>
        NO PREP<br />INTERACTIVE<br />QUIZZES / POLLS
      </div>

      <form style={{ ...loginBoxStyle, zIndex: 2 }} onSubmit={isRegistering ? handleRegister : handleLogin}>
        {onClose && <button style={closeStyle} type="button" onClick={onClose} aria-label="Close">×</button>}
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <span style={iconStyle}>🔒</span>
          <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 6 }}>
            {isRegistering ? 'Create Account' : 'Teacher Log In'}
          </div>
        </div>

        {isRegistering && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
        />

        {error && <div style={errorStyle}>{error}</div>}

        <div style={rememberStyle}>
          <input
            type="checkbox"
            id="remember"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <label htmlFor="remember">Remember me</label>
        </div>

        <button
          type="submit"
          style={{
            ...buttonStyle,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          disabled={loading}
        >
          {loading ? 'Please wait...' : (isRegistering ? 'Register' : 'Log In')}
        </button>

        <button
          type="button"
          style={forgotStyle}
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? 'Already have an account? Log in' : 'Need an account? Register'}
        </button>

        <button
          type="button"
          style={forgotStyle}
          onClick={handleForgot}
        >
          {forgotSent ? 'Reset link sent!' : 'Forgot password?'}
        </button>

        <button
          type="button"
          style={{
            ...buttonStyle,
            background: 'linear-gradient(90deg, rgb(0, 168, 255) 0%, rgb(6, 169, 0) 100%)',
            marginTop: 8
          }}
          onClick={handleGuest}
        >
          Continue as Guest
        </button>
      </form>
    </div>
  );
} 