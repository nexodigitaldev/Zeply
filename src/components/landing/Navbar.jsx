import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollPosition } from '../../hooks/useMotion';
import { Store, User, ArrowRight, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { isScrolled } = useScrollPosition(30);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Beneficios', href: '#beneficios' },
    { label: 'Catálogo Revista', href: '#revista-digital' },
    { label: 'Precios', href: '#precios' },
    { label: 'Preguntas', href: '#faq' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: '18px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        width: 'min(94%, 960px)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Contenedor Flotante Estilo Tiendanube */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff',
          borderRadius: '9999px',
          padding: '8px 12px 8px 24px',
          boxShadow: isScrolled
            ? '0 12px 30px -6px rgba(15, 23, 42, 0.12), 0 0 0 1px #e2e8f0'
            : '0 8px 25px -5px rgba(15, 23, 42, 0.08), 0 0 0 1px #e2e8f0',
          transition: 'all 0.25s ease',
        }}
      >
        {/* Logo Zeply a la izquierda */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
            }}
          >
            <Store size={18} strokeWidth={2.4} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.35rem',
              letterSpacing: '-0.02em',
              color: '#0284c7',
            }}
          >
            zeply
          </span>
        </Link>

        {/* Links Centrales - Limpios y Espaciados */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '28px',
          }}
          className="desktop-nav"
        >
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                fontSize: '0.92rem',
                fontWeight: 600,
                color: '#334155',
                textDecoration: 'none',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#0284c7')}
              onMouseLeave={(e) => (e.target.style.color = '#334155')}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Acciones Derecha: Login + Botón Azul "Crear tienda online" */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link
            to="/portal/login"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#334155',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
            className="login-btn-desktop"
            onMouseEnter={(e) => (e.currentTarget.style.color = '#0284c7')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#334155')}
          >
            <User size={17} />
            <span>Login</span>
          </Link>

          <Link
            to="/registro"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#ffffff',
              backgroundColor: '#0284c7',
              padding: '11px 22px',
              borderRadius: '9999px',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0369a1';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#0284c7';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <span>Crear tienda online</span>
          </Link>

          {/* Botón Móvil */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'transparent',
              padding: '6px',
              color: '#0f172a',
            }}
            className="mobile-toggle"
            aria-label="Menú"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div
          style={{
            marginTop: '8px',
            padding: '16px 24px',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#1e293b',
                padding: '8px 0',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              {item.label}
            </a>
          ))}
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <Link
              to="/portal/login"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: '#f1f5f9',
                fontWeight: 700,
                fontSize: '0.88rem',
                color: '#0f172a',
              }}
            >
              Login
            </Link>
            <Link
              to="/registro"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                flex: 2,
                textAlign: 'center',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: '#0284c7',
                fontWeight: 700,
                fontSize: '0.88rem',
                color: '#ffffff',
              }}
            >
              Crear tienda online
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 820px) {
          .desktop-nav {
            display: flex !important;
          }
          .login-btn-desktop {
            display: inline-flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
        @media (max-width: 819px) {
          .desktop-nav {
            display: none !important;
          }
          .login-btn-desktop {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
