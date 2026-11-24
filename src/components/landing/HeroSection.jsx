import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  MessageCircle, 
  BookOpen, 
  Zap, 
  Star,
  ShoppingBag,
  TrendingUp,
  Smartphone,
  Eye
} from 'lucide-react';
import { use3DTilt } from '../../hooks/useMotion';

const ROTATING_NICHES = [
  { text: 'Ropa & Moda', color: '#0ea5e9' },
  { text: 'Celulares & Gadgets', color: '#0d9488' },
  { text: 'Joyería & Relojes', color: '#f59e0b' },
  { text: 'Perfumes Exclusivos', color: '#8b5cf6' },
  { text: 'Calzado & Sneakers', color: '#06b6d4' },
  { text: 'Belleza & Skincare', color: '#ec4899' },
];

export default function HeroSection() {
  const [currentNicheIndex, setCurrentNicheIndex] = useState(0);
  const [fadeState, setFadeState] = useState(true);
  const [tiltRef, tiltStyle] = use3DTilt(6);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState(false);
      setTimeout(() => {
        setCurrentNicheIndex((prev) => (prev + 1) % ROTATING_NICHES.length);
        setFadeState(true);
      }, 250);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const activeNiche = ROTATING_NICHES[currentNicheIndex];

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        paddingTop: '130px',
        paddingBottom: '80px',
        background: 'radial-gradient(ellipse 90% 60% at 50% -15%, rgba(45, 212, 191, 0.22) 0%, rgba(14, 165, 233, 0.12) 40%, rgba(250, 252, 253, 0) 80%), #fafcfd',
        overflow: 'hidden',
      }}
    >
      {/* Círculos decorativos de fondo con desenfoque suave (Glows menta y azul) */}
      <div
        style={{
          position: 'absolute',
          top: '80px',
          left: '10%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(94, 234, 212, 0.28) 0%, rgba(255, 255, 255, 0) 70%)',
          filter: 'blur(45px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '200px',
          right: '8%',
          width: '440px',
          height: '440px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(255, 255, 255, 0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Columna Izquierda: Copy persuasivo, SEO semántico y CTAs */}
        <div>
          {/* Badge de Vanguardia Tecnológica */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, rgba(240, 253, 250, 0.95) 0%, rgba(224, 242, 254, 0.95) 100%)',
              border: '1px solid rgba(45, 212, 191, 0.45)',
              boxShadow: '0 2px 10px rgba(20, 184, 166, 0.12)',
              marginBottom: '20px',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#10b981',
                color: '#ffffff',
              }}
            >
              <Zap size={11} strokeWidth={3} />
            </span>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#0d9488',
                letterSpacing: '0.01em',
              }}
            >
              El Ecosistema E-commerce #1 para Vender por WhatsApp en Colombia
            </span>
          </div>

          {/* H1 Principal con Palabra Dinámica Animada */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.3rem, 5vw, 3.8rem)',
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              color: '#0b1528',
              marginBottom: '22px',
            }}
          >
            Crea tu Tienda Online para{' '}
            <span
              style={{
                display: 'inline-block',
                color: activeNiche.color,
                transition: 'opacity 0.25s ease, transform 0.25s ease',
                opacity: fadeState ? 1 : 0,
                transform: fadeState ? 'translateY(0)' : 'translateY(8px)',
                borderBottom: `3px solid ${activeNiche.color}`,
                paddingBottom: '2px',
              }}
            >
              {activeNiche.text}
            </span>{' '}
            y Vende Más en WhatsApp
          </h1>

          {/* Párrafo descriptivo con SEO y propuesta de valor */}
          <p
            style={{
              fontSize: '1.12rem',
              lineHeight: 1.65,
              color: '#475569',
              marginBottom: '32px',
              maxWidth: '560px',
            }}
          >
            <strong>Deja de perder ventas en chats desordenados.</strong> Zeply te da una tienda web moderna, 
            un <strong style={{ color: '#0d9488' }}>Catálogo Revista Digital interactivo</strong> y un carrito inteligente 
            que envía la orden de compra lista a tu WhatsApp con total y dirección.
          </p>

          {/* Grupo de Botones de Llamado a la Acción */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              alignItems: 'center',
              marginBottom: '36px',
            }}
          >
            <Link
              to="/registro"
              className="shimmer-button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#ffffff',
                padding: '16px 32px',
                borderRadius: '9999px',
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(14, 165, 233, 0.35)',
              }}
            >
              <Sparkles size={18} />
              <span>Crear mi Tienda Gratis (14 Días)</span>
              <ArrowRight size={18} />
            </Link>

            <a
              href="#tiendas"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#0f172a',
                padding: '15px 24px',
                borderRadius: '9999px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0284c7';
                e.currentTarget.style.color = '#0284c7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.color = '#0f172a';
              }}
            >
              <Eye size={17} />
              <span>Ver Tienda Demo</span>
            </a>
          </div>

          {/* Sellos de Confianza y Garantía */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '20px',
              alignItems: 'center',
              fontSize: '0.85rem',
              color: '#64748b',
              fontWeight: 600,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>Sin tarjeta de crédito</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>0% comisiones por venta</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>Lista en 5 minutos</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Mockup Interactivo Flotante 3D de la Tienda Zeply */}
        <div
          ref={tiltRef}
          style={{
            ...tiltStyle,
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Teléfono Mockup de Tienda Real */}
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              backgroundColor: '#0b1528',
              borderRadius: '42px',
              padding: '12px',
              boxShadow: '0 25px 60px -15px rgba(2, 132, 199, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              position: 'relative',
            }}
          >
            {/* Notch superior del smartphone */}
            <div
              style={{
                width: '120px',
                height: '18px',
                backgroundColor: '#050b14',
                borderRadius: '0 0 14px 14px',
                margin: '0 auto 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1e293b' }} />
              <div style={{ width: '40px', height: '4px', borderRadius: '2px', backgroundColor: '#1e293b' }} />
            </div>

            {/* Pantalla interna de la Tienda Online Zeply */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '32px',
                overflow: 'hidden',
                boxShadow: 'inset 0 0 8px rgba(0,0,0,0.05)',
              }}
            >
              {/* Header de la tienda de ejemplo */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #14b8a6 100%)',
                  padding: '14px 16px',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.85, fontWeight: 700 }}>
                    Tienda Oficial Zeply
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                    Aura & Co. Jewelry
                  </div>
                </div>
                <span
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.22)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '4px 8px',
                    borderRadius: '999px',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  🟢 Abierto
                </span>
              </div>

              {/* Banner de Revista Digital */}
              <div
                style={{
                  padding: '8px 14px',
                  backgroundColor: '#f0fdfa',
                  borderBottom: '1px solid #ccfbf1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpen size={14} color="#0d9488" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0d9488' }}>
                    Revista Digital Verano 2026
                  </span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 700 }}>Ver PDF →</span>
              </div>

              {/* Showcase de Productos */}
              <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '10px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&auto=format&fit=crop&q=80"
                    alt="Anillo Solitario"
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '12px',
                      objectFit: 'cover',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        color: '#d97706',
                        backgroundColor: '#fef3c7',
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      TOP VENTAS
                    </span>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                      Anillo Solitario Oro 18K
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0284c7' }}>
                      $289.000 <span style={{ fontSize: '0.7rem', color: '#94a3b8', textDecoration: 'line-through' }}>$350.000</span>
                    </div>
                  </div>
                </div>

                {/* Botón de Checkout Automático a WhatsApp */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    padding: '12px',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                    cursor: 'pointer',
                  }}
                >
                  <MessageCircle size={18} />
                  <span>Pedir por WhatsApp (1 Clic)</span>
                </div>
              </div>

              {/* Footer de tienda en el mockup */}
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#f1f5f9',
                  textAlign: 'center',
                  fontSize: '0.68rem',
                  color: '#64748b',
                  fontWeight: 600,
                }}
              >
                ⚡ Impulsado por Zeply • 0% Comisiones
              </div>
            </div>
          </div>

          {/* Tarjeta Flotante Izquierda: Mensaje en vivo de WhatsApp */}
          <div
            className="animate-float"
            style={{
              position: 'absolute',
              top: '15%',
              left: '-25px',
              backgroundColor: '#ffffff',
              borderRadius: '18px',
              padding: '12px 16px',
              boxShadow: '0 14px 30px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(226, 232, 240, 0.8)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              zIndex: 20,
              maxWidth: '240px',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16a34a',
                flexShrink: 0,
              }}
            >
              <MessageCircle size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 800 }}>
                ¡Nuevo Pedido Recibido!
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                $289.000 COP • Bogotá
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                Mensaje armado listo para despachar
              </div>
            </div>
          </div>

          {/* Tarjeta Flotante Derecha: Métricas de Crecimiento */}
          <div
            className="animate-float-reverse"
            style={{
              position: 'absolute',
              bottom: '12%',
              right: '-25px',
              backgroundColor: '#ffffff',
              borderRadius: '18px',
              padding: '14px 18px',
              boxShadow: '0 14px 30px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(226, 232, 240, 0.8)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              zIndex: 20,
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
                flexShrink: 0,
              }}
            >
              <TrendingUp size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0b1528', lineHeight: 1 }}>
                +380%
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
                Aumento en Conversión de Chats
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
