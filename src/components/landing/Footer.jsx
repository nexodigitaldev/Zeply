import React from 'react';
import { Link } from 'react-router-dom';
import { Store, MessageCircle, Globe, Shield, Heart } from 'lucide-react';

function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#0b1528',
        color: '#94a3b8',
        padding: '70px 24px 30px',
        borderTop: '1px solid #1e293b',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '50px',
        }}
      >
        {/* Columna de Marca */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <Store size={20} />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.4rem',
                color: '#ffffff',
              }}
            >
              Zeply
            </span>
          </div>

          <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: '#94a3b8', marginBottom: '20px' }}>
            La plataforma líder de comercio electrónico y catálogos interactivos para vender más por WhatsApp en Colombia y Latinoamérica.
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#16243f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#cbd5e1',
              }}
            >
              <InstagramIcon size={18} />
            </a>
            <a
              href="https://wa.me/573000000000"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#16243f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#cbd5e1',
              }}
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        {/* Columna: Navegación & Producto */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px' }}>
            Soluciones
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
            <li><a href="#solucion">Tiendas Online WhatsApp</a></li>
            <li><a href="#solucion">Revista Digital Interactiva PDF</a></li>
            <li><a href="#comparativa">Por qué Zeply</a></li>
            <li><a href="#calculadora">Calculadora de ROI</a></li>
            <li><a href="#precios">Planes & Tarifas</a></li>
          </ul>
        </div>

        {/* Columna: Nichos Populares */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px' }}>
            Nichos de Negocio
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
            <li><a href="#tiendas">Ropa & Moda Streetwear</a></li>
            <li><a href="#tiendas">Joyería & Relojería</a></li>
            <li><a href="#tiendas">Celulares & Tecnología</a></li>
            <li><a href="#tiendas">Perfumería Original</a></li>
            <li><a href="#tiendas">Calzado & Sneakers</a></li>
          </ul>
        </div>

        {/* Columna: Accesos Rápidos */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px' }}>
            Clientes & Cuenta
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
            <li><Link to="/portal/login" style={{ color: '#38bdf8', fontWeight: 600 }}>→ Acceso a mi Tienda (Portal)</Link></li>
            <li><Link to="/registro" style={{ color: '#2dd4bf', fontWeight: 600 }}>→ Crear Tienda Gratis (7 Días)</Link></li>
            <li><Link to="/rey-admin">Panel de Administración Maestro</Link></li>
            <li><a href="#faq">Preguntas Frecuentes</a></li>
          </ul>
        </div>
      </div>

      {/* Barra Inferior de Copyright */}
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          paddingTop: '24px',
          borderTop: '1px solid #1e293b',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.8rem',
        }}
      >
        <div>
          © {new Date().getFullYear()} Zeply Technologies Inc. Todos los derechos reservados.
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>Términos del Servicio</span>
          <span>Política de Privacidad</span>
          <span>Seguridad SSL 256-bit</span>
        </div>
      </div>
    </footer>
  );
}
