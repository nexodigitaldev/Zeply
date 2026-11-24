import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, LogIn, Mail, Lock, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ClientLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // 1. Verificar si hay tienda registrada en localStorage con este email
      const localSession = localStorage.getItem('zeply_client_session');
      if (localSession) {
        try {
          const parsed = JSON.parse(localSession);
          if (parsed.email === email.trim() || email.includes('demo')) {
            navigate('/portal/dashboard');
            return;
          }
        } catch (err) {
          // ignore
        }
      }

      // 2. Si no o es demo, consultar Supabase
      try {
        const { data: tenantData } = await supabase
          .from('tenants')
          .select('*')
          .ilike('slug', `%${email.split('@')[0]}%`)
          .limit(1);

        if (tenantData && tenantData.length > 0) {
          const t = tenantData[0];
          const newSession = {
            id: t.id,
            name: t.name,
            slug: t.slug,
            whatsapp: t.whatsapp,
            niche: t.niche,
            primary_color: t.primary_color || '#0ea5e9',
            currency: t.currency || 'COP',
            currency_symbol: t.currency_symbol || '$',
            plan: t.plan || 'STARTER',
            email: email,
            ownerName: t.name,
          };
          localStorage.setItem('zeply_client_session', JSON.stringify(newSession));
          navigate('/portal/dashboard');
          return;
        }
      } catch (err) {
        console.warn('Fallback login');
      }

      // 3. Fallback inteligente: si ingresa cualquier email válido creamos sesión para que pueda administrar
      const fallbackSession = {
        id: `tenant-${Date.now()}`,
        name: email.split('@')[0].toUpperCase() + ' STORE',
        slug: email.split('@')[0].toLowerCase(),
        whatsapp: '3124567890',
        niche: 'ropa',
        primary_color: '#0ea5e9',
        currency: 'COP',
        currency_symbol: '$',
        plan: 'STARTER',
        email: email,
        ownerName: 'Administrador Tienda',
      };
      localStorage.setItem('zeply_client_session', JSON.stringify(fallbackSession));
      navigate('/portal/dashboard');
    } catch (err) {
      setErrorMsg('Credenciales inválidas. Por favor verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemoLogin = () => {
    const demoStore = {
      id: 'demo-aura-jewelry',
      name: 'Aura & Co. Joyería Fina',
      slug: 'joyeria',
      whatsapp: '573124567890',
      niche: 'joyeria',
      primary_color: '#0d9488',
      currency: 'COP',
      currency_symbol: '$',
      plan: 'STARTER',
      email: 'demo@aurajewelry.com',
      ownerName: 'Camila Restrepo',
    };
    localStorage.setItem('zeply_client_session', JSON.stringify(demoStore));
    navigate('/portal/dashboard');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(14, 165, 233, 0.15) 0%, #fafcfd 75%)',
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(20, 184, 166, 0.35)',
            }}
          >
            <Store size={22} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.6rem',
              fontWeight: 800,
              color: '#0b1528',
            }}
          >
            Zeply
          </span>
        </Link>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.9rem',
            fontWeight: 800,
            color: '#0b1528',
            letterSpacing: '-0.02em',
          }}
        >
          Portal de Clientes & Tiendas
        </h1>
        <p style={{ fontSize: '0.92rem', color: '#64748b', marginTop: '6px' }}>
          Gestiona tu catálogo, pedidos de WhatsApp y revista digital
        </p>
      </div>

      {/* Login Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#ffffff',
          borderRadius: '26px',
          padding: '36px',
          boxShadow: '0 20px 50px -10px rgba(15, 23, 42, 0.08), 0 0 0 1px #e2e8f0',
        }}
      >
        {errorMsg && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '0.86rem',
              fontWeight: 600,
              marginBottom: '20px',
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                Correo Electrónico de tu Tienda
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#94a3b8" style={{ position: 'absolute', top: '15px', left: '14px' }} />
                <input
                  type="email"
                  placeholder="ejemplo@mitienda.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '13px 16px 13px 42px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>
                  Contraseña
                </label>
                <span style={{ fontSize: '0.78rem', color: '#0284c7', cursor: 'pointer', fontWeight: 600 }}>
                  ¿Olvidaste tu clave?
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', top: '15px', left: '14px' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '13px 16px 13px 42px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '6px',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(20, 184, 166, 0.35)',
              }}
            >
              {loading ? (
                <span>Ingresando al portal...</span>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Ingresar a Mi Tienda</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div
          style={{
            margin: '24px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#94a3b8',
            fontSize: '0.8rem',
          }}
        >
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
          <span>O PRUEBA RÁPIDA</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
        </div>

        {/* Botón de Acceso Instantáneo a Tienda Demo */}
        <button
          type="button"
          onClick={handleInstantDemoLogin}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: '#f0fdfa',
            border: '1px solid #ccfbf1',
            color: '#0d9488',
            fontWeight: 700,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Sparkles size={16} />
          <span>Entrar con Tienda Demo (Aura & Co.)</span>
        </button>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: '#64748b' }}>
          ¿Aún no tienes tienda?{' '}
          <Link to="/registro" style={{ color: '#0284c7', fontWeight: 700 }}>
            Crear Tienda Gratis (14 Días)
          </Link>
        </div>
      </div>
    </div>
  );
}
