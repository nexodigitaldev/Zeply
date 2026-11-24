import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: '¿Cómo ayuda Zeply a no perder clientes en WhatsApp?',
      a: 'Cuando vendes solo por chat, responder precios y enviar fotos manualmente hace que el 65% de clientes se cansen de esperar y compren a la competencia. Con Zeply, el cliente navega tu tienda online o tu revista digital interactiva, selecciona tallas/colores y presiona "Pedir por WhatsApp". Te llega un mensaje pre-estructurado con el pedido exacto, dirección y total, listo para despachar en segundos.',
    },
    {
      q: '¿Zeply cobra comisiones por cada venta que realizo?',
      a: 'No. En Zeply cobramos 0% de comisión por venta. El 100% de los ingresos de tus productos es totalmente tuyo. Solo pagas una suscripción fija mensual sin cargos sorpresa ni tarifas ocultas.',
    },
    {
      q: '¿Qué es la Revista Digital PDF de Zeply?',
      a: 'Es una innovación exclusiva de Zeply. El sistema toma tus productos y genera automáticamente una revista digital interactiva en PDF de alta resolución. Tus clientes pueden hojearla en su móvil como un catálogo de moda o tecnología de lujo y hacer clic en cualquier producto para pedirlo directamente por WhatsApp.',
    },
    {
      q: '¿Necesito conocimientos de diseño o programación?',
      a: 'Para nada. Zeply fue diseñado para que cualquier persona cree su tienda en menos de 5 minutos. Solo ingresas el nombre de tu marca, tu número de WhatsApp, subes tus productos con precio y foto, y tu tienda queda inmediatamente en línea.',
    },
    {
      q: '¿Cómo recibo el dinero de mis pedidos?',
      a: 'Tú eliges cómo cobrar: pago contraentrega en efectivo, transferencias bancarias (Bancolombia, Nequi, Daviplata), o pasarelas de pago. Todo el dinero va directo a tu cuenta sin retenciones.',
    },
    {
      q: '¿Puedo usar mi propio dominio personalizado (.com o .co)?',
      a: 'Sí. Por defecto tu tienda tiene una dirección rápida oficial (ej: mitienda.zeply.co), pero a partir del Plan Pro puedes conectar fácilmente tu propio dominio .com o .co para máxima autoridad de marca.',
    },
    {
      q: '¿Cómo funciona la prueba gratuita de 14 días?',
      a: 'Puedes registrarte hoy mismo sin ingresar tarjeta de crédito. Tienes acceso completo a tu panel administrativo, puedes cargar productos, personalizar tu tienda y empezar a recibir pedidos por WhatsApp de inmediato.',
    },
  ];

  return (
    <section
      id="faq"
      style={{
        padding: '90px 24px',
        backgroundColor: '#ffffff',
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: '860px',
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
              backgroundColor: '#f0fdfa',
              border: '1px solid #ccfbf1',
              color: '#0d9488',
              fontSize: '0.82rem',
              fontWeight: 800,
              marginBottom: '12px',
            }}
          >
            <HelpCircle size={15} />
            <span>RESOLVEMOS TUS DUDAS</span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 2.7rem)',
              fontWeight: 800,
              color: '#0b1528',
              letterSpacing: '-0.02em',
              marginBottom: '14px',
            }}
          >
            Preguntas Frecuentes
          </h2>

          <p style={{ fontSize: '1.05rem', color: '#64748b' }}>
            Todo lo que necesitas saber antes de dar el salto al comercio electrónico inteligente con Zeply.
          </p>
        </div>

        {/* Acordeón de FAQs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  border: isOpen ? '1px solid #14b8a6' : '1px solid #e2e8f0',
                  boxShadow: isOpen ? '0 8px 24px rgba(20, 184, 166, 0.12)' : 'none',
                  overflow: 'hidden',
                  transition: 'all 0.25s ease',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: isOpen ? '#f0fdfa' : '#ffffff',
                    gap: '16px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: isOpen ? '#0d9488' : '#0b1528',
                    }}
                  >
                    {faq.q}
                  </span>
                  <div
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                      color: isOpen ? '#0d9488' : '#94a3b8',
                      flexShrink: 0,
                    }}
                  >
                    <ChevronDown size={20} />
                  </div>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '16px 24px 22px',
                      fontSize: '0.94rem',
                      color: '#475569',
                      lineHeight: 1.65,
                      backgroundColor: '#ffffff',
                      borderTop: '1px solid #f0fdfa',
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
