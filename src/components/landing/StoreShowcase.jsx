import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  MessageCircle, 
  BookOpen, 
  ExternalLink, 
  Check, 
  ShoppingBag, 
  Tag, 
  Zap, 
  ArrowRight,
  Eye,
  CheckCircle2
} from 'lucide-react';

const STORES_DATA = {
  joyeria: {
    name: 'Aura & Co. Joyería Fina',
    niche: 'Joyería & Relojes',
    tagline: 'Piezas exclusivas en Oro 18K y Plata Ley 925',
    color: '#d97706',
    bgColor: '#fef3c7',
    coverImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
    products: [
      {
        id: 1,
        name: 'Anillo Solitario Oro 18K & Circonia Suiza',
        price: '$289.000 COP',
        oldPrice: '$350.000 COP',
        tag: 'MÁS VENDIDO',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80',
        variations: ['Talla 6', 'Talla 7', 'Talla 8'],
      },
      {
        id: 2,
        name: 'Reloj Cronógrafo Cuarzo Signature Black',
        price: '$420.000 COP',
        oldPrice: '$490.000 COP',
        tag: 'EDICIÓN LIMITADA',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=80',
        variations: ['Correa Cuero', 'Correa Acero'],
      },
      {
        id: 3,
        name: 'Cadena Eslabón Cubano Plata Ley 925',
        price: '$185.000 COP',
        oldPrice: '$220.000 COP',
        tag: 'TENDENCIA',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80',
        variations: ['50 cm', '55 cm', '60 cm'],
      },
    ],
  },
  ropa: {
    name: 'Urban Luxe Streetwear',
    niche: 'Ropa & Moda',
    tagline: 'Tendencias urbanas, drops exclusivos y básicos premium',
    color: '#0284c7',
    bgColor: '#e0f2fe',
    coverImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
    products: [
      {
        id: 1,
        name: 'Chaqueta Bomber Cuero Genuino Premium',
        price: '$295.000 COP',
        oldPrice: '$380.000 COP',
        tag: 'NUEVA COLECCIÓN',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=80',
        variations: ['S', 'M', 'L', 'XL'],
      },
      {
        id: 2,
        name: 'Vestido Midi Seda Estampado Floral',
        price: '$189.000 COP',
        oldPrice: '$240.000 COP',
        tag: 'FAVORITO',
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=80',
        variations: ['XS', 'S', 'M'],
      },
      {
        id: 3,
        name: 'Camisa Oversize Algodón Pima Blanco',
        price: '$119.000 COP',
        oldPrice: '$150.000 COP',
        tag: 'BÁSICO',
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop&q=80',
        variations: ['S', 'M', 'L'],
      },
    ],
  },
  celulares: {
    name: 'TechZone Colombia',
    niche: 'Celulares & Gadgets',
    tagline: 'Smartphones libres de fábrica con garantía certificada',
    color: '#0d9488',
    bgColor: '#ccfbf1',
    coverImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    products: [
      {
        id: 1,
        name: 'iPhone 15 Pro Max 256GB Titanio Natural',
        price: '$4.890.000 COP',
        oldPrice: '$5.200.000 COP',
        tag: 'PREMIUM',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=80',
        variations: ['Titanio Natural', 'Titanio Negro', 'Titanio Azul'],
      },
      {
        id: 2,
        name: 'Samsung Galaxy S24 Ultra 512GB',
        price: '$4.590.000 COP',
        oldPrice: '$4.950.000 COP',
        tag: 'TOP VENTAS',
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=80',
        variations: ['Titanium Gray', 'Titanium Black'],
      },
      {
        id: 3,
        name: 'AirPods Pro 2da Generación USB-C',
        price: '$950.000 COP',
        oldPrice: '$1.150.000 COP',
        tag: 'OFERTA FLASH',
        image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80',
        variations: ['Estuche MagSafe USB-C'],
      },
    ],
  },
  perfumeria: {
    name: 'Essence Parfum Privé',
    niche: 'Perfumería & Fragancias',
    tagline: 'Perfumería nicho y diseñador 100% original con sello de garantía',
    color: '#8b5cf6',
    bgColor: '#ede9fe',
    coverImage: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80',
    products: [
      {
        id: 1,
        name: 'Baccarat Rouge 540 Eau de Parfum 70ml',
        price: '$1.450.000 COP',
        oldPrice: '$1.680.000 COP',
        tag: 'LUJO EXCLUSIVO',
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&auto=format&fit=crop&q=80',
        variations: ['70 ml', '200 ml'],
      },
      {
        id: 2,
        name: 'Sauvage Elixir Parfum Concentré 60ml',
        price: '$680.000 COP',
        oldPrice: '$750.000 COP',
        tag: 'TOP MASCULINO',
        image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&auto=format&fit=crop&q=80',
        variations: ['60 ml', '100 ml'],
      },
      {
        id: 3,
        name: 'Good Girl Carolina Herrera Eau de Parfum',
        price: '$490.000 COP',
        oldPrice: '$560.000 COP',
        tag: 'MÁS PEDIDO',
        image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=500&auto=format&fit=crop&q=80',
        variations: ['80 ml'],
      },
    ],
  },
};

export default function StoreShowcase() {
  const [activeTab, setActiveTab] = useState('joyeria');

  const currentStore = STORES_DATA[activeTab];

  return (
    <section
      id="tiendas"
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
        {/* Cabecera */}
        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
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
            <span>VITRINA EN VIVO</span>
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
            Así de Elegante y Rápida se Verá tu Tienda Zeply
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#64748b',
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            Navega entre diferentes nichos de negocio y prueba la experiencia de compra con checkout directo a WhatsApp y catálogo revista.
          </p>
        </div>

        {/* Selector de Nichos / Pestañas */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '40px',
          }}
        >
          {Object.entries(STORES_DATA).map(([key, store]) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '9999px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  backgroundColor: isActive ? '#0b1528' : '#f1f5f9',
                  color: isActive ? '#ffffff' : '#475569',
                  border: isActive ? '1px solid #0b1528' : '1px solid #e2e8f0',
                  boxShadow: isActive ? '0 4px 14px rgba(11, 21, 40, 0.25)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {store.niche}
              </button>
            );
          })}
        </div>

        {/* Tarjeta de Tienda Activa */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '28px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Header de la Tienda de Muestra */}
          <div
            style={{
              padding: '24px 32px',
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                  }}
                />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0b1528' }}>
                  {currentStore.name}
                </h3>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#64748b', marginTop: '2px' }}>
                {currentStore.tagline}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Link
                to={`/revista/${activeTab}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#0d9488',
                  backgroundColor: '#f0fdfa',
                  border: '1px solid #ccfbf1',
                  padding: '9px 16px',
                  borderRadius: '9999px',
                }}
              >
                <BookOpen size={15} />
                <span>Ver Revista Digital PDF</span>
              </Link>
            </div>
          </div>

          {/* Grid de Productos */}
          <div
            style={{
              padding: '32px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {currentStore.products.map((product) => (
              <div
                key={product.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                }}
                className="card-hover-lift"
              >
                {/* Imagen con Tag */}
                <div style={{ position: 'relative', height: '230px', backgroundColor: '#f1f5f9' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      color: '#ffffff',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      backdropFilter: 'blur(4px)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {product.tag}
                  </div>
                </div>

                {/* Info del Producto */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h4
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      marginBottom: '8px',
                      lineHeight: 1.35,
                    }}
                  >
                    {product.name}
                  </h4>

                  {/* Variaciones Disponibles */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {product.variations.map((v, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.72rem',
                          padding: '3px 8px',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          color: '#475569',
                          fontWeight: 600,
                        }}
                      >
                        {v}
                      </span>
                    ))}
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0b1528' }}>
                        {product.price}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                        {product.oldPrice}
                      </span>
                    </div>

                    {/* Botón Estático Pedir por WhatsApp */}
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '12px',
                        borderRadius: '12px',
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                        cursor: 'default',
                        userSelect: 'none',
                      }}
                    >
                      <MessageCircle size={16} />
                      <span>Pedir por WhatsApp</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
