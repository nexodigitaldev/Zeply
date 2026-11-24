import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Store, 
  Package, 
  ShoppingBag, 
  BookOpen, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  ExternalLink, 
  Download, 
  QrCode, 
  MessageCircle, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle, 
  DollarSign, 
  Sparkles, 
  Share2, 
  Check, 
  AlertCircle,
  Eye,
  Filter
} from 'lucide-react';
import { downloadStorePdfCatalog } from '../lib/pdfGenerator';
import confetti from 'canvas-confetti';

export default function ClientDashboard() {
  const navigate = useNavigate();

  // Estado de la Tienda / Sesión
  const [store, setStore] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, products, orders, magazine, branding, plan

  // Productos y Pedidos
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Modales
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Formulario de Producto
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    compare_at_price: '',
    category: 'General',
    stock: 20,
    sku: '',
    image: '',
    variations: 'S, M, L',
    is_active: true,
  });

  useEffect(() => {
    // 1. Cargar sesión de cliente
    const session = localStorage.getItem('zeply_client_session');
    let currentStore = null;

    if (session) {
      try {
        currentStore = JSON.parse(session);
      } catch (e) {
        console.warn('Error reading session');
      }
    }

    // Si no hay sesión, inicializamos una por defecto para no bloquear al usuario
    if (!currentStore) {
      currentStore = {
        id: 'tenant-demo',
        name: 'Aura & Co. Joyería Fina',
        slug: 'joyeria',
        whatsapp: '573124567890',
        niche: 'joyeria',
        primary_color: '#0d9488',
        currency: 'COP',
        currency_symbol: '$',
        plan: 'STARTER',
        email: 'admin@aurajewelry.com',
        ownerName: 'Camila Restrepo',
      };
      localStorage.setItem('zeply_client_session', JSON.stringify(currentStore));
    }

    setStore(currentStore);

    // 2. Cargar o inicializar productos
    const storedProducts = localStorage.getItem(`zeply_store_products_${currentStore.slug}`);
    if (storedProducts) {
      try {
        setProducts(JSON.parse(storedProducts));
      } catch (e) {
        loadDefaultProducts(currentStore);
      }
    } else {
      loadDefaultProducts(currentStore);
    }

    // 3. Cargar o inicializar pedidos de muestra
    const storedOrders = localStorage.getItem(`zeply_store_orders_${currentStore.slug}`);
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders));
      } catch (e) {
        loadDefaultOrders(currentStore);
      }
    } else {
      loadDefaultOrders(currentStore);
    }
  }, []);

  const loadDefaultProducts = (currStore) => {
    const demoItems = [
      {
        id: 'prod-1',
        name: 'Anillo Solitario Oro 18K & Circonia Suiza',
        price: 289000,
        compare_at_price: 350000,
        category: 'Anillos',
        stock: 14,
        sku: 'AUR-01',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80',
        variations: ['Talla 6', 'Talla 7', 'Talla 8'],
        is_active: true,
      },
      {
        id: 'prod-2',
        name: 'Reloj Cronógrafo Signature Black Edition',
        price: 420000,
        compare_at_price: 490000,
        category: 'Relojes',
        stock: 8,
        sku: 'AUR-02',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=80',
        variations: ['Correa Cuero', 'Correa Acero'],
        is_active: true,
      },
      {
        id: 'prod-3',
        name: 'Cadena Eslabón Cubano Plata Ley 925',
        price: 185000,
        compare_at_price: 220000,
        category: 'Cadenas',
        stock: 22,
        sku: 'AUR-03',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80',
        variations: ['50 cm', '55 cm'],
        is_active: true,
      },
      {
        id: 'prod-4',
        name: 'Aretes Perla Cultivada y Baño de Oro',
        price: 135000,
        compare_at_price: 165000,
        category: 'Aretes',
        stock: 18,
        sku: 'AUR-04',
        image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&auto=format&fit=crop&q=80',
        variations: ['Única'],
        is_active: true,
      },
    ];
    setProducts(demoItems);
    localStorage.setItem(`zeply_store_products_${currStore.slug}`, JSON.stringify(demoItems));
  };

  const loadDefaultOrders = (currStore) => {
    const demoOrders = [
      {
        id: 'ORD-1082',
        customer_name: 'María Camila Restrepo',
        customer_phone: '3124567890',
        customer_city: 'Medellín',
        customer_address: 'Cra 43A # 18 Sur - 120, El Poblado',
        items: '1x Anillo Solitario Oro 18K (Talla 7)',
        total: 289000,
        status: 'CONFIRMED',
        payment_method: 'Contraentrega',
        date: 'Hoy, 2:45 PM',
      },
      {
        id: 'ORD-1081',
        customer_name: 'Santiago Morales',
        customer_phone: '3189901234',
        customer_city: 'Bogotá',
        customer_address: 'Calle 116 # 15-28, Usaquén',
        items: '1x Reloj Cronógrafo Signature Black',
        total: 420000,
        status: 'SHIPPED',
        payment_method: 'Transferencia Nequi',
        date: 'Ayer, 6:15 PM',
      },
      {
        id: 'ORD-1080',
        customer_name: 'Valentina Ospina',
        customer_phone: '3007891234',
        customer_city: 'Cali',
        customer_address: 'Av San Joaquín # 14-05',
        items: '1x Cadena Eslabón Cubano (50 cm)',
        total: 185000,
        status: 'DELIVERED',
        payment_method: 'Bancolombia',
        date: 'Hace 2 días',
      },
    ];
    setOrders(demoOrders);
    localStorage.setItem(`zeply_store_orders_${currStore.slug}`, JSON.stringify(demoOrders));
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('zeply_client_session');
    navigate('/portal/login');
  };

  // Guardar o Actualizar Producto
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    let updatedProducts = [];
    if (editingProduct) {
      updatedProducts = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: productForm.name,
              price: Number(productForm.price),
              compare_at_price: Number(productForm.compare_at_price) || null,
              category: productForm.category,
              stock: Number(productForm.stock),
              sku: productForm.sku || p.sku,
              image: productForm.image || p.image,
              variations: typeof productForm.variations === 'string'
                ? productForm.variations.split(',').map((s) => s.trim())
                : productForm.variations,
              is_active: productForm.is_active,
            }
          : p
      );
      showToast('Producto actualizado exitosamente.');
    } else {
      const newProd = {
        id: `prod-${Date.now()}`,
        name: productForm.name,
        price: Number(productForm.price),
        compare_at_price: Number(productForm.compare_at_price) || null,
        category: productForm.category || 'General',
        stock: Number(productForm.stock) || 10,
        sku: productForm.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        image:
          productForm.image ||
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
        variations: productForm.variations.split(',').map((s) => s.trim()),
        is_active: productForm.is_active,
      };
      updatedProducts = [newProd, ...products];
      showToast('¡Nuevo producto añadido al catálogo!');
    }

    setProducts(updatedProducts);
    if (store?.slug) {
      localStorage.setItem(`zeply_store_products_${store.slug}`, JSON.stringify(updatedProducts));
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      if (store?.slug) {
        localStorage.setItem(`zeply_store_products_${store.slug}`, JSON.stringify(updated));
      }
      showToast('Producto eliminado.');
    }
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    setOrders(updated);
    if (store?.slug) {
      localStorage.setItem(`zeply_store_orders_${store.slug}`, JSON.stringify(updated));
    }
    showToast(`Estado de pedido actualizado a ${newStatus}.`);
  };

  const openWhatsAppWithCustomer = (order) => {
    const phone = order.customer_phone.replace(/\D/g, '');
    const cleanPhone = phone.startsWith('57') ? phone : `57${phone}`;
    const message = encodeURIComponent(
      `¡Hola ${order.customer_name}! 👋 Te escribimos de ${store?.name || 'la tienda'} respecto a tu pedido #${order.id} por valor de $${order.total.toLocaleString('es-CO')} COP. ¡Tu pedido está confirmado y en preparación para despacho! 🚀`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  if (!store) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando portal administrativo...</div>;
  }

  // Cálculos de métricas
  const totalRevenue = orders.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const activeProductsCount = products.filter((p) => p.is_active).length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Alert */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#0b1528',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          <Sparkles size={16} color="#2dd4bf" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Superior del Dashboard */}
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '14px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)',
            }}
          >
            <Store size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0b1528' }}>
                {store.name}
              </h1>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#16a34a',
                  backgroundColor: '#dcfce7',
                  padding: '2px 8px',
                  borderRadius: '999px',
                }}
              >
                🟢 EN LÍNEA
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{store.slug}.zeply.co</span>
              <span>•</span>
              <span>WhatsApp: +{store.whatsapp}</span>
            </div>
          </div>
        </div>

        {/* Botones de Acción Rápida */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link
            to={`/revista/${store.slug}`}
            target="_blank"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              backgroundColor: '#f0fdfa',
              border: '1px solid #ccfbf1',
              color: '#0d9488',
              fontSize: '0.85rem',
              fontWeight: 700,
            }}
          >
            <Eye size={15} />
            <span>Ver Tienda Pública</span>
          </Link>

          <button
            onClick={() => downloadStorePdfCatalog(store, store.currency)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: '#0f172a',
              fontSize: '0.85rem',
              fontWeight: 700,
            }}
          >
            <Download size={15} />
            <span>Descargar Catálogo PDF</span>
          </button>

          <button
            onClick={() => setIsQrModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: '#0f172a',
              fontSize: '0.85rem',
              fontWeight: 700,
            }}
          >
            <QrCode size={15} />
            <span>Código QR</span>
          </button>

          <button
            onClick={handleLogout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '10px',
              backgroundColor: '#fef2f2',
              color: '#ef4444',
              fontSize: '0.85rem',
              fontWeight: 700,
            }}
            title="Cerrar sesión"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Contenedor Principal con Navegación por Tabs */}
      <div style={{ maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '24px 20px', flex: 1 }}>
        {/* Barra de Pestañas */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid #e2e8f0',
            marginBottom: '24px',
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'overview', label: 'Resumen General', icon: TrendingUp },
            { id: 'products', label: `Productos (${products.length})`, icon: Package },
            { id: 'orders', label: `Pedidos WhatsApp (${orders.length})`, icon: ShoppingBag },
            { id: 'magazine', label: 'Revista Digital PDF', icon: BookOpen },
            { id: 'branding', label: 'Marca & QR', icon: Settings },
            { id: 'plan', label: 'Mi Plan (Trial)', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  borderBottom: isActive ? '3px solid #0d9488' : '3px solid transparent',
                  backgroundColor: 'transparent',
                  color: isActive ? '#0d9488' : '#64748b',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.92rem',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={17} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: RESUMEN GENERAL (OVERVIEW)                              */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <div>
            {/* 4 Tarjetas de Métricas Principales */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
                marginBottom: '28px',
              }}
            >
              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: '22px',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#64748b' }}>
                    Ventas del Mes (WhatsApp)
                  </span>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: '#f0fdfa',
                      color: '#0d9488',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <DollarSign size={20} />
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    color: '#0b1528',
                    fontFamily: 'var(--font-display)',
                    margin: '8px 0 4px',
                  }}
                >
                  ${totalRevenue.toLocaleString('es-CO')} COP
                </div>
                <span style={{ fontSize: '0.76rem', color: '#16a34a', fontWeight: 700 }}>
                  ↑ +28% vs semana pasada
                </span>
              </div>

              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: '22px',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#64748b' }}>
                    Pedidos Recibidos
                  </span>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: '#e0f2fe',
                      color: '#0284c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ShoppingBag size={20} />
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    color: '#0b1528',
                    fontFamily: 'var(--font-display)',
                    margin: '8px 0 4px',
                  }}
                >
                  {orders.length} pedidos
                </div>
                <span style={{ fontSize: '0.76rem', color: '#0284c7', fontWeight: 700 }}>
                  100% procesados sin comisiones
                </span>
              </div>

              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: '22px',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#64748b' }}>
                    Productos Activos
                  </span>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: '#fef3c7',
                      color: '#d97706',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Package size={20} />
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    color: '#0b1528',
                    fontFamily: 'var(--font-display)',
                    margin: '8px 0 4px',
                  }}
                >
                  {activeProductsCount} items
                </div>
                <span style={{ fontSize: '0.76rem', color: '#d97706', fontWeight: 700 }}>
                  Visibles en catálogo y revista PDF
                </span>
              </div>

              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: '22px',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#64748b' }}>
                    Visitas a tu Tienda
                  </span>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: '#ede9fe',
                      color: '#7c3aed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Eye size={20} />
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    color: '#0b1528',
                    fontFamily: 'var(--font-display)',
                    margin: '8px 0 4px',
                  }}
                >
                  1.284
                </div>
                <span style={{ fontSize: '0.76rem', color: '#7c3aed', fontWeight: 700 }}>
                  Indexada en Google e IAs
                </span>
              </div>
            </div>

            {/* Accesos Directos & Pedidos Recientes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {/* Pedidos Recientes */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '22px',
                  padding: '24px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0b1528' }}>
                    Pedidos Recientes de WhatsApp
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    style={{ fontSize: '0.82rem', color: '#0284c7', fontWeight: 700, background: 'none' }}
                  >
                    Ver todos →
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {orders.slice(0, 3).map((o) => (
                    <div
                      key={o.id}
                      style={{
                        padding: '14px',
                        borderRadius: '14px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #f1f5f9',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                          {o.customer_name} • #{o.id}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                          {o.items}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0d9488' }}>
                          ${o.total.toLocaleString('es-CO')}
                        </div>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '999px',
                            backgroundColor:
                              o.status === 'CONFIRMED'
                                ? '#dcfce7'
                                : o.status === 'SHIPPED'
                                ? '#e0f2fe'
                                : '#fef3c7',
                            color:
                              o.status === 'CONFIRMED'
                                ? '#16a34a'
                                : o.status === 'SHIPPED'
                                ? '#0284c7'
                                : '#d97706',
                          }}
                        >
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Banner de Revista Digital & Marketing */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #0b1528 0%, #13223f 100%)',
                  borderRadius: '22px',
                  padding: '28px',
                  color: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: 'rgba(45, 212, 191, 0.2)',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#2dd4bf',
                      marginBottom: '12px',
                    }}
                  >
                    <BookOpen size={13} />
                    <span>INNOVACIÓN EXCLUSIVA ZEPLY</span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>
                    Tu Catálogo Revista Digital PDF está Listo
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '20px' }}>
                    Tus clientes pueden hojear tu revista digital con todos tus productos activos y hacer pedidos en un clic por WhatsApp.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => downloadStorePdfCatalog(store, store.currency)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <Download size={15} />
                    <span>Descargar PDF</span>
                  </button>
                  <Link
                    to={`/revista/${store.slug}`}
                    target="_blank"
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '12px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Ver en Vivo</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: PRODUCTOS & INVENTARIO                                  */}
        {/* ============================================================== */}
        {activeTab === 'products' && (
          <div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '14px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '420px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#ffffff',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    width: '100%',
                  }}
                >
                  <Search size={18} color="#94a3b8" />
                  <input
                    type="text"
                    placeholder="Buscar producto por nombre o SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: '',
                    price: '',
                    compare_at_price: '',
                    category: 'General',
                    stock: 20,
                    sku: '',
                    image: '',
                    variations: 'S, M, L',
                    is_active: true,
                  });
                  setIsProductModalOpen(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  boxShadow: '0 4px 14px rgba(20, 184, 166, 0.35)',
                }}
              >
                <Plus size={18} />
                <span>Agregar Nuevo Producto</span>
              </button>
            </div>

            {/* Tabla de Productos */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '14px 18px' }}>Producto</th>
                    <th style={{ padding: '14px 18px' }}>Categoría</th>
                    <th style={{ padding: '14px 18px' }}>Precio Regular</th>
                    <th style={{ padding: '14px 18px' }}>Stock</th>
                    <th style={{ padding: '14px 18px' }}>Estado</th>
                    <th style={{ padding: '14px 18px', textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products
                    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img
                              src={p.image}
                              alt={p.name}
                              style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.name}</div>
                              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>SKU: {p.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 18px', color: '#475569', fontWeight: 600 }}>
                          {p.category}
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ fontWeight: 800, color: '#0b1528' }}>
                            ${Number(p.price).toLocaleString('es-CO')}
                          </div>
                          {p.compare_at_price && (
                            <div style={{ fontSize: '0.74rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                              ${Number(p.compare_at_price).toLocaleString('es-CO')}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span
                            style={{
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              color: p.stock > 5 ? '#16a34a' : '#dc2626',
                            }}
                          >
                            {p.stock} unidades
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '3px 8px',
                              borderRadius: '999px',
                              backgroundColor: p.is_active ? '#dcfce7' : '#f1f5f9',
                              color: p.is_active ? '#16a34a' : '#64748b',
                            }}
                          >
                            {p.is_active ? 'Activo' : 'Oculto'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setProductForm({
                                  name: p.name,
                                  price: p.price,
                                  compare_at_price: p.compare_at_price || '',
                                  category: p.category,
                                  stock: p.stock,
                                  sku: p.sku,
                                  image: p.image,
                                  variations: Array.isArray(p.variations) ? p.variations.join(', ') : p.variations,
                                  is_active: p.is_active,
                                });
                                setIsProductModalOpen(true);
                              }}
                              style={{
                                padding: '6px',
                                borderRadius: '8px',
                                backgroundColor: '#f1f5f9',
                                color: '#0284c7',
                              }}
                              title="Editar"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              style={{
                                padding: '6px',
                                borderRadius: '8px',
                                backgroundColor: '#fef2f2',
                                color: '#ef4444',
                              }}
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: PEDIDOS DE WHATSAPP (CRM)                               */}
        {/* ============================================================== */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0b1528' }}>
                Bandeja de Pedidos de WhatsApp
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Gestiona las órdenes que entran directamente desde el carrito de tu tienda online o tu revista PDF.
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '14px 18px' }}>Orden & Cliente</th>
                    <th style={{ padding: '14px 18px' }}>Dirección & Ciudad</th>
                    <th style={{ padding: '14px 18px' }}>Productos Solicitados</th>
                    <th style={{ padding: '14px 18px' }}>Total a Pagar</th>
                    <th style={{ padding: '14px 18px' }}>Estado</th>
                    <th style={{ padding: '14px 18px', textAlign: 'right' }}>Abrir WhatsApp</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>{o.customer_name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 600 }}>
                          #{o.id} • {o.customer_phone}
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 600, color: '#334155' }}>{o.customer_city}</div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{o.customer_address}</div>
                      </td>
                      <td style={{ padding: '14px 18px', color: '#475569', fontSize: '0.84rem' }}>
                        {o.items}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 800, color: '#0d9488' }}>
                          ${o.total.toLocaleString('es-CO')}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{o.payment_method}</div>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            backgroundColor:
                              o.status === 'CONFIRMED'
                                ? '#dcfce7'
                                : o.status === 'SHIPPED'
                                ? '#e0f2fe'
                                : o.status === 'DELIVERED'
                                ? '#f3e8ff'
                                : '#fef3c7',
                            color:
                              o.status === 'CONFIRMED'
                                ? '#16a34a'
                                : o.status === 'SHIPPED'
                                ? '#0284c7'
                                : o.status === 'DELIVERED'
                                ? '#7c3aed'
                                : '#d97706',
                            border: 'none',
                            outline: 'none',
                          }}
                        >
                          <option value="PENDING">Pendiente</option>
                          <option value="CONFIRMED">Confirmado</option>
                          <option value="SHIPPED">Enviado</option>
                          <option value="DELIVERED">Entregado</option>
                          <option value="CANCELLED">Cancelado</option>
                        </select>
                      </td>
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <button
                          onClick={() => openWhatsAppWithCustomer(o)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            backgroundColor: '#10b981',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                          }}
                        >
                          <MessageCircle size={15} />
                          <span>Chat Cliente</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: MI REVISTA DIGITAL PDF                                  */}
        {/* ============================================================== */}
        {activeTab === 'magazine' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                padding: '36px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  margin: '0 auto 20px',
                }}
              >
                <BookOpen size={32} />
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0b1528', marginBottom: '8px' }}>
                Tu Revista Digital Interactiva Zeply
              </h2>
              <p style={{ fontSize: '0.94rem', color: '#64748b', maxWidth: '540px', margin: '0 auto 28px' }}>
                Genera tu catálogo oficial en PDF con diseño editorial de alta gama. Puedes descargarlo e imprimirlo o enviarlo por WhatsApp a tus clientes para que compren directamente.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
                <button
                  onClick={() => downloadStorePdfCatalog(store, store.currency)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 24px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 14px rgba(20, 184, 166, 0.35)',
                  }}
                >
                  <Download size={18} />
                  <span>Descargar Catálogo PDF Ahora</span>
                </button>

                <Link
                  to={`/revista/${store.slug}`}
                  target="_blank"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 24px',
                    borderRadius: '12px',
                    backgroundColor: '#f1f5f9',
                    color: '#0f172a',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                  }}
                >
                  <Eye size={18} />
                  <span>Ver Revista Web Interactiva</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: MARCA & CÓDIGO QR                                       */}
        {/* ============================================================== */}
        {activeTab === 'branding' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                padding: '36px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              }}
            >
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0b1528', marginBottom: '8px' }}>
                Personalización de Marca & Código QR
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '24px' }}>
                Configura los colores oficiales de tu tienda y descarga tu código QR para packaging.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                    Color Primario de tu Tienda
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <input
                      type="color"
                      value={store.primary_color || '#0ea5e9'}
                      onChange={(e) => {
                        const newStore = { ...store, primary_color: e.target.value };
                        setStore(newStore);
                        localStorage.setItem('zeply_client_session', JSON.stringify(newStore));
                        showToast('Color de marca actualizado.');
                      }}
                      style={{ width: '48px', height: '48px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>
                      {store.primary_color || '#0ea5e9'}
                    </span>
                  </div>

                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                    Número Oficial de WhatsApp
                  </label>
                  <input
                    type="text"
                    value={store.whatsapp}
                    onChange={(e) => {
                      const newStore = { ...store, whatsapp: e.target.value };
                      setStore(newStore);
                      localStorage.setItem('zeply_client_session', JSON.stringify(newStore));
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      marginBottom: '20px',
                    }}
                  />
                </div>

                {/* Código QR Oficial */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '18px',
                    padding: '24px',
                    textAlign: 'center',
                    border: '1px dashed #cbd5e1',
                  }}
                >
                  <div
                    style={{
                      width: '140px',
                      height: '140px',
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      padding: '10px',
                      margin: '0 auto 14px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://zeply.co/revista/${store.slug}`}
                      alt="Código QR Tienda"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0b1528' }}>
                    QR Oficial de tu Tienda
                  </div>
                  <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '4px 0 12px' }}>
                    Imprímelo en tus tarjetas, empaques y bolsas de envío.
                  </p>
                  <a
                    href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=https://zeply.co/revista/${store.slug}`}
                    download="QR-Tienda-Zeply.png"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      backgroundColor: '#0b1528',
                      color: '#ffffff',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
                  >
                    <Download size={14} />
                    <span>Descargar Imagen QR</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: MI PLAN & SUSCRIPCIÓN                                   */}
        {/* ============================================================== */}
        {activeTab === 'plan' && (
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                padding: '36px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: '#0d9488',
                      backgroundColor: '#f0fdfa',
                      padding: '4px 10px',
                      borderRadius: '999px',
                    }}
                  >
                    ESTADO ACTUAL
                  </span>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0b1528', marginTop: '6px' }}>
                    Plan {store.plan || 'Starter'} (Prueba Activa)
                  </h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>
                    14 Días
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Restantes de prueba gratis</div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '24px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '8px' }}>
                  <span style={{ color: '#475569' }}>Límite de productos utilizados:</span>
                  <strong>{products.length} de 250 productos</strong>
                </div>
                <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${(products.length / 250) * 100}%`,
                      height: '100%',
                      backgroundColor: '#0d9488',
                      borderRadius: '999px',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                {[
                  'Tienda online con subdominio oficial Zeply',
                  'Exclusiva Revista Digital Interactiva PDF',
                  'Recepción ilimitada de pedidos a WhatsApp',
                  '0% comisiones por venta (100% de tus ingresos son tuyos)',
                  'Soporte directo por chat y WhatsApp',
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
                    <CheckCircle size={16} color="#10b981" />
                    <span style={{ color: '#334155' }}>{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  confetti({ particleCount: 60, spread: 60 });
                  showToast('Tu plan está activo en periodo de prueba.');
                }}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Sparkles size={18} />
                <span>Plan Oficial Activo • Disfruta tu Periodo de Prueba</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Crear / Editar Producto */}
      {isProductModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(11, 21, 40, 0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setIsProductModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '540px',
              width: '100%',
              boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0b1528', marginBottom: '18px' }}>
              {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
            </h3>

            <form onSubmit={handleSaveProduct}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="Ej: Vestido Seda Elegante, Anillo Oro 18K..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                      Precio de Venta ($ COP) *
                    </label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="189000"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                      Precio Anterior (Tachado)
                    </label>
                    <input
                      type="number"
                      value={productForm.compare_at_price}
                      onChange={(e) => setProductForm({ ...productForm, compare_at_price: e.target.value })}
                      placeholder="240000"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                      Categoría
                    </label>
                    <input
                      type="text"
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      placeholder="Ej: Ropa, Joyas, Tech..."
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                      Stock Disponible
                    </label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      placeholder="20"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                    URL de la Imagen (Unsplash o Web)
                  </label>
                  <input
                    type="url"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                    Variaciones (Tallas, Colores - separados por coma)
                  </label>
                  <input
                    type="text"
                    value={productForm.variations}
                    onChange={(e) => setProductForm({ ...productForm, variations: e.target.value })}
                    placeholder="S, M, L, XL ó Oro, Plata"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      backgroundColor: '#f1f5f9',
                      color: '#334155',
                      fontWeight: 700,
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                      color: '#ffffff',
                      fontWeight: 800,
                    }}
                  >
                    Guardar Producto
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Código QR de Tienda */}
      {isQrModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(11, 21, 40, 0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setIsQrModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '420px',
              width: '100%',
              boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0b1528', marginBottom: '6px' }}>
              Código QR de {store.name}
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '20px' }}>
              Escanea para abrir la tienda pública y la revista digital
            </p>

            <div
              style={{
                width: '180px',
                height: '180px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '12px',
                margin: '0 auto 20px',
              }}
            >
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://zeply.co/revista/${store.slug}`}
                alt="QR Code"
                style={{ width: '100%', height: '100%' }}
              />
            </div>

            <button
              onClick={() => setIsQrModalOpen(false)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: '#f1f5f9',
                color: '#0f172a',
                fontWeight: 700,
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
