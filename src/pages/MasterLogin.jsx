import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Credenciales Maestras Blindadas para Real Admin
const MASTER_ADMIN_EMAIL = 'nexodigitaldev@gmail.com';
const MASTER_ADMIN_PASS = 'tuiT(346XXA#HYX@';

export default function MasterLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const inputEmail = email.trim().toLowerCase();
    const inputPass = password.trim();

    // 1. Blindaje estricto: Validación de credenciales únicas maestras
    if (inputEmail !== MASTER_ADMIN_EMAIL.toLowerCase() || inputPass !== MASTER_ADMIN_PASS) {
      setErrorMessage('Acceso denegado. Credenciales de Real Admin no autorizadas.');
      setLoading(false);
      return;
    }

    try {
      // 2. Autenticación contra Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: MASTER_ADMIN_EMAIL,
        password: MASTER_ADMIN_PASS,
      });

      if (error) {
        console.warn('Supabase session fallback:', error.message);
      }

      // 3. Establecer sesión autorizada de Real Admin
      localStorage.setItem('zeply_master_admin_session', JSON.stringify({
        email: MASTER_ADMIN_EMAIL,
        role: 'REAL_ADMIN',
        loginAt: new Date().toISOString(),
      }));

      navigate('/rey-admin/dashboard');
    } catch (err) {
      // Si la red falla pero las credenciales son las correctas maestras, se autoriza
      localStorage.setItem('zeply_master_admin_session', JSON.stringify({
        email: MASTER_ADMIN_EMAIL,
        role: 'REAL_ADMIN',
        loginAt: new Date().toISOString(),
      }));
      navigate('/rey-admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Brand Header */}
        <div style={styles.header}>
          <div style={styles.brandTitle}>Zeply</div>
          <h1 style={styles.title}>Master Admin</h1>
          <p style={styles.subtitle}>Panel Exclusivo de Control Central • Otto Donado</p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={styles.errorAlert}>
            <span>⚠️ {errorMessage}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Correo Electrónico Autorizado</label>
            <input
              type="email"
              placeholder="admin@dominio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.labelRow}>
              <label style={styles.label}>Contraseña</label>
            </div>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.passwordInput}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.toggleBtn}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Validando Seguridad...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={styles.footerText}>
          Acceso Cifrado • Zeply Platform © 2026
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    backgroundColor: '#f0f9ff',
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '40px 32px',
    boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.1), 0 0 0 1px #e2e8f0',
  },
  header: {
    textAlign: 'center',
    marginBottom: '26px',
  },
  brandTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0284c7',
    letterSpacing: '-0.5px',
    marginBottom: '4px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#64748b',
  },
  errorAlert: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '18px',
    textAlign: 'center',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    outline: 'none',
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    boxSizing: 'border-box',
  },
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  passwordInput: {
    width: '100%',
    padding: '12px 75px 12px 14px',
    fontSize: '14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    outline: 'none',
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    boxSizing: 'border-box',
  },
  toggleBtn: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    fontSize: '12px',
    fontWeight: '600',
    color: '#0284c7',
    cursor: 'pointer',
  },
  submitBtn: {
    marginTop: '6px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#ffffff',
    backgroundColor: '#0284c7',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
  },
  footerText: {
    marginTop: '26px',
    textAlign: 'center',
    fontSize: '11px',
    color: '#94a3b8',
    letterSpacing: '0.3px',
  },
};
