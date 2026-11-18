/* Generador de PDF de la Declaración Voluntaria de Traslado */
(function () {
  function pdf() {
    return new window.jspdf.jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
  }

  function fechaLarga(r) {
    const dia = r.dia_firma || "";
    return (dia ? dia + " de " : "") + "noviembre de 2026";
  }

  window.DeclaracionPDF = {
    descargar: function (r) {
      const doc = pdf();
      const M = 18;
      const W = 216 - M * 2;
      let y = 18;

      const salto = (n) => {
        if (y + n > 268) { doc.addPage(); y = 20; }
      };

      const texto = (t, size, style, gap) => {
        doc.setFont("helvetica", style || "normal");
        doc.setFontSize(size || 9.5);
        const lineas = doc.splitTextToSize(String(t), W);
        lineas.forEach((ln) => {
          salto(6);
          doc.text(ln, M, y);
          y += (size || 9.5) * 0.42;
        });
        y += gap == null ? 3 : gap;
      };

      // Encabezado
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(27, 58, 107);
      doc.text("GRUPO HELSE S.A.S.", M, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(90, 105, 120);
      doc.text("Evento corporativo · Despedida de Fin de Año 2026", 216 - M, y, { align: "right" });
      y += 3;
      doc.setDrawColor(27, 58, 107);
      doc.setLineWidth(0.6);
      doc.line(M, y, 216 - M, y);
      y += 10;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(20, 30, 45);
      doc.text("DOCUMENTO DE DECLARACIÓN VOLUNTARIA DE TRASLADO", 108, y, { align: "center" });
      y += 6;
      doc.text("Y EXONERACIÓN DE RESPONSABILIDAD CIVIL Y LABORAL", 108, y, { align: "center" });
      y += 9;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("Ciudad y fecha: " + (r.ciudad_fecha || "____________________"), M, y);
      y += 7;

      texto("Señores: GRUPO HELSE S.A.S.", 9.5, "bold", 2);
      texto("De: " + (r.nombre || "____________________"), 9.5, "normal", 1);
      texto("Identificación: C.C. No. " + (r.cedula || "____________________"), 9.5, "normal", 1);
      texto("Cargo: " + (r.cargo || "____________________"), 9.5, "normal", 6);

      texto(
        "Por medio del presente documento, yo, " + (r.nombre || "____________________") +
        ", mayor de edad y plenamente capaz, obrando en nombre propio, manifiesto de forma libre, voluntaria y espontánea lo siguiente de cara al evento corporativo programado en el municipio de Arbeláez (Cundinamarca) entre el 20 y el 22 de noviembre de 2026:",
        9.5, "normal", 4
      );

      texto("PRIMERO. - Reconozco expresamente que GRUPO HELSE S.A.S. ha puesto a mi disposición, de manera gratuita y garantizada, un medio de transporte idóneo para mi desplazamiento de ida y regreso al lugar del evento. No obstante, por motivos estrictamente personales y de mi exclusiva conveniencia, HE DECIDIDO DECLINAR el uso de dicho transporte oficial.", 9.5, "normal", 4);

      texto("SEGUNDO. - Informo a la compañía que realizaré el desplazamiento hacia y desde Arbeláez (Cundinamarca) asumiendo por mi cuenta y riesgo la logística del viaje, utilizando para ello el siguiente vehículo (propio o de un tercero bajo mi responsabilidad):", 9.5, "normal", 3);

      texto("Clase de Vehículo: " + (r.vehiculo_clase || "____________________") +
            "     Marca y Modelo: " + (r.vehiculo_marca || "____________________"), 9.5, "normal", 1);
      texto("Placa: " + (r.vehiculo_placa || "____________________") +
            "     Nombre del Conductor: " + (r.conductor || "____________________"), 9.5, "normal", 5);

      texto("TERCERO. - Declaro bajo la gravedad de juramento que el vehículo descrito cuenta con toda la documentación legal vigente exigida por las autoridades de tránsito colombianas, incluyendo, pero sin limitarse a: Seguro Obligatorio de Accidentes de Tránsito (SOAT), Revisión Técnico-Mecánica (si aplica) y que el conductor asignado posee licencia de conducción vigente y de la categoría correspondiente.", 9.5, "normal", 4);

      texto("CUARTO. - Entiendo y acepto que, al no utilizar el transporte suministrado por el empleador, mi desplazamiento no obedece a órdenes, subordinación ni cumplimiento de funciones propias de mi cargo. En consecuencia, acepto expresamente que cualquier siniestro, accidente de tránsito o eventualidad que ocurra durante los trayectos de ida o regreso NO CONSTITUYE ACCIDENTE DE TRABAJO, liberando a GRUPO HELSE S.A.S. de cualquier reporte ante la Administradora de Riesgos Laborales (ARL) por hechos ocurridos en el trayecto.", 9.5, "normal", 4);

      texto("QUINTO. - Asumo la guarda material y jurídica de la actividad peligrosa de conducción. Por consiguiente, eximo y libero total y definitivamente a GRUPO HELSE S.A.S., a sus accionistas, representantes legales, directivos y empleados, de cualquier responsabilidad civil (contractual o extracontractual), penal, administrativa o contravencional derivada de accidentes, choques, hurtos, daños a terceros (bienes o personas) o multas de tránsito que puedan presentarse durante mi desplazamiento o el estacionamiento del vehículo.", 9.5, "normal", 4);

      texto("Me obligo a mantener indemne a GRUPO HELSE S.A.S. ante cualquier reclamación, demanda o requerimiento de terceros que tenga causa en mi desplazamiento independiente.", 9.5, "normal", 4);

      texto("En constancia de lectura, entendimiento y aceptación plena de las implicaciones legales de este documento, lo suscribo a los " + (r.dia_firma || "____") + " días del mes de noviembre de 2026.", 9.5, "normal", 10);

      // Firma
      salto(50);
      if (r.firma_trabajador) {
        try {
          const fmt = r.firma_trabajador.indexOf("data:image/jpeg") === 0 ? "JPEG" : "PNG";
          doc.addImage(r.firma_trabajador, fmt, M, y, 62, 24);
        } catch (e) { /* sin firma */ }
      }
      y += 26;
      doc.setDrawColor(120, 130, 145);
      doc.setLineWidth(0.3);
      doc.line(M, y, M + 62, y);
      y += 5;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(40, 50, 60);
      doc.text("Firma del Trabajador", M, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.text("Nombre: " + (r.nombre || "____________________"), M, y);
      doc.text("C.C. No. " + (r.cedula || "____________________"), 108, y);

      // Pie
      doc.setFontSize(7.5);
      doc.setTextColor(120, 130, 145);
      doc.text("Documento firmado digitalmente a través de la plataforma de Grupo Helse · " + fechaLarga(r), 108, 280, { align: "center" });

      const nombre = (r.nombre || "declaracion").replace(/[^\wáéíóúÁÉÍÓÚñÑ ]/g, "").trim().replace(/\s+/g, "_");
      doc.save("Declaracion_Traslado_" + nombre + ".pdf");
    }
  };
})();
