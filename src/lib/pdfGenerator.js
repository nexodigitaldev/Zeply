import { jsPDF } from 'jspdf';

export function downloadStorePdfCatalog(store, currency = 'COP') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const storeName = store?.name || 'Tienda Zeply';
  const whatsapp = store?.whatsapp || '3184804720';
  const niche = store?.niche?.toUpperCase() || 'GENERAL';

  const formatPrice = (amount) => {
    if (currency === 'USD') {
      const usd = (amount / 4000).toFixed(2);
      return `$ ${usd} USD`;
    }
    return `$ ${new Intl.NumberFormat('es-CO').format(amount)} COP`;
  };

  // Demo products by niche or fallback
  const products = [
    { name: 'Producto Premier Destacado Oro', code: 'ZP-01', price: 289000, desc: 'Colección oficial con acabados de alta gama y garantía oficial.' },
    { name: 'Reloj Cronógrafo Signature Black', code: 'ZP-02', price: 420000, desc: 'Diseño minimalista y elegante para uso diario o eventos.' },
    { name: 'Cadena Eslabón Cubano Especial', code: 'ZP-03', price: 185000, desc: 'Fabricación certificada y resistencia garantizada.' },
    { name: 'Aretes Perla Cultivada y Baño Oro', code: 'ZP-04', price: 135000, desc: 'Pieza atemporal de máxima sofisticación.' },
    { name: 'Pulsera Tennis Circones Suizos', code: 'ZP-05', price: 210000, desc: 'Brillo excepcional y cierre de seguridad reforzado.' },
    { name: 'Dije Personalizado Inicial Oro', code: 'ZP-06', price: 165000, desc: 'Grabado exclusivo con inicial a elección del cliente.' },
  ];

  // ==========================================
  // PÁGINA 1: PORTADA
  // ==========================================
  // Fondo de portada elegante
  doc.setFillColor(15, 23, 42); // Navy profundo
  doc.rect(0, 0, 210, 297, 'F');

  // Acento de color superior
  doc.setFillColor(2, 132, 199); // Azul Zeply
  doc.rect(0, 0, 210, 8, 'F');

  // Badge Zeply
  doc.setFontSize(10);
  doc.setTextColor(56, 189, 248);
  doc.text('ZEPLY • CATÁLOGO DIGITAL OFICIAL 2026', 105, 30, { align: 'center' });

  // Título de la tienda
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text(storeName.toUpperCase(), 105, 60, { align: 'center' });

  // Nicho
  doc.setFontSize(13);
  doc.setTextColor(148, 163, 184);
  doc.text(`COLECCIÓN TEMPORADA: ${niche}`, 105, 75, { align: 'center' });

  // Línea divisoria
  doc.setDrawColor(2, 132, 199);
  doc.setLineWidth(1);
  doc.line(60, 85, 150, 85);

  // Recuadro informativo
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(30, 120, 150, 60, 4, 4, 'F');

  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('¿Cómo realizar tu pedido?', 105, 138, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225);
  doc.text('1. Revisa las referencias y precios en las siguientes páginas.', 105, 148, { align: 'center' });
  doc.text(`2. Escríbenos directamente al WhatsApp Oficial: +57 ${whatsapp}`, 105, 156, { align: 'center' });
  doc.text('3. Despachamos tu pedido con número de guía inmediato.', 105, 164, { align: 'center' });

  // Pie de portada
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generado para ${storeName} • Infraestructura Multi-Tenant Zeply`, 105, 280, { align: 'center' });

  // ==========================================
  // PÁGINA 2: PRODUCTOS DESTACADOS
  // ==========================================
  doc.addPage();
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, 210, 297, 'F');

  // Cabecera de página
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 24, 'F');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(`${storeName} • Catálogo de Productos (Página 2 de 3)`, 14, 16);

  let yPos = 38;
  products.slice(0, 3).forEach((item) => {
    // Tarjeta de producto
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, yPos, 182, 45, 3, 3, 'FD');

    // Nombre y código
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(item.name, 22, yPos + 12);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Referencia: ${item.code}`, 22, yPos + 20);

    // Descripción
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(item.desc, 22, yPos + 28);

    // Precio
    doc.setFontSize(14);
    doc.setTextColor(2, 132, 199);
    doc.text(formatPrice(item.price), 22, yPos + 38);

    // Botón / indicación WhatsApp
    doc.setFillColor(22, 163, 74);
    doc.roundedRect(125, yPos + 26, 62, 12, 2, 2, 'F');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(`Pedir al ${whatsapp}`, 156, yPos + 34, { align: 'center' });

    yPos += 52;
  });

  // ==========================================
  // PÁGINA 3: MÁS PRODUCTOS Y CONTACTO
  // ==========================================
  doc.addPage();
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, 210, 297, 'F');

  // Cabecera
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 24, 'F');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(`${storeName} • Colección Exclusiva & Envíos (Página 3 de 3)`, 14, 16);

  yPos = 38;
  products.slice(3, 6).forEach((item) => {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, yPos, 182, 45, 3, 3, 'FD');

    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(item.name, 22, yPos + 12);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Referencia: ${item.code}`, 22, yPos + 20);

    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(item.desc, 22, yPos + 28);

    doc.setFontSize(14);
    doc.setTextColor(2, 132, 199);
    doc.text(formatPrice(item.price), 22, yPos + 38);

    doc.setFillColor(22, 163, 74);
    doc.roundedRect(125, yPos + 26, 62, 12, 2, 2, 'F');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(`Pedir al ${whatsapp}`, 156, yPos + 34, { align: 'center' });

    yPos += 52;
  });

  // Caja de Términos y Envíos
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(14, 205, 182, 60, 4, 4, 'FD');

  doc.setFontSize(12);
  doc.setTextColor(3, 105, 161);
  doc.text('Políticas de Envío y Medios de Pago', 24, 220);

  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text('• Cobertura nacional con envíos asegurados a las principales ciudades y municipios.', 24, 230);
  doc.text('• Medios de pago: Transferencia bancaria, PSE, Nequi y pedidos coordinados por WhatsApp.', 24, 238);
  doc.text(`• Línea directa de atención al cliente: +57 ${whatsapp}`, 24, 246);
  doc.text('• Garantía de satisfacción y cambios respaldados por la tienda.', 24, 254);

  // Guardar archivo PDF directamente al explorador
  const safeName = storeName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  doc.save(`${safeName}_catalogo_zeply.pdf`);
}
