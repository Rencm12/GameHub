import { jsPDF } from "jspdf";

export const generarBoleta = (
  orden_id,
  carrito,
  total,
  nombre,
  correo,
  telefono,
  direccion,
  metodoPago,
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margen = 15;

  // Color de fondo oscuro
  doc.setFillColor(15, 17, 39);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Encabezado decorativo
  doc.setFillColor(0, 255, 195);
  doc.rect(0, 0, pageWidth, 40, "F");

  // Logo/Nombre
  doc.setTextColor(15, 17, 39);
  doc.setFontSize(28);
  doc.setFont(undefined, "bold");
  doc.text("GameHub", pageWidth / 2, 25, { align: "center" });

  // Línea separadora
  doc.setDrawColor(15, 17, 39);
  doc.setLineWidth(0.5);
  doc.line(margen, 42, pageWidth - margen, 42);

  // Título boleta
  doc.setTextColor(0, 255, 195);
  doc.setFontSize(16);
  doc.setFont(undefined, "bold");
  doc.text("BOLETA DE VENTA ELECTRÓNICA", margen, 55);

  // Número de orden
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.text(`N° ${orden_id.substring(0, 8).toUpperCase()}`, margen, 65);

  // Fecha
  const fecha = new Date().toLocaleDateString("es-PE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  doc.text(`Fecha: ${fecha}`, pageWidth - margen, 65, { align: "right" });

  // Sección datos del cliente
  doc.setDrawColor(50, 50, 80);
  doc.rect(margen, 72, pageWidth - 2 * margen, 35);

  doc.setTextColor(0, 255, 195);
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.text("DATOS DEL CLIENTE", margen + 5, 80);

  doc.setTextColor(200, 200, 200);
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.text(`Cliente: ${nombre}`, margen + 5, 90);
  doc.text(`Correo: ${correo}`, margen + 5, 97);
  doc.text(`Teléfono: ${telefono}`, pageWidth / 2, 90);
  doc.text(`Dirección: ${direccion}`, margen + 5, 104);

  // Sección productos
  let yPos = 120;
  doc.setDrawColor(50, 50, 80);
  doc.rect(margen, yPos - 5, pageWidth - 2 * margen, 8);

  doc.setTextColor(0, 255, 195);
  doc.setFontSize(10);
  doc.setFont(undefined, "bold");
  doc.text("DESCRIPCIÓN", margen + 5, yPos);
  doc.text("CANT.", pageWidth / 2 + 30, yPos);
  doc.text("PRECIO", pageWidth - 50, yPos);
  doc.text("TOTAL", pageWidth - margen - 5, yPos, { align: "right" });

  yPos += 8;
  doc.setLineWidth(0.1);
  doc.line(margen, yPos, pageWidth - margen, yPos);

  doc.setTextColor(200, 200, 200);
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");

  carrito.forEach((item) => {
    const precioTotal = item.precio * item.cantidad;

    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = 20;
    }

    doc.text(item.nombre.substring(0, 35), margen + 5, yPos);
    doc.text(String(item.cantidad), pageWidth / 2 + 30, yPos);
    doc.text(`S/ ${item.precio.toFixed(2)}`, pageWidth - 50, yPos);
    doc.text(`S/ ${precioTotal.toFixed(2)}`, pageWidth - margen - 5, yPos, {
      align: "right",
    });

    yPos += 7;
  });

  // Línea antes del total
  yPos += 5;
  doc.setLineWidth(0.3);
  doc.line(margen, yPos, pageWidth - margen, yPos);

  // Resumen de pago
  yPos += 8;
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(10);

  const subtotal = total / 1.18;
  const igv = total - subtotal;

  doc.text("Subtotal:", pageWidth - 50, yPos);
  doc.text(`S/ ${subtotal.toFixed(2)}`, pageWidth - margen - 5, yPos, {
    align: "right",
  });

  yPos += 7;
  doc.text("IGV (18%):", pageWidth - 50, yPos);
  doc.text(`S/ ${igv.toFixed(2)}`, pageWidth - margen - 5, yPos, {
    align: "right",
  });

  yPos += 8;
  doc.setLineWidth(0.3);
  doc.line(margen, yPos, pageWidth - margen, yPos);

  yPos += 7;
  doc.setTextColor(0, 255, 195);
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text("TOTAL:", pageWidth - 50, yPos);
  doc.text(`S/ ${total.toFixed(2)}`, pageWidth - margen - 5, yPos, {
    align: "right",
  });

  // Método de pago
  yPos += 12;
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.text(`Método de Pago: ${metodoPago}`, margen, yPos);

  // Pie de página
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text(
    "Gracias por tu compra. www.gamehub.com | soporte@gamehub.com",
    pageWidth / 2,
    pageHeight - 12,
    { align: "center" },
  );

  doc.save(`boleta-${orden_id.substring(0, 8)}.pdf`);
};
