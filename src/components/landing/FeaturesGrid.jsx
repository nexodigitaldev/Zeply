import React from 'react';
import { 
  BookOpen, 
  MessageCircle, 
  LayoutDashboard, 
  Search, 
  Palette, 
  QrCode, 
  Percent, 
  Smartphone,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';

export default function FeaturesGrid() {
  const features = [
    {
      icon: BookOpen,
      title: 'Revista Digital PDF Interactiva',
      desc: 'El formato visual más atractivo del mercado. Tus clientes hojean tu catálogo como una revista de moda o tecnología de alta calidad y compran con un toque.',
      badge: 'EXCLUSIVO ZEPLY',
      color: '#0d9488',
      bg: '#f0fdfa',
    },
    {
      icon: MessageCircle,
      title: 'Checkout Inteligente a WhatsApp',
      desc: 'Convierte carritos de compra en mensajes de WhatsApp automáticos, con items, tallas, dirección, método de pago y valor exacto para despachar de inmediato.',
      badge: 'ALTA CONVERSIÓN',
      color: '#10b981',
      bg: '#ecfdf5',
    },
    {
      icon: LayoutDashboard,
      title: 'Panel Administrativo Propio',
      desc: 'Un panel intuitivo para gestionar tus productos, fotos, precios de oferta, stock disponible y estados de cada pedido (Confirmado, Enviado, Entregado).',
      badge: 'FÁCIL DE USAR',
      color: '#0284c7',
      bg: '#f0f9ff',
    },
    {
      icon: Search,
      title: 'SEO Orgánico & Posicionamiento IA',
      desc: 'Optimizada semánticamente con Schema.org y metadatos para que tu tienda aparezca en los primeros lugares de Google y en recomendaciones de ChatGPT y Perplexity.',
      badge: 'VISIBILIDAD 24/7',
      color: '#8b5cf6',
      bg: '#f5f3ff',
    },
    {
      icon: Palette,
      title: 'Personalización de Marca y Colores',
      desc: 'Adapta los colores de tu tienda a tu identidad visual (azules menta, neutros elegantes), sube tu logo oficial y conecta Instagram, TikTok y WhatsApp.',
      badge: 'TU PROPIA MARCA',
      color: '#06b6d4',
      bg: '#ecfeff',
    },
    {
      icon: QrCode,
      title: 'Código QR para Packaging y Envíos',
      desc: 'Descarga tu código QR en alta resolución para estamparlo en tus bolsas, cajas de envío o tarjetas de agradecimiento para incentivar la recompra rápida.',
      badge: 'MARKETING VIRAL',
      color: '#f59e0b',
      bg: '#fffbeb',
    },
    {
      icon: Percent,
      title: '0% Comisiones por Venta',
      desc: 'No te quitamos porcentaje de tus ventas. Todo el dinero que cobres en efectivo, contraentrega, transferencia o Nequi es 100% tuyo.',
      badge: 'SIN COBROS EXTRA',
      color: '#16a34a',
      bg: '#f0fdf4',
    },
    {
      icon: Smartphone,
      title: 'Experiencia Móvil Ultra Rápida',
      desc: 'El 96% de las compras en Latinoamérica se hacen desde celulares. Tu tienda Zeply carga en menos de 0.8 segundos con diseño ultra responsive.',
      badge: 'VELOCIDAD LIGHTNING',
      color: '#0ea5e9',
      bg: '#f0f9ff',
    },
  ];

  return (
    <section
      id="beneficios"
      style={{
        padding: '90px 24px',
        backgroundColor: '#ffffff',
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
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
            <Sparkles size={15} />
            <span>TECNOLOGÍA PROFESIONAL PARA TU COMERCIO</span>
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
            Todo lo que Necesitas para Vender Como los Grandes
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#64748b',
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            Diseñado especialmente para marcas, boutiques, mayoristas y comercios que quieren multiplicar sus ventas sin complicarse con tecnología difícil.
          </p>
        </div>

        {/* Grid de 8 Beneficios */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '24px',
          }}
        >
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  padding: '28px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="card-hover-lift"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '16px',
                      backgroundColor: feat.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: feat.color,
                    }}
                  >
                    <Icon size={24} />
                  </div>

                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      color: feat.color,
                      backgroundColor: feat.bg,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {feat.badge}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#0b1528',
                    marginBottom: '10px',
                    lineHeight: 1.3,
                  }}
                >
                  {feat.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.88rem',
                    color: '#64748b',
                    lineHeight: 1.55,
                  }}
                >
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
