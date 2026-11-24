import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useScrollPosition } from '../../hooks/useMotion';
import { 
  Store, 
  Sparkles, 
  ArrowRight, 
  Menu, 
  X, 
  LogIn, 
  ShieldCheck,
  TrendingUp,
  Flame
} from 'lucide-react';

export default function Navbar() {
  const { isScrolled } = useScrollPosition(45);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Solución', href: '#solucion' },
    { label: 'Por qué Zeply', href: '#comparativa' },
    { label: 'Tiendas Demo', href: '#tiendas' },
    { label: 'Calculadora ROI', href: '#calculadora' },
    { label: 'Beneficios', href: '#beneficios' },
    { label: 'Precios', href: '#precios' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        width: 'min(94%, 1120px)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={isScrolled ? 'glass-nav-scrolled' : 'glass-nav-initial'}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isScrolled ? '10px 20px' : '12px 24px',
          borderRadius: '9999px',
        }}
      >
        {/* Logo con Icono Zeply */}
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
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(20, 184, 166, 0.35)',
              color: '#ffffff',
            }}
          >
            <Store size={22} strokeWidth={2.4} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.35rem',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #0f172a 0%, #0284c7 60%, #0d9488 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1,
              }}
            >
              Zeply
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                color: '#0d9488',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#10b981',
                  display: 'inline-block',
                }}
              />
              E-commerce SaaS
            </span>
          </div>
        </Link>

        {/* Links de Navegación Desktop */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '22px',
          }}
          className="desktop-nav"
        >
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                fontSize: '0.88rem',
                fontWeight: 600,
                color: '#334155',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#0284c7')}
              onMouseLeave={(e) => (e.target.style.color = '#334155')}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Acciones de la derecha: Login Portal Clientes + CTA Registro */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <Link
            to="/portal/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#0f172a',
              padding: '8px 14px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(241, 245, 249, 0.8)',
              border: '1px solid #e2e8f0',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e0f2fe';
              e.currentTarget.style.borderColor = '#bae6fd';
              e.currentTarget.style.color = '#0284c7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(241, 245, 249, 0.8)';
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.color = '#0f172a';
            }}
          >
            <LogIn size={15} />
            <span className="hidden-mobile">Mi Tienda</span>
          </Link>

          <Link
            to="/registro"
            className="shimmer-button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#ffffff',
              padding: '9px 18px',
              borderRadius: '9999px',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(14, 165, 233, 0.35)',
            }}
          >
            <Sparkles size={15} />
            <span>Crear Tienda Gratis</span>
            <ArrowRight size={14} />
          </Link>

          {/* Botón Móvil */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'transparent',
              padding: '6px',
              color: '#0f172a',
              borderRadius: '8px',
            }}
            className="mobile-toggle"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '0 0 24px 24px',
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
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
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
                fontSize: '0.9rem',
                color: '#0f172a',
              }}
            >
              Ingresar a mi Tienda
            </Link>
            <Link
              to="/registro"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '10px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                fontWeight: 700,
                fontSize: '0.9rem',
                color: '#ffffff',
              }}
            >
              Crear Tienda
            </Link>
          </div>
        </div>
      )}

      {/* Estilos responsivos inline para el navbar */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
        @media (max-width: 899px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
          .hidden-mobile {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
