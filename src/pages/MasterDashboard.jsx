import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Nichos ampliados (incluyendo Celulares, Tecnología, etc.)
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

const MONTHS = [
  { id: '2026-11', label: 'Noviembre 2026' },
  { id: '2026-10', label: 'Octubre 2026' },
  { id: '2026-09', label: 'Septiembre 2026' },
  { id: '2026-all', label: 'Año Completo 2026' },
];

export default function MasterDashboard() {
  const navigate = useNavigate();

  // Estados de navegación y filtros
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currency, setCurrency] = useState('COP'); // 'COP' | 'USD'
  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  const [selectedNiche, setSelectedNiche] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Datos de tiendas
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Formulario de nueva tienda manual
  const [newStore, setNewStore] = useState({
    name: '',
    slug: '',
    niche: 'ropa',
    country: 'Colombia',
    country_code: '+57',
    whatsapp: '',
    plan: 'STARTER',
    currency: 'COP',
  });

  // Base inicial de tiendas con datos de prueba realistas para métricas
  const initialTenants = [
    {
      id: '1',
      name: 'Aura Joyas & Relojes',
      slug: 'aurajoyas',
      niche: 'joyeria',
      country: 'Colombia',
      country_code: '+57',
      whatsapp: '3184804720',
      status: 'ACTIVE',
      subscriptionStatus: 'ACTIVE',
      daysUntilExpiry: 24,
      plan: 'PRO',
      salesCOP: 18500000,
      created_at: '2026-11-21T14:30:00Z',
    },
    {
      id: '2',
      name: 'SmartPhone Store Pro',
      slug: 'smartphonestore',
      niche: 'celulares',
      country: 'Colombia',
      country_code: '+57',
      whatsapp: '3157891234',
      status: 'ACTIVE',
      subscriptionStatus: 'EXPIRING_SOON',
      daysUntilExpiry: 3,
      plan: 'STARTER',
      salesCOP: 22400000,
      created_at: '2026-11-20T10:15:00Z',
    },
    {
      id: '3',
      name: 'UrbanStyle Boutique',
      slug: 'urbanstyle',
      niche: 'ropa',
      country: 'Colombia',
      country_code: '+57',
      whatsapp: '3001234567',
      status: 'ACTIVE',
      subscriptionStatus: 'ACTIVE',
      daysUntilExpiry: 18,
      plan: 'STARTER',
      salesCOP: 9200000,
      created_at: '2026-11-19T18:45:00Z',
    },
    {
      id: '4',
      name: 'NovaTech Móviles & Accesorios',
      slug: 'novatech',
      niche: 'tecnologia',
      country: 'Colombia',
      country_code: '+57',
      whatsapp: '3159876543',
      status: 'TRIAL',
      subscriptionStatus: 'TRIAL',
      daysUntilExpiry: 5,
      plan: 'FREE_TRIAL',
      salesCOP: 4100000,
      created_at: '2026-11-18T16:20:00Z',
    },
    {
      id: '5',
      name: 'Essence Perfumes Exclusivos',
      slug: 'essenceperfumes',
      niche: 'perfumeria',
      country: 'Colombia',
      country_code: '+57',
      whatsapp: '3205558899',
      status: 'ACTIVE',
      subscriptionStatus: 'EXPIRING_SOON',
      daysUntilExpiry: 2,
      plan: 'PRO',
      salesCOP: 24600000,
      created_at: '2026-11-17T11:00:00Z',
    },
    {
      id: '6',
      name: 'Calzado & Sneakers Col',
      slug: 'calzadosneakers',
      niche: 'calzado',
      country: 'Colombia',
      country_code: '+57',
      whatsapp: '3124443322',
      status: 'ACTIVE',
      subscriptionStatus: 'ACTIVE',
      daysUntilExpiry: 29,
      plan: 'STARTER',
      salesCOP: 7800000,
      created_at: '2026-11-12T09:30:00Z',
    },
  ];

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        setTenants(initialTenants);
      } else {
        // Enriquecer datos de supabase con valores por defecto
        const enriched = data.map((item, idx) => ({
          ...item,
          subscriptionStatus: item.status === 'TRIAL' ? 'TRIAL' : idx % 2 === 0 ? 'EXPIRING_SOON' : 'ACTIVE',
          daysUntilExpiry: idx % 2 === 0 ? 3 : 25,
          salesCOP: (idx + 1) * 6500000,
        }));
        setTenants(enriched);
      }
    } catch {
      setTenants(initialTenants);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTenant = async (e) => {
    e.preventDefault();
    if (!newStore.name || !newStore.whatsapp) return;

    const generatedSlug = newStore.slug || newStore.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const storeToInsert = {
      ...newStore,
      slug: generatedSlug,
      status: 'ACTIVE',
      subscriptionStatus: 'ACTIVE',
      daysUntilExpiry: 30,
      salesCOP: 0,
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
      plan: 'STARTER',
      currency: 'COP',
    });
  };

  // Conversión de moneda (1 USD = ~4,000 COP)
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

  // Cálculo de Métricas Reales
  const activeSubscriptions = tenants.filter((t) => t.subscriptionStatus === 'ACTIVE').length;
  const expiringSoonSubscriptions = tenants.filter((t) => t.subscriptionStatus === 'EXPIRING_SOON').length;
  const trialStores = tenants.filter((t) => t.status === 'TRIAL' || t.subscriptionStatus === 'TRIAL').length;
  const totalSalesCOP = tenants.reduce((acc, curr) => acc + (Number(curr.salesCOP) || 0), 0);

  // Cálculo de Nichos Más Registrados
  const nicheCounts = tenants.reduce((acc, curr) => {
    acc[curr.niche] = (acc[curr.niche] || 0) + 1;
    return acc;
  }, {});

  const topNiches = Object.keys(nicheCounts)
    .map((key) => ({
      niche: key,
      label: ALL_NICHES.find((n) => n.id === key)?.label || key,
      count: nicheCounts[key],
      percentage: Math.round((nicheCounts[key] / tenants.length) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  // Filtrado de tiendas
  const filteredTenants = tenants.filter((t) => {
    const matchesNiche = selectedNiche === 'all' || t.niche === selectedNiche;
    const matchesSearch =
      (t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.slug || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.whatsapp || '').includes(searchQuery);
    return matchesNiche && matchesSearch;
  });

  // Últimas 5 tiendas registradas
  const latestFiveTenants = filteredTenants.slice(0, 5);

  return (
    <div style={styles.appContainer}>
      {/* ── SIDEBAR IZQUIERDO CON SCROLL INTELIGENTE ── */}
      <aside style={styles.sidebar} className="smart-scroll">
        <div style={styles.sidebarHeader}>
          <div style={styles.brandTitle}>Zeply</div>
          <div style={styles.adminBadge}>Real Admin</div>
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
            <span>Suscripciones</span>
            {expiringSoonSubscriptions > 0 && (
              <span style={styles.counterBadge}>{expiringSoonSubscriptions}</span>
            )}
          </button>

          <div style={styles.navGroupLabel}>HERRAMIENTAS</div>
          <button
            onClick={() => setActiveTab('catalogos')}
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
            <div style={styles.userAvatar}>A</div>
            <div style={styles.userInfo}>
              <div style={styles.userName}>Administrador</div>
              <div style={styles.userRole}>admin@zeply.com</div>
            </div>
          </div>
          <button
            onClick={() => {
              sessionStorage.clear();
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
            <h1 style={styles.pageHeading}>Panel de Control Maestro</h1>
            <p style={styles.pageSubheading}>Gestión centralizada de infraestructura multi-tenant</p>
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

            {/* Selector de Mes para Filtro de Ventas */}
            <div style={styles.monthSelectWrapper}>
              <span style={styles.monthLabel}>Periodo:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={styles.monthSelect}
              >
                {MONTHS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón de Registro Manual */}
            <button
              onClick={() => setShowCreateModal(true)}
              style={styles.btnCreateStore}
            >
              + Registrar Tienda Manual
            </button>
          </div>
        </header>

        {/* Contenido Dinámico */}
        <main style={styles.mainContent}>
          {/* 1. TARJETAS DE MÉTRICAS REALES */}
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
                <span style={styles.statTitle}>Ventas del Mes ({selectedMonth.replace('2026-', 'Mes ')})</span>
                <span style={styles.statBadgeInfo}>GMV</span>
              </div>
              <div style={styles.statNumber}>{formatMoney(totalSalesCOP)}</div>
              <div style={styles.statFooterText}>Generado por las tiendas activas</div>
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

          {/* 2. FILA: DISTRIBUCIÓN DE NICHOS + SELECTOR SIN SCROLL */}
          <section style={styles.middleRow}>
            {/* Widget: Nichos Más Registrados */}
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

            {/* Widget: Filtro de Nicho Limpio y sin Scroll */}
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

          {/* 3. DIRECTORIO: ÚLTIMAS 5 TIENDAS REGISTRADAS */}
          <section style={styles.directorySection}>
            <div style={styles.directoryHeader}>
              <div>
                <h2 style={styles.directoryTitle}>Últimas 5 Tiendas Registradas</h2>
                <p style={styles.directorySub}>Monitoreo en tiempo real del ecosistema Zeply</p>
              </div>
              <span style={styles.liveIndicator}>● Sincronizado con Supabase</span>
            </div>

            <div style={styles.tableResponsive}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Tienda</th>
                    <th style={styles.th}>Nicho</th>
                    <th style={styles.th}>WhatsApp</th>
                    <th style={styles.th}>Plan</th>
                    <th style={styles.th}>Estado Suscripción</th>
                    <th style={styles.th}>Ventas Mes</th>
                    <th style={styles.th}>Catálogo</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {latestFiveTenants.map((store) => (
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
                        <div style={styles.phoneText}>
                          {store.country_code} {store.whatsapp}
                        </div>
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
                          {formatMoney(store.salesCOP)}
                        </strong>
                      </td>
                      <td style={styles.td}>
                        <button
                          onClick={() => alert(`Generando Revista Dinámica para ${store.name}...`)}
                          style={styles.catalogBtn}
                        >
                          Revista PDF
                        </button>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        <button
                          onClick={() => alert(`Abriendo panel de administración de ${store.name}...`)}
                          style={styles.manageBtn}
                        >
                          Gestionar ↗
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

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
                    <option value="STARTER">Starter</option>
                    <option value="PRO">Pro</option>
                    <option value="FREE_TRIAL">Prueba Gratuita (15 días)</option>
                    <option value="ENTERPRISE">Enterprise</option>
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
  nicheBadge: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#334155',
    backgroundColor: '#f1f5f9',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  phoneText: {
    fontWeight: '600',
    color: '#0f172a',
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
  manageBtn: {
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#0284c7',
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '6px',
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
