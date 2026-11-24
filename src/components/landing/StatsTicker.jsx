import React from 'react';
import { useInView, useAnimatedCounter } from '../../hooks/useMotion';
import { Store, TrendingUp, DollarSign, Percent, HeartHandshake } from 'lucide-react';

function StatItem({ icon: Icon, endValue, suffix = '', label, sublabel, decimals = 0, inView }) {
  const count = useAnimatedCounter(endValue, 2200, inView, decimals);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '24px 16px',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
        transition: 'all 0.3s ease',
      }}
      className="card-hover-lift"
    >
      <div
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)',
          border: '1px solid #ccfbf1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0d9488',
          marginBottom: '14px',
        }}
      >
        <Icon size={24} />
      </div>

      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.2rem',
          fontWeight: 800,
          color: '#0b1528',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          marginBottom: '6px',
        }}
      >
        {decimals > 0 ? count.toFixed(decimals) : count.toLocaleString()}
        <span style={{ color: '#0ea5e9' }}>{suffix}</span>
      </div>

      <div
        style={{
          fontSize: '0.92rem',
          fontWeight: 700,
          color: '#1e293b',
          marginBottom: '2px',
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: '0.78rem',
          color: '#64748b',
          fontWeight: 500,
        }}
      >
        {sublabel}
      </div>
    </div>
  );
}

export default function StatsTicker() {
  const [containerRef, inView] = useInView({ threshold: 0.2 });

  return (
    <section
      ref={containerRef}
      style={{
        padding: '60px 24px',
        backgroundColor: '#ffffff',
        position: 'relative',
        borderTop: '1px solid #f1f5f9',
        borderBottom: '1px solid #f1f5f9',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#0d9488',
              letterSpacing: '0.08em',
            }}
          >
            Métricas Comprobadas en Toda Latinoamérica
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.9rem',
              fontWeight: 800,
              color: '#0b1528',
              marginTop: '6px',
            }}
          >
            Respaldando el Crecimiento de Marcas y Comercios Reales
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '20px',
          }}
        >
          <StatItem
            icon={Store}
            endValue={1850}
            suffix="+"
            label="Tiendas Activas"
            sublabel="En más de 8 países"
            inView={inView}
          />
          <StatItem
            icon={TrendingUp}
            endValue={380}
            suffix="%"
            label="Aumento en Conversión"
            sublabel="Comparado a chat manual"
            inView={inView}
          />
          <StatItem
            icon={Percent}
            endValue={0}
            suffix="%"
            label="Comisión por Venta"
            sublabel="Tus ganancias son 100% tuyas"
            inView={inView}
          />
          <StatItem
            icon={DollarSign}
            endValue={14.2}
            decimals={1}
            suffix="M"
            label="USD Facturados"
            sublabel="Por clientes Zeply en 2026"
            inView={inView}
          />
          <StatItem
            icon={HeartHandshake}
            endValue={99.4}
            decimals={1}
            suffix="%"
            label="Clientes Satisfechos"
            sublabel="Soporte humano y ágil"
            inView={inView}
          />
        </div>
      </div>
    </section>
  );
}
