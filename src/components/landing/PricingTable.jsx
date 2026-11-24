import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

export default function PricingTable() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      id: 'BASIC',
      name: 'Plan Básico',
      tag: 'PARA NUEVOS NEGOCIOS',
      desc: 'Ideal si estás iniciando y quieres profesionalizar tus ventas por WhatsApp.',
      priceMonthly: 29900,
      priceAnnual: 23900,
      usdMonthly: 7.5,
      usdAnnual: 6.0,
      color: '#0284c7',
      isPopular: false,
      features: [
        'Hasta 50 productos en inventario',
        'Tienda online con subdominio Zeply',
        'Pedidos automáticos directos a WhatsApp',
        'Catálogo digital estándar',
        'Panel administrativo de productos y pedidos',
        '0% comisiones por venta',
        'Soporte estándar por WhatsApp',
      ],
    },
    {
      id: 'STARTER',
      name: 'Plan Starter',
      tag: 'MÁS ELEGIDO (RECOMENDADO)',
      desc: 'La solución completa para marcas que venden a diario y quieren destacar.',
      priceMonthly: 49900,
      priceAnnual: 39900,
      usdMonthly: 12.5,
      usdAnnual: 10.0,
      color: '#0d9488',
      isPopular: true,
      features: [
        'Hasta 250 productos con variaciones de tallas/colores',
        'Exclusiva Revista Digital Interactiva PDF',
        'Pedidos ilimitados a WhatsApp con checkout',
        'Panel administrativo completo en tiempo real',
        'Generador de Códigos QR para packaging',
        'Personalización de colores de marca y logo',
        '0% comisiones por venta',
        'Soporte prioritario 7 días a la semana',
      ],
    },
    {
      id: 'PRO',
      name: 'Plan Pro',
      tag: 'ALTO VOLUMEN',
      desc: 'Para comercios consolidados con catálogo amplio y gran volumen de despachos.',
      priceMonthly: 89900,
      priceAnnual: 71900,
      usdMonthly: 22.5,
      usdAnnual: 18.0,
      color: '#8b5cf6',
      isPopular: false,
      features: [
        'Hasta 1.000 productos y múltiples categorías',
        'Conexión de dominio propio (.com, .co)',
        'Revista Digital HD interactiva ilimitada',
        'Rotación de números de WhatsApp para vendedores',
        'Métricas avanzadas de visitas y conversión',
        '0% comisiones por venta',
        'Soporte VIP telefónico y por WhatsApp',
      ],
    },
    {
      id: 'ENTERPRISE',
      name: 'Plan Enterprise',
      tag: 'EMPRESAS Y MAYORISTAS',
      desc: 'Para distribuidores, franquicias y marcas con requerimientos a medida.',
      priceMonthly: 169000,
      priceAnnual: 135000,
      usdMonthly: 42.0,
      usdAnnual: 34.0,
      color: '#0b1528',
      isPopular: false,
      features: [
        'Productos y catálogos ilimitados',
        'Multi-sucursal y gestión de bodegas',
        'Capacitación y onboarding VIP 1 a 1',
        'Integración con ERP o software contable',
        'Infraestructura de alta disponibilidad',
        'Gerente de cuenta dedicado',
      ],
    },
  ];

  return (
    <section
      id="precios"
      style={{
        padding: '90px 24px',
        backgroundColor: '#fafcfd',
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
        }}
      >
        {/* Cabecera */}
        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
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
            <Sparkles size={15} />
            <span>PLANES TRANSPARENTES SIN COBROS OCULTOS</span>
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
            Elige el Plan Perfecto para tu Tienda
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#64748b',
              maxWidth: '640px',
              margin: '0 auto 28px',
            }}
          >
            Todos los planes incluyen 14 días de prueba gratuita sin ingresar tarjeta de crédito. Cancela en cualquier momento.
          </p>

          {/* Toggle Mensual / Anual */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#f1f5f9',
              padding: '5px',
              borderRadius: '9999px',
              border: '1px solid #e2e8f0',
              gap: '6px',
            }}
          >
            <button
              onClick={() => setIsAnnual(false)}
              style={{
                padding: '8px 20px',
                borderRadius: '9999px',
                fontSize: '0.88rem',
                fontWeight: 700,
                backgroundColor: !isAnnual ? '#ffffff' : 'transparent',
                color: !isAnnual ? '#0b1528' : '#64748b',
                boxShadow: !isAnnual ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              Pago Mensual
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              style={{
                padding: '8px 20px',
                borderRadius: '9999px',
                fontSize: '0.88rem',
                fontWeight: 700,
                backgroundColor: isAnnual ? '#0b1528' : 'transparent',
                color: isAnnual ? '#ffffff' : '#64748b',
                boxShadow: isAnnual ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>Pago Anual</span>
              <span
                style={{
                  fontSize: '0.68rem',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  padding: '2px 6px',
                  borderRadius: '999px',
                  fontWeight: 800,
                }}
              >
                20% AHORRO
              </span>
            </button>
          </div>
        </div>

        {/* Grid de 4 Planes */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            alignItems: 'stretch',
          }}
        >
          {plans.map((plan) => {
            const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
            const usd = isAnnual ? plan.usdAnnual : plan.usdMonthly;

            return (
              <div
                key={plan.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '26px',
                  padding: '32px 24px',
                  border: plan.isPopular ? '2px solid #14b8a6' : '1px solid #e2e8f0',
                  boxShadow: plan.isPopular
                    ? '0 20px 45px -10px rgba(20, 184, 166, 0.22)'
                    : '0 4px 16px rgba(15, 23, 42, 0.04)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  transform: plan.isPopular ? 'translateY(-6px)' : 'none',
                }}
              >
                {/* Badge Superior para Plan Popular */}
                {plan.isPopular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-14px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                      color: '#ffffff',
                      padding: '5px 16px',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      boxShadow: '0 4px 12px rgba(20, 184, 166, 0.35)',
                    }}
                  >
                    ⭐ MÁS ELEGIDO POR TIENDAS
                  </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: plan.color,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {plan.tag}
                  </span>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0b1528', marginTop: '4px' }}>
                    {plan.name}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px', lineHeight: 1.4 }}>
                    {plan.desc}
                  </p>
                </div>

                {/* Precio */}
                <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '2.2rem',
                        fontWeight: 800,
                        color: '#0b1528',
                      }}
                    >
                      ${price.toLocaleString('es-CO')}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
                      COP / mes
                    </span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600, marginTop: '2px' }}>
                    Aprox. ${usd.toFixed(1)} USD • Facturado {isAnnual ? 'anualmente' : 'mensual'}
                  </div>
                </div>

                {/* Lista de Características */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, marginBottom: '28px' }}>
                  {plan.features.map((feat, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: '#f0fdfa',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#0d9488',
                          flexShrink: 0,
                          marginTop: '2px',
                        }}
                      >
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.4, fontWeight: 500 }}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Botón CTA */}
                <Link
                  to={`/registro?plan=${plan.id}`}
                  style={{
                    width: '100%',
                    padding: '13px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: plan.isPopular ? '#0d9488' : '#f1f5f9',
                    color: plan.isPopular ? '#ffffff' : '#0f172a',
                    boxShadow: plan.isPopular ? '0 6px 18px rgba(13, 148, 136, 0.35)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!plan.isPopular) {
                      e.currentTarget.style.backgroundColor = '#e2e8f0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!plan.isPopular) {
                      e.currentTarget.style.backgroundColor = '#f1f5f9';
                    }
                  }}
                >
                  <span>Probar 14 Días Gratis</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
