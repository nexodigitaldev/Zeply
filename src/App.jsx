import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MasterLogin from './pages/MasterLogin';
import MasterDashboard from './pages/MasterDashboard';

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
      <Routes>
        {/* Redirección raíz al login de Real Admin */}
        <Route path="/" element={<Navigate to="/rey-admin" replace />} />
        
        {/* Rutas de Acceso Real Admin */}
        <Route path="/rey-admin" element={<MasterLogin />} />
        <Route path="/login" element={<Navigate to="/rey-admin" replace />} />

        {/* Dashboard Maestro Protegido */}
        <Route
          path="/rey-admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <MasterDashboard />
            </ProtectedAdminRoute>
          }
        />

        {/* Fallback de seguridad */}
        <Route path="*" element={<Navigate to="/rey-admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
