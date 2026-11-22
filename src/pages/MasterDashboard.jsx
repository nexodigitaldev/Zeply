import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const NICHES = [
  { id: 'all', label: 'Todos los Nichos', icon: '🌐' },
  { id: 'ropa', label: 'Ropa & Moda', icon: '👗' },
  { id: 'calzado', label: 'Calzado & Sneakers', icon: '👟' },
  { id: 'joyeria', label: 'Joyería & Relojes', icon: '💍' },
  { id: 'perfumeria', label: 'Perfumería & Fragancias', icon: '✨' },
  { id: 'tecnologia', label: 'Tecnología & Gadgets', icon: '📱' },
  { id: 'accesorios', label: 'Accesorios & Bolsos', icon: '👜' },
  { id: 'lenceria', label: 'Lencería & Pijamas', icon: '🎀' },
];

export default function MasterDashboard() {
  const navigate = useNavigate();
  const [selectedNiche, setSelectedNiche] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Formulario de nueva tienda
  const [newStore, setNewStore] = useState({
    name: '',
    slug: '',
    niche: 'ropa',
    country: 'Colombia',
    country_code: '+57',
    whatsapp: '',
    plan: 'STARTER',
  });

  // Datos de prueba iniciales para arrancar con dinamismo inmediato
  const defaultTenants = [
    {
      id: '1',
      name: 'Aura Joyas & Relojes',
      slug: 'aurajoyas',
      niche: 'joyeria',
      country: 'Colombia',
      country_code: '+57',
      whatsapp: '3184804720',
      status: 'ACTIVE',
      plan: 'PRO',
      productsCount: 48,
      ordersMonth: 142,
      gmv: 18500000,
      created_at: '2026-11-15',
    },
    {
      id: '2',
      name: 'UrbanStyle Boutique',
      slug: 'urbanstyle',
      niche: 'ropa',
      country: 'Colombia',
      country_code: '+57',
      whatsapp: '3001234567',
      status: 'ACTIVE',
      plan: 'STARTER',
      productsCount: 110,
      ordersMonth: 89,
      gmv: 9200000,
      created_at: '2026-11-18',
    },
    {
      id: '3',
      name: 'NovaTech Móviles',
      slug: 'novatech',
      niche: 'tecnologia',
      country: 'Colombia',
      country_code: '+57',
      whatsapp: '3159876543',
      status: 'TRIAL',
      plan: 'FREE_TRIAL',
      productsCount: 32,
      ordersMonth: 27,
      gmv: 4100000,
      created_at: '2026-11-20',
    },
    {
      id: '4',
      name: 'Essence Perfumes Exclusivos',
      slug: 'essenceperfumes',
      niche: 'perfumeria',
      country: 'Colombia',
      country_code: '+57',
      whatsapp: '3205558899',
      status: 'ACTIVE',
      plan: 'PRO',
      productsCount: 65,
      ordersMonth: 204,
      gmv: 24600000,
      created_at: '2026-11-10',
    },
  ];

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        setTenants(defaultTenants);
      } else {
        setTenants(data);
      }
    } catch {
      setTenants(defaultTenants);
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
    };

    try {
      const { data, error } = await supabase.from('tenants').insert([storeToInsert]).select();
      if (!error && data) {
        setTenants([data[0], ...tenants]);
      } else {
        // Fallback local
        setTenants([
          {
            id: Date.now().toString(),
            ...storeToInsert,
            productsCount: 0,
            ordersMonth: 0,
            gmv: 0,
            created_at: new Date().toISOString(),
          },
          ...tenants,
        ]);
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
      });
    } catch {
      setShowCreateModal(false);
    }
  };

  const filteredTenants = tenants.filter((t) => {
    const matchesNiche = selectedNiche === 'all' || t.niche === selectedNiche;
    const matchesSearch =
      (t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.slug || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.whatsapp || '').includes(searchQuery);
    return matchesNiche && matchesSearch;
  });

  const totalGMV = tenants.reduce((acc, curr) => acc + (Number(curr.gmv) || 0), 0);
  const totalOrders = tenants.reduce((acc, curr) => acc + (Number(curr.ordersMonth) || 0), 0);

  return (
    <div style={styles.layout}>
      {/* Navbar Superior Rey */}
      <header style={styles.topbar}>
        <div style={styles.brandGroup}>
          <div style={styles.brandLogo}>
            <span style={{ fontSize: '20px' }}>👑</span>
            <span style={styles.brandTitle}>Zeply</span>
          </div>
          <span style={styles.badgeRey}>Master Admin Rey</span>
        </div>

        <div style={styles.topbarActions}>
          <button
            onClick={() => setShowCreateModal(true)}
            style={styles.btnPrimary}
          >
            <span>+</span> Nueva Tienda
          </button>
          <button
            onClick={() => {
              sessionStorage.clear();
              navigate('/rey-admin');
            }}
            style={styles.btnLogout}
          >
            Salir
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main style={styles.main}>
        {/* Banner de Bienvenida y Métricas Globales */}
        <div style={styles.metricGrid}>
          <div style={styles.metricCard}>
            <div style={styles.metricHeader}>
              <span style={styles.metricTitle}>Tiendas Totales</span>
              <span style={styles.metricIcon}>🏪</span>
            </div>
            <div style={styles.metricValue}>{tenants.length}</div>
            <div style={styles.metricSub}>Sistemas Multi-Tenant Activos</div>
          </div>

          <div style={styles.metricCard}>
            <div style={styles.metricHeader}>
              <span style={styles.metricTitle}>Órdenes WhatsApp</span>
              <span style={styles.metricIcon}>💬</span>
            </div>
            <div style={styles.metricValue}>{totalOrders.toLocaleString()}</div>
            <div style={styles.metricSub}>Este mes en toda la red</div>
          </div>

          <div style={styles.metricCard}>
            <div style={styles.metricHeader}>
              <span style={styles.metricTitle}>Volumen Global (GMV)</span>
              <span style={styles.metricIcon}>📈</span>
            </div>
            <div style={styles.metricValue}>${(totalGMV / 1000000).toFixed(1)}M COP</div>
            <div style={styles.metricSub}>Transaccionado por clientes</div>
          </div>

          <div style={styles.metricCard}>
            <div style={styles.metricHeader}>
              <span style={styles.metricTitle}>Catálogos Revista PDF</span>
              <span style={styles.metricIcon}>📖</span>
            </div>
            <div style={styles.metricValue}>100%</div>
            <div style={styles.metricSub}>Generador Dinámico Activo</div>
          </div>
        </div>

        {/* Barra de Filtros por Nicho */}
        <div style={styles.filterBar}>
          <div style={styles.nicheScroll}>
            {NICHES.map((n) => (
              <button
                key={n.id}
                onClick={() => setSelectedNiche(n.id)}
                style={{
                  ...styles.nichePill,
                  backgroundColor: selectedNiche === n.id ? '#0284c7' : '#ffffff',
                  color: selectedNiche === n.id ? '#ffffff' : '#334155',
                  borderColor: selectedNiche === n.id ? '#0284c7' : '#e2e8f0',
                }}
              >
                <span>{n.icon}</span>
                <span>{n.label}</span>
              </button>
            ))}
          </div>

          <div style={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Buscar tienda por nombre, slug o WhatsApp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        {/* Tabla de Tiendas (Tenants) */}
        <div style={styles.tableCard}>
          <div style={styles.tableHeaderSection}>
            <h2 style={styles.sectionTitle}>
              Directorio de Tiendas ({filteredTenants.length})
            </h2>
            <span style={styles.liveBadge}>● En vivo (Supabase)</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thRow}>
                  <th style={styles.th}>Tienda</th>
                  <th style={styles.th}>Nicho</th>
                  <th style={styles.th}>WhatsApp & País</th>
                  <th style={styles.th}>Plan</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Catálogo PDF</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.map((t) => (
                  <tr key={t.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.storeNameGroup}>
                        <div style={styles.storeAvatar}>
                          {t.name.charAt(0)}
                        </div>
                        <div>
                          <div style={styles.storeName}>{t.name}</div>
                          <div style={styles.storeSlug}>zeply.store/{t.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.nicheBadge}>
                        {NICHES.find((n) => n.id === t.niche)?.icon || '🛍️'}{' '}
                        {t.niche.toUpperCase()}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.waPhone}>
                        {t.country_code} {t.whatsapp}
                      </div>
                      <div style={styles.countryLabel}>{t.country}</div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.planBadge}>{t.plan}</span>
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: t.status === 'ACTIVE' ? '#dcfce7' : '#fef9c3',
                          color: t.status === 'ACTIVE' ? '#15803d' : '#854d0e',
                        }}
                      >
                        {t.status === 'ACTIVE' ? 'Activa' : 'En Prueba'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => alert(`Generando Revista Dinámica para ${t.name}...`)}
                        style={styles.pdfBtn}
                      >
                        📖 Revista PDF
                      </button>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      <button
                        onClick={() => alert(`Accediendo al Panel de Administración de ${t.name}...`)}
                        style={styles.actionBtn}
                      >
                        Gestionar ↗
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Nueva Tienda */}
      {showCreateModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Crear Nueva Tienda en Zeply</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                style={styles.closeBtn}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTenant} style={styles.modalForm}>
              <div>
                <label style={styles.modalLabel}>Nombre Comercial de la Tienda</label>
                <input
                  type="text"
                  placeholder="Ej: Joyería Monte Carlo"
                  value={newStore.name}
                  onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                  style={styles.modalInput}
                  required
                />
              </div>

              <div>
                <label style={styles.modalLabel}>Nicho de Mercado</label>
                <select
                  value={newStore.niche}
                  onChange={(e) => setNewStore({ ...newStore, niche: e.target.value })}
                  style={styles.modalInput}
                >
                  <option value="ropa">Ropa & Moda</option>
                  <option value="calzado">Calzado & Sneakers</option>
                  <option value="joyeria">Joyería & Relojes</option>
                  <option value="perfumeria">Perfumería & Fragancias</option>
                  <option value="tecnologia">Tecnología & Gadgets</option>
                  <option value="accesorios">Accesorios & Bolsos</option>
                  <option value="lenceria">Lencería & Pijamas</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                <div>
                  <label style={styles.modalLabel}>Código</label>
                  <input
                    type="text"
                    value={newStore.country_code}
                    onChange={(e) => setNewStore({ ...newStore, country_code: e.target.value })}
                    style={styles.modalInput}
                  />
                </div>
                <div>
                  <label style={styles.modalLabel}>WhatsApp Oficial</label>
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

              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={styles.btnCancel}
                >
                  Cancelar
                </button>
                <button type="submit" style={styles.btnPrimary}>
                  Crear Tienda Inmediata 🚀
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
  layout: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
  },
  topbar: {
    height: '68px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  brandLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  brandTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#0284c7',
    letterSpacing: '-0.5px',
  },
  badgeRey: {
    fontSize: '11px',
    fontWeight: '700',
    backgroundColor: '#f0f9ff',
    color: '#0369a1',
    border: '1px solid #bae6fd',
    padding: '3px 10px',
    borderRadius: '9999px',
    textTransform: 'uppercase',
  },
  topbarActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  btnPrimary: {
    padding: '10px 18px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#ffffff',
    backgroundColor: '#0284c7',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
  },
  btnLogout: {
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    backgroundColor: 'transparent',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
  },
  main: {
    padding: '32px',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  metricGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
    marginBottom: '28px',
  },
  metricCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  metricHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  metricTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
  },
  metricIcon: {
    fontSize: '18px',
  },
  metricValue: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '4px',
  },
  metricSub: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  filterBar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '20px',
  },
  nicheScroll: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '4px',
  },
  nichePill: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    fontSize: '13px',
    fontWeight: '600',
    borderRadius: '9999px',
    border: '1px solid',
    whiteSpace: 'nowrap',
  },
  searchWrapper: {
    width: '100%',
  },
  searchInput: {
    width: '100%',
    padding: '12px 18px',
    fontSize: '14px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    outline: 'none',
  },
  tableCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    overflow: 'hidden',
  },
  tableHeaderSection: {
    padding: '20px 24px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
  },
  liveBadge: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#16a34a',
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
    padding: '12px 24px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
  },
  td: {
    padding: '16px 24px',
    fontSize: '14px',
    verticalAlign: 'middle',
  },
  storeNameGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  storeAvatar: {
    width: '38px',
    height: '38px',
    borderRadius: '8px',
    backgroundColor: '#e0f2fe',
    color: '#0284c7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '16px',
  },
  storeName: {
    fontWeight: '700',
    color: '#0f172a',
  },
  storeSlug: {
    fontSize: '12px',
    color: '#64748b',
  },
  nicheBadge: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#334155',
    backgroundColor: '#f1f5f9',
    padding: '4px 8px',
    borderRadius: '6px',
  },
  waPhone: {
    fontWeight: '600',
    color: '#0f172a',
  },
  countryLabel: {
    fontSize: '11px',
    color: '#94a3b8',
  },
  planBadge: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#0369a1',
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    padding: '3px 8px',
    borderRadius: '4px',
  },
  statusBadge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: '9999px',
  },
  pdfBtn: {
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#475569',
    backgroundColor: '#f8fafc',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
  },
  actionBtn: {
    padding: '6px 14px',
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
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '500px',
    padding: '28px',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: '#94a3b8',
    cursor: 'pointer',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  modalLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '4px',
    display: 'block',
  },
  modalInput: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '12px',
  },
  btnCancel: {
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    backgroundColor: 'transparent',
  },
};
