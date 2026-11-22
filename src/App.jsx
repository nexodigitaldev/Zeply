import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MasterLogin from './pages/MasterLogin';
import MasterDashboard from './pages/MasterDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección principal al Login del Panel Rey */}
        <Route path="/" element={<Navigate to="/rey-admin" replace />} />
        
        {/* Rutas Panel Rey (Master Admin) */}
        <Route path="/rey-admin" element={<MasterLogin />} />
        <Route path="/login" element={<Navigate to="/rey-admin" replace />} />
        <Route path="/rey-admin/dashboard" element={<MasterDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/rey-admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
