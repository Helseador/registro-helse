/* Constancia de capacitación */
(function () {
  function pdf() {
    return new window.jspdf.jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
  }

  const TEMAS = [
    "El caso del 20 %: autorización, registro y respaldo.",
    "Qué hace la IA cuando inventa, ejecuta o saca datos.",
    "Phishing y fraude del proveedor (cambio de cuenta bancaria).",
    "Datos sensibles y principio de finalidad (Ley 1581 de 2012).",
    "Protocolo si algo pasa: para, reporta y no borres.",
  ];

  window.CapacitacionPDF = {
    descargar: function (r) {
      const doc = pdf();
      const M = 18, W = 216 - M * 2;
      let y = 18;

      const salto = (n) => { if (y + n > 268) { doc.addPage(); y = 20; } };
      const texto = (t, size, style, gap) => {
        doc.setFont("helvetica", style || "normal");
        doc.setFontSize(size || 9.5);
        const lineas = doc.splitTextToSize(String(t), W);
        lineas.forEach((ln) => { salto(6); doc.text(ln, M, y); y += (size || 9.5) * 0.42; });
        y += gap == null ? 3 : gap;
      };

      doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(27, 58, 107);
      doc.text("GRUPO HELSE S.A.S.", M, y);
      doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(90, 105, 120);
      doc.text("Capacitación interna", 216 - M, y, { align: "right" });
      y += 3;
      doc.setDrawColor(27, 58, 107); doc.setLineWidth(0.6); doc.line(M, y, 216 - M, y);
      y += 10;

      doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(20, 30, 45);
      doc.text("CONSTANCIA DE ASISTENCIA Y ACEPTACIÓN", 108, y, { align: "center" });
      y += 7;
      doc.setFontSize(11);
      doc.text("Capacitación: Seguridad de la Información", 108, y, { align: "center" });
      y += 5;
      doc.setFont("helvetica", "normal"); doc.setFontSize(9);
      doc.text("Fecha: 24 de noviembre de 2026 · Modalidad: presencial / virtual", 108, y, { align: "center" });
      y += 10;

      texto("Datos del asistente", 10, "bold", 2);
      texto("Nombre: " + (r.nombre || "____________________"), 9.5, "normal", 1);
      texto("C.C. No.: " + (r.cedula || "____________________") + "     Cargo: " + (r.cargo || "____________________"), 9.5, "normal", 1);
      texto("Área / equipo: " + (r.area || "____________________") + "     Correo: " + (r.correo || "____________________"), 9.5, "normal", 6);

      texto("Contenido de la capacitación", 10, "bold", 2);
      TEMAS.forEach((t) => texto("•  " + t, 9.5, "normal", 1));
      y += 2;

      texto("Evaluación", 10, "bold", 2);
      texto("Resultado: " + (r.puntaje != null ? r.puntaje : "—") + " de " + (r.total_preguntas || 4) + " respuestas correctas. " + (r.aprobado ? "Aprobado." : "No aprobado."), 9.5, "normal", 6);

      texto("Declaración", 10, "bold", 2);
      texto("Declaro que recibí la capacitación de Seguridad de la Información, que comprendí su contenido, que tuve la oportunidad de resolver mis dudas y que me comprometo a aplicar las medidas de seguridad, proteger la información de la compañía y reportar cualquier incidente por los canales oficiales.", 9.5, "normal", 10);

      salto(52);
      if (r.firma_imagen) {
        try {
          const fmt = r.firma_imagen.indexOf("data:image/jpeg") === 0 ? "JPEG" : "PNG";
          doc.addImage(r.firma_imagen, fmt, M, y, 62, 24);
        } catch (e) { /* sin firma */ }
      }
      y += 26;
      doc.setDrawColor(120, 130, 145); doc.setLineWidth(0.3); doc.line(M, y, M + 62, y);
      y += 5;
      doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(40, 50, 60);
      doc.text("Firma del asistente", M, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.text("Nombre: " + (r.nombre || "____________________"), M, y);
      doc.text("C.C. No.: " + (r.cedula || "____________________"), 108, y);

      doc.setFontSize(7.5); doc.setTextColor(120, 130, 145);
      doc.text("Constancia generada digitalmente por la plataforma de Grupo Helse.", 108, 280, { align: "center" });

      const nombre = (r.nombre || "asistente").replace(/[^\wáéíóúÁÉÍÓÚñÑ ]/g, "").trim().replace(/\s+/g, "_");
      doc.save("Constancia_Capacitacion_" + nombre + ".pdf");
    }
  };
})();
