import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Store, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  MessageCircle, 
  Globe, 
  Palette, 
  User, 
  Lock, 
  Mail, 
  Check, 
  Building2,
  Tag
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const NICHES = [
  { id: 'ropa', label: 'Ropa & Moda', color: '#0ea5e9' },
  { id: 'celulares', label: 'Celulares & Tecnología', color: '#0d9488' },
  { id: 'joyeria', label: 'Joyería & Relojes', color: '#f59e0b' },
  { id: 'perfumeria', label: 'Perfumería & Fragancias', color: '#8b5cf6' },
  { id: 'calzado', label: 'Calzado & Sneakers', color: '#06b6d4' },
  { id: 'belleza', label: 'Belleza & Cosméticos', color: '#ec4899' },
  { id: 'hogar', label: 'Hogar & Decoración', color: '#6366f1' },
  { id: 'accesorios', label: 'Accesorios & Bolsos', color: '#10b981' },
];

const COLOR_PRESETS = [
  { name: 'Azul Menta Zeply', hex: '#0ea5e9', secondary: '#14b8a6' },
  { name: 'Turquesa Caribe', hex: '#06b6d4', secondary: '#0d9488' },
  { name: 'Esmeralda Vital', hex: '#10b981', secondary: '#059669' },
  { name: 'Azul Zafiro Real', hex: '#0284c7', secondary: '#0369a1' },
  { name: 'Navy Minimalista', hex: '#0f172a', secondary: '#334155' },
  { name: 'Dorado & Ámbar', hex: '#d97706', secondary: '#b45309' },
  { name: 'Púrpura Exclusivo', hex: '#7c3aed', secondary: '#6d28d9' },
];

export default function ClientRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planParam = searchParams.get('plan') || 'STARTER';

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    storeName: '',
    slug: '',
    niche: 'ropa',
    country: 'Colombia',
    countryCode: '+57',
    whatsapp: '',
    primaryColor: '#0ea5e9',
    currency: 'COP',
    currencySymbol: '$',
    ownerName: '',
    email: '',
    password: '',
    plan: planParam,
  });

  // Generación automática de slug a partir del nombre
  const handleStoreNameChange = (e) => {
    const name = e.target.value;
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData((prev) => ({
      ...prev,
      storeName: name,
      slug: generatedSlug,
    }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (step === 1) {
      if (!formData.storeName.trim()) {
        setErrorMsg('Por favor ingresa el nombre de tu tienda.');
        return;
      }
      if (!formData.slug.trim()) {
        setErrorMsg('Por favor define el subdominio de tu tienda.');
        return;
      }
      if (!formData.whatsapp.trim()) {
        setErrorMsg('Ingresa tu número de WhatsApp para recibir los pedidos.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.ownerName.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Ingresa un correo electrónico válido.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      // 1. Crear o registrar en base de datos Supabase
      const newTenant = {
        name: formData.storeName,
        slug: formData.slug,
        niche: formData.niche,
        country: formData.country,
        country_code: formData.countryCode,
        whatsapp: formData.whatsapp,
        currency: formData.currency,
        currency_symbol: formData.currencySymbol,
        primary_color: formData.primaryColor,
        status: 'ACTIVE',
        plan: formData.plan,
        catalog_title: `Catálogo Oficial • ${formData.storeName}`,
        catalog_description: 'Encuentra las mejores ofertas y haz tu pedido directo por WhatsApp.',
      };

      let tenantId = `tenant-${Date.now()}`;

      try {
        const { data: dbData, error: dbError } = await supabase
          .from('tenants')
          .insert([newTenant])
          .select()
          .single();

        if (dbData && !dbError) {
          tenantId = dbData.id;
        }
      } catch (err) {
        console.warn('Registro local de fallback activado:', err);
      }

      // 2. Guardar sesión del cliente
      const clientSession = {
        id: tenantId,
        ...newTenant,
        ownerName: formData.ownerName,
        email: formData.email,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('zeply_client_session', JSON.stringify(clientSession));

      // 3. Crear productos demo de bienvenida en el catálogo del cliente
      const defaultProducts = [
        {
          id: `p-${Date.now()}-1`,
          tenant_id: tenantId,
          name: 'Producto Destacado de Temporada',
          price: 189000,
          compare_at_price: 240000,
          stock: 25,
          sku: 'ZP-01',
          category: 'Destacados',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
          variations: ['Estándar'],
          is_active: true,
        },
        {
          id: `p-${Date.now()}-2`,
          tenant_id: tenantId,
          name: 'Edición Limitada Colección',
          price: 295000,
          compare_at_price: 360000,
          stock: 12,
          sku: 'ZP-02',
          category: 'Premium',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
          variations: ['Negro', 'Plata'],
          is_active: true,
        },
        {
          id: `p-${Date.now()}-3`,
          tenant_id: tenantId,
          name: 'Básico Más Vendido',
          price: 95000,
          compare_at_price: 120000,
          stock: 40,
          sku: 'ZP-03',
          category: 'Básicos',
          image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
          variations: ['Única'],
          is_active: true,
        },
      ];

      localStorage.setItem(`zeply_store_products_${formData.slug}`, JSON.stringify(defaultProducts));

      // Confetti de celebración
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0ea5e9', '#14b8a6', '#2dd4bf', '#38bdf8', '#ffffff'],
      });

      // Redirigir al Dashboard del Cliente
      setTimeout(() => {
        navigate('/portal/dashboard');
      }, 1000);
    } catch (err) {
      setErrorMsg('Ocurrió un error al crear la tienda. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(45, 212, 191, 0.15) 0%, #fafcfd 75%)',
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Header Superior */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(20, 184, 166, 0.35)',
            }}
          >
            <Store size={22} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.6rem',
              fontWeight: 800,
              color: '#0b1528',
            }}
          >
            Zeply
          </span>
        </Link>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 3.5vw, 2.3rem)',
            fontWeight: 800,
            color: '#0b1528',
            letterSpacing: '-0.02em',
          }}
        >
          Crea tu Tienda Online Inteligente
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#64748b', marginTop: '6px' }}>
          Prueba gratuita de 14 días • Sin tarjeta de crédito • Lista en 3 minutos
        </p>
      </div>

      {/* Tarjeta Principal del Wizard */}
      <div
        style={{
          width: '100%',
          maxWidth: '620px',
          backgroundColor: '#ffffff',
          borderRadius: '28px',
          padding: '36px',
          boxShadow: '0 20px 50px -10px rgba(15, 23, 42, 0.08), 0 0 0 1px #e2e8f0',
          position: 'relative',
        }}
      >
        {/* Barra de Pasos Visual */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '10%',
              right: '10%',
              height: '2px',
              backgroundColor: '#e2e8f0',
              zIndex: 1,
              transform: 'translateY(-50%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '10%',
              width: step === 1 ? '0%' : step === 2 ? '40%' : '80%',
              height: '2px',
              backgroundColor: '#14b8a6',
              zIndex: 1,
              transform: 'translateY(-50%)',
              transition: 'width 0.3s ease',
            }}
          />

          {[
            { num: 1, label: 'Tu Tienda' },
            { num: 2, label: 'Identidad' },
            { num: 3, label: 'Tu Cuenta' },
          ].map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;

            return (
              <div
                key={s.num}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: isCompleted || isCurrent ? '#0d9488' : '#ffffff',
                    border: isCompleted || isCurrent ? '2px solid #0d9488' : '2px solid #cbd5e1',
                    color: isCompleted || isCurrent ? '#ffffff' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isCompleted ? <Check size={18} strokeWidth={3} /> : s.num}
                </div>
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: isCurrent ? '#0d9488' : '#64748b',
                    marginTop: '6px',
                  }}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Mensaje de Error si hay */}
        {errorMsg && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '0.86rem',
              fontWeight: 600,
              marginBottom: '20px',
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* ============================================================== */}
        {/* PASO 1: DATOS DE LA TIENDA & WHATSAPP                           */}
        {/* ============================================================== */}
        {step === 1 && (
          <form onSubmit={handleNextStep}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Nombre Comercial de tu Tienda o Marca *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Aura Joyería, Urban Trends, Moda Medellín..."
                  value={formData.storeName}
                  onChange={handleStoreNameChange}
                  required
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Enlace Web / Subdominio de tu Tienda *
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#f8fafc',
                  }}
                >
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="mitienda"
                    required
                    style={{
                      flex: 1,
                      padding: '13px 16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      outline: 'none',
                    }}
                  />
                  <span style={{ padding: '0 16px', fontSize: '0.9rem', color: '#64748b', fontWeight: 700, borderLeft: '1px solid #e2e8f0' }}>
                    .zeply.co
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                  Tus clientes entrarán a este link para ver tu catálogo.
                </div>
              </div>

              {/* Nicho de Mercado */}
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  Nicho de Negocio *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {NICHES.map((n) => {
                    const isSelected = formData.niche === n.id;
                    return (
                      <div
                        key={n.id}
                        onClick={() => setFormData({ ...formData, niche: n.id })}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          border: isSelected ? `2px solid ${n.color}` : '1px solid #e2e8f0',
                          backgroundColor: isSelected ? '#f0fdfa' : '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: isSelected ? '#0b1528' : '#475569',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: n.color }} />
                        <span>{n.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* WhatsApp Oficial */}
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Número de WhatsApp Oficial para Recibir Pedidos *
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    style={{
                      padding: '13px 12px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      backgroundColor: '#f8fafc',
                    }}
                  >
                    <option value="+57">🇨🇴 +57 (Colombia)</option>
                    <option value="+52">🇲🇽 +52 (México)</option>
                    <option value="+1">🇺🇸 +1 (USA / PR)</option>
                    <option value="+51">🇵🇪 +51 (Perú)</option>
                    <option value="+56">🇨🇱 +56 (Chile)</option>
                    <option value="+507">🇵🇦 +507 (Panamá)</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="Ej: 312 456 7890"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    required
                    style={{
                      flex: 1,
                      padding: '13px 16px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                  Aquí te llegarán los pedidos con los datos y total del cliente.
                </div>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '10px',
                  padding: '15px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(20, 184, 166, 0.4)',
                }}
              >
                <span>Continuar a Identidad de Marca</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        )}

        {/* ============================================================== */}
        {/* PASO 2: IDENTIDAD, COLOR DE MARCA & MONEDA                      */}
        {/* ============================================================== */}
        {step === 2 && (
          <form onSubmit={handleNextStep}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  Elige la Paleta de Color de tu Tienda
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {COLOR_PRESETS.map((preset) => {
                    const isSelected = formData.primaryColor === preset.hex;
                    return (
                      <div
                        key={preset.hex}
                        onClick={() => setFormData({ ...formData, primaryColor: preset.hex })}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid #0d9488' : '1px solid #e2e8f0',
                          backgroundColor: isSelected ? '#f0fdfa' : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: preset.hex,
                              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                            }}
                          />
                          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>
                            {preset.name}
                          </span>
                        </div>
                        {isSelected && <Check size={18} color="#0d9488" strokeWidth={3} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Moneda Principal */}
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Moneda Oficial de Precios
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => {
                    const curr = e.target.value;
                    setFormData({
                      ...formData,
                      currency: curr,
                      currencySymbol: curr === 'USD' ? '$' : curr === 'COP' ? '$' : '$',
                    });
                  }}
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    backgroundColor: '#ffffff',
                  }}
                >
                  <option value="COP">COP ($ Pesos Colombianos)</option>
                  <option value="USD">USD ($ Dólares Americanos)</option>
                  <option value="MXN">MXN ($ Pesos Mexicanos)</option>
                </select>
              </div>

              {/* Botones Volver / Avanzar */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor: '#f1f5f9',
                    color: '#334155',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Atrás</span>
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <span>Siguiente: Datos de Acceso</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ============================================================== */}
        {/* PASO 3: CUENTA DE ADMINISTRADOR & CONTRASEÑA                    */}
        {/* ============================================================== */}
        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Tu Nombre y Apellidos *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="#94a3b8" style={{ position: 'absolute', top: '15px', left: '14px' }} />
                  <input
                    type="text"
                    placeholder="Ej: Carolina Sánchez"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '13px 16px 13px 42px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Correo Electrónico (Para Administrar tu Tienda) *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="#94a3b8" style={{ position: 'absolute', top: '15px', left: '14px' }} />
                  <input
                    type="email"
                    placeholder="ejemplo@mitienda.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '13px 16px 13px 42px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Contraseña de Administrador (Mínimo 6 dígitos) *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#94a3b8" style={{ position: 'absolute', top: '15px', left: '14px' }} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                    style={{
                      width: '100%',
                      padding: '13px 16px 13px 42px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Resumen de Plan */}
              <div
                style={{
                  backgroundColor: '#f0fdfa',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  border: '1px solid #ccfbf1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0d9488' }}>
                    PLAN SELECCIONADO: {formData.plan}
                  </div>
                  <div style={{ fontSize: '0.86rem', color: '#0f766e', fontWeight: 600 }}>
                    14 Días de Prueba 100% Gratis
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: '999px',
                  }}
                >
                  $0 HOY
                </span>
              </div>

              {/* Botones Finales */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor: '#f1f5f9',
                    color: '#334155',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                  }}
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 2,
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(20, 184, 166, 0.4)',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? (
                    <span>Creando tu tienda...</span>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>¡Lanzar Mi Tienda Zeply!</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Enlace para clientes con tienda existente */}
      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: '#64748b' }}>
        ¿Ya tienes una tienda creada?{' '}
        <Link to="/portal/login" style={{ color: '#0284c7', fontWeight: 700, textDecoration: 'underline' }}>
          Iniciar Sesión en mi Portal
        </Link>
      </div>
    </div>
  );
}
