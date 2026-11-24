import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollPosition } from '../../hooks/useMotion';
import { Store, Sparkles, ArrowRight, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { isScrolled } = useScrollPosition(30);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Beneficios', href: '#beneficios' },
    { label: 'Revista Digital', href: '#revista-digital' },
    { label: 'Planes', href: '#precios' },
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
        width: 'min(92%, 880px)',
        transition: 'all 0.3s ease',
      }}
      className={isScrolled ? 'glass-nav-scrolled' : 'glass-nav-initial'}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isScrolled ? '10px 24px' : '12px 28px',
          borderRadius: '9999px',
        }}
      >
        {/* Logo Zeply */}
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
              width: '36px',
              height: '36px',
              borderRadius: '11px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)',
              color: '#ffffff',
            }}
          >
            <Store size={20} strokeWidth={2.4} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.4rem',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #0f172a 0%, #0284c7 60%, #0d9488 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
            }}
          >
            Zeply
          </span>
        </Link>

        {/* Links de Navegación Desktop - Limpios y Espaciados */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '32px',
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
                transition: 'color 0.2s ease',
                letterSpacing: '-0.01em',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#0284c7')}
              onMouseLeave={(e) => (e.target.style.color = '#334155')}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Único Botón de Acción Principal: Crear Tienda Gratis */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            to="/registro"
            className="shimmer-button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: '#ffffff',
              padding: '10px 22px',
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
            padding: '16px 24px',
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
          <Link
            to="/registro"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              textAlign: 'center',
              padding: '12px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: '#ffffff',
              marginTop: '6px',
            }}
          >
            Crear Tienda Gratis
          </Link>
        </div>
      )}

      <style>{`
        @media (min-width: 820px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
        @media (max-width: 819px) {
          .desktop-nav {
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
