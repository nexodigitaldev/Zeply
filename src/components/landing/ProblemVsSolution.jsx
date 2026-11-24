import React from 'react';
import { 
  XCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  MessageCircle, 
  Clock, 
  FileSpreadsheet, 
  HelpCircle,
  ShoppingBag,
  Zap
} from 'lucide-react';

export default function ProblemVsSolution() {
  const painPoints = [
    {
      title: 'Responder "¿Precio?" 50 veces al día',
      desc: 'Pierdes horas respondiendo mensajes repetitivos mientras otros clientes se van sin comprar.',
    },
    {
      title: 'Fotos sueltas perdidas en la galería del móvil',
      desc: 'Enviar 15 fotos por chat satura la memoria del cliente y no se aprecia la calidad de tus productos.',
    },
    {
      title: 'Clientes que abandonan por tardar en responder',
      desc: 'Si tardas más de 10 minutos en responder un chat nocturno, el cliente ya le compró a tu competencia.',
    },
    {
      title: 'Direcciones y tallas anotadas en papel o notas',
      desc: 'Errores constantes en despachos, tallas equivocadas y pedidos duplicados por desorden en el chat.',
    },
    {
      title: 'Ventas limitadas por tus horas despierto',
      desc: 'Tu negocio deja de vender en las noches y fines de semana porque dependes de estar pegado al teléfono.',
    },
  ];

  const zeplySolutions = [
    {
      title: 'Catálogo y Precios Públicos 24 Horas al Día',
      desc: 'Tus clientes exploran tu tienda a cualquier hora, ven fotos en alta resolución, disponibilidad y precios claros.',
    },
    {
      title: 'Exclusiva Revista Digital Interactiva PDF',
      desc: 'Un formato de lujo que tus clientes hojean en el móvil y compran con un solo toque sin salir de la revista.',
    },
    {
      title: 'El Cliente Arma su Pedido y te lo Envía Listo',
      desc: 'Te llega un mensaje de WhatsApp estructurado con nombre, ciudad, dirección, productos, tallas y valor exacto.',
    },
    {
      title: 'Panel Administrativo en Tiempo Real',
      desc: 'Controla el estado de cada pedido (Confirmado, Enviado, Entregado) y actualiza tu inventario en un clic.',
    },
    {
      title: 'Cero Comisiones por Venta',
      desc: 'No te quitamos porcentaje de tus ingresos. Cada peso que entra a tu cuenta es 100% de tu negocio.',
    },
  ];

  return (
    <section
      id="comparativa"
      style={{
        padding: '90px 24px',
        background: 'linear-gradient(180deg, #fafcfd 0%, #f0fdfa 50%, #fafcfd 100%)',
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
        }}
      >
        {/* Cabecera de Sección */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
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
            <AlertTriangle size={15} />
            <span>¿POR QUÉ CONTRATAR ZEPLY?</span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontWeight: 800,
              color: '#0b1528',
              letterSpacing: '-0.02em',
              marginBottom: '16px',
            }}
          >
            Vender Solo por Chats Sueltos te Hace Perder el 65% de tus Ventas
          </h2>

          <p
            style={{
              fontSize: '1.08rem',
              color: '#64748b',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Descubre la diferencia entre el agotador caos de vender con fotos sueltas vs la velocidad de una tienda online automatizada con Zeply.
          </p>
        </div>

        {/* Tarjetas Comparativas Lado a Lado */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
          }}
        >
          {/* Lado Izquierdo: El dolor sin Zeply */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '28px',
              padding: '36px',
              border: '1px solid #fee2e2',
              boxShadow: '0 10px 30px rgba(239, 68, 68, 0.06)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px',
                paddingBottom: '20px',
                borderBottom: '1px solid #fecaca',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  backgroundColor: '#fef2f2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ef4444',
                }}
              >
                <XCircle size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#991b1b' }}>
                  Sin Zeply (El Caos Manual)
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#b91c1c', fontWeight: 600 }}>
                  Agotamiento y fuga de clientes
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {painPoints.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '14px' }}>
                  <XCircle size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#1e293b', marginBottom: '2px' }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: '32px',
                padding: '16px',
                backgroundColor: '#fff1f2',
                borderRadius: '16px',
                border: '1px dashed #fca5a5',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <AlertTriangle size={24} color="#dc2626" />
              <div style={{ fontSize: '0.82rem', color: '#991b1b', fontWeight: 700 }}>
                Resultado: Pierdes hasta 6 de cada 10 compradores potenciales por demora y desorganización.
              </div>
            </div>
          </div>

          {/* Lado Derecho: La Solución con Zeply */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '28px',
              padding: '36px',
              border: '2px solid #5eead4',
              boxShadow: '0 20px 45px rgba(20, 184, 166, 0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Tag Destacado Superior */}
            <div
              style={{
                position: 'absolute',
                top: '0',
                right: '0',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                color: '#ffffff',
                padding: '6px 20px',
                borderRadius: '0 0 0 16px',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              RECOMENDADO
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px',
                paddingBottom: '20px',
                borderBottom: '1px solid #ccfbf1',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0d9488',
                }}
              >
                <CheckCircle2 size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f766e' }}>
                  Con Zeply (Ventas Automatizadas)
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#0d9488', fontWeight: 600 }}>
                  Orden, profesionalismo y 3.8x más ventas
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {zeplySolutions.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '14px' }}>
                  <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: '32px',
                padding: '16px',
                background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)',
                borderRadius: '16px',
                border: '1px solid #99f6e4',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <Sparkles size={24} color="#0d9488" />
              <div style={{ fontSize: '0.84rem', color: '#0f766e', fontWeight: 800 }}>
                Resultado: Tus clientes compran en 2 clics y tú recibes pedidos listos para facturar y enviar.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
