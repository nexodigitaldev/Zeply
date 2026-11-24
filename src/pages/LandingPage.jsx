import React from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import StatsTicker from '../components/landing/StatsTicker';
import ProblemVsSolution from '../components/landing/ProblemVsSolution';
import MagazineFlipbook from '../components/landing/MagazineFlipbook';
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
      {/* Menú Sticky Flotante Limpio y Alineado */}
      <Navbar />

      <main>
        {/* Hero Principal con Tipografía de Alta Gama */}
        <HeroSection />

        {/* Ticker de Métricas Comprobadas */}
        <StatsTicker />

        {/* Por Qué Contratarnos: La Solución a los Chats de WhatsApp */}
        <div id="solucion">
          <ProblemVsSolution />
        </div>

        {/* Exclusivo Catálogo Revista Digital Estilo Avon/Ésika con Hojas que se Pasan */}
        <div id="revista-digital">
          <MagazineFlipbook />
        </div>

        {/* Vitrina de Tiendas con Botón Estático "Pedir por WhatsApp" */}
        <StoreShowcase />

        {/* Calculadora Gráfica de Rentabilidad (ROI) */}
        <RoiCalculator />

        {/* Grid de Beneficios Tecnológicos */}
        <div id="beneficios">
          <FeaturesGrid />
        </div>

        {/* Planes de Precios: 3 Planes con 7 Días de Prueba Gratis */}
        <PricingTable />

        {/* Preguntas Frecuentes (FAQ) */}
        <div id="faq">
          <FaqAccordion />
        </div>

        {/* Llamado a la Acción Final */}
        <CtaSection />
      </main>

      {/* Footer Semántico */}
      <Footer />
    </div>
  );
}
