import React from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import StatsTicker from '../components/landing/StatsTicker';
import ProblemVsSolution from '../components/landing/ProblemVsSolution';
import StoreShowcase from '../components/landing/StoreShowcase';
import RoiCalculator from '../components/landing/RoiCalculator';
import FeaturesGrid from '../components/landing/FeaturesGrid';
import PricingTable from '../components/landing/PricingTable';
import FaqAccordion from '../components/landing/FaqAccordion';
import CtaSection from '../components/landing/CtaSection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafcfd' }}>
      {/* Menú Sticky Flotante que cambia de color y estado con el scroll */}
      <Navbar />

      {/* Hero Principal con Palabras Dinámicas y Mockup Interactivo */}
      <main>
        <HeroSection />

        {/* Ticker de Métricas y Contadores Animados con Scroll Trigger */}
        <StatsTicker />

        {/* Beneficios de tener tu tienda y Por Qué Contratarnos (No perder chats de WhatsApp) */}
        <div id="solucion">
          <ProblemVsSolution />
        </div>

        {/* Vitrina de Tiendas Animadas por Nichos con Simulación de Pedido */}
        <StoreShowcase />

        {/* Calculadora Gráfica Interactiva de Retorno de Inversión (ROI) */}
        <RoiCalculator />

        {/* Grid de Beneficios Tecnológicos (Revista PDF, QR, Panel, etc.) */}
        <FeaturesGrid />

        {/* Tabla de Planes de Precios Transparentes */}
        <PricingTable />

        {/* Preguntas Frecuentes optimizadas para Google y Búsquedas de IA */}
        <FaqAccordion />

        {/* CTA Final con Lanzamiento de Confeti */}
        <CtaSection />
      </main>

      {/* Footer Semántico y SEO */}
      <Footer />
    </div>
  );
}
