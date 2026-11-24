import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Code-splitting para carga ultrarrápida y SEO óptimo
const LandingPage = lazy(() => import('./pages/LandingPage'));
const ClientRegister = lazy(() => import('./pages/ClientRegister'));
const ClientLogin = lazy(() => import('./pages/ClientLogin'));
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));
const MasterLogin = lazy(() => import('./pages/MasterLogin'));
const MasterDashboard = lazy(() => import('./pages/MasterDashboard'));
const MagazineViewer = lazy(() => import('./pages/MagazineViewer'));

// Componente de carga suave con estética Zeply
function PageLoadingFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafcfd',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            border: '3px solid #e0f2fe',
            borderTopColor: '#0ea5e9',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 12px',
          }}
        />
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0d9488' }}>
          Zeply • Cargando...
        </span>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Guardián de seguridad: Solo permite el acceso al Real Admin si tiene sesión válida
function ProtectedAdminRoute({ children }) {
  const session = localStorage.getItem('zeply_master_admin_session');
  if (!session) {
    return <Navigate to="/rey-admin" replace />;
  }
  try {
    const parsed = JSON.parse(session);
    if (parsed.email !== 'nexodigitaldev@gmail.com') {
      localStorage.removeItem('zeply_master_admin_session');
      return <Navigate to="/rey-admin" replace />;
    }
  } catch {
    localStorage.removeItem('zeply_master_admin_session');
    return <Navigate to="/rey-admin" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          {/* Landing Page Principal de Zeply con SEO, GEO y Animaciones */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Registro y Creación de Tiendas para Clientes */}
          <Route path="/registro" element={<ClientRegister />} />

          {/* Portal y Paneles Administrativos para Clientes */}
          <Route path="/portal/login" element={<ClientLogin />} />
          <Route path="/login" element={<Navigate to="/portal/login" replace />} />
          <Route path="/portal" element={<ClientDashboard />} />
          <Route path="/portal/dashboard" element={<ClientDashboard />} />

          {/* Revista Digital Interactiva (Pública para clientes y tiendas) */}
          <Route path="/revista/:slug" element={<MagazineViewer />} />
          <Route path="/revista" element={<MagazineViewer />} />

          {/* Rutas de Acceso Real Admin / Superadmin */}
          <Route path="/rey-admin" element={<MasterLogin />} />
          <Route
            path="/rey-admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <MasterDashboard />
              </ProtectedAdminRoute>
            }
          />

          {/* Fallback de seguridad al home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
