import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  ChevronLeft, 
  ChevronRight, 
  Store, 
  Sparkles, 
  MessageCircle, 
  BookOpen, 
  ArrowLeft, 
  Share2, 
  Check 
} from 'lucide-react';

// Catálogo editorial con spreads (pares de hojas izquierda y derecha)
const CATALOG_SPREADS_BY_NICHE = {
  joyeria: [
    {
      spreadTitle: 'COLECCIÓN ORO 18K & CIRCONIAS SUIZAS',
      leftPage: {
        pageNumber: 2,
        category: 'JOYERÍA DE GALA',
        tag: 'TOP VENTAS COLOMBIA',
        name: 'Anillo Solitario Oro 18K & Diamante Circonia',
        price: 289000,
        regularPrice: 380000,
        code: 'JOY-01',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700&auto=format&fit=crop&q=80',
        detail: '✨ Oro laminado 18K con incrustación central y grabado artesanal. Incluye estuche de lujo.',
        sizes: 'Tallas: 6, 7, 8',
      },
      rightPage: {
        pageNumber: 3,
        category: 'RELOJERÍA DE PRECISIÓN',
        tag: 'EDICIÓN LIMITADA',
        name: 'Reloj Cronógrafo Cuarzo Signature Black',
        price: 420000,
        regularPrice: 520000,
        code: 'JOY-02',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=700&auto=format&fit=crop&q=80',
        detail: '⏱️ Maquinaria de cuarzo, cristal zafiro resistente a rayones y correa en cuero genuino.',
        sizes: 'Edición Black & Gold',
      },
    },
    {
      spreadTitle: 'PLATA LEY 925 & PERLAS CULTIVADAS',
      leftPage: {
        pageNumber: 4,
        category: 'CADENAS & DIJES',
        tag: 'MÁS PEDIDO',
        name: 'Cadena Eslabón Cubano Plata Ley 925',
        price: 185000,
        regularPrice: 240000,
        code: 'JOY-03',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700&auto=format&fit=crop&q=80',
        detail: '🔗 Fabricación en plata maciza certificada con broche de seguridad reforzado.',
        sizes: 'Longitud: 50cm y 55cm',
      },
      rightPage: {
        pageNumber: 5,
        category: 'ARETES & PENDIENTES',
        tag: 'NUEVA COLECCIÓN',
        name: 'Aretes Perla Cultivada y Baño de Oro',
        price: 135000,
        regularPrice: 175000,
        code: 'JOY-04',
        image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=700&auto=format&fit=crop&q=80',
        detail: '🌸 Perlas naturales de río con postes antialérgicos bañados en oro de 24 quilates.',
        sizes: 'Par exclusivo',
      },
    },
  ],
  ropa: [
    {
      spreadTitle: 'STREETWEAR & LOOKBOOK URBANO 2026',
      leftPage: {
        pageNumber: 2,
        category: 'CHAQUETAS & OBERWEAR',
        tag: 'DROP EXCLUSIVO',
        name: 'Chaqueta Bomber Aviator Cuero Genuino',
        price: 295000,
        regularPrice: 390000,
        code: 'ROP-01',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=700&auto=format&fit=crop&q=80',
        detail: '🧥 Cuero premium con forro térmico satinado y cremalleras metálicas reforzadas.',
        sizes: 'Tallas: S, M, L, XL',
      },
      rightPage: {
        pageNumber: 3,
        category: 'VESTIDOS DE PASARELA',
        tag: 'TENDENCIA',
        name: 'Vestido Midi Seda Floral Garden Edition',
        price: 189000,
        regularPrice: 250000,
        code: 'ROP-02',
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=700&auto=format&fit=crop&q=80',
        detail: '👗 Confección en seda estampada con caída ligera y lazo ajustable en la cintura.',
        sizes: 'Tallas: XS, S, M',
      },
    },
  ],
  default: [
    {
      spreadTitle: 'CATÁLOGO OFICIAL • EDICIÓN ESPECIAL',
      leftPage: {
        pageNumber: 2,
        category: 'PRODUCTO DESTACADO',
        tag: 'OFERTA CAMPAÑA',
        name: 'Fragancia Imperial Gold Pour Homme 100ml',
        price: 139000,
        regularPrice: 195000,
        code: 'CAT-01',
        image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=700&auto=format&fit=crop&q=80',
        detail: '✨ Notas maderosas y cuero con fijación prolongada de 24 horas.',
        sizes: '100ml Eau de Parfum',
      },
      rightPage: {
        pageNumber: 3,
        category: 'ALTA GAMA',
        tag: 'MÁS VENDIDO',
        name: 'Perfume Rosa Éclat Privée 75ml',
        price: 125000,
        regularPrice: 180000,
        code: 'CAT-02',
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=700&auto=format&fit=crop&q=80',
        detail: '🌸 Vainilla francesa y jazmín silvestre con atomizador de lujo.',
        sizes: '75ml Parfum Concentré',
      },
    },
  ],
};

export default function MagazineViewer() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const [store, setStore] = useState(null);
  const [currency, setCurrency] = useState('COP');
  const [isFlipping, setIsFlipping] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    loadStore();
  }, [slug]);

  const loadStore = async () => {
    try {
      if (slug) {
        // Buscar tienda en supabase
        const { data } = await supabase.from('tenants').select('*').eq('slug', slug).single();
        if (data) {
          setStore(data);
          return;
        }
      }
      // Fallback a localStorage si el cliente creó la tienda
      const localSession = localStorage.getItem('zeply_client_session');
      if (localSession) {
        const parsed = JSON.parse(localSession);
        if (parsed.slug === slug || !slug) {
          setStore(parsed);
          return;
        }
      }

      setStore({
        name: slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Aura & Co. Joyería',
        slug: slug || 'joyeria',
        niche: slug === 'ropa' ? 'ropa' : 'joyeria',
        whatsapp: '573124567890',
      });
    } catch {
      setStore({
        name: 'Aura & Co. Joyería Fina',
        slug: 'joyeria',
        niche: 'joyeria',
        whatsapp: '573124567890',
      });
    }
  };

  const nicheKey = store?.niche === 'ropa' ? 'ropa' : 'joyeria';
  const spreads = CATALOG_SPREADS_BY_NICHE[nicheKey] || CATALOG_SPREADS_BY_NICHE.default;
  const currentSpread = spreads[currentSpreadIndex] || spreads[0];

  const formatPrice = (amount) => {
    if (currency === 'USD') {
      const usd = (amount / 4000).toFixed(2);
      return `$${usd} USD`;
    }
    return `$${amount.toLocaleString('es-CO')} COP`;
  };

  const handleNextSpread = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSpreadIndex((prev) => (prev < spreads.length - 1 ? prev + 1 : 0));
      setIsFlipping(false);
    }, 220);
  };

  const handlePrevSpread = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSpreadIndex((prev) => (prev > 0 ? prev - 1 : spreads.length - 1));
      setIsFlipping(false);
    }, 220);
  };

  const handleWhatsAppOrder = (item) => {
    const phone = store?.whatsapp ? store.whatsapp.replace(/\D/g, '') : '573124567890';
    const message = encodeURIComponent(
      `¡Hola ${store?.name || 'Zeply'}! 👋\nVi su Revista Digital Interactiva y quiero pedir este producto:\n\n🛍️ *Producto:* ${item.name}\n🏷️ *Código:* ${item.code}\n💰 *Precio:* ${formatPrice(item.price)}\n\n¿Tienen disponibilidad para envío?`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#070d18',
        background: 'radial-gradient(circle at 50% 20%, #0f1d35 0%, #060b13 100%)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Barra Superior con Controles */}
      <header
        style={{
          backgroundColor: 'rgba(11, 21, 40, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '12px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            <ArrowLeft size={14} />
            <span>Inicio</span>
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.06em' }}>
                📖 REVISTA DIGITAL OFICIAL
              </span>
              <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 700 }}>• EN VIVO</span>
            </div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-display)' }}>
              {store?.name || 'Catálogo Zeply'}
            </h1>
          </div>
        </div>

        {/* Controles Centrales de Pase de Página */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handlePrevSpread}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '7px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 700,
            }}
          >
            <ChevronLeft size={16} />
            <span>◀ Anterior</span>
          </button>

          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#38bdf8',
              backgroundColor: 'rgba(2, 132, 199, 0.2)',
              padding: '4px 12px',
              borderRadius: '999px',
              border: '1px solid rgba(56, 189, 248, 0.3)',
            }}
          >
            Pág. {currentSpread.leftPage.pageNumber} - {currentSpread.rightPage.pageNumber}
          </span>

          <button
            onClick={handleNextSpread}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '7px 14px',
              borderRadius: '8px',
              backgroundColor: '#0284c7',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 700,
              boxShadow: '0 2px 10px rgba(2, 132, 199, 0.4)',
            }}
          >
            <span>Siguiente ▶</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Selector Moneda y Compartir */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '2px' }}>
            <button
              onClick={() => setCurrency('COP')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 800,
                backgroundColor: currency === 'COP' ? '#0284c7' : 'transparent',
                color: '#ffffff',
              }}
            >
              COP
            </button>
            <button
              onClick={() => setCurrency('USD')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 800,
                backgroundColor: currency === 'USD' ? '#0284c7' : 'transparent',
                color: '#ffffff',
              }}
            >
              USD
            </button>
          </div>

          <button
            onClick={handleCopyLink}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            {copiedLink ? <Check size={14} color="#10b981" /> : <Share2 size={14} />}
            <span>{copiedLink ? '¡Enlace Copiado!' : 'Compartir'}</span>
          </button>
        </div>
      </header>

      {/* VIEWPORT PRINCIPAL: LIBRO ABIERTO DE 2 HOJAS */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px 20px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#38bdf8',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {currentSpread.spreadTitle}
          </span>
        </div>

        {/* EL LIBRO ABIERTO (2 HOJAS CON PLIEGUE CENTRAL 3D) */}
        <div
          style={{
            maxWidth: '1060px',
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.15)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'opacity 0.22s ease, transform 0.22s ease',
            opacity: isFlipping ? 0.6 : 1,
            transform: isFlipping ? 'scale(0.985)' : 'scale(1)',
          }}
        >
          {/* Lomo Central del Libro (Sombra Realista de Pliegue) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '50%',
              width: '44px',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(90deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.28) 50%, rgba(0,0,0,0.12) 100%)',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              color: '#0f172a',
            }}
          >
            {/* ═══════════════════════════════════════════ */}
            {/* HOJA IZQUIERDA (PÁGINA PAR)                 */}
            {/* ═══════════════════════════════════════════ */}
            <div
              style={{
                padding: '38px 34px',
                borderRight: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, #ffffff 0%, #fafcfd 100%)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0284c7', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {currentSpread.leftPage.category}
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      backgroundColor: '#e0f2fe',
                      color: '#0369a1',
                      padding: '3px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    {currentSpread.leftPage.tag}
                  </span>
                </div>

                {/* Foto del Producto con Código */}
                <div
                  style={{
                    position: 'relative',
                    height: '270px',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    backgroundColor: '#f1f5f9',
                    marginBottom: '18px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  }}
                >
                  <img
                    src={currentSpread.leftPage.image}
                    alt={currentSpread.leftPage.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.88)',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    REF: {currentSpread.leftPage.code}
                  </div>
                </div>

                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0b1528', marginBottom: '6px', lineHeight: 1.3 }}>
                  {currentSpread.leftPage.name}
                </h2>

                <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5, marginBottom: '10px' }}>
                  {currentSpread.leftPage.detail}
                </p>

                <div style={{ fontSize: '0.76rem', color: '#0d9488', fontWeight: 700, marginBottom: '18px' }}>
                  {currentSpread.leftPage.sizes}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0284c7', fontFamily: 'var(--font-display)' }}>
                    {formatPrice(currentSpread.leftPage.price)}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                    {formatPrice(currentSpread.leftPage.regularPrice)}
                  </span>
                </div>

                <button
                  onClick={() => handleWhatsAppOrder(currentSpread.leftPage)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <MessageCircle size={18} />
                  <span>Pedir por WhatsApp</span>
                </button>

                <div style={{ textAlign: 'left', marginTop: '14px', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>
                  PÁGINA {currentSpread.leftPage.pageNumber}
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════ */}
            {/* HOJA DERECHA (PÁGINA IMPAR)                 */}
            {/* ═══════════════════════════════════════════ */}
            <div
              style={{
                padding: '38px 34px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'linear-gradient(225deg, #ffffff 0%, #fafcfd 100%)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0284c7', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {currentSpread.rightPage.category}
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      backgroundColor: '#fef3c7',
                      color: '#b45309',
                      padding: '3px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    {currentSpread.rightPage.tag}
                  </span>
                </div>

                {/* Foto del Producto con Código */}
                <div
                  style={{
                    position: 'relative',
                    height: '270px',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    backgroundColor: '#f1f5f9',
                    marginBottom: '18px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  }}
                >
                  <img
                    src={currentSpread.rightPage.image}
                    alt={currentSpread.rightPage.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.88)',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    REF: {currentSpread.rightPage.code}
                  </div>
                </div>

                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0b1528', marginBottom: '6px', lineHeight: 1.3 }}>
                  {currentSpread.rightPage.name}
                </h2>

                <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5, marginBottom: '10px' }}>
                  {currentSpread.rightPage.detail}
                </p>

                <div style={{ fontSize: '0.76rem', color: '#0d9488', fontWeight: 700, marginBottom: '18px' }}>
                  {currentSpread.rightPage.sizes}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0284c7', fontFamily: 'var(--font-display)' }}>
                    {formatPrice(currentSpread.rightPage.price)}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                    {formatPrice(currentSpread.rightPage.regularPrice)}
                  </span>
                </div>

                <button
                  onClick={() => handleWhatsAppOrder(currentSpread.rightPage)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <MessageCircle size={18} />
                  <span>Pedir por WhatsApp</span>
                </button>

                <div style={{ textAlign: 'right', marginTop: '14px', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>
                  PÁGINA {currentSpread.rightPage.pageNumber}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón Flotante para pasar página al tocar */}
        <div style={{ display: 'flex', gap: '14px', marginTop: '24px' }}>
          <button
            onClick={handlePrevSpread}
            style={{
              padding: '10px 20px',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              fontSize: '0.86rem',
              fontWeight: 700,
            }}
          >
            ◀ Voltear a la Página Anterior
          </button>
          <button
            onClick={handleNextSpread}
            style={{
              padding: '10px 24px',
              borderRadius: '999px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              fontSize: '0.86rem',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
            }}
          >
            Pasar a la Siguiente Hoja ▶
          </button>
        </div>
      </main>
    </div>
  );
}
