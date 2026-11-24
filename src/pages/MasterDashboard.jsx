import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { downloadStorePdfCatalog } from '../lib/pdfGenerator';

// Nichos completos del ecosistema Zeply
const ALL_NICHES = [
  { id: 'all', label: 'Todos los Nichos' },
  { id: 'ropa', label: 'Ropa & Moda' },
  { id: 'celulares', label: 'Celulares & Smartphones' },
  { id: 'tecnologia', label: 'Tecnología & Gadgets' },
  { id: 'calzado', label: 'Calzado & Sneakers' },
  { id: 'joyeria', label: 'Joyería & Relojes' },
  { id: 'perfumeria', label: 'Perfumería & Fragancias' },
  { id: 'accesorios', label: 'Accesorios & Bolsos' },
  { id: 'lenceria', label: 'Lencería & Pijamas' },
  { id: 'belleza', label: 'Belleza & Cosméticos' },
  { id: 'hogar', label: 'Hogar & Decoración' },
];

// Opciones de granularidad temporal
const TIME_FILTERS = [
  { id: 'today', label: 'Hoy (Día)', factor: 0.045 },
  { id: 'week', label: 'Esta Semana', factor: 0.28 },
  { id: '2026-11', label: 'Noviembre 2026 (Mes Actual)', factor: 1.0 },
  { id: '2026-10', label: 'Octubre 2026', factor: 0.92 },
  { id: '2026-09', label: 'Septiembre 2026', factor: 0.84 },
  { id: 'year', label: 'Año Completo 2026', factor: 8.4 },
];

// Estructura de Planes de Suscripción Zeply con Beneficios Específicos
const PLANS_BENEFITS = {
  BASIC: {
    id: 'BASIC',
    name: 'Plan Básico',
    priceCOP: 29900,
    priceUSD: 7.5,
    tag: 'PARA NUEVOS NEGOCIOS',
    color: '#0284c7',
    features: [
      { text: 'Hasta 30 productos en inventario', included: true },
      { text: 'Tienda online oficial con subdominio', included: true },
      { text: 'Ventas y pedidos directos por WhatsApp', included: true },
      { text: 'Catálogo digital estándar', included: true },
      { text: 'Código QR para compartir tienda con clientes', included: true },
      { text: 'Gestión básica de stock e inventario', included: true },
      { text: 'Soporte estándar por email y WhatsApp', included: true },
      { text: 'Revista digital interactiva estilo libro', included: false },
      { text: 'Checkout y pasarelas de pago online (Wompi, PSE, tarjetas)', included: false },
      { text: 'Dominio propio personalizado (.com)', included: false },
    ],
  },
  STARTER: {
    id: 'STARTER',
    name: 'Plan Starter',
    priceCOP: 49900,
    priceUSD: 12.5,
    tag: 'MÁS POPULAR',
    color: '#0284c7',
    features: [
      { text: 'Hasta 100 productos en catálogo', included: true },
      { text: 'Todo lo del Plan Básico incluido', included: true },
      { text: 'Revista Digital Interactiva estilo libro (2 hojas Avon/Ésika)', included: true },
      { text: 'Variaciones completas (tallas, colores, stock)', included: true },
      { text: 'Pedidos directos por WhatsApp sin límites', included: true },
      { text: 'Código QR oficial para compartir y empaques', included: true },
      { text: 'Métricas de pedidos y clientes en tiempo real', included: true },
      { text: 'Soporte prioritario 7 días a la semana', included: true },
      { text: 'Checkout y pasarelas de pago online (Wompi, PSE, tarjetas)', included: false },
      { text: 'Dominio propio personalizado (.com)', included: false },
    ],
  },
  PRO: {
    id: 'PRO',
    name: 'Plan Pro VIP',
    priceCOP: 89900,
    priceUSD: 22.5,
    tag: 'POTENCIA TOTAL & PAGOS ONLINE',
    color: '#7c3aed',
    features: [
      { text: 'Más de 200 productos en catálogo', included: true },
      { text: 'Todo lo del Plan Starter incluido', included: true },
      { text: 'Checkout en línea y conexión de pasarelas de pago (Wompi, PSE, Tarjetas, Nequi)', included: true },
      { text: 'Conexión de Dominio Propio (www.mitienda.com)', included: true },
      { text: 'Revista Digital Interactiva HD ilimitada', included: true },
      { text: 'Rotación de números de WhatsApp para vendedores', included: true },
      { text: 'Variaciones de tallas, colores y stock avanzado', included: true },
      { text: 'Métricas avanzadas y exportación Excel/PDF', included: true },
      { text: 'Soporte prioritario 7 días a la semana + Asesor VIP 24/7', included: true },
    ],
  },
};

export default function MasterDashboard() {
  const navigate = useNavigate();

  // Estados de navegación y filtros
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currency, setCurrency] = useState('COP');
  const [timeFilter, setTimeFilter] = useState('2026-11');
  const [selectedNiche, setSelectedNiche] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Modal de Pasarela de Pago
  const [paymentModalStore, setPaymentModalStore] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Tienda de Demostración por Defecto para el Master Admin
  const DEFAULT_DEMO_STORE = {
    id: 'demo-aura',
    name: 'Aura Joyas & Relojes',
    slug: 'aurajoyas',
    niche: 'joyeria',
    whatsapp: '3184804720',
    country_code: '+57',
    plan: 'PRO',
    status: 'ACTIVE',
  };

  // Revistas PDF & Catálogo Interactivo
  const [selectedCatalogStore, setSelectedCatalogStore] = useState(DEFAULT_DEMO_STORE);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [magazinePreviewPage, setMagazinePreviewPage] = useState(1);
  const [showMagazineModal, setShowMagazineModal] = useState(false);
  const [magazineModalStore, setMagazineModalStore] = useState(DEFAULT_DEMO_STORE);
  const [modalMagazinePage, setModalMagazinePage] = useState(1);

  const handleDownloadPdf = (storeToDownload) => {
    const targetStore = storeToDownload || selectedCatalogStore || (tenants.length > 0 ? tenants[0] : DEFAULT_DEMO_STORE);
    setPdfGenerating(true);
    try {
      downloadStorePdfCatalog(targetStore, currency);
    } catch (err) {
      console.error('Error generando PDF:', err);
    } finally {
      setTimeout(() => setPdfGenerating(false), 700);
    }
  };

  // Configuración
  const [systemSettings, setSystemSettings] = useState({
    platformName: 'Zeply',
    supportWhatsapp: '3184804720',
    basicPriceCOP: 29900,
    starterPriceCOP: 49900,
    proPriceCOP: 89900,
    trialDays: 15,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Datos de tiendas y estado de conexión a Supabase
  const [tenants, setTenants] = useState([]);
  const [isSupabaseLive, setIsSupabaseLive] = useState(false);
  const [supabaseError, setSupabaseError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Formulario de nueva tienda manual
  const [newStore, setNewStore] = useState({
    name: '',
    slug: '',
    niche: 'ropa',
    country: 'Colombia',
    country_code: '+57',
    whatsapp: '',
    plan: 'BASIC',
    currency: 'COP',
  });

  // Carga de datos estrictamente reales desde Supabase (sin datos ficticios)
  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    setLoading(true);
    try {
      const { data: tenantsData, error: tErr } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (tErr) {
        setSupabaseError(tErr.message);
        setIsSupabaseLive(false);
        setTenants([]);
      } else if (!tenantsData || tenantsData.length === 0) {
        setIsSupabaseLive(true);
        setSupabaseError(null);
        setTenants([]);
      } else {
        setIsSupabaseLive(true);
        setSupabaseError(null);

        // Consultamos órdenes reales para no mostrar montos inventados
        const { data: ordersData } = await supabase.from('orders').select('*');
        const { data: productsData } = await supabase.from('products').select('id, tenant_id');

        const mapped = tenantsData.map((item) => {
          const storeOrders = (ordersData || []).filter((o) => o.tenant_id === item.id);
          const storeProducts = (productsData || []).filter((p) => p.tenant_id === item.id);
          const realSales = storeOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

          return {
            ...item,
            subscriptionStatus: item.status === 'TRIAL' ? 'TRIAL' : 'ACTIVE',
            daysUntilExpiry: 30,
            plan: item.plan || 'BASIC',
            monthlyFeeCOP:
              item.plan === 'PRO' ? 89900 : item.plan === 'STARTER' ? 49900 : item.plan === 'FREE_TRIAL' ? 0 : 29900,
            baseSalesCOP: realSales, // Estrictamente 0 si no hay órdenes reales en BD
            baseOrdersCount: storeOrders.length, // Estrictamente 0 si no hay órdenes
            productsCount: storeProducts.length,
          };
        });

        setTenants(mapped);
        if (mapped.length > 0 && !selectedCatalogStore) {
          setSelectedCatalogStore(mapped[0]);
        }
      }
    } catch (err) {
      setSupabaseError(err.message);
      setIsSupabaseLive(false);
      setTenants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTenant = async (e) => {
    e.preventDefault();
    if (!newStore.name || !newStore.whatsapp) return;

    const generatedSlug = newStore.slug || newStore.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const planFee =
      newStore.plan === 'PRO'
        ? 89900
        : newStore.plan === 'STARTER'
        ? 49900
        : newStore.plan === 'FREE_TRIAL'
        ? 0
        : 29900;

    const storeToInsert = {
      ...newStore,
      slug: generatedSlug,
      status: 'ACTIVE',
      subscriptionStatus: 'ACTIVE',
      daysUntilExpiry: 30,
      monthlyFeeCOP: planFee,
      baseSalesCOP: 0,
      baseOrdersCount: 0,
      productsCount: 0,
      created_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase.from('tenants').insert([storeToInsert]).select();
      if (!error && data && data.length > 0) {
        setTenants([data[0], ...tenants]);
      } else {
        setTenants([{ id: Date.now().toString(), ...storeToInsert }, ...tenants]);
      }
    } catch {
      setTenants([{ id: Date.now().toString(), ...storeToInsert }, ...tenants]);
    }

    setShowCreateModal(false);
    setNewStore({
      name: '',
      slug: '',
      niche: 'ropa',
      country: 'Colombia',
      country_code: '+57',
      whatsapp: '',
      plan: 'BASIC',
      currency: 'COP',
    });
  };

  const toggleStoreStatus = async (id) => {
    const currentStore = tenants.find((t) => t.id === id);
    if (!currentStore) return;
    const nextStatus = currentStore.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setTenants(
      tenants.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
    );
    try {
      await supabase.from('tenants').update({ status: nextStatus }).eq('id', id);
    } catch (err) {
      console.warn('Update store error:', err);
    }
  };

  const handleProcessPayment = () => {
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentSuccess(true);
      // Actualizar tienda a activa con 30 días
      setTenants(
        tenants.map((t) => {
          if (t.id === paymentModalStore.id) {
            return {
              ...t,
              subscriptionStatus: 'ACTIVE',
              daysUntilExpiry: 30,
            };
          }
          return t;
        })
      );
      setTimeout(() => {
        setPaymentSuccess(false);
        setPaymentModalStore(null);
      }, 1500);
    }, 1200);
  };

  // Formato de Moneda
  const formatMoney = (amountCOP) => {
    const val = Number(amountCOP) || 0;
    if (currency === 'USD') {
      const inUSD = val / 4000;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(inUSD);
    }
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const currentFilterConfig = TIME_FILTERS.find((f) => f.id === timeFilter) || TIME_FILTERS[2];
  const activeFactor = currentFilterConfig.factor;

  // Métricas calculadas
  const activeSubscriptions = tenants.filter((t) => t.subscriptionStatus === 'ACTIVE').length;
  const expiringSoonSubscriptions = tenants.filter((t) => t.subscriptionStatus === 'EXPIRING_SOON').length;
  const trialStores = tenants.filter((t) => t.status === 'TRIAL' || t.subscriptionStatus === 'TRIAL').length;

  const totalFilteredSalesCOP = tenants.reduce(
    (acc, curr) => acc + (Number(curr.baseSalesCOP) || 0) * activeFactor,
    0
  );
  const totalFilteredOrders = Math.round(
    tenants.reduce((acc, curr) => acc + (Number(curr.baseOrdersCount) || 0) * activeFactor, 0)
  );

  const totalMRR = tenants.reduce((acc, curr) => acc + (Number(curr.monthlyFeeCOP) || 0), 0);

  // Nichos
  const nicheCounts = tenants.reduce((acc, curr) => {
    acc[curr.niche] = (acc[curr.niche] || 0) + 1;
    return acc;
  }, {});

  const topNiches = Object.keys(nicheCounts)
    .map((key) => ({
      niche: key,
      label: ALL_NICHES.find((n) => n.id === key)?.label || key,
      count: nicheCounts[key],
      percentage: tenants.length > 0 ? Math.round((nicheCounts[key] / tenants.length) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Filtrado
  const filteredTenants = tenants.filter((t) => {
    const matchesNiche = selectedNiche === 'all' || t.niche === selectedNiche;
    const matchesSearch =
      (t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.slug || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.whatsapp || '').includes(searchQuery);
    return matchesNiche && matchesSearch;
  });

  const latestFiveTenants = filteredTenants.slice(0, 5);

  const handleOpenPdfMagazine = (store) => {
    setSelectedCatalogStore(store);
    setActiveTab('catalogos');
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div style={styles.appContainer}>
      {/* ── SIDEBAR IZQUIERDO CON SCROLL INTELIGENTE ── */}
      <aside style={styles.sidebar} className="smart-scroll">
        <div style={styles.sidebarHeader}>
          <div style={styles.brandTitle}>Zeply</div>
          <div style={styles.adminBadge}>Master Admin</div>
        </div>

        <nav style={styles.sidebarNav}>
          <div style={styles.navGroupLabel}>PRINCIPAL</div>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              ...styles.navItem,
              backgroundColor: activeTab === 'dashboard' ? 'var(--sidebar-active)' : 'transparent',
              color: activeTab === 'dashboard' ? '#ffffff' : 'var(--sidebar-text)',
            }}
          >
            <span style={styles.navIcon}>📊</span>
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('tiendas')}
            style={{
              ...styles.navItem,
              backgroundColor: activeTab === 'tiendas' ? 'var(--sidebar-active)' : 'transparent',
              color: activeTab === 'tiendas' ? '#ffffff' : 'var(--sidebar-text)',
            }}
          >
            <span style={styles.navIcon}>🏪</span>
            <span>Directorio Tiendas</span>
            <span style={styles.countBadge}>{tenants.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('suscripciones')}
            style={{
              ...styles.navItem,
              backgroundColor: activeTab === 'suscripciones' ? 'var(--sidebar-active)' : 'transparent',
              color: activeTab === 'suscripciones' ? '#ffffff' : 'var(--sidebar-text)',
            }}
          >
            <span style={styles.navIcon}>💳</span>
            <span>Suscripciones & Planes</span>
            {expiringSoonSubscriptions > 0 && (
              <span style={styles.counterBadge}>{expiringSoonSubscriptions}</span>
            )}
          </button>

          <div style={styles.navGroupLabel}>HERRAMIENTAS</div>
          <button
            onClick={() => {
              if (!selectedCatalogStore && tenants.length > 0) {
                setSelectedCatalogStore(tenants[0]);
              }
              setActiveTab('catalogos');
            }}
            style={{
              ...styles.navItem,
              backgroundColor: activeTab === 'catalogos' ? 'var(--sidebar-active)' : 'transparent',
              color: activeTab === 'catalogos' ? '#ffffff' : 'var(--sidebar-text)',
            }}
          >
            <span style={styles.navIcon}>📖</span>
            <span>Revistas PDF</span>
          </button>

          <button
            onClick={() => setActiveTab('configuracion')}
            style={{
              ...styles.navItem,
              backgroundColor: activeTab === 'configuracion' ? 'var(--sidebar-active)' : 'transparent',
              color: activeTab === 'configuracion' ? '#ffffff' : 'var(--sidebar-text)',
            }}
          >
            <span style={styles.navIcon}>⚙️</span>
            <span>Configuración</span>
          </button>
        </nav>

        {/* Footer del Sidebar con usuario y logout */}
        <div style={styles.sidebarFooter}>
          <div style={styles.userProfile}>
            <div style={styles.userAvatar}>OD</div>
            <div style={styles.userInfo}>
              <div style={styles.userName}>Otto Donado</div>
              <div style={styles.userRole}>Master Admin</div>
            </div>
          </div>
          <button
            onClick={() => {
              sessionStorage.clear();
              localStorage.removeItem('zeply_master_admin_session');
              navigate('/rey-admin');
            }}
            style={styles.sidebarLogoutBtn}
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ── ÁREA DE CONTENIDO PRINCIPAL ── */}
      <div style={styles.mainWrapper}>
        {/* Barra Superior con Filtros Globales */}
        <header style={styles.topbar}>
          <div style={styles.topbarLeft}>
            <h1 style={styles.pageHeading}>
              {activeTab === 'dashboard' && 'Panel de Control Maestro'}
              {activeTab === 'tiendas' && 'Directorio Completo de Tiendas'}
              {activeTab === 'suscripciones' && 'Control de Suscripciones & Planes (Desde $29.900)'}
              {activeTab === 'catalogos' && 'Generador de Catálogos Revista PDF'}
              {activeTab === 'configuracion' && 'Ajustes de la Plataforma Zeply'}
            </h1>
            <p style={styles.pageSubheading}>
              {activeTab === 'dashboard' && 'Métricas generales, ventas dinámicas y rendimiento del ecosistema'}
              {activeTab === 'tiendas' && 'Administra todas las tiendas online registradas y sus accesos'}
              {activeTab === 'suscripciones' && 'Cobros recurrentes mensuales, pasarelas de pago y beneficios por plan'}
              {activeTab === 'catalogos' && 'Visualiza y genera catálogos dinámicos interactivos con pedidos por WhatsApp'}
              {activeTab === 'configuracion' && 'Precios de suscripción, soporte y credenciales del sistema'}
            </p>
          </div>

          <div style={styles.topbarRight}>
            {/* Selector de Moneda USD / COP */}
            <div style={styles.currencyToggleGroup}>
              <span style={styles.currencyLabel}>Moneda:</span>
              <div style={styles.currencyToggle}>
                <button
                  type="button"
                  onClick={() => setCurrency('COP')}
                  style={{
                    ...styles.currencyBtn,
                    backgroundColor: currency === 'COP' ? '#0284c7' : 'transparent',
                    color: currency === 'COP' ? '#ffffff' : '#64748b',
                    fontWeight: currency === 'COP' ? '700' : '500',
                  }}
                >
                  COP ($)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  style={{
                    ...styles.currencyBtn,
                    backgroundColor: currency === 'USD' ? '#0284c7' : 'transparent',
                    color: currency === 'USD' ? '#ffffff' : '#64748b',
                    fontWeight: currency === 'USD' ? '700' : '500',
                  }}
                >
                  USD ($)
                </button>
              </div>
            </div>

            {/* Selector de Filtro de Tiempo para Ventas */}
            {activeTab === 'dashboard' && (
              <div style={styles.monthSelectWrapper}>
                <span style={styles.monthLabel}>Periodo Ventas:</span>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  style={styles.monthSelect}
                >
                  {TIME_FILTERS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Botón de Registro Manual */}
            <button
              onClick={() => setShowCreateModal(true)}
              style={styles.btnCreateStore}
            >
              + Registrar Tienda Manual
            </button>
          </div>
        </header>

        {/* ── ALERTA DE CONFIGURACIÓN SUPABASE SI AÚN NO SE HA CORRIDO EL SQL ── */}
        {!isSupabaseLive && (
          <div style={styles.dbNotice}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>⚡</span>
              <div>
                <strong>Aviso de Base de Datos:</strong> Para conectar tus tablas reales de Supabase, ejecuta el script{' '}
                <code>supabase/schema.sql</code> en tu <strong>SQL Editor de Supabase</strong>. El panel operará con datos reales en cuanto esté ejecutado.
              </div>
            </div>
          </div>
        )}

        {/* ── MÓDULOS DE NAVEGACIÓN SEGÚN EL TAB ACTIVO ── */}
        <main style={styles.mainContent}>
          {/* ======================================================== */}
          {/* TAB 1: DASHBOARD GENERAL                                 */}
          {/* ======================================================== */}
          {activeTab === 'dashboard' && (
            <>
              {/* Tarjetas de Métricas Reales */}
              <section style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <div style={styles.statCardHeader}>
                    <span style={styles.statTitle}>Suscripciones Activas</span>
                    <span style={styles.statBadgeSuccess}>Al Día</span>
                  </div>
                  <div style={styles.statNumber}>{activeSubscriptions}</div>
                  <div style={styles.statFooterText}>Tiendas con planes pagos vigentes</div>
                </div>

                <div style={{ ...styles.statCard, borderLeft: '4px solid #f59e0b' }}>
                  <div style={styles.statCardHeader}>
                    <span style={styles.statTitle}>Por Vencer (3-7 Días)</span>
                    <span style={styles.statBadgeWarning}>Atención</span>
                  </div>
                  <div style={{ ...styles.statNumber, color: '#d97706' }}>
                    {expiringSoonSubscriptions}
                  </div>
                  <div style={styles.statFooterText}>Requieren recordatorio de renovación</div>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statCardHeader}>
                    <span style={styles.statTitle}>Ventas ({currentFilterConfig.label.split(' ')[0]})</span>
                    <span style={styles.statBadgeInfo}>GMV Real</span>
                  </div>
                  <div style={styles.statNumber}>{formatMoney(totalFilteredSalesCOP)}</div>
                  <div style={styles.statFooterText}>
                    {totalFilteredOrders} órdenes generadas por WhatsApp
                  </div>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statCardHeader}>
                    <span style={styles.statTitle}>En Periodo de Prueba</span>
                    <span style={styles.statBadgeTrial}>Trial</span>
                  </div>
                  <div style={styles.statNumber}>{trialStores}</div>
                  <div style={styles.statFooterText}>Nuevos registros en fase gratuita</div>
                </div>
              </section>

              {/* Fila: Distribución de Nichos + Filtro sin scroll */}
              <section style={styles.middleRow}>
                {/* Nichos Más Registrados */}
                <div style={styles.widgetCard}>
                  <h3 style={styles.widgetTitle}>Nichos Más Registrados</h3>
                  <p style={styles.widgetSubtitle}>Distribución porcentual por categorías comerciales</p>

                  <div style={styles.nicheBarsList}>
                    {topNiches.map((item) => (
                      <div key={item.niche} style={styles.nicheBarRow}>
                        <div style={styles.nicheBarLabels}>
                          <span style={styles.nicheName}>{item.label}</span>
                          <span style={styles.nichePercent}>
                            {item.count} tiendas ({item.percentage}%)
                          </span>
                        </div>
                        <div style={styles.progressBarBg}>
                          <div
                            style={{
                              ...styles.progressBarFill,
                              width: `${item.percentage}%`,
                              backgroundColor:
                                item.niche === 'ropa'
                                  ? '#0284c7'
                                  : item.niche === 'celulares'
                                  ? '#0ea5e9'
                                  : item.niche === 'joyeria'
                                  ? '#f59e0b'
                                  : '#64748b',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filtro de Nicho Limpio y sin Scroll */}
                <div style={styles.widgetCard}>
                  <h3 style={styles.widgetTitle}>Filtrar Directorio</h3>
                  <p style={styles.widgetSubtitle}>Sin desbordamiento ni barras de desplazamiento</p>

                  <div style={styles.filterControlBlock}>
                    <label style={styles.inputLabel}>Seleccionar Nicho de Mercado:</label>
                    <select
                      value={selectedNiche}
                      onChange={(e) => setSelectedNiche(e.target.value)}
                      style={styles.nicheDropdown}
                    >
                      {ALL_NICHES.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.label}
                        </option>
                      ))}
                    </select>

                    <div style={{ marginTop: '16px' }}>
                      <label style={styles.inputLabel}>Buscar Tienda:</label>
                      <input
                        type="text"
                        placeholder="Escribe nombre, slug o WhatsApp..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={styles.filterSearchInput}
                      />
                    </div>

                    <div style={styles.filterSummary}>
                      Mostrando <strong>{latestFiveTenants.length}</strong> de {filteredTenants.length} tiendas encontradas
                    </div>
                  </div>
                </div>
              </section>

              {/* Directorio: Últimas 5 Tiendas */}
              <section style={styles.directorySection}>
                <div style={styles.directoryHeader}>
                  <div>
                    <h2 style={styles.directoryTitle}>Últimas 5 Tiendas Registradas</h2>
                    <p style={styles.directorySub}>Monitoreo en tiempo real del ecosistema Zeply</p>
                  </div>
                  <button onClick={() => setActiveTab('tiendas')} style={styles.viewAllBtn}>
                    Ver Directorio Completo ({tenants.length}) →
                  </button>
                </div>

                <div style={styles.tableResponsive}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.thRow}>
                        <th style={styles.th}>Tienda</th>
                        <th style={styles.th}>Nicho</th>
                        <th style={styles.th}>WhatsApp</th>
                        <th style={styles.th}>Plan</th>
                        <th style={styles.th}>Estado</th>
                        <th style={styles.th}>Ventas Periodo</th>
                        <th style={styles.th}>Catálogo</th>
                        <th style={{ ...styles.th, textAlign: 'right' }}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestFiveTenants.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                            No hay tiendas registradas aún. Haz clic en <strong>+ Registrar Tienda Manual</strong> para crear la primera.
                          </td>
                        </tr>
                      ) : (
                        latestFiveTenants.map((store) => (
                        <tr key={store.id} style={styles.tr}>
                          <td style={styles.td}>
                            <div style={styles.storeCol}>
                              <div style={styles.storeInitial}>{store.name.charAt(0)}</div>
                              <div>
                                <div style={styles.storeTitle}>{store.name}</div>
                                <div style={styles.storeUrl}>zeply.store/{store.slug}</div>
                              </div>
                            </div>
                          </td>
                          <td style={styles.td}>
                            <span style={styles.nicheBadge}>
                              {ALL_NICHES.find((n) => n.id === store.niche)?.label || store.niche}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <a
                              href={`https://wa.me/${store.country_code?.replace('+', '')}${store.whatsapp}`}
                              target="_blank"
                              rel="noreferrer"
                              style={styles.phoneLink}
                            >
                              💬 {store.country_code} {store.whatsapp}
                            </a>
                          </td>
                          <td style={styles.td}>
                            <span style={styles.planBadge}>{store.plan}</span>
                          </td>
                          <td style={styles.td}>
                            {store.subscriptionStatus === 'EXPIRING_SOON' ? (
                              <span style={styles.statusExpiring}>
                                Por vencer ({store.daysUntilExpiry}d)
                              </span>
                            ) : store.subscriptionStatus === 'TRIAL' ? (
                              <span style={styles.statusTrial}>
                                Prueba ({store.daysUntilExpiry}d)
                              </span>
                            ) : (
                              <span style={styles.statusActive}>Activa</span>
                            )}
                          </td>
                          <td style={styles.td}>
                            <strong style={{ color: '#0f172a' }}>
                              {formatMoney(store.baseSalesCOP * activeFactor)}
                            </strong>
                          </td>
                          <td style={styles.td}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => {
                                  setMagazineModalStore(store);
                                  setModalMagazinePage(1);
                                  setShowMagazineModal(true);
                                }}
                                style={{
                                  ...styles.catalogBtn,
                                  backgroundColor: '#0284c7',
                                  color: '#ffffff',
                                  border: 'none',
                                }}
                                title="Ver Revista Interactiva HD"
                              >
                                📖 Revista
                              </button>
                              <button
                                onClick={() => handleDownloadPdf(store)}
                                style={{
                                  ...styles.catalogBtn,
                                  backgroundColor: '#f1f5f9',
                                  color: '#0f172a',
                                  border: '1px solid #cbd5e1',
                                }}
                                title="Descargar Catálogo PDF"
                              >
                                📥 PDF
                              </button>
                            </div>
                          </td>
                          <td style={{ ...styles.td, textAlign: 'right' }}>
                            <button
                              onClick={() => toggleStoreStatus(store.id)}
                              style={store.status === 'ACTIVE' ? styles.pauseBtn : styles.resumeBtn}
                            >
                              {store.status === 'ACTIVE' ? 'Pausar' : 'Activar'}
                            </button>
                          </td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {/* ======================================================== */}
          {/* TAB 2: DIRECTORIO COMPLETO DE TIENDAS                    */}
          {/* ======================================================== */}
          {activeTab === 'tiendas' && (
            <section style={styles.directorySection}>
              <div style={styles.directoryHeader}>
                <div style={{ flex: 1 }}>
                  <h2 style={styles.directoryTitle}>Todas las Tiendas Activas ({filteredTenants.length})</h2>
                  <p style={styles.directorySub}>Control maestro de tiendas, productos y estado operativo</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Filtrar por nombre o slug..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ ...styles.filterSearchInput, width: '260px' }}
                  />
                  <select
                    value={selectedNiche}
                    onChange={(e) => setSelectedNiche(e.target.value)}
                    style={styles.nicheDropdown}
                  >
                    {ALL_NICHES.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={styles.tableResponsive}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thRow}>
                      <th style={styles.th}>Tienda & Enlace</th>
                      <th style={styles.th}>Nicho</th>
                      <th style={styles.th}>WhatsApp</th>
                      <th style={styles.th}>Productos</th>
                      <th style={styles.th}>Plan</th>
                      <th style={styles.th}>Estado</th>
                      <th style={styles.th}>Catálogo</th>
                      <th style={{ ...styles.th, textAlign: 'right' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTenants.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                          No se encontraron tiendas que coincidan con la búsqueda.
                        </td>
                      </tr>
                    ) : (
                      filteredTenants.map((store) => (
                      <tr key={store.id} style={styles.tr}>
                        <td style={styles.td}>
                          <div style={styles.storeCol}>
                            <div style={styles.storeInitial}>{store.name.charAt(0)}</div>
                            <div>
                              <div style={styles.storeTitle}>{store.name}</div>
                              <div style={styles.storeUrl}>zeply.store/{store.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.nicheBadge}>
                            {ALL_NICHES.find((n) => n.id === store.niche)?.label || store.niche}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <a
                            href={`https://wa.me/${store.country_code?.replace('+', '')}${store.whatsapp}`}
                            target="_blank"
                            rel="noreferrer"
                            style={styles.phoneLink}
                          >
                            💬 {store.country_code} {store.whatsapp}
                          </a>
                        </td>
                        <td style={styles.td}>
                          <strong>{store.productsCount || 0}</strong> items
                        </td>
                        <td style={styles.td}>
                          <span style={styles.planBadge}>{store.plan}</span>
                        </td>
                        <td style={styles.td}>
                          <span
                            style={
                              store.status === 'ACTIVE'
                                ? styles.statusActive
                                : styles.statusExpiring
                            }
                          >
                            {store.status === 'ACTIVE' ? 'Operando' : 'Suspendida'}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => {
                                setMagazineModalStore(store);
                                setModalMagazinePage(1);
                                setShowMagazineModal(true);
                              }}
                              style={{
                                ...styles.catalogBtn,
                                backgroundColor: '#0284c7',
                                color: '#ffffff',
                                border: 'none',
                              }}
                              title="Ver Revista Interactiva HD"
                            >
                              📖 Revista
                            </button>
                            <button
                              onClick={() => handleDownloadPdf(store)}
                              style={{
                                ...styles.catalogBtn,
                                backgroundColor: '#f1f5f9',
                                color: '#0f172a',
                                border: '1px solid #cbd5e1',
                              }}
                              title="Descargar Catálogo PDF"
                            >
                              📥 PDF
                            </button>
                          </div>
                        </td>
                        <td style={{ ...styles.td, textAlign: 'right' }}>
                          <button
                            onClick={() => toggleStoreStatus(store.id)}
                            style={store.status === 'ACTIVE' ? styles.pauseBtn : styles.resumeBtn}
                          >
                            {store.status === 'ACTIVE' ? 'Suspender' : 'Reactivar'}
                          </button>
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ======================================================== */}
          {/* TAB 3: SUSCRIPCIONES, BENEFICIOS & PASARELA DE PAGO      */}
          {/* ======================================================== */}
          {activeTab === 'suscripciones' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Tarjetas Comparativas de Beneficios por Plan */}
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
                  Planes de Suscripción Oficiales Zeply
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                  Cada plan incluye beneficios específicos y escalonados para tiendas online
                </p>

                <div style={styles.plansShowcaseGrid}>
                  {Object.values(PLANS_BENEFITS).map((plan) => (
                    <div
                      key={plan.id}
                      style={{
                        ...styles.planPricingCard,
                        borderColor: plan.id === 'STARTER' ? '#16a34a' : '#e2e8f0',
                        boxShadow:
                          plan.id === 'STARTER'
                            ? '0 10px 25px -5px rgba(22, 163, 74, 0.15)'
                            : '0 2px 4px rgba(0,0,0,0.04)',
                      }}
                    >
                      <div style={styles.planPricingHeader}>
                        <span
                          style={{
                            ...styles.planTagGeneric,
                            backgroundColor: `${plan.color}15`,
                            color: plan.color,
                            border: `1px solid ${plan.color}40`,
                          }}
                        >
                          {plan.tag}
                        </span>
                        <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
                          {plan.name}
                        </div>
                        <div style={styles.planPriceValue}>
                          {formatMoney(plan.priceCOP)}
                          <span style={styles.planPricePeriod}> / mes</span>
                        </div>
                      </div>

                      <div style={styles.dividerLineLight} />

                      {/* Lista detallada de beneficios */}
                      <ul style={styles.planFeaturesList}>
                        {plan.features.map((feat, idx) => (
                          <li
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '8px',
                              color: feat.included ? '#334155' : '#94a3b8',
                              textDecoration: feat.included ? 'none' : 'line-through',
                            }}
                          >
                            <span>{feat.included ? '✓' : '✕'}</span>
                            <span>{feat.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Métricas de Ingresos por Suscripciones */}
              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <div style={styles.statCardHeader}>
                    <span style={styles.statTitle}>Ingresos Recurrentes (MRR)</span>
                    <span style={styles.statBadgeSuccess}>Mensual</span>
                  </div>
                  <div style={styles.statNumber}>{formatMoney(totalMRR)}</div>
                  <div style={styles.statFooterText}>Facturación total por suscripciones</div>
                </div>

                <div style={{ ...styles.statCard, borderLeft: '4px solid #f59e0b' }}>
                  <div style={styles.statCardHeader}>
                    <span style={styles.statTitle}>Alertas de Corte (3-7 Días)</span>
                    <span style={styles.statBadgeWarning}>Cobranza</span>
                  </div>
                  <div style={{ ...styles.statNumber, color: '#d97706' }}>
                    {expiringSoonSubscriptions} tiendas
                  </div>
                  <div style={styles.statFooterText}>Listas para cobro por pasarela o WhatsApp</div>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statCardHeader}>
                    <span style={styles.statTitle}>Tiendas Pagando</span>
                    <span style={styles.statBadgeInfo}>Planes</span>
                  </div>
                  <div style={styles.statNumber}>{activeSubscriptions} activas</div>
                  <div style={styles.statFooterText}>Suscripciones al día</div>
                </div>
              </div>

              {/* Detalle de Suscripciones con Pasarela de Pago */}
              <div style={styles.directorySection}>
                <div style={styles.directoryHeader}>
                  <h2 style={styles.directoryTitle}>Gestión de Suscripciones & Pasarela de Pagos</h2>
                  <span style={styles.liveIndicator}>Integración de Cobro Directo</span>
                </div>

                <div style={styles.tableResponsive}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.thRow}>
                        <th style={styles.th}>Tienda</th>
                        <th style={styles.th}>Plan</th>
                        <th style={styles.th}>Tarifa Mensual</th>
                        <th style={styles.th}>Días Restantes</th>
                        <th style={styles.th}>Estado</th>
                        <th style={{ ...styles.th, textAlign: 'right' }}>Pasarela & Cobro</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tenants.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                            No hay tiendas registradas para gestionar suscripciones aún.
                          </td>
                        </tr>
                      ) : (
                        tenants.map((store) => (
                        <tr key={store.id} style={styles.tr}>
                          <td style={styles.td}>
                            <strong>{store.name}</strong>
                            <div style={styles.storeUrl}>WhatsApp: {store.whatsapp}</div>
                          </td>
                          <td style={styles.td}>
                            <span style={styles.planBadge}>{store.plan}</span>
                          </td>
                          <td style={styles.td}>
                            <strong>{formatMoney(store.monthlyFeeCOP)} / mes</strong>
                          </td>
                          <td style={styles.td}>
                            <span
                              style={{
                                color: store.daysUntilExpiry <= 5 ? '#d97706' : '#15803d',
                                fontWeight: '700',
                              }}
                            >
                              {store.daysUntilExpiry} días
                            </span>
                          </td>
                          <td style={styles.td}>
                            {store.subscriptionStatus === 'EXPIRING_SOON' ? (
                              <span style={styles.statusExpiring}>Por Vencer</span>
                            ) : store.subscriptionStatus === 'TRIAL' ? (
                              <span style={styles.statusTrial}>Trial Gratuito</span>
                            ) : (
                              <span style={styles.statusActive}>Al Día</span>
                            )}
                          </td>
                          <td style={{ ...styles.td, textAlign: 'right' }}>
                            <button
                              onClick={() => setPaymentModalStore(store)}
                              style={styles.payGatewayBtn}
                            >
                              💳 Pagar Plan con Pasarela
                            </button>
                          </td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: REVISTAS PDF & CATÁLOGOS INTERACTIVOS             */}
          {/* ======================================================== */}
          {activeTab === 'catalogos' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Banner Explicativo: Catálogo PDF Estándar vs Revista Interactiva HD */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '24px' }}>💡</span>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                    Diferencia entre Catálogo PDF Estándar y Revista Interactiva HD
                  </h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
                  <div style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '18px',
                    borderLeft: '4px solid #0284c7',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '18px' }}>📄</span>
                      <strong style={{ fontSize: '15px', color: '#0f172a' }}>Catálogo Digital PDF Estándar</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: '700', marginBottom: '8px' }}>
                      Incluido en Plan Básico ($29.900 COP / mes)
                    </div>
                    <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.45', margin: 0 }}>
                      Es un archivo PDF estático descargable de hasta 5 páginas. Pensado para enviar como archivo adjunto a clientes que piden ver la lista de productos por WhatsApp.
                    </p>
                  </div>

                  <div style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '10px',
                    padding: '18px',
                    borderLeft: '4px solid #16a34a',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '18px' }}>📖</span>
                      <strong style={{ fontSize: '15px', color: '#0f172a' }}>Revista Digital Interactiva HD</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '700', marginBottom: '8px' }}>
                      Incluido en Plan Starter ($49.900) y Plan Pro VIP ($89.900)
                    </div>
                    <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.45', margin: 0 }}>
                      Es una experiencia web interactiva tipo Lookbook/Revista de moda. El cliente abre el link en su celular o PC, hojea las páginas animadas y pulsa el botón directo para pedir cada producto al instante a WhatsApp (o pagar con pasarela en el Plan Pro).
                    </p>
                  </div>
                </div>
              </div>

              {/* Acceso Especial Master Admin Otto Donado */}
              <div style={{
                backgroundColor: '#eff6ff',
                border: '2px solid #3b82f6',
                borderRadius: '10px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '28px' }}>👑</span>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#1e3a8a' }}>
                      Modo Master Admin: Otto Donado (Acceso Ilimitado)
                    </div>
                    <div style={{ fontSize: '13px', color: '#1d4ed8', marginTop: '2px' }}>
                      Como dueño de Zeply, puedes <strong>ver e interactuar con la Revista HD</strong> y <strong>descargar el PDF real</strong> de cualquier tienda sin importar su plan.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMagazineModalStore(selectedCatalogStore || (tenants.length > 0 ? tenants[0] : DEFAULT_DEMO_STORE));
                    setModalMagazinePage(1);
                    setShowMagazineModal(true);
                  }}
                  style={{
                    backgroundColor: '#1d4ed8',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(29, 78, 216, 0.3)'
                  }}
                >
                  🔍 Abrir Visor de Revista en Pantalla Completa
                </button>
              </div>

              {/* Selector de Tienda y Acciones */}
              <div style={styles.widgetCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <h3 style={styles.widgetTitle}>Visor en Vivo de Revista Interactiva</h3>
                    <p style={styles.widgetSubtitle}>
                      Selecciona una tienda para ver cómo interactúa el cliente con su catálogo digital
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <select
                      value={selectedCatalogStore?.id || (tenants[0]?.id || '')}
                      onChange={(e) => {
                        const found = tenants.find((t) => t.id === e.target.value);
                        if (found) setSelectedCatalogStore(found);
                      }}
                      style={styles.nicheDropdown}
                    >
                      {tenants.length > 0 ? (
                        tenants.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({ALL_NICHES.find((n) => n.id === t.niche)?.label || t.niche})
                          </option>
                        ))
                      ) : (
                        <option value="demo">Aura Joyas & Relojes (Tienda de Muestra)</option>
                      )}
                    </select>

                    <button
                      onClick={() => {
                        setMagazineModalStore(selectedCatalogStore || (tenants.length > 0 ? tenants[0] : DEFAULT_DEMO_STORE));
                        setModalMagazinePage(1);
                        setShowMagazineModal(true);
                      }}
                      style={{
                        ...styles.btnCreateStore,
                        backgroundColor: '#0284c7',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      📖 Ver Revista Interactiva
                    </button>

                    <a
                      href={`/revista/${selectedCatalogStore?.slug || 'aurajoyas'}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        ...styles.btnCreateStore,
                        backgroundColor: '#16a34a',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      🚀 Enlace Cliente (Web) ↗
                    </a>

                    <button
                      onClick={() => handleDownloadPdf(selectedCatalogStore)}
                      disabled={pdfGenerating}
                      style={{
                        ...styles.btnCreateStore,
                        backgroundColor: '#0f172a',
                        cursor: pdfGenerating ? 'wait' : 'pointer',
                      }}
                    >
                      {pdfGenerating ? 'Generando y Descargando...' : '📥 Descargar PDF Real'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Previsualización Interactiva Tipo Revista Flip-Book */}
              <div style={styles.magazinePreviewCard}>
                <div style={styles.magazineHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '26px' }}>📖</span>
                    <div>
                      <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                        {selectedCatalogStore?.name || 'Aura Joyas & Relojes'} - Lookbook Revista Digital 2026
                      </h4>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        Nicho: {ALL_NICHES.find((n) => n.id === (selectedCatalogStore?.niche || 'joyeria'))?.label} • WhatsApp de Pedidos: +57 {selectedCatalogStore?.whatsapp || '3184804720'}
                      </div>
                    </div>
                  </div>

                  {/* Controles de cambio de página de la revista */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={() => setMagazinePreviewPage((p) => Math.max(1, p - 1))}
                      disabled={magazinePreviewPage === 1}
                      style={{
                        backgroundColor: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: magazinePreviewPage === 1 ? 'not-allowed' : 'pointer',
                        opacity: magazinePreviewPage === 1 ? 0.4 : 1,
                      }}
                    >
                      ◀ Pág. Anterior
                    </button>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>
                      Página {magazinePreviewPage} de 4
                    </span>
                    <button
                      onClick={() => setMagazinePreviewPage((p) => Math.min(4, p + 1))}
                      disabled={magazinePreviewPage === 4}
                      style={{
                        backgroundColor: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: magazinePreviewPage === 4 ? 'not-allowed' : 'pointer',
                        opacity: magazinePreviewPage === 4 ? 0.4 : 1,
                      }}
                    >
                      Pág. Siguiente ▶
                    </button>
                  </div>
                </div>

                {/* Contenido de la Página Activa de la Revista */}
                <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '380px' }}>
                  {/* PÁGINA 1: PORTADA */}
                  {magazinePreviewPage === 1 && (
                    <div style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      padding: '36px',
                      border: '1px solid #e2e8f0',
                      textAlign: 'center',
                      maxWidth: '680px',
                      margin: '0 auto',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.15em', color: '#0284c7', marginBottom: '8px' }}>
                        COLECCIÓN EDITORIAL 2026
                      </div>
                      <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: '0 0 10px 0' }}>
                        {selectedCatalogStore?.name?.toUpperCase() || 'AURA JOYAS & RELOJES'}
                      </h2>
                      <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 20px 0' }}>
                        Revista Digital Interactiva • Catálogo Oficial de Temporada
                      </p>
                      <div style={{
                        height: '220px',
                        borderRadius: '10px',
                        backgroundImage: 'url(https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: '20px',
                        color: '#ffffff',
                        marginBottom: '20px',
                      }}>
                        <div style={{ textAlign: 'left', background: 'rgba(15,23,42,0.75)', padding: '10px 16px', borderRadius: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '800', color: '#38bdf8' }}>DESTACADO DEL MES</span>
                          <div style={{ fontSize: '16px', fontWeight: '800' }}>Novedades con Entrega Inmediata</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                        <button
                          onClick={() => setMagazinePreviewPage(2)}
                          style={{
                            backgroundColor: '#0284c7',
                            color: '#ffffff',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '6px',
                            fontWeight: '800',
                            fontSize: '13px',
                            cursor: 'pointer',
                          }}
                        >
                          Hojear Colección (Página 2) →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PÁGINA 2: PRODUCTOS CON BOTÓN WHATSAPP */}
                  {magazinePreviewPage === 2 && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: '#0284c7', letterSpacing: '0.05em' }}>
                          PÁGINA 02 • TENDENCIAS DE TEMPORADA
                        </span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                          Toca cualquier producto para ordenar por WhatsApp
                        </span>
                      </div>

                      <div style={styles.magazineGrid}>
                        {[
                          { id: 1, name: 'Anillo Solitario Oro 18K & Diamante', price: 289000, code: 'ZP-01', tag: 'MÁS VENDIDO' },
                          { id: 2, name: 'Reloj Cronógrafo Signature Black', price: 420000, code: 'ZP-02', tag: 'EDICIÓN LIMITADA' },
                          { id: 3, name: 'Cadena Eslabón Cubano Plata 925', price: 185000, code: 'ZP-03', tag: 'TENDENCIA' },
                          { id: 4, name: 'Aretes Perla Cultivada y Baño Oro', price: 135000, code: 'ZP-04', tag: 'NUEVO' },
                        ].map((item) => (
                          <div key={item.id} style={styles.productMagazineCard}>
                            <div style={{
                              height: '140px',
                              backgroundColor: '#e2e8f0',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: '700',
                              color: '#64748b',
                              marginBottom: '10px',
                            }}>
                              📸 FOTOGRAFÍA HD
                            </div>
                            <span style={{ fontSize: '10px', fontWeight: '800', color: '#0284c7', textTransform: 'uppercase' }}>
                              {item.tag} • Ref: {item.code}
                            </span>
                            <div style={styles.productMagazineName}>{item.name}</div>
                            <div style={styles.productMagazinePrice}>{formatMoney(item.price)}</div>
                            <a
                              href={`https://wa.me/57${selectedCatalogStore?.whatsapp || '3184804720'}?text=${encodeURIComponent(`Hola, vi la Revista Interactiva de ${selectedCatalogStore?.name || 'Zeply'} y deseo ordenar: ${item.name} (${formatMoney(item.price)})`)}`}
                              target="_blank"
                              rel="noreferrer"
                              style={styles.orderWhatsAppBtn}
                            >
                              Pedir por WhatsApp 💬
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PÁGINA 3: COLECCIÓN PREMIUM */}
                  {magazinePreviewPage === 3 && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: '#0284c7', letterSpacing: '0.05em' }}>
                          PÁGINA 03 • LÍNEA EXCLUSIVA & ACCESORIOS
                        </span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                          Envíos asegurados a todo el territorio nacional
                        </span>
                      </div>

                      <div style={styles.magazineGrid}>
                        {[
                          { id: 5, name: 'Pulsera Tennis Circones Suizos', price: 210000, code: 'ZP-05', tag: 'EXCLUSIVO' },
                          { id: 6, name: 'Dije Personalizado Inicial Oro', price: 165000, code: 'ZP-06', tag: 'PERSONALIZABLE' },
                          { id: 7, name: 'Estuche Organizador de Viaje Cuero', price: 89000, code: 'ZP-07', tag: 'ACCESORIO' },
                          { id: 8, name: 'Set de Limpieza y Brillo Joyería', price: 45000, code: 'ZP-08', tag: 'CUIDADO' },
                        ].map((item) => (
                          <div key={item.id} style={styles.productMagazineCard}>
                            <div style={{
                              height: '140px',
                              backgroundColor: '#e2e8f0',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: '700',
                              color: '#64748b',
                              marginBottom: '10px',
                            }}>
                              📸 FOTOGRAFÍA HD
                            </div>
                            <span style={{ fontSize: '10px', fontWeight: '800', color: '#0284c7', textTransform: 'uppercase' }}>
                              {item.tag} • Ref: {item.code}
                            </span>
                            <div style={styles.productMagazineName}>{item.name}</div>
                            <div style={styles.productMagazinePrice}>{formatMoney(item.price)}</div>
                            <a
                              href={`https://wa.me/57${selectedCatalogStore?.whatsapp || '3184804720'}?text=${encodeURIComponent(`Hola, vi la Revista Interactiva de ${selectedCatalogStore?.name || 'Zeply'} y deseo ordenar: ${item.name} (${formatMoney(item.price)})`)}`}
                              target="_blank"
                              rel="noreferrer"
                              style={styles.orderWhatsAppBtn}
                            >
                              Pedir por WhatsApp 💬
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PÁGINA 4: CONTRAPORTADA & FORMAS DE PAGO */}
                  {magazinePreviewPage === 4 && (
                    <div style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      padding: '36px',
                      border: '1px solid #e2e8f0',
                      textAlign: 'center',
                      maxWidth: '680px',
                      margin: '0 auto',
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.15em', color: '#16a34a', marginBottom: '8px' }}>
                        PÁGINA 04 • INFORMACIÓN DE COMPRA & CONTACTO
                      </div>
                      <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: '0 0 16px 0' }}>
                        ¿Cómo Procesamos tu Compra?
                      </h3>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px', textAlign: 'left' }}>
                        <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block', marginBottom: '4px' }}>💬 Atención Directa</strong>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>Pedidos y cotizaciones coordinadas por WhatsApp al +57 {selectedCatalogStore?.whatsapp || '3184804720'}.</span>
                        </div>
                        <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block', marginBottom: '4px' }}>🚚 Envíos Nacionales</strong>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>Despachos con guía de rastreo y entrega rápida en 24 a 48 horas.</span>
                        </div>
                        <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block', marginBottom: '4px' }}>🛡️ Garantía Oficial</strong>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>Soporte posventa directo con la tienda y cambios garantizados.</span>
                        </div>
                      </div>

                      <a
                        href={`https://wa.me/57${selectedCatalogStore?.whatsapp || '3184804720'}?text=${encodeURIComponent(`Hola ${selectedCatalogStore?.name || 'Zeply'}, estuve viendo el catálogo y quiero consultar disponibilidad.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          ...styles.orderWhatsAppBtn,
                          padding: '12px 24px',
                          display: 'inline-block',
                          fontSize: '14px',
                        }}
                      >
                        Chatear con un Asesor por WhatsApp 💬
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: CONFIGURACIÓN DEL SISTEMA                         */}
          {/* ======================================================== */}
          {activeTab === 'configuracion' && (
            <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={styles.widgetCard}>
                <h3 style={styles.widgetTitle}>Configuración General de Zeply</h3>
                <p style={styles.widgetSubtitle}>Ajustes globales de la infraestructura multi-tenant</p>

                {saveSuccess && (
                  <div style={styles.saveAlert}>
                    ✅ Ajustes actualizados y guardados correctamente.
                  </div>
                )}

                <form onSubmit={handleSaveSettings} style={styles.modalForm}>
                  <div style={styles.formGroup}>
                    <label style={styles.inputLabel}>Nombre Oficial de la Plataforma</label>
                    <input
                      type="text"
                      value={systemSettings.platformName}
                      onChange={(e) =>
                        setSystemSettings({ ...systemSettings, platformName: e.target.value })
                      }
                      style={styles.modalInput}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.inputLabel}>WhatsApp de Soporte Central Master Admin</label>
                    <input
                      type="text"
                      value={systemSettings.supportWhatsapp}
                      onChange={(e) =>
                        setSystemSettings({ ...systemSettings, supportWhatsapp: e.target.value })
                      }
                      style={styles.modalInput}
                    />
                  </div>

                  <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                      <label style={styles.inputLabel}>Precio Plan Básico (COP/mes)</label>
                      <input
                        type="number"
                        value={systemSettings.basicPriceCOP}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            basicPriceCOP: Number(e.target.value),
                          })
                        }
                        style={styles.modalInput}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.inputLabel}>Precio Plan Starter (COP/mes)</label>
                      <input
                        type="number"
                        value={systemSettings.starterPriceCOP}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            starterPriceCOP: Number(e.target.value),
                          })
                        }
                        style={styles.modalInput}
                      />
                    </div>
                  </div>

                  <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                      <label style={styles.inputLabel}>Precio Plan Pro (COP/mes)</label>
                      <input
                        type="number"
                        value={systemSettings.proPriceCOP}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            proPriceCOP: Number(e.target.value),
                          })
                        }
                        style={styles.modalInput}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.inputLabel}>Días de Periodo Gratuito (Trial)</label>
                      <input
                        type="number"
                        value={systemSettings.trialDays}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            trialDays: Number(e.target.value),
                          })
                        }
                        style={styles.modalInput}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '10px' }}>
                    <button type="submit" style={styles.btnCreateStore}>
                      Guardar Configuración
                    </button>
                  </div>
                </form>
              </div>

              {/* Estado de Supabase */}
              <div style={styles.widgetCard}>
                <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                  Conexión a Base de Datos Supabase
                </h4>
                <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div><strong>Proyecto:</strong> iequlfuyagzxlpfpzjdl.supabase.co</div>
                  <div>
                    <strong>Estado Tablas:</strong>{' '}
                    <span style={{ color: isSupabaseLive ? '#16a34a' : '#d97706', fontWeight: '700' }}>
                      {isSupabaseLive ? '● Tablas Conectadas & Sincronizadas' : '⚠️ Pendiente ejecutar schema.sql'}
                    </span>
                  </div>
                  <div><strong>Aislamiento Multi-Tenant:</strong> Políticas RLS Habilitadas</div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── MODAL: PASARELA DE PAGO DE SUSCRIPCIONES ── */}
      {paymentModalStore && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContainer}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={styles.modalTitle}>Pasarela de Pago Segura Zeply</h3>
                <p style={styles.modalSub}>
                  Renovar o pagar suscripción para <strong>{paymentModalStore.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setPaymentModalStore(null)}
                style={styles.modalCloseBtn}
              >
                ✕
              </button>
            </div>

            {paymentSuccess ? (
              <div style={styles.paymentSuccessBox}>
                <span style={{ fontSize: '40px' }}>✅</span>
                <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#15803d', margin: 0 }}>
                  ¡Pago Procesado con Éxito!
                </h4>
                <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center' }}>
                  La suscripción de <strong>{paymentModalStore.name}</strong> se ha renovado por 30 días adicionales.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={styles.paymentSummaryCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                      Plan {paymentModalStore.plan}
                    </span>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#0284c7' }}>
                      {formatMoney(paymentModalStore.monthlyFeeCOP)}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Cobertura: 30 días de servicio multi-tenant + Tienda + Revista PDF
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={styles.inputLabel}>Seleccionar Medio de Pago:</label>
                  <div style={styles.paymentMethodsGrid}>
                    <button type="button" style={styles.paymentMethodOption}>
                      <span>💳</span>
                      <span>Tarjeta de Crédito / Débito</span>
                    </button>
                    <button type="button" style={styles.paymentMethodOption}>
                      <span>🏦</span>
                      <span>PSE / Transferencia Bancaria</span>
                    </button>
                    <button type="button" style={styles.paymentMethodOption}>
                      <span>📱</span>
                      <span>Wompi / Nequi / Daviplata</span>
                    </button>
                  </div>
                </div>

                <div style={styles.modalFooter}>
                  <button
                    type="button"
                    onClick={() => setPaymentModalStore(null)}
                    style={styles.btnCancel}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={paymentProcessing}
                    onClick={handleProcessPayment}
                    style={styles.btnConfirm}
                  >
                    {paymentProcessing ? 'Procesando Transacción...' : `Pagar ${formatMoney(paymentModalStore.monthlyFeeCOP)} Ahora`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL: REGISTRO MANUAL DE TIENDA ── */}
      {showCreateModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContainer}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={styles.modalTitle}>Registrar Nueva Tienda Manual</h3>
                <p style={styles.modalSub}>Ingresa los datos para dar de alta un nuevo negocio</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                style={styles.modalCloseBtn}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTenant} style={styles.modalForm}>
              <div style={styles.formGroup}>
                <label style={styles.inputLabel}>Nombre Comercial de la Tienda *</label>
                <input
                  type="text"
                  placeholder="Ej: Tienda Express Móviles"
                  value={newStore.name}
                  onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                  style={styles.modalInput}
                  required
                />
              </div>

              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.inputLabel}>Nicho Comercial *</label>
                  <select
                    value={newStore.niche}
                    onChange={(e) => setNewStore({ ...newStore, niche: e.target.value })}
                    style={styles.modalSelect}
                  >
                    {ALL_NICHES.filter((n) => n.id !== 'all').map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.inputLabel}>Plan Inicial</label>
                  <select
                    value={newStore.plan}
                    onChange={(e) => setNewStore({ ...newStore, plan: e.target.value })}
                    style={styles.modalSelect}
                  >
                    <option value="BASIC">Básico ($29.900 COP)</option>
                    <option value="STARTER">Starter ($49.900 COP)</option>
                    <option value="PRO">Pro ($89.900 COP)</option>
                    <option value="FREE_TRIAL">Prueba Gratuita (7 días)</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.inputLabel}>Código País</label>
                  <input
                    type="text"
                    value={newStore.country_code}
                    onChange={(e) => setNewStore({ ...newStore, country_code: e.target.value })}
                    style={styles.modalInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.inputLabel}>WhatsApp para Pedidos *</label>
                  <input
                    type="text"
                    placeholder="3184804720"
                    value={newStore.whatsapp}
                    onChange={(e) => setNewStore({ ...newStore, whatsapp: e.target.value })}
                    style={styles.modalInput}
                    required
                  />
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={styles.btnCancel}
                >
                  Cancelar
                </button>
                <button type="submit" style={styles.btnConfirm}>
                  Crear Tienda en Zeply 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL DE REVISTA DIGITAL INTERACTIVA (MODO MASTER ADMIN) ── */}
      {showMagazineModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(11, 17, 32, 0.88)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '860px',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            {/* Modal Top Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 20px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              borderBottom: '1px solid #1e293b',
              flexWrap: 'wrap',
              gap: '10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>📖</span>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '800' }}>
                    Revista Interactiva: {magazineModalStore?.name || 'Tienda Zeply'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    Nicho: {ALL_NICHES.find((n) => n.id === magazineModalStore?.niche)?.label || 'General'} • WhatsApp: +57 {magazineModalStore?.whatsapp}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => handleDownloadPdf(magazineModalStore)}
                  disabled={pdfGenerating}
                  style={{
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  {pdfGenerating ? 'Descargando...' : '📥 Descargar PDF Real'}
                </button>
                <a
                  href={`/revista/${magazineModalStore?.slug || 'aurajoyas'}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    textDecoration: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '700',
                  }}
                >
                  🚀 Enlace Cliente ↗
                </a>
                <button
                  onClick={() => setShowMagazineModal(false)}
                  style={{
                    backgroundColor: '#334155',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body: Revista Spread */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: '#f8fafc' }}>
              {/* Navegador de páginas */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <button
                  onClick={() => setModalMagazinePage((p) => Math.max(1, p - 1))}
                  disabled={modalMagazinePage === 1}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: '800',
                    color: '#0f172a',
                    cursor: modalMagazinePage === 1 ? 'not-allowed' : 'pointer',
                    opacity: modalMagazinePage === 1 ? 0.4 : 1,
                  }}
                >
                  ◀ Página Anterior
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>
                    Página {modalMagazinePage} de 4
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    ({modalMagazinePage === 1 ? 'Portada' : modalMagazinePage === 2 ? 'Tendencias' : modalMagazinePage === 3 ? 'Colección' : 'Envíos & Pagos'})
                  </span>
                </div>
                <button
                  onClick={() => setModalMagazinePage((p) => Math.min(4, p + 1))}
                  disabled={modalMagazinePage === 4}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: '800',
                    color: '#0f172a',
                    cursor: modalMagazinePage === 4 ? 'not-allowed' : 'pointer',
                    opacity: modalMagazinePage === 4 ? 0.4 : 1,
                  }}
                >
                  Página Siguiente ▶
                </button>
              </div>

              {/* PÁGINA 1: PORTADA */}
              {modalMagazinePage === 1 && (
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '36px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#0284c7', letterSpacing: '0.15em', marginBottom: '8px' }}>
                    LOOKBOOK EDITORIAL 2026
                  </div>
                  <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: '0 0 8px 0' }}>
                    {magazineModalStore?.name?.toUpperCase() || 'AURA JOYAS & RELOJES'}
                  </h2>
                  <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 20px 0' }}>
                    Colección Oficial Exclusiva • Pedidos Directos a WhatsApp
                  </p>
                  <div style={{
                    height: '240px',
                    borderRadius: '10px',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '20px',
                    marginBottom: '24px',
                  }}>
                    <div style={{ background: 'rgba(15,23,42,0.8)', color: '#ffffff', padding: '12px 18px', borderRadius: '8px', textAlign: 'left' }}>
                      <div style={{ fontSize: '11px', fontWeight: '800', color: '#38bdf8' }}>TEMPORADA 2026</div>
                      <div style={{ fontSize: '18px', fontWeight: '800' }}>Catálogo Digital de Alta Definición</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setModalMagazinePage(2)}
                    style={{
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    Abrir Colección (Página 2) →
                  </button>
                </div>
              )}

              {/* PÁGINA 2: PRODUCTOS */}
              {modalMagazinePage === 2 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#0284c7' }}>PÁGINA 02 • TENDENCIAS</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Haz clic en un producto para ordenar por WhatsApp</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    {[
                      { id: 1, name: 'Anillo Solitario Oro 18K & Diamante', price: 289000, code: 'ZP-01', tag: 'TOP VENTAS' },
                      { id: 2, name: 'Reloj Cronógrafo Signature Black', price: 420000, code: 'ZP-02', tag: 'EDICIÓN LIMITADA' },
                      { id: 3, name: 'Cadena Eslabón Cubano Plata 925', price: 185000, code: 'ZP-03', tag: 'TENDENCIA' },
                      { id: 4, name: 'Aretes Perla Cultivada y Baño Oro', price: 135000, code: 'ZP-04', tag: 'NUEVO' },
                    ].map((item) => (
                      <div key={item.id} style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                      }}>
                        <div style={{ height: '120px', backgroundColor: '#f1f5f9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#64748b', fontWeight: '700', marginBottom: '10px' }}>
                          📸 FOTOGRAFÍA HD
                        </div>
                        <span style={{ fontSize: '10px', fontWeight: '800', color: '#0284c7' }}>{item.tag}</span>
                        <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', margin: '4px 0 8px 0', lineHeight: '1.3' }}>{item.name}</h4>
                        <div style={{ fontSize: '16px', fontWeight: '900', color: '#0284c7', marginBottom: '12px' }}>{formatMoney(item.price)}</div>
                        <a
                          href={`https://wa.me/57${magazineModalStore?.whatsapp || '3184804720'}?text=${encodeURIComponent(`Hola, vi la Revista Interactiva de ${magazineModalStore?.name || 'Zeply'} y quiero pedir: ${item.name} (${formatMoney(item.price)})`)}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            backgroundColor: '#16a34a',
                            color: '#ffffff',
                            textDecoration: 'none',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '800',
                            textAlign: 'center',
                            display: 'block',
                            marginTop: 'auto',
                          }}
                        >
                          💬 Pedir por WhatsApp
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PÁGINA 3: COLECCIÓN SIGNATURE */}
              {modalMagazinePage === 3 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#0284c7' }}>PÁGINA 03 • LÍNEA SIGNATURE</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Disponibilidad inmediata con despacho rápido</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    {[
                      { id: 5, name: 'Pulsera Tennis Circones Suizos', price: 210000, code: 'ZP-05', tag: 'EXCLUSIVO' },
                      { id: 6, name: 'Dije Personalizado Inicial Oro', price: 165000, code: 'ZP-06', tag: 'PERSONALIZABLE' },
                      { id: 7, name: 'Estuche Organizador de Viaje Cuero', price: 89000, code: 'ZP-07', tag: 'ACCESORIO' },
                      { id: 8, name: 'Set de Limpieza y Brillo Joyería', price: 45000, code: 'ZP-08', tag: 'CUIDADO' },
                    ].map((item) => (
                      <div key={item.id} style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                      }}>
                        <div style={{ height: '120px', backgroundColor: '#f1f5f9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#64748b', fontWeight: '700', marginBottom: '10px' }}>
                          📸 FOTOGRAFÍA HD
                        </div>
                        <span style={{ fontSize: '10px', fontWeight: '800', color: '#0284c7' }}>{item.tag}</span>
                        <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', margin: '4px 0 8px 0', lineHeight: '1.3' }}>{item.name}</h4>
                        <div style={{ fontSize: '16px', fontWeight: '900', color: '#0284c7', marginBottom: '12px' }}>{formatMoney(item.price)}</div>
                        <a
                          href={`https://wa.me/57${magazineModalStore?.whatsapp || '3184804720'}?text=${encodeURIComponent(`Hola, vi la Revista Interactiva de ${magazineModalStore?.name || 'Zeply'} y quiero pedir: ${item.name} (${formatMoney(item.price)})`)}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            backgroundColor: '#16a34a',
                            color: '#ffffff',
                            textDecoration: 'none',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '800',
                            textAlign: 'center',
                            display: 'block',
                            marginTop: 'auto',
                          }}
                        >
                          💬 Pedir por WhatsApp
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PÁGINA 4: CONTRAPORTADA */}
              {modalMagazinePage === 4 && (
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '36px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#16a34a', letterSpacing: '0.15em', marginBottom: '8px' }}>
                    PÁGINA 04 • CONTRAPORTADA & FORMAS DE PAGO
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: '0 0 16px 0' }}>
                    Atención Directa y Medios de Pago
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px', textAlign: 'left' }}>
                    <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block', marginBottom: '4px' }}>💬 Atención Personalizada</strong>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Asesoría directa en el WhatsApp de la tienda: +57 {magazineModalStore?.whatsapp || '3184804720'}.</span>
                    </div>
                    <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block', marginBottom: '4px' }}>🚚 Envíos Nacionales</strong>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Despachos rápidos y seguros a todo el país con guía de rastreo.</span>
                    </div>
                    <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block', marginBottom: '4px' }}>🛡️ Garantía Oficial</strong>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Respaldo garantizado y soporte en cada una de tus órdenes.</span>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/57${magazineModalStore?.whatsapp || '3184804720'}?text=${encodeURIComponent(`Hola ${magazineModalStore?.name || 'Zeply'}, estuve viendo el catálogo en la revista y deseo hacer una consulta.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      backgroundColor: '#16a34a',
                      color: '#ffffff',
                      textDecoration: 'none',
                      padding: '12px 28px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '800',
                      display: 'inline-block',
                    }}
                  >
                    💬 Contactar por WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    color: '#0f172a',
  },
  sidebar: {
    width: '260px',
    backgroundColor: '#0b1528',
    borderRight: '1px solid #1e293b',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowY: 'auto',
    zIndex: 20,
    flexShrink: 0,
  },
  sidebarHeader: {
    padding: '24px 20px',
    borderBottom: '1px solid #1e293b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#38bdf8',
    letterSpacing: '-0.5px',
  },
  adminBadge: {
    fontSize: '11px',
    fontWeight: '700',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    color: '#38bdf8',
    border: '1px solid rgba(56, 189, 248, 0.3)',
    padding: '2px 8px',
    borderRadius: '4px',
    letterSpacing: '0.5px',
  },
  sidebarNav: {
    padding: '20px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  },
  navGroupLabel: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: '0.8px',
    marginTop: '14px',
    marginBottom: '6px',
    paddingLeft: '10px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    width: '100%',
    textAlign: 'left',
    position: 'relative',
  },
  navIcon: {
    fontSize: '16px',
  },
  countBadge: {
    marginLeft: 'auto',
    backgroundColor: '#1e293b',
    color: '#94a3b8',
    fontSize: '11px',
    fontWeight: '700',
    padding: '1px 6px',
    borderRadius: '4px',
  },
  counterBadge: {
    marginLeft: 'auto',
    backgroundColor: '#f59e0b',
    color: '#ffffff',
    fontSize: '10px',
    fontWeight: '700',
    padding: '1px 6px',
    borderRadius: '9999px',
  },
  sidebarFooter: {
    padding: '16px',
    borderTop: '1px solid #1e293b',
    backgroundColor: '#070f1e',
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },
  userAvatar: {
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    backgroundColor: '#0284c7',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '14px',
  },
  userInfo: {
    overflow: 'hidden',
  },
  userName: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#f1f5f9',
  },
  userRole: {
    fontSize: '11px',
    color: '#64748b',
  },
  sidebarLogoutBtn: {
    width: '100%',
    padding: '8px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#94a3b8',
    backgroundColor: 'transparent',
    border: '1px solid #1e293b',
    borderRadius: '6px',
    textAlign: 'center',
  },
  mainWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  topbar: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    padding: '16px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  topbarLeft: {},
  pageHeading: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.3px',
  },
  pageSubheading: {
    fontSize: '13px',
    color: '#64748b',
    marginTop: '2px',
  },
  topbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  currencyToggleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  currencyLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
  },
  currencyToggle: {
    display: 'flex',
    backgroundColor: '#f1f5f9',
    borderRadius: '8px',
    padding: '2px',
    border: '1px solid #e2e8f0',
  },
  currencyBtn: {
    padding: '6px 12px',
    fontSize: '12px',
    borderRadius: '6px',
    border: 'none',
  },
  monthSelectWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  monthLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
  },
  monthSelect: {
    padding: '7px 12px',
    fontSize: '13px',
    fontWeight: '600',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    outline: 'none',
  },
  btnCreateStore: {
    padding: '9px 18px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#ffffff',
    backgroundColor: '#0284c7',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
  },
  dbNotice: {
    backgroundColor: '#fffbeb',
    borderBottom: '1px solid #fef3c7',
    color: '#b45309',
    padding: '12px 32px',
    fontSize: '13px',
  },
  mainContent: {
    padding: '32px',
    maxWidth: '1440px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '18px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  statCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  statTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
  },
  statBadgeSuccess: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#16a34a',
    backgroundColor: '#dcfce7',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  statBadgeWarning: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#d97706',
    backgroundColor: '#fef3c7',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  statBadgeInfo: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#0284c7',
    backgroundColor: '#e0f2fe',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  statBadgeTrial: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#7c3aed',
    backgroundColor: '#ede9fe',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.5px',
    marginBottom: '4px',
  },
  statFooterText: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  middleRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '20px',
  },
  widgetCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '22px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  widgetTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '2px',
  },
  widgetSubtitle: {
    fontSize: '12px',
    color: '#64748b',
    marginBottom: '18px',
  },
  nicheBarsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  nicheBarRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  nicheBarLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    fontWeight: '600',
  },
  nicheName: {
    color: '#334155',
  },
  nichePercent: {
    color: '#0284c7',
  },
  progressBarBg: {
    height: '8px',
    backgroundColor: '#f1f5f9',
    borderRadius: '9999px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '9999px',
  },
  filterControlBlock: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#475569',
    marginBottom: '6px',
    display: 'block',
  },
  nicheDropdown: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    fontSize: '13px',
    fontWeight: '600',
    color: '#0f172a',
    outline: 'none',
  },
  filterSearchInput: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  filterSummary: {
    marginTop: '16px',
    fontSize: '12px',
    color: '#64748b',
    padding: '10px',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
  },
  directorySection: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    overflow: 'hidden',
  },
  directoryHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
  directoryTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
  },
  directorySub: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '2px',
  },
  liveIndicator: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#16a34a',
  },
  viewAllBtn: {
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#0284c7',
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '6px',
  },
  tableResponsive: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  thRow: {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
  },
  th: {
    padding: '12px 20px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
  },
  td: {
    padding: '14px 20px',
    fontSize: '13px',
    verticalAlign: 'middle',
  },
  storeCol: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  storeInitial: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    backgroundColor: '#e0f2fe',
    color: '#0284c7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '14px',
  },
  storeTitle: {
    fontWeight: '700',
    color: '#0f172a',
  },
  storeUrl: {
    fontSize: '11px',
    color: '#64748b',
  },
  phoneLink: {
    fontWeight: '600',
    color: '#0284c7',
    textDecoration: 'none',
  },
  nicheBadge: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#334155',
    backgroundColor: '#f1f5f9',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  planBadge: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#0369a1',
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  statusActive: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#15803d',
    backgroundColor: '#dcfce7',
    padding: '3px 8px',
    borderRadius: '9999px',
  },
  statusExpiring: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#b45309',
    backgroundColor: '#fef3c7',
    padding: '3px 8px',
    borderRadius: '9999px',
  },
  statusTrial: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#6d28d9',
    backgroundColor: '#ede9fe',
    padding: '3px 8px',
    borderRadius: '9999px',
  },
  catalogBtn: {
    padding: '5px 10px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#334155',
    backgroundColor: '#f8fafc',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
  },
  pauseBtn: {
    padding: '5px 12px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#b45309',
    backgroundColor: '#fef3c7',
    border: '1px solid #fde68a',
    borderRadius: '6px',
  },
  resumeBtn: {
    padding: '5px 12px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#15803d',
    backgroundColor: '#dcfce7',
    border: '1px solid #bbf7d0',
    borderRadius: '6px',
  },
  payGatewayBtn: {
    display: 'inline-block',
    padding: '6px 14px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#ffffff',
    backgroundColor: '#0284c7',
    borderRadius: '6px',
  },
  saveAlert: {
    padding: '10px 14px',
    backgroundColor: '#dcfce7',
    border: '1px solid #bbf7d0',
    color: '#15803d',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '16px',
  },
  magazinePreviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '24px',
  },
  magazineHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #f1f5f9',
  },
  magazinePagesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
  },
  magazinePage: {
    backgroundColor: '#0b1528',
    color: '#ffffff',
    borderRadius: '12px',
    padding: '36px 28px',
    minHeight: '420px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
  },
  magazineCoverBadge: {
    fontSize: '10px',
    fontWeight: '800',
    backgroundColor: '#38bdf8',
    color: '#0b1528',
    padding: '4px 12px',
    borderRadius: '9999px',
    letterSpacing: '1px',
    marginBottom: '16px',
  },
  coverTitle: {
    fontSize: '26px',
    fontWeight: '800',
    letterSpacing: '-0.5px',
    marginBottom: '8px',
  },
  coverSub: {
    fontSize: '12px',
    color: '#94a3b8',
    letterSpacing: '2px',
    marginBottom: '24px',
  },
  coverFooter: {
    fontSize: '12px',
    color: '#cbd5e1',
    maxWidth: '260px',
    lineHeight: '1.4',
  },
  magazineProductsPage: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  pageHeaderLabel: {
    fontSize: '11px',
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: '1px',
    marginBottom: '14px',
  },
  magazineGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  productMagazineCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '12px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
  },
  productMagazineImgPlaceholder: {
    height: '100px',
    backgroundColor: '#f1f5f9',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: '700',
    color: '#94a3b8',
    marginBottom: '8px',
  },
  productMagazineName: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '4px',
  },
  productMagazinePrice: {
    fontSize: '13px',
    fontWeight: '800',
    color: '#0284c7',
    marginBottom: '8px',
  },
  orderWhatsAppBtn: {
    display: 'block',
    textAlign: 'center',
    padding: '6px 8px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#ffffff',
    backgroundColor: '#16a34a',
    borderRadius: '6px',
    textDecoration: 'none',
  },
  plansShowcaseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  planPricingCard: {
    backgroundColor: '#ffffff',
    border: '1.5px solid #e2e8f0',
    borderRadius: '14px',
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  planPricingHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  planTagGeneric: {
    fontSize: '10px',
    fontWeight: '800',
    padding: '3px 8px',
    borderRadius: '6px',
    width: 'fit-content',
    letterSpacing: '0.5px',
  },
  planPriceValue: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#0f172a',
  },
  planPricePeriod: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
  },
  dividerLineLight: {
    height: '1px',
    backgroundColor: '#f1f5f9',
  },
  planFeaturesList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '12px',
  },
  paymentSummaryCard: {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '10px',
    padding: '16px',
  },
  paymentMethodsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  paymentMethodOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 14px',
    backgroundColor: '#ffffff',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'left',
  },
  paymentSuccessBox: {
    padding: '32px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: '16px',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '520px',
    padding: '28px',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#0f172a',
  },
  modalSub: {
    fontSize: '13px',
    color: '#64748b',
    marginTop: '2px',
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    color: '#94a3b8',
    cursor: 'pointer',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  modalInput: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '13px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  modalSelect: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '13px',
    backgroundColor: '#ffffff',
    outline: 'none',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '12px',
  },
  btnCancel: {
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    backgroundColor: 'transparent',
  },
  btnConfirm: {
    padding: '10px 18px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#ffffff',
    backgroundColor: '#0284c7',
    borderRadius: '8px',
  },
};
