import React from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, MessageSquare } from 'lucide-react';

export default function CtaSection() {
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#0ea5e9', '#14b8a6', '#38bdf8', '#5eead4', '#ffffff'],
    });
  };

  return (
    <section
      style={{
        padding: '80px 24px',
        backgroundColor: '#fafcfd',
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: '1160px',
          margin: '0 auto',
          background: 'radial-gradient(ellipse at 80% 20%, rgba(20, 184, 166, 0.3) 0%, rgba(11, 21, 40, 0.98) 70%), #0b1528',
          borderRadius: '36px',
          padding: '64px 40px',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(2, 132, 199, 0.35)',
          textAlign: 'center',
        }}
      >
        {/* Glow de fondo */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '780px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(45, 212, 191, 0.4)',
              fontSize: '0.82rem',
              fontWeight: 800,
              color: '#5eead4',
              marginBottom: '20px',
            }}
          >
            <Sparkles size={14} />
            <span>LANZA TU TIENDA EN MENOS DE 5 MINUTOS</span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: '18px',
            }}
          >
            Deja de Perder Clientes y Empieza a Vender como un Profesional
          </h2>

          <p
            style={{
              fontSize: '1.15rem',
              color: '#cbd5e1',
              lineHeight: 1.6,
              marginBottom: '36px',
            }}
          >
            Únete a más de 1,850 marcas en Colombia y Latinoamérica que automatizaron sus pedidos de WhatsApp con Zeply. Prueba 14 días sin costo.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '32px',
            }}
          >
            <Link
              to="/registro"
              onClick={triggerConfetti}
              className="shimmer-button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#ffffff',
                padding: '18px 36px',
                borderRadius: '9999px',
                textDecoration: 'none',
                boxShadow: '0 8px 25px rgba(20, 184, 166, 0.5)',
              }}
            >
              <Sparkles size={18} />
              <span>Crear Mi Tienda Gratis Ahora</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/portal/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#ffffff',
                padding: '16px 26px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textDecoration: 'none',
              }}
            >
              <span>Acceder a Mi Tienda Existente</span>
            </Link>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              justifyContent: 'center',
              fontSize: '0.85rem',
              color: '#94a3b8',
              fontWeight: 600,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#2dd4bf" />
              <span>14 días de prueba completa</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#2dd4bf" />
              <span>Sin tarjeta de crédito requerida</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#2dd4bf" />
              <span>0% comisiones por venta</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
