import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  Sparkles, 
  CheckCircle,
  HelpCircle,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RoiCalculator() {
  const [dailyChats, setDailyChats] = useState(30);
  const [averageTicket, setAverageTicket] = useState(120000); // COP

  // Cálculos de conversión:
  // Modo manual: ~2% de conversión (muchos se pierden por falta de respuesta o fotos perdidas)
  // Modo Zeply: ~7.2% de conversión (catálogo accesible 24/7 + revista interactiva + checkout instantáneo)
  const monthlyChats = dailyChats * 30;
  
  const manualOrders = Math.round(monthlyChats * 0.02);
  const manualRevenue = manualOrders * averageTicket;

  const zeplyOrders = Math.round(monthlyChats * 0.072);
  const zeplyRevenue = zeplyOrders * averageTicket;

  const extraRevenue = zeplyRevenue - manualRevenue;
  const zeplyPlanCost = 49900; // Plan Starter
  const roiMultiplier = Math.round((extraRevenue / zeplyPlanCost) * 10);

  return (
    <section
      id="calculadora"
      style={{
        padding: '90px 24px',
        background: 'linear-gradient(180deg, #fafcfd 0%, #f0fdfa 60%, #ffffff 100%)',
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              fontSize: '0.82rem',
              fontWeight: 800,
              marginBottom: '12px',
            }}
          >
            <Calculator size={15} />
            <span>SIMULADOR DE RENTABILIDAD & CRECIMIENTO</span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontWeight: 800,
              color: '#0b1528',
              letterSpacing: '-0.02em',
              marginBottom: '14px',
            }}
          >
            Calcula Cuánto Dinero Dejas de Ganar al Mes Sin una Tienda Online
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#64748b',
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            Ajusta los deslizadores según tu volumen actual de WhatsApp y mira la diferencia real en ventas con la automatización de Zeply.
          </p>
        </div>

        {/* Panel Interactivo de Cálculo */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            backgroundColor: '#ffffff',
            borderRadius: '28px',
            padding: '36px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 45px -10px rgba(14, 165, 233, 0.1)',
          }}
        >
          {/* Lado Izquierdo: Controles de Deslizador */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0b1528', marginBottom: '24px' }}>
              Tus Números Actuales
            </h3>

            {/* Slider 1: Chats Diarios */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#334155' }}>
                  Chats o consultas al día en WhatsApp:
                </span>
                <span
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: '#0284c7',
                    backgroundColor: '#e0f2fe',
                    padding: '2px 10px',
                    borderRadius: '8px',
                  }}
                >
                  {dailyChats} chats/día
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="200"
                step="5"
                value={dailyChats}
                onChange={(e) => setDailyChats(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#0ea5e9',
                  cursor: 'pointer',
                  height: '8px',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                <span>5 chats</span>
                <span>100 chats</span>
                <span>200 chats</span>
              </div>
            </div>

            {/* Slider 2: Ticket Promedio */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#334155' }}>
                  Precio promedio por venta (Ticket):
                </span>
                <span
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: '#0d9488',
                    backgroundColor: '#ccfbf1',
                    padding: '2px 10px',
                    borderRadius: '8px',
                  }}
                >
                  ${averageTicket.toLocaleString('es-CO')} COP
                </span>
              </div>
              <input
                type="range"
                min="30000"
                max="600000"
                step="10000"
                value={averageTicket}
                onChange={(e) => setAverageTicket(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#14b8a6',
                  cursor: 'pointer',
                  height: '8px',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                <span>$30.000</span>
                <span>$300.000</span>
                <span>$600.000</span>
              </div>
            </div>

            {/* Resumen comparativo de conversión */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                padding: '18px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '10px' }}>
                Comparativa de Conversión Estimada Mensual:
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.86rem', color: '#64748b' }}>Ventas sin tienda online (~2%):</span>
                <strong style={{ color: '#ef4444' }}>{manualOrders} pedidos/mes</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.86rem', color: '#0d9488', fontWeight: 700 }}>Con Zeply (~7.2%):</span>
                <strong style={{ color: '#10b981', fontSize: '1rem' }}>{zeplyOrders} pedidos/mes (+{zeplyOrders - manualOrders})</strong>
              </div>
            </div>
          </div>

          {/* Lado Derecho: Gráfica Animada de Facturación y ROI */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0b1528 0%, #13223f 100%)',
              borderRadius: '24px',
              padding: '32px',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#2dd4bf',
                }}
              >
                PROYECCIÓN DE CRECIMIENTO REAL
              </span>
              <h4 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px', marginBottom: '20px' }}>
                Ingresos Mensuales Estimados
              </h4>

              {/* Gráfica Visual de Barras Comparativas */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                {/* Barra 1: Sin Zeply */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                    <span style={{ color: '#94a3b8' }}>Sin Zeply (Chat manual):</span>
                    <span style={{ fontWeight: 700, color: '#f87171' }}>
                      ${manualRevenue.toLocaleString('es-CO')} COP
                    </span>
                  </div>
                  <div
                    style={{
                      height: '14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '999px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.max((manualRevenue / zeplyRevenue) * 100, 15)}%`,
                        backgroundColor: '#ef4444',
                        borderRadius: '999px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>

                {/* Barra 2: Con Zeply */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                    <span style={{ color: '#5eead4', fontWeight: 700 }}>Con Zeply (Tienda + Revista):</span>
                    <span style={{ fontWeight: 800, color: '#38bdf8' }}>
                      ${zeplyRevenue.toLocaleString('es-CO')} COP
                    </span>
                  </div>
                  <div
                    style={{
                      height: '18px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '999px',
                      overflow: 'hidden',
                      boxShadow: '0 0 12px rgba(45, 212, 191, 0.4)',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: '100%',
                        background: 'linear-gradient(90deg, #0ea5e9 0%, #14b8a6 100%)',
                        borderRadius: '999px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Tarjeta de Ganancia Extra Neta */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '18px',
                  border: '1px solid rgba(45, 212, 191, 0.25)',
                  marginBottom: '20px',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Ventas adicionales que recuperarías cada mes:
                </div>
                <div
                  style={{
                    fontSize: '1.85rem',
                    fontWeight: 800,
                    color: '#2dd4bf',
                    fontFamily: 'var(--font-display)',
                    margin: '4px 0',
                  }}
                >
                  +${extraRevenue.toLocaleString('es-CO')} COP
                </div>
                <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>
                  Inversión en Zeply: solo $49.900 COP/mes (Plan Starter)
                </div>
              </div>
            </div>

            <Link
              to="/registro"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.95rem',
                textDecoration: 'none',
                boxShadow: '0 8px 20px rgba(20, 184, 166, 0.4)',
              }}
            >
              <Sparkles size={16} />
              <span>Empezar a Facturar con Zeply (Prueba Gratis)</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
