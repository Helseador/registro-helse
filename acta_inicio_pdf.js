/*!
 * acta_inicio_pdf.js — Acta de Entrega · Inicio de Tratamiento
 * FTA-02-P2D-V.2 · Grupo Helse SAS
 * Genera el PDF del acta con la firma del paciente.
 */
(function () {
'use strict';

var G = (typeof window !== 'undefined') ? window : globalThis;
var LOGO = 'data:image/jpeg;base64,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4Kp9XyQtb9ZF4AlVrYqana6YcsbXdS4noVPlhZOwseOZp8QoJqSKenMD2ZixjlQY/b78PGqN9NQUdPVau9l0NzB9VaWA/XAfJXs05puh0jpi3WW0xiKht8LYYIx5Nb4L6vssfcCHlxGBgAeijihZAwNYMNHkgop6aOolge88rwc4VRzxyylrm9WeBKmPp43yNeW5c3wK5MbSckdUFM1jw+cvOWuHuqGKkZ7EY3MPvdCASqwsBAGPDwXKChp4I6WlNNC73mDm5SclQ0MktQ1754ywN8GlVjaaNk7pg3EjhguUwgEEeSChZJDc4z3jMxA4GVFPC1lMBDIIAD9oqpZAxkfI1uG+i4lpo5ou7e3mZ6IKaWnY4NnY0GcDAf8ABT2CJ8gcMOkAxlTWMbG0NaMD0UMcDIiS1uCfFBMREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQf/2Q==';

var W = 210, M = 14, CW = W - M * 2;
var AZUL = [27, 58, 107], AZUL_LT = [227, 234, 245];
var GRIS = [84, 110, 122], TEXTO = [26, 44, 43], VERDE = [46, 125, 50];
var BORDE = [176, 196, 222];

function pad(n) { return (n < 10 ? '0' : '') + n; }

function nuevo() {
  var J = G.jspdf && G.jspdf.jsPDF;
  if (!J) throw new Error('jsPDF no está cargado (jspdf.umd.min.js).');
  return new J({ unit: 'mm', format: 'a4' });
}

function limpia(t) {
  return String(t == null ? '' : t)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_').replace(/[^A-Za-z0-9_\-]+/g, '');
}

function archivo(a) {
  var n = limpia(a && a.pacienteNombre) || 'sin_paciente';
  var c = limpia(a && a.pacienteCedula);
  return 'Acta_Inicio_Tratamiento_' + n + (c ? '_' + c : '') + '.pdf';
}

function fFecha(v) {
  if (!v) return '—';
  var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v));
  if (m) return m[3] + '/' + m[2] + '/' + m[1];
  var d = new Date(v);
  return isNaN(d.getTime()) ? String(v) : pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear();
}

function fFechaHora(v) {
  if (!v) return '—';
  var d = new Date(v);
  if (isNaN(d.getTime())) return fFecha(v);
  return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear() + ' · ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

function render(doc, a) {
  var y = 0;

  function txt(t, x, yy, size, style, color, align) {
    doc.setFontSize(size);
    doc.setFont('helvetica', style || 'normal');
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(String(t == null ? '—' : t), x, yy, align || 'left');
  }

  function pagina() {
    doc.setDrawColor(213, 222, 234); doc.setLineWidth(0.2);
    doc.line(M, 283, W - M, 283);
    txt('Grupo Helse SAS · NIT 901.401.880-4 · Documento generado electrónicamente', M, 287, 5.4, 'normal', [143, 163, 181]);
    txt('Pág. ' + doc.internal.getNumberOfPages(), W - M, 287, 5.4, 'normal', [143, 163, 181], 'right');
  }

  function cabecera() {
    doc.setFillColor(AZUL[0], AZUL[1], AZUL[2]);
    doc.rect(0, 0, W, 30, 'F');
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(M, 4, 32, 14, 1.5, 1.5, 'F');
    try { doc.addImage(LOGO, 'JPEG', M + 1.2, 5.4, 29.6, 11.2); } catch (e) {}
    txt('ACTA DE ENTREGA', M + 36, 13, 9, 'bold', [255, 255, 255]);
    txt('INICIO DE TRATAMIENTO', M + 36, 19.5, 7.2, 'normal', [200, 215, 240]);
    txt('FTA-02-P2D-V.2', W - M, 13, 6, 'normal', [200, 215, 240], 'right');
    txt(a.estado === 'firmado' ? 'FIRMADA' : 'PENDIENTE DE FIRMA', W - M, 19, 6, 'bold',
        a.estado === 'firmado' ? [120, 200, 140] : [255, 200, 120], 'right');
    y = 37;
  }

  function barra(t) {
    doc.setFillColor(AZUL_LT[0], AZUL_LT[1], AZUL_LT[2]);
    doc.rect(M, y, CW, 6.5, 'F');
    doc.setFillColor(AZUL[0], AZUL[1], AZUL[2]);
    doc.rect(M, y, 1.4, 6.5, 'F');
    txt(t, M + 4, y + 4.6, 7.2, 'bold', AZUL);
    y += 9.6;
  }

  function fila(pairs) {
    var n = pairs.length, cw = CW / n;
    for (var i = 0; i < n; i++) {
      if (!pairs[i][0]) continue;
      var x = M + i * cw;
      txt(pairs[i][0], x, y, 6.1, 'bold', GRIS);
      txt(pairs[i][1] || '—', x, y + 4.4, 7.8, 'normal', TEXTO);
      doc.setDrawColor(230, 236, 245); doc.setLineWidth(0.2);
      doc.line(x, y + 7.2, x + cw - 4, y + 7.2);
    }
    y += 9.4;
  }

  cabecera();
  fila([['Gestor', a.gestorNombre], ['Fecha de gestión', fFecha(a.fecha)]]);

  barra('DATOS DE LA GESTIÓN');
  fila([['Zona', a.zona], ['Fabricante / Laboratorio', a.laboratorio]]);
  fila([['Gestor comercial', a.gcNombre], ['Cédula gestor comercial', a.gcCedula]]);

  barra('PRODUCTOS ENTREGADOS');
  var cols = [8, 62, 18, 32, 34, CW - 8 - 62 - 18 - 32 - 34];
  var heads = ['#', 'Producto', 'Cantidad', 'Vencimiento', 'Ciudad', 'Lote'];
  doc.setFillColor(AZUL[0], AZUL[1], AZUL[2]);
  doc.rect(M, y, CW, 6, 'F');
  var cx = M;
  for (var h = 0; h < heads.length; h++) {
    txt(heads[h], cx + 2, y + 4, 6, 'bold', [255, 255, 255]);
    cx += cols[h];
  }
  y += 6;
  var prods = a.productos || [];
  for (var i = 0; i < prods.length; i++) {
    if (y > 245) { pagina(); doc.addPage(); y = 18; cabecera(); y = 37; }
    var p = prods[i] || {};
    if (i % 2 === 0) { doc.setFillColor(246, 249, 253); doc.rect(M, y - 4, CW, 7, 'F'); }
    var vals = [String(i + 1), p.nombre || '', p.cantidad || '', fFecha(p.vencimiento), p.ciudad || '', p.lote || ''];
    cx = M;
    for (var c = 0; c < vals.length; c++) {
      txt(doc.splitTextToSize(vals[c], cols[c] - 4)[0], cx + 2, y, 7, 'normal', TEXTO);
      cx += cols[c];
    }
    doc.setDrawColor(230, 236, 245); doc.setLineWidth(0.2); doc.line(M, y + 3, W - M, y + 3);
    y += 7.5;
  }
  y += 2;

  barra('PACIENTE BENEFICIADO');
  fila([['Nombre', a.pacienteNombre], ['Cédula', a.pacienteCedula], ['Teléfono', a.pacienteTel]]);

  barra('OBSERVACIONES');
  var obs = a.observaciones || 'Sin observaciones.';
  var ls = doc.splitTextToSize(obs, CW - 4);
  doc.setFontSize(7.4); doc.setFont('helvetica', 'normal'); doc.setTextColor(GRIS[0], GRIS[1], GRIS[2]);
  doc.text(ls, M + 2, y);
  y += ls.length * 3.2 + 8;

  // Firmas
  var bw = (CW - 10) / 2;
  doc.setDrawColor(BORDE[0], BORDE[1], BORDE[2]); doc.setLineWidth(0.35);
  doc.roundedRect(M, y, bw, 36, 1.6, 1.6);
  doc.roundedRect(M + bw + 10, y, bw, 36, 1.6, 1.6);
  txt('Firma del paciente', M + 3, y + 4.4, 5.8, 'normal', GRIS);
  if (a.firmaPaciente) {
    try { doc.addImage(a.firmaPaciente, 'PNG', M + 4, y + 6, bw - 8, 14); } catch (e) {}
  }
  txt(a.pacienteNombre || '', M + 3, y + 25, 7.4, 'bold', TEXTO);
  txt('C.C. ' + (a.pacienteCedula || ''), M + 3, y + 29.4, 6.2, 'normal', GRIS);
  txt(a.estado === 'firmado' ? 'Firmado el ' + fFechaHora(a.fechaFirma) : 'Pendiente de firma', M + 3, y + 33.4, 5.8, 'normal', GRIS);

  var x2 = M + bw + 10;
  txt('Gestor comercial', x2 + 3, y + 4.4, 5.8, 'normal', GRIS);
  txt(a.gcNombre || '', x2 + 3, y + 25, 7.4, 'bold', TEXTO);
  txt('C.C. ' + (a.gcCedula || ''), x2 + 3, y + 29.4, 6.2, 'normal', GRIS);
  txt('Entrega de productos', x2 + 3, y + 33.4, 5.8, 'normal', GRIS);
  y += 42;

  txt('APME – USO MÉDICO ESPECIAL. Producto sin valor comercial. NO TIENE PRECIO – PROHIBIDA SU VENTA. ' +
      'Uso exclusivo bajo indicación médica o nutricional. No es un medicamento. Programa de Apoyo a Pacientes.',
      M, y, 5.6, 'normal', GRIS);

  pagina();
  return doc;
}

function descargar(a, docExistente) {
  var doc = docExistente || nuevo();
  render(doc, a);
  doc.save(archivo(a));
  return doc;
}

function descargarLote(lista) {
  if (!lista || !lista.length) throw new Error('No hay actas para descargar.');
  var doc = nuevo();
  for (var i = 0; i < lista.length; i++) {
    if (i > 0) doc.addPage();
    render(doc, lista[i]);
  }
  doc.save('Actas_Inicio_Tratamiento_' + new Date().toISOString().slice(0, 10) + '.pdf');
  return doc;
}

G.ActaInicioPDF = {
  nuevo: nuevo,
  archivo: archivo,
  fFecha: fFecha,
  render: render,
  descargar: descargar,
  descargarLote: descargarLote
};
})();
