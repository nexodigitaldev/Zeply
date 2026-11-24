import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  BookOpen, 
  Tag, 
  Flame, 
  ShoppingBag, 
  Eye, 
  Maximize2 
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Páginas de catálogo estilo Revista Ésika / Avon / Yanbal de Colombia
const SPREADS = [
  {
    spreadNumber: '02 - 03',
    theme: 'PERFUMERÍA FINA & ALTA GAMA',
    tagline: 'Campaña Oficial 2026 • Fragancias Más Vendidas',
    leftPage: {
      category: 'ALTA PERFUMERÍA MASCULINA',
      title: 'Magnat Imperial Black',
      subtitle: 'Eau de Parfum 100ml • Notas amaderadas, cuero y ámbar',
      badge: 'OFERTA ESTRELLA 45% DSCTO',
      image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80',
      price: '$129.900 COP',
      regularPrice: '$235.000 COP',
      code: 'CÓD. 8841-A',
      aromaTip: '✨ Aroma amaderado intenso de larga fijación 24h',
    },
    rightPage: {
      category: 'FRAGANCIAS FEMENINAS DE GALA',
      title: 'L’Éclat D’Or Rose Privée',
      subtitle: 'Parfum Concentré 75ml • Vainilla de Madagascar y jazmín',
      badge: 'TOP VENTAS COLOMBIA',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80',
      price: '$114.900 COP',
      regularPrice: '$190.000 COP',
      code: 'CÓD. 9210-B',
      aromaTip: '🌸 Dulce floral sofisticado para ocasiones especiales',
    },
  },
  {
    spreadNumber: '04 - 05',
    theme: 'JOYERÍA & RELOJERÍA FINA',
    tagline: 'Edición de Lujo • Oro de 18K y Plata Esterlina 925',
    leftPage: {
      category: 'COLECCIÓN BRILLO ETERNO',
      title: 'Set Anillo & Dije Solitario Zirconia',
      subtitle: 'Baño de Oro 18K con acabado pulido y grabado artesanal',
      badge: 'EDICIÓN LIMITADA',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80',
      price: '$149.000 COP',
      regularPrice: '$260.000 COP',
      code: 'CÓD. 4102-J',
      aromaTip: '💎 Con estuche de terciopelo de regalo',
    },
    rightPage: {
      category: 'RELOJERÍA DE PRECISIÓN',
      title: 'Cronógrafo Signature Chrono 2026',
      subtitle: 'Cuarzo japonés de alta precisión con correa en cuero genuino',
      badge: 'MEJOR PRECIO DEL AÑO',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
      price: '$189.900 COP',
      regularPrice: '$320.000 COP',
      code: 'CÓD. 7055-R',
      aromaTip: '⏱️ Resistente al agua 5 ATM con 2 años de garantía',
    },
  },
  {
    spreadNumber: '06 - 07',
    theme: 'MODA & LOOKBOOK DE TEMPORADA',
    tagline: 'Tendencias Urbanas • Drops Exclusivos Colombia',
    leftPage: {
      category: 'STREETWEAR PREMIUM',
      title: 'Chaqueta Bomber Aviator Cuero',
      subtitle: 'Forro térmico satinado con cremalleras metálicas reforzadas',
      badge: 'TENDENCIA 2026',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
      price: '$219.000 COP',
      regularPrice: '$310.000 COP',
      code: 'CÓD. 3319-M',
      aromaTip: '🧥 Tallas disponibles: S, M, L, XL',
    },
    rightPage: {
      category: 'ALTA COSTURA CASUAL',
      title: 'Vestido Midi Silk Floral Garden',
      subtitle: 'Confección en seda liviana con caída fluida y lazo en cintura',
      badge: 'MÁS PEDIDO EN CATÁLOGO',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80',
      price: '$139.900 COP',
      regularPrice: '$195.000 COP',
      code: 'CÓD. 5580-F',
      aromaTip: '👗 Edición especial de pasarela',
    },
  },
];

export default function MagazineFlipbook() {
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const currentSpread = SPREADS[currentSpreadIndex];

  const handlePrev = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSpreadIndex((prev) => (prev > 0 ? prev - 1 : SPREADS.length - 1));
      setIsFlipping(false);
    }, 200);
  };

  const handleNext = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSpreadIndex((prev) => (prev < SPREADS.length - 1 ? prev + 1 : 0));
      setIsFlipping(false);
    }, 200);
  };

  return (
    <section
      id="revista-digital"
      style={{
        padding: '90px 20px',
        backgroundColor: '#fafcfd',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        {/* Cabecera */}
        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              backgroundColor: '#fef2f2',
              color: '#e11d48',
              fontSize: '0.82rem',
              fontWeight: 800,
              marginBottom: '12px',
            }}
          >
            <Sparkles size={15} />
            <span>EXCLUSIVO ZEPLY: ESTILO CATÁLOGO AVON / ÉSIKA</span>
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
            Catálogo Revista Digital con Hojas que se Pasan
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#64748b',
              maxWidth: '660px',
              margin: '0 auto',
            }}
          >
            Tus clientes hojean tu tienda exactamente como una revista física de perfumes y moda. Haz clic en las flechas laterales para pasar las páginas:
          </p>
        </div>

        {/* Controles Superiores: Navegador de Páginas */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '920px',
            margin: '0 auto 16px',
            padding: '0 10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#e11d48',
                backgroundColor: '#ffe4e6',
                padding: '4px 10px',
                borderRadius: '6px',
                letterSpacing: '0.04em',
              }}
            >
              PÁGINAS {currentSpread.spreadNumber}
            </span>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
              • {currentSpread.theme}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handlePrev}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#1e293b',
                boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
              }}
            >
              <ChevronLeft size={16} />
              <span>Página Anterior</span>
            </button>

            <button
              onClick={handleNext}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(225, 29, 72, 0.35)',
              }}
            >
              <span>Pasar Página</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* LIBRO ABIERTO: DOBLE HOJA ESTILO CATÁLOGO ÉSIKA / AVON */}
        <div
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.18), 0 0 0 1px #e2e8f0',
            position: 'relative',
            overflow: 'hidden',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            opacity: isFlipping ? 0.7 : 1,
            transform: isFlipping ? 'scale(0.99)' : 'scale(1)',
          }}
        >
          {/* Lomo Central del Libro (Sombra de Pliegue Realista) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '50%',
              width: '40px',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(90deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.08) 100%)',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              position: 'relative',
            }}
          >
            {/* HOJA IZQUIERDA */}
            <div
              style={{
                padding: '36px 32px',
                borderRight: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, #ffffff 0%, #fffbfb 100%)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#e11d48', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {currentSpread.leftPage.category}
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      backgroundColor: '#ffe4e6',
                      color: '#be123c',
                      padding: '3px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {currentSpread.leftPage.badge}
                  </span>
                </div>

                <div
                  style={{
                    position: 'relative',
                    height: '240px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    marginBottom: '18px',
                    backgroundColor: '#f8fafc',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                  }}
                >
                  <img
                    src={currentSpread.leftPage.image}
                    alt={currentSpread.leftPage.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {currentSpread.leftPage.code}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0b1528', marginBottom: '4px' }}>
                  {currentSpread.leftPage.title}
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.4, marginBottom: '10px' }}>
                  {currentSpread.leftPage.subtitle}
                </p>

                <div
                  style={{
                    fontSize: '0.78rem',
                    color: '#9f1239',
                    fontWeight: 600,
                    backgroundColor: '#fff1f2',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                  }}
                >
                  {currentSpread.leftPage.aromaTip}
                </div>
              </div>

              <div style={{ paddingTop: '14px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#be123c' }}>
                    {currentSpread.leftPage.price}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                    Antes {currentSpread.leftPage.regularPrice}
                  </div>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>
                  Pág. {currentSpread.spreadNumber.split(' - ')[0]}
                </div>
              </div>
            </div>

            {/* HOJA DERECHA */}
            <div
              style={{
                padding: '36px 32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'linear-gradient(225deg, #ffffff 0%, #fffbfb 100%)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#e11d48', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {currentSpread.rightPage.category}
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      backgroundColor: '#fef3c7',
                      color: '#b45309',
                      padding: '3px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {currentSpread.rightPage.badge}
                  </span>
                </div>

                <div
                  style={{
                    position: 'relative',
                    height: '240px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    marginBottom: '18px',
                    backgroundColor: '#f8fafc',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                  }}
                >
                  <img
                    src={currentSpread.rightPage.image}
                    alt={currentSpread.rightPage.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {currentSpread.rightPage.code}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0b1528', marginBottom: '4px' }}>
                  {currentSpread.rightPage.title}
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.4, marginBottom: '10px' }}>
                  {currentSpread.rightPage.subtitle}
                </p>

                <div
                  style={{
                    fontSize: '0.78rem',
                    color: '#9f1239',
                    fontWeight: 600,
                    backgroundColor: '#fff1f2',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                  }}
                >
                  {currentSpread.rightPage.aromaTip}
                </div>
              </div>

              <div style={{ paddingTop: '14px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#be123c' }}>
                    {currentSpread.rightPage.price}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                    Antes {currentSpread.rightPage.regularPrice}
                  </div>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>
                  Pág. {currentSpread.spreadNumber.split(' - ')[1]}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Abajo de la Revista */}
        <div style={{ textAlign: 'center', marginTop: '28px' }}>
          <Link
            to="/revista/joyeria"
            target="_blank"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '9999px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#0b1528',
              fontSize: '0.9rem',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <Maximize2 size={16} />
            <span>Abrir Revista Digital Completa en Pantalla Completa</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
