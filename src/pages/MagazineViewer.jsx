import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Datos de demostración según nicho si la tienda no tiene productos en BD
const DEMO_PRODUCTS_BY_NICHE = {
  joyeria: [
    { id: 1, name: 'Anillo Solitario Oro 18K & Diamante Zirconia', price: 289000, tag: 'TOP VENTAS', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80', code: 'JOY-01' },
    { id: 2, name: 'Reloj Cronógrafo Cuarzo Signature Black', price: 420000, tag: 'EDICIÓN LIMITADA', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80', code: 'JOY-02' },
    { id: 3, name: 'Cadena Eslabón Cubano Plata Ley 925', price: 185000, tag: 'TENDENCIA', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80', code: 'JOY-03' },
    { id: 4, name: 'Aretes Perla Cultivada y Baño de Oro', price: 135000, tag: 'NUEVO', image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&auto=format&fit=crop&q=80', code: 'JOY-04' },
  ],
  celulares: [
    { id: 1, name: 'iPhone 15 Pro Max 256GB Titanio Natural', price: 4890000, tag: 'PREMIUM', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80', code: 'CEL-01' },
    { id: 2, name: 'Samsung Galaxy S24 Ultra 512GB Titanium Gray', price: 4590000, tag: 'TOP VENTAS', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80', code: 'CEL-02' },
    { id: 3, name: 'AirPods Pro 2da Generación USB-C', price: 950000, tag: 'ACCESORIO TOP', image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80', code: 'CEL-03' },
    { id: 4, name: 'Funda Magnética Armor Magsafe Anticaídas', price: 85000, tag: 'OFERTA', image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80', code: 'CEL-04' },
  ],
  ropa: [
    { id: 1, name: 'Chaqueta Bomber Cuero Genuino Premium', price: 295000, tag: 'LOOKBOOK 2026', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80', code: 'ROP-01' },
    { id: 2, name: 'Vestido Midi Seda Estampado Floral', price: 189000, tag: 'TENDENCIA', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80', code: 'ROP-02' },
    { id: 3, name: 'Camisa Oversize Algodón Pima Blanco', price: 119000, tag: 'BÁSICO ESENCIAL', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80', code: 'ROP-03' },
    { id: 4, name: 'Pantalón Cargo Táctico Streetwear', price: 145000, tag: 'MÁS VENDIDO', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80', code: 'ROP-04' },
  ],
  default: [
    { id: 1, name: 'Producto Premier Oro / Edición', price: 189000, tag: 'DESTACADO', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80', code: 'PROD-01' },
    { id: 2, name: 'Colección Signature Exclusiva', price: 125000, tag: 'TENDENCIA', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80', code: 'PROD-02' },
    { id: 3, name: 'Edición Limitada Temporada', price: 240000, tag: 'NUEVO', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80', code: 'PROD-03' },
    { id: 4, name: 'Pack Especial de Temporada', price: 95000, tag: 'OFERTA', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80', code: 'PROD-04' },
  ]
};

export default function MagazineViewer() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [store, setStore] = useState(null);
  const [currency, setCurrency] = useState('COP');
  const [loading, setLoading] = useState(true);

  const totalPages = 4;

  useEffect(() => {
    loadStore();
  }, [slug]);

  const loadStore = async () => {
    setLoading(true);
    try {
      if (slug) {
        const { data } = await supabase.from('tenants').select('*').eq('slug', slug).single();
        if (data) {
          setStore(data);
        } else {
          setStore({
            name: slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Tienda Zeply',
            slug: slug || 'demo',
            niche: 'joyeria',
            whatsapp: '3184804720',
            plan: 'STARTER',
          });
        }
      } else {
        setStore({
          name: 'Aura Joyas & Relojes',
          slug: 'aurajoyas',
          niche: 'joyeria',
          whatsapp: '3184804720',
          plan: 'PRO',
        });
      }
    } catch {
      setStore({
        name: 'Aura Joyas & Relojes',
        slug: 'aurajoyas',
        niche: 'joyeria',
        whatsapp: '3184804720',
        plan: 'PRO',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount) => {
    if (currency === 'USD') {
      const usd = (amount / 4000).toFixed(2);
      return `$ ${usd} USD`;
    }
    return `$ ${new Intl.NumberFormat('es-CO').format(amount)} COP`;
  };

  const products = (store && DEMO_PRODUCTS_BY_NICHE[store.niche]) || DEMO_PRODUCTS_BY_NICHE.default;

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <p style={{ color: '#ffffff', marginTop: '16px' }}>Cargando Revista Interactiva Zeply...</p>
      </div>
    );
  }

  const storePhone = store?.whatsapp ? store.whatsapp.replace(/\D/g, '') : '3184804720';
  const whatsappUrl = (productName, price, code) => {
    const text = encodeURIComponent(
      `¡Hola ${store?.name || 'Zeply'}! Vi tu Revista Digital Interactiva y quiero hacer el pedido de:\n\n📦 *Producto:* ${productName}\n🏷️ *Código:* ${code}\n💰 *Precio:* ${formatPrice(price)}\n\n¿Tienen disponibilidad para envío inmediato?`
    );
    return `https://wa.me/57${storePhone}?text=${text}`;
  };

  return (
    <div style={styles.container}>
      {/* Barra superior de control */}
      <header style={styles.topbar}>
        <div style={styles.topbarLeft}>
          <span style={styles.badge}>📖 REVISTA DIGITAL INTERACTIVA</span>
          <span style={styles.storeName}>{store?.name}</span>
        </div>

        <div style={styles.topbarControls}>
          {/* Selector de Moneda */}
          <div style={styles.currencyToggle}>
            <button
              onClick={() => setCurrency('COP')}
              style={{
                ...styles.currencyBtn,
                backgroundColor: currency === 'COP' ? '#0284c7' : 'transparent',
                color: currency === 'COP' ? '#ffffff' : '#94a3b8',
              }}
            >
              COP
            </button>
            <button
              onClick={() => setCurrency('USD')}
              style={{
                ...styles.currencyBtn,
                backgroundColor: currency === 'USD' ? '#0284c7' : 'transparent',
                color: currency === 'USD' ? '#ffffff' : '#94a3b8',
              }}
            >
              USD
            </button>
          </div>

          {/* Navegación de páginas */}
          <div style={styles.pagination}>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              style={{
                ...styles.pageNavBtn,
                opacity: currentPage === 1 ? 0.4 : 1,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              ◀ Anterior
            </button>
            <span style={styles.pageIndicator}>
              Pág. {currentPage} de {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              style={{
                ...styles.pageNavBtn,
                opacity: currentPage === totalPages ? 0.4 : 1,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              Siguiente ▶
            </button>
          </div>

          <button onClick={() => navigate('/rey-admin/dashboard')} style={styles.exitBtn}>
            Volver al Panel
          </button>
        </div>
      </header>

      {/* Contenedor tipo revista flip-book centrado */}
      <main style={styles.magazineViewport}>
        <div style={styles.magazineSpread}>
          {/* ═══════════════════════════════════════════ */}
          {/* PÁGINA 1: PORTADA EDITORIAL DE ALTA GAMA    */}
          {/* ═══════════════════════════════════════════ */}
          {currentPage === 1 && (
            <div style={styles.pageCover}>
              <div style={styles.coverHeader}>
                <div style={styles.coverIssueBadge}>EDICIÓN EXCLUSIVA 2026</div>
                <h1 style={styles.coverTitle}>{store?.name?.toUpperCase()}</h1>
                <p style={styles.coverSub}>CATÁLOGO LOOKBOOK OFICIAL</p>
                <div style={styles.coverLine} />
              </div>

              <div style={styles.coverHeroWrapper}>
                <img
                  src={products[0]?.image}
                  alt="Portada"
                  style={styles.coverHeroImg}
                />
                <div style={styles.coverHeroOverlay}>
                  <span style={styles.coverHeroTag}>NOVA COLECCIÓN</span>
                  <div style={styles.coverHeroText}>Diseño Vanguardista & Máxima Calidad</div>
                </div>
              </div>

              <div style={styles.coverFooter}>
                <div style={styles.coverHelpBox}>
                  <span style={{ fontSize: '18px' }}>👉</span>
                  <span>
                    <strong>¿Cómo comprar?</strong> Pasa las páginas, explora los productos en alta resolución y pulsa el botón <strong>Pedir por WhatsApp</strong> para ordenar de forma instantánea.
                  </span>
                </div>

                <button onClick={handleNextPage} style={styles.btnExplore}>
                  Abrir Catálogo y Explorar →
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* PÁGINA 2: NOVEDADES DESTACADAS              */}
          {/* ═══════════════════════════════════════════ */}
          {currentPage === 2 && (
            <div style={styles.pageInner}>
              <div style={styles.pageHeaderBanner}>
                <div>
                  <span style={styles.pageCategoryLabel}>COLECCIÓN DESTACADA • PÁGINA 02</span>
                  <h2 style={styles.pageHeading}>Novedades de Temporada</h2>
                </div>
                <div style={styles.pageHeaderRight}>
                  Pedidos directos vía WhatsApp oficial: <strong>+{storePhone}</strong>
                </div>
              </div>

              <div style={styles.productsGrid}>
                {products.slice(0, 2).map((item) => (
                  <div key={item.id} style={styles.productCard}>
                    <div style={styles.productImgContainer}>
                      <span style={styles.productBadge}>{item.tag}</span>
                      <img src={item.image} alt={item.name} style={styles.productImg} />
                    </div>
                    <div style={styles.productBody}>
                      <div style={styles.productCode}>Ref: {item.code}</div>
                      <h3 style={styles.productName}>{item.name}</h3>
                      <div style={styles.productPrice}>{formatPrice(item.price)}</div>
                      <div style={styles.actionRow}>
                        <a
                          href={whatsappUrl(item.name, item.price, item.code)}
                          target="_blank"
                          rel="noreferrer"
                          style={styles.btnOrderWhatsApp}
                        >
                          💬 Pedir por WhatsApp
                        </a>
                        {store?.plan === 'PRO' && (
                          <button
                            onClick={() => alert(`Iniciando pasarela de pago para ${item.name} (${formatPrice(item.price)})`)}
                            style={styles.btnOrderGateway}
                          >
                            💳 Pagar con Tarjeta/PSE
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.pageBottomNav}>
                <button onClick={handlePrevPage} style={styles.bottomNavBtn}>◀ Volver a la Portada</button>
                <button onClick={handleNextPage} style={styles.bottomNavBtnPrimary}>Ver Más Productos (Página 3) ▶</button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* PÁGINA 3: COLECCIÓN SIGNATURE               */}
          {/* ═══════════════════════════════════════════ */}
          {currentPage === 3 && (
            <div style={styles.pageInner}>
              <div style={styles.pageHeaderBanner}>
                <div>
                  <span style={styles.pageCategoryLabel}>SELECCIÓN PREMIUM • PÁGINA 03</span>
                  <h2 style={styles.pageHeading}>Edición Limitada & Exclusivos</h2>
                </div>
                <div style={styles.pageHeaderRight}>
                  Garantía y asesoría personalizada por WhatsApp
                </div>
              </div>

              <div style={styles.productsGrid}>
                {products.slice(2, 4).map((item) => (
                  <div key={item.id} style={styles.productCard}>
                    <div style={styles.productImgContainer}>
                      <span style={styles.productBadge}>{item.tag}</span>
                      <img src={item.image} alt={item.name} style={styles.productImg} />
                    </div>
                    <div style={styles.productBody}>
                      <div style={styles.productCode}>Ref: {item.code}</div>
                      <h3 style={styles.productName}>{item.name}</h3>
                      <div style={styles.productPrice}>{formatPrice(item.price)}</div>
                      <div style={styles.actionRow}>
                        <a
                          href={whatsappUrl(item.name, item.price, item.code)}
                          target="_blank"
                          rel="noreferrer"
                          style={styles.btnOrderWhatsApp}
                        >
                          💬 Pedir por WhatsApp
                        </a>
                        {store?.plan === 'PRO' && (
                          <button
                            onClick={() => alert(`Iniciando pasarela de pago para ${item.name} (${formatPrice(item.price)})`)}
                            style={styles.btnOrderGateway}
                          >
                            💳 Pagar con Tarjeta/PSE
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.pageBottomNav}>
                <button onClick={handlePrevPage} style={styles.bottomNavBtn}>◀ Página Anterior</button>
                <button onClick={handleNextPage} style={styles.bottomNavBtnPrimary}>Ver Políticas y Envíos (Pág. 4) ▶</button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* PÁGINA 4: CONTRAPORTADA, ENVÍOS Y PAGOS    */}
          {/* ═══════════════════════════════════════════ */}
          {currentPage === 4 && (
            <div style={styles.pageBackCover}>
              <div style={styles.backCoverHeader}>
                <span style={styles.coverIssueBadge}>CONTRAPORTADA • FINAL</span>
                <h2 style={styles.backCoverTitle}>¿Listo para Realizar tu Pedido?</h2>
                <p style={styles.backCoverSubtitle}>
                  Atención directa, envíos seguros y soporte continuo para todos nuestros clientes.
                </p>
              </div>

              <div style={styles.featuresCardsGrid}>
                <div style={styles.featureBox}>
                  <div style={styles.featureIcon}>🚚</div>
                  <div style={styles.featureTitle}>Envíos a Todo el País</div>
                  <div style={styles.featureDesc}>
                    Despachos rápidos y asegurados con número de guía en tiempo real para rastreo.
                  </div>
                </div>

                <div style={styles.featureBox}>
                  <div style={styles.featureIcon}>
                    {store?.plan === 'PRO' ? '💳' : '💬'}
                  </div>
                  <div style={styles.featureTitle}>
                    {store?.plan === 'PRO' ? 'Pasarela de Pagos & WhatsApp' : 'Pedidos por WhatsApp'}
                  </div>
                  <div style={styles.featureDesc}>
                    {store?.plan === 'PRO'
                      ? 'Paga con tarjeta de crédito, PSE o Nequi de forma segura en línea, o coordina por WhatsApp.'
                      : 'Atención personalizada para cotizar y confirmar tu pedido directamente en el chat.'}
                  </div>
                </div>

                <div style={styles.featureBox}>
                  <div style={styles.featureIcon}>🛡️</div>
                  <div style={styles.featureTitle}>Garantía de Satisfacción</div>
                  <div style={styles.featureDesc}>
                    Todos nuestros productos cuentan con garantía oficial de fábrica y soporte posventa.
                  </div>
                </div>
              </div>

              {/* Botón Central para Contactar por WhatsApp */}
              <div style={styles.backCoverCtaBox}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#0f172a' }}>
                  Atención Inmediata con un Asesor
                </h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#64748b' }}>
                  ¿Tienes dudas o buscas una referencia personalizada? Escríbenos directamente.
                </p>
                <a
                  href={`https://wa.me/57${storePhone}?text=${encodeURIComponent('¡Hola! Estuve viendo la Revista Interactiva y quiero hacer una consulta sobre los productos.')}`}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.bigWhatsAppBtn}
                >
                  💬 Escribir al WhatsApp Oficial de la Tienda
                </a>
              </div>

              <div style={styles.pageBottomNav}>
                <button onClick={handlePrevPage} style={styles.bottomNavBtn}>◀ Volver a Productos</button>
                <button onClick={() => setCurrentPage(1)} style={styles.bottomNavBtnPrimary}>Volver a la Portada ↺</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0b1120',
    color: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  loadingContainer: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0b1120',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255,255,255,0.1)',
    borderTopColor: '#0284c7',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  topbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 24px',
    backgroundColor: '#0f172a',
    borderBottom: '1px solid #1e293b',
    flexWrap: 'wrap',
    gap: '12px',
  },
  topbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  badge: {
    backgroundColor: 'rgba(2, 132, 199, 0.2)',
    color: '#38bdf8',
    border: '1px solid rgba(2, 132, 199, 0.4)',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '0.05em',
  },
  storeName: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#ffffff',
  },
  topbarControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  currencyToggle: {
    display: 'flex',
    backgroundColor: '#1e293b',
    borderRadius: '6px',
    padding: '2px',
  },
  currencyBtn: {
    padding: '5px 12px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  pageNavBtn: {
    backgroundColor: '#1e293b',
    color: '#f8fafc',
    border: '1px solid #334155',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    transition: 'all 0.15s ease',
  },
  pageIndicator: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#94a3b8',
    padding: '0 4px',
  },
  exitBtn: {
    backgroundColor: '#334155',
    color: '#ffffff',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  magazineViewport: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px 16px',
  },
  magazineSpread: {
    width: '100%',
    maxWidth: '850px',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    borderRadius: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  pageCover: {
    padding: '40px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
  },
  coverHeader: {
    marginBottom: '24px',
  },
  coverIssueBadge: {
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '0.15em',
    color: '#0284c7',
    marginBottom: '6px',
  },
  coverTitle: {
    fontSize: '34px',
    fontWeight: '900',
    letterSpacing: '-0.02em',
    color: '#0f172a',
    margin: '0 0 6px 0',
  },
  coverSub: {
    fontSize: '14px',
    letterSpacing: '0.12em',
    color: '#64748b',
    fontWeight: '700',
    margin: 0,
  },
  coverLine: {
    width: '60px',
    height: '3px',
    backgroundColor: '#0284c7',
    margin: '12px auto 0 auto',
    borderRadius: '2px',
  },
  coverHeroWrapper: {
    position: 'relative',
    width: '100%',
    maxHeight: '360px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
    marginBottom: '28px',
  },
  coverHeroImg: {
    width: '100%',
    height: '360px',
    objectFit: 'cover',
  },
  coverHeroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '20px',
    background: 'linear-gradient(180deg, transparent 0%, rgba(15,23,42,0.85) 100%)',
    color: '#ffffff',
    textAlign: 'left',
  },
  coverHeroTag: {
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '0.1em',
    color: '#38bdf8',
  },
  coverHeroText: {
    fontSize: '20px',
    fontWeight: '800',
    marginTop: '4px',
  },
  coverFooter: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  coverHelpBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#e0f2fe',
    border: '1px solid #bae6fd',
    borderRadius: '8px',
    padding: '12px 18px',
    fontSize: '13px',
    color: '#0369a1',
    textAlign: 'left',
    lineHeight: '1.4',
  },
  btnExplore: {
    backgroundColor: '#0284c7',
    color: '#ffffff',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
  },
  pageInner: {
    padding: '32px',
  },
  pageHeaderBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  pageCategoryLabel: {
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '0.1em',
    color: '#0284c7',
  },
  pageHeading: {
    fontSize: '24px',
    fontWeight: '900',
    color: '#0f172a',
    margin: '4px 0 0 0',
  },
  pageHeaderRight: {
    fontSize: '12px',
    color: '#64748b',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '28px',
  },
  productCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  productImgContainer: {
    position: 'relative',
    height: '240px',
    overflow: 'hidden',
  },
  productBadge: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    color: '#ffffff',
    fontSize: '10px',
    fontWeight: '800',
    padding: '4px 8px',
    borderRadius: '4px',
    letterSpacing: '0.05em',
  },
  productImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  productBody: {
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  productCode: {
    fontSize: '11px',
    color: '#94a3b8',
    fontWeight: '700',
    marginBottom: '4px',
  },
  productName: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 10px 0',
    lineHeight: '1.3',
  },
  productPrice: {
    fontSize: '18px',
    fontWeight: '900',
    color: '#0284c7',
    marginBottom: '16px',
  },
  actionRow: {
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  btnOrderWhatsApp: {
    backgroundColor: '#16a34a',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '10px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '800',
    textAlign: 'center',
    display: 'block',
    boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)',
  },
  btnOrderGateway: {
    backgroundColor: '#7c3aed',
    color: '#ffffff',
    border: 'none',
    padding: '9px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  pageBottomNav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '16px',
  },
  bottomNavBtn: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: '1px solid #cbd5e1',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  bottomNavBtnPrimary: {
    backgroundColor: '#0284c7',
    color: '#ffffff',
    border: 'none',
    padding: '8px 18px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '800',
    cursor: 'pointer',
  },
  pageBackCover: {
    padding: '40px 32px',
    background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
  },
  backCoverHeader: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  backCoverTitle: {
    fontSize: '28px',
    fontWeight: '900',
    color: '#0f172a',
    margin: '6px 0',
  },
  backCoverSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    maxWidth: '520px',
    margin: '0 auto',
  },
  featuresCardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  featureBox: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    textAlign: 'center',
  },
  featureIcon: {
    fontSize: '28px',
    marginBottom: '8px',
  },
  featureTitle: {
    fontSize: '15px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '6px',
  },
  featureDesc: {
    fontSize: '12px',
    color: '#64748b',
    lineHeight: '1.4',
  },
  backCoverCtaBox: {
    backgroundColor: '#ffffff',
    border: '2px solid #bae6fd',
    borderRadius: '12px',
    padding: '28px',
    textAlign: 'center',
    marginBottom: '28px',
    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.08)',
  },
  bigWhatsAppBtn: {
    backgroundColor: '#16a34a',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '14px 28px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '800',
    display: 'inline-block',
    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
  },
};
