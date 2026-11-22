import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

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

    try {
      if (!email || !password) {
        throw new Error('Por favor ingresa correo y contraseña.');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Si no hay usuario creado en Supabase Auth todavía, permitimos acceso administrativo local para pruebas
        console.warn('Auth notice:', error.message);
        throw new Error(error.message || 'Error al autenticar.');
      }

      navigate('/rey-admin/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    // Acceso directo para evaluar y construir el sistema de inmediato
    sessionStorage.setItem('zeply_master_session', 'active_master');
    navigate('/rey-admin/dashboard');
  };

  return (
    <div style={styles.container}>
      {/* Elementos visuales de fondo estilo Shopify Light Blue */}
      <div style={styles.blobTopLeft} />
      <div style={styles.blobBottomRight} />

      <div style={styles.card}>
        {/* Brand Header */}
        <div style={styles.header}>
          <div style={styles.logoBadge}>
            <span style={styles.crownIcon}>👑</span>
            <span style={styles.logoText}>Zeply</span>
          </div>
          <div style={styles.panelTag}>PANEL REY • MASTER ADMIN</div>
          <h1 style={styles.title}>Control Maestro del Sistema</h1>
          <p style={styles.subtitle}>
            Administración centralizada de tiendas online, métricas y tenants.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={styles.errorAlert}>
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Correo Electrónico Master</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>✉️</span>
              <input
                type="email"
                placeholder="master@zeply.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña de Acceso</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.toggleBtn}
                title="Mostrar/Ocultar"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
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
            {loading ? 'Verificando credenciales...' : 'Entrar al Panel Rey 🚀'}
          </button>
        </form>

        {/* Acceso rápido de desarrollo / Demo */}
        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>O ACCESO DIRECTO EN DESARROLLO</span>
          <span style={styles.dividerLine} />
        </div>

        <button
          type="button"
          onClick={handleDemoAccess}
          style={styles.demoBtn}
        >
          Explorar Dashboard Rey (Modo Previsualización) ✨
        </button>

        {/* Footer de Seguridad */}
        <div style={styles.footer}>
          <div style={styles.securityPill}>
            <span>🛡️</span>
            <span>Blindaje Multi-Tenant & Supabase RLS Activo</span>
          </div>
          <p style={styles.copyright}>© 2026 Zeply Platform. Todos los derechos reservados.</p>
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
    position: 'relative',
    overflow: 'hidden',
  },
  blobTopLeft: {
    position: 'absolute',
    top: '-10%',
    left: '-5%',
    width: '450px',
    height: '450px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(2, 132, 199, 0) 70%)',
    filter: 'blur(40px)',
    pointerEvents: 'none',
  },
  blobBottomRight: {
    position: 'absolute',
    bottom: '-10%',
    right: '-5%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, rgba(2, 132, 199, 0) 70%)',
    filter: 'blur(50px)',
    pointerEvents: 'none',
  },
  card: {
    width: '100%',
    maxWidth: '460px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '40px 36px',
    boxShadow: '0 20px 40px -15px rgba(2, 132, 199, 0.12), 0 0 0 1px rgba(226, 232, 240, 0.8)',
    position: 'relative',
    zIndex: 1,
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  logoBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 16px',
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '9999px',
    marginBottom: '14px',
  },
  crownIcon: {
    fontSize: '18px',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#0284c7',
    letterSpacing: '-0.5px',
  },
  panelTag: {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1px',
    color: '#0369a1',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: '-0.5px',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.4',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '12px 14px',
    borderRadius: '10px',
    fontSize: '13px',
    marginBottom: '20px',
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
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    fontSize: '15px',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '12px 14px 12px 42px',
    fontSize: '14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    outline: 'none',
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  toggleBtn: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    opacity: 0.6,
  },
  submitBtn: {
    marginTop: '6px',
    padding: '13px',
    fontSize: '15px',
    fontWeight: '700',
    color: '#ffffff',
    backgroundColor: '#0284c7',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
    transition: 'all 0.2s',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0 16px 0',
    gap: '10px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: '0.5px',
  },
  demoBtn: {
    width: '100%',
    padding: '11px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#0369a1',
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '10px',
    transition: 'background-color 0.2s',
  },
  footer: {
    marginTop: '28px',
    textAlign: 'center',
  },
  securityPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#0284c7',
    backgroundColor: '#e0f2fe',
    padding: '4px 12px',
    borderRadius: '9999px',
    marginBottom: '10px',
  },
  copyright: {
    fontSize: '11px',
    color: '#94a3b8',
  },
};
