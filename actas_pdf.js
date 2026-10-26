/*!
 * actas_pdf.js — Plantillas oficiales de actas de entrega · Grupo Helse SAS
 * ---------------------------------------------------------------------------
 * Genera los documentos firmados de dotación y herramientas con el mismo
 * formato del dashboard (POS CO-SSG-15-V02), incluida la firma capturada.
 *
 * API:
 *   ActaPDF.nuevo()                          -> instancia jsPDF A4
 *   ActaPDF.renderDotacion(doc, registro)     -> dibuja el acta en doc
 *   ActaPDF.renderHerramientas(doc, registro) -> dibuja el acta en doc
 *   ActaPDF.descargar('dotacion'|'herramientas', registro)
 *   ActaPDF.descargarLote('dotacion'|'herramientas', registros)  // un PDF con todas
 *   ActaPDF.archivo('dotacion'|'herramientas', registro) -> nombre de archivo
 *
 * Requiere window.jspdf (jspdf.umd.min.js) cargado antes.
 */
(function () {
'use strict';

var G = (typeof window !== 'undefined') ? window : globalThis;
const MB64="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAzEAAAQhCAYAAAAd5wGVAAAgAElEQVR4nOydd5wW1b3/32eeXrYvnaULCAgiCKiICrHHEo0xmmjKjUYTe270ppiiid57c2MSr4lRk/xyb2JiufaGJWoQpYM0G01AOtJh92lzfn9MeWaefbbBLmz5vvOK7DNz5syZ55k5cz7nW47SWmsEQRAEQRAEQRA6Bso40i0QBEEQBEEQBEFoCarbyTeJJUYQBEEQBEEQhA7B1hm/EkuMIAiCIAiCIAgdCxExgiAIgiAIgiB0KETECIIgCIIgCILQoRARIwiCIAiCIAhCh0JEjCAIgiAIgiAIHQoRMYIgCIIgCIIgdChExAiCIAiCIAiC0KEQESMIgiAIgiAIQodCRIwgCIIgCIIgdChExAiCIAiCIAhCh0JEjCAIgiAIgiAIHQoRMYIgCIIgCIIgdChExAiCIAiCIAhCh0JEjCAIgiAIgiAIHQoRMYIgCIIgCIIgdChExAiCIAiCIAhCh0JEjCAIgiAIgiAIHQoRMYIgCIIgCIIgdChExAiCIAiCIAhCh0JEjCAIgiAIgiAIHQoRMYIgCIIgCIIgdChExAiCIAiCIAhCh0JEjCAIgiAIgiAIHQoRMYIgCIIgCIIgdChExAiCIAiCIAhCh0JEjCAIgiAIgiAIHQoRMYIgCIIgCIIgdChExAiCIAiCIAhCh0JEjCAIgiAIgiAIHQoRMYIgCIIgCIIgdChExAiCIAiCIAhCh0JEjCAIgiAIgiAIHQoRMYIgCIIgCIIgdChExAiCIAiCIAhCh0JEjCAIgiAIgiAIHQoRMYIgCIIgCIIgdChExAiCIAiCIAhCh0JEjCAIgiAIgiAIHQoRMYIgCIIgCIIgdChExAiCIAiCIAhCh0JEjCAIgiAIgiAIHQoRMYIgCIIgCIIgdChExAiCIAiCIAhCh0JEjCAIgiAIgiAIHQoRMYIgCIIgCIIgdChExAiCIAiCIAhCh0JEjCAIgiAIgiAIHQoRMYIgCIIgCIIgdChExAiCIAiCIAhCh0JEjCAIgiAIgiAIHQoRMYIgCIIgCIIgdCj+fxdD1pf8yNfvAAAAAElFTkSuQmCC";

function renderHerramientas(doc, r){
  const W=210,M=14,CW=W-M*2;
  const CP=[27,58,107];
  const fR=r.fecha&&r.fecha.toDate?r.fecha.toDate():new Date();
  let y=0;

  const YULI_SIG='data:image/png;base64,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';
  const YORMAN_SIG='data:image/jpeg;base64,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';

  function nPag(){ piePDF(); doc.addPage(); y=0; cabPDF(); }
  function cY(n){ if(y+n>272) nPag(); }

  function cabPDF(){
    doc.setFillColor(CP[0],CP[1],CP[2]); doc.rect(0,0,W,18,'F');
    try{ doc.addImage(MB64,'PNG',M,2,22,14); }catch(e){}
    doc.setFontSize(7.5);doc.setFont('helvetica','bold');doc.setTextColor(255,255,255);
    doc.text('GRUPO HELSE SAS',M+25,9);
    doc.setFont('helvetica','normal');doc.setFontSize(6.5);doc.setTextColor(200,215,240);
    doc.text('NIT 901.401.880-4',M+25,14);
    doc.setFontSize(8.5);doc.setFont('helvetica','bold');doc.setTextColor(255,255,255);
    doc.text('PROCEDIMIENTO DE OPERACIÓN ESTÁNDAR (POS)',W/2,8,'center');
    doc.setFontSize(9.5);doc.text('ACTA DE ENTREGA DE HERRAMIENTAS DE TRABAJO',W/2,14,'center');
    doc.setFontSize(6.5);doc.setFont('helvetica','normal');doc.setTextColor(200,215,240);
    doc.text('Código: CO-SSG-15-V02',W-M,8,'right');
    doc.text('Versión: 01 · 13-01-2022',W-M,13,'right');
    y=22;
  }

  function piePDF(){
    doc.setDrawColor(180,195,220);doc.setLineWidth(0.2);doc.line(M,283,W-M,283);
    doc.setFontSize(6.5);doc.setFont('helvetica','normal');doc.setTextColor(130,140,160);
    doc.text('Grupo Helse SAS · NIT 901.401.880-4 · Cra 68b #13-42 Bodega 1 · Bogotá, Colombia · www.helse.com.co',M,287);
    doc.text('Pág. '+doc.internal.getNumberOfPages(),W-M,287,'right');
  }

  cabPDF();

  // Tabla Elaboró / Revisó / Aprobó
  const colW=CW/3;
  doc.setFillColor(CP[0],CP[1],CP[2]);
  doc.rect(M,y,colW,7,'F'); doc.rect(M+colW,y,colW,7,'F'); doc.rect(M+colW*2,y,colW,7,'F');
  doc.setFontSize(7);doc.setFont('helvetica','bold');doc.setTextColor(255,255,255);
  doc.text('Elaboró:',M+2,y+4.5); doc.text('Revisó:',M+colW+2,y+4.5); doc.text('Aprobó:',M+colW*2+2,y+4.5);
  y+=7;
  doc.setDrawColor(CP[0],CP[1],CP[2]);doc.setLineWidth(0.3);
  doc.rect(M,y,colW,6); doc.rect(M+colW,y,colW,6); doc.rect(M+colW*2,y,colW,6);
  doc.setFontSize(7.5);doc.setFont('helvetica','bold');doc.setTextColor(26,44,43);
  doc.text('Yuli Betancur',M+2,y+4); doc.text('Yorman Monroy',M+colW+2,y+4); doc.text('Yorman Monroy',M+colW*2+2,y+4);
  y+=6;
  doc.rect(M,y,colW,5.5); doc.rect(M+colW,y,colW,5.5); doc.rect(M+colW*2,y,colW,5.5);
  doc.setFontSize(7);doc.setFont('helvetica','normal');doc.setTextColor(84,110,122);
  doc.text('Coordinadora SST',M+2,y+3.8); doc.text('Gerente General',M+colW+2,y+3.8); doc.text('Gerente General',M+colW*2+2,y+3.8);
  y+=5.5;
  // Fila firmas con imágenes reales
  const fH=14;
  doc.rect(M,y,colW,fH); doc.rect(M+colW,y,colW,fH); doc.rect(M+colW*2,y,colW,fH);
  try{ doc.addImage(YULI_SIG,'PNG',M+2,y+1,colW-4,fH-2); }catch(e){}
  try{ doc.addImage(YORMAN_SIG,'JPEG',M+colW+2,y+1,colW-4,fH-2); }catch(e){}
  try{ doc.addImage(YORMAN_SIG,'JPEG',M+colW*2+2,y+1,colW-4,fH-2); }catch(e){}
  y+=fH+4;

  // Datos colaborador
  doc.setFillColor(CP[0],CP[1],CP[2]);
  doc.roundedRect(M,y,CW,6,1,1,'F');
  doc.setFontSize(7);doc.setFont('helvetica','bold');doc.setTextColor(255,255,255);
  doc.text('DATOS DEL COLABORADOR',M+3,y+4); y+=8;
  const lw=38;
  function datoPar(l1,v1,l2,v2){
    cY(6);
    doc.setFontSize(7.5);doc.setFont('helvetica','bold');doc.setTextColor(84,110,122);
    doc.text(l1,M,y); doc.setFont('helvetica','normal');doc.setTextColor(26,44,43); doc.text(v1||'—',M+lw,y);
    if(l2){ doc.setFont('helvetica','bold');doc.setTextColor(84,110,122); doc.text(l2,W/2+2,y); doc.setFont('helvetica','normal');doc.setTextColor(26,44,43); doc.text(v2||'—',W/2+2+lw,y); }
    y+=5.5;
  }
  datoPar('Nombre y Apellidos:',r.nombre,'Fecha de Entrega:',r.fecha_entrega||'');
  datoPar('Cargo:',r.cargo,'Área:',r.area);
  datoPar('N° Identificación:',r.cedula,'','');
  y+=2;

  // Texto introductorio
  doc.setFontSize(8.5);doc.setFont('helvetica','normal');doc.setTextColor(26,44,43);
  const intro='De conformidad con las disposiciones internas de GRUPO HELSE S.A.S. y con el fin de garantizar el adecuado desarrollo de las funciones asignadas, se deja constancia de la entrega de las herramientas de trabajo relacionadas a continuación:';
  const iLines=doc.splitTextToSize(intro,CW);
  cY(iLines.length*4.5+8);
  doc.text(iLines,M,y); y+=iLines.length*4.5+4;
  doc.setFontSize(8.5);doc.setFont('helvetica','normal');
  doc.text('Con la presente acta se hace entrega de las siguientes herramientas de trabajo:',M,y); y+=8;

  // Tabla herramientas (4 columnas: Cantidad, Descripción, Observaciones, Firma de entrega)
  const cw1=22,cw2=CW-cw1-55-38,cw3=55,cw4=38;
  doc.setFillColor(CP[0],CP[1],CP[2]);
  doc.rect(M,y,cw1,6,'F');doc.rect(M+cw1,y,cw2,6,'F');doc.rect(M+cw1+cw2,y,cw3,6,'F');doc.rect(M+cw1+cw2+cw3,y,cw4,6,'F');
  doc.setFontSize(7);doc.setFont('helvetica','bold');doc.setTextColor(255,255,255);
  doc.text('Cantidad',M+2,y+4);
  doc.text('Descripción',M+cw1+2,y+4);
  doc.text('Observaciones',M+cw1+cw2+2,y+4);
  doc.text('Firma',M+cw1+cw2+cw3+2,y+4);
  y+=6;
  const items=r.herramientas||[];
  items.forEach((item,i)=>{
    cY(8);
    const bg=i%2===0?[245,248,252]:[255,255,255];
    doc.setFillColor(bg[0],bg[1],bg[2]);
    doc.rect(M,y,cw1,7,'F');doc.rect(M+cw1,y,cw2,7,'F');doc.rect(M+cw1+cw2,y,cw3,7,'F');doc.rect(M+cw1+cw2+cw3,y,cw4,7,'F');
    doc.setDrawColor(180,200,220);doc.setLineWidth(0.2);
    doc.rect(M,y,cw1,7);doc.rect(M+cw1,y,cw2,7);doc.rect(M+cw1+cw2,y,cw3,7);doc.rect(M+cw1+cw2+cw3,y,cw4,7);
    doc.setFontSize(8);doc.setFont('helvetica','normal');doc.setTextColor(26,44,43);
    doc.text(item.cantidad||'',M+2,y+4.5);
    doc.text(doc.splitTextToSize(item.descripcion||'',cw2-4)[0],M+cw1+2,y+4.5);
    doc.text(doc.splitTextToSize(item.observaciones||'',cw3-4)[0],M+cw1+cw2+2,y+4.5);
    y+=7;
  });
  y+=4;

  // Declaraciones (pág 2)
  nPag();
  doc.setFontSize(8.5);doc.setFont('helvetica','bold');doc.setTextColor(26,44,43);
  doc.text('EL COLABORADOR QUE FIRMA LA PRESENTE ACTA MANIFIESTA QUE:',M,y); y+=8;
  const decls=[
    'Las herramientas de trabajo aquí entregadas son propiedad exclusiva de GRUPO HELSE S.A.S. y serán utilizadas únicamente para el desarrollo de las funciones inherentes a su cargo.',
    'Se compromete a hacer uso adecuado, responsable y diligente de las herramientas suministradas, evitando daños, pérdidas o uso indebido de las mismas.',
    'En caso de daño, pérdida, hurto o cualquier novedad que afecte el estado de las herramientas entregadas, deberá informar de manera inmediata a su jefe inmediato y al área de RR.HH.',
    'Se compromete a devolver las herramientas de trabajo en buen estado al momento de la terminación del contrato laboral, cambio de cargo, reemplazo del equipo o cuando la compañía así lo requiera, salvo el desgaste normal derivado de su uso adecuado.',
    'Es consciente de que el uso indebido, la pérdida por negligencia o la no devolución de las herramientas de trabajo podrá generar las acciones administrativas y disciplinarias correspondientes de conformidad con el Reglamento Interno de Trabajo y la normatividad vigente.',
  ];
  decls.forEach((d,i)=>{
    const ls=doc.splitTextToSize((i+1)+'. '+d,CW-6);
    cY(ls.length*4.5+4);
    doc.setFillColor(235,241,250);doc.roundedRect(M,y-3,CW,ls.length*4.5+5,1,1,'F');
    doc.setFontSize(8);doc.setFont('helvetica','normal');doc.setTextColor(26,44,43);
    doc.text(ls,M+3,y); y+=ls.length*4.5+6;
  });
  y+=2;

  // Sección firmas finales
  cY(40);
  doc.setFillColor(CP[0],CP[1],CP[2]);
  doc.roundedRect(M,y,CW,6,1,1,'F');
  doc.setFontSize(7);doc.setFont('helvetica','bold');doc.setTextColor(255,255,255);
  doc.text('DATOS DEL COLABORADOR',M+3,y+4); y+=8;
  const fw=(CW-10)/2;
  // Entregado por – Yuli
  doc.setDrawColor(CP[0],CP[1],CP[2]);doc.setLineWidth(0.4);
  doc.rect(M,y,fw,32);
  doc.setFontSize(7);doc.setFont('helvetica','bold');doc.setTextColor(84,110,122);
  doc.text('Entregado por:',M+2,y+5);
  try{ doc.addImage(YULI_SIG,'PNG',M+4,y+6,fw-8,16); }catch(e){}
  doc.setFontSize(7.5);doc.setFont('helvetica','bold');doc.setTextColor(26,44,43);
  doc.text('Yuli Betancur',M+2,y+25);
  doc.setFont('helvetica','normal');doc.setFontSize(7);doc.setTextColor(84,110,122);
  doc.text('Coordinadora SST · Gerente General',M+2,y+29);
  // Recibido por – colaborador
  doc.rect(M+fw+10,y,fw,32);
  doc.setFont('helvetica','bold');doc.setFontSize(7);doc.setTextColor(84,110,122);
  doc.text('Recibido por:',M+fw+12,y+5);
  if(r.firma_recibo){ try{ doc.addImage(r.firma_recibo,'PNG',M+fw+12,y+6,fw-14,16); }catch(e){} }
  doc.setFontSize(7.5);doc.setFont('helvetica','bold');doc.setTextColor(26,44,43);
  doc.text(r.nombre||'',M+fw+12,y+25);
  doc.setFont('helvetica','normal');doc.setFontSize(7);doc.setTextColor(84,110,122);
  doc.text('C.C. '+(r.cedula||'')+'  ·  Cargo: '+(r.cargo||''),M+fw+12,y+29);
  y+=36;

  // Tabla Responsable SST
  cY(20);
  doc.setFillColor(CP[0],CP[1],CP[2]);
  doc.roundedRect(M,y,CW,6,1,1,'F');
  doc.setFontSize(7);doc.setFont('helvetica','bold');doc.setTextColor(255,255,255);
  doc.text('DATOS DEL RESPONSABLE EN SST',M+3,y+4); y+=6;
  const sstW=[CW*0.3,CW*0.2,CW*0.2,CW*0.3];
  let sx=M;
  ['Nombre y Apellidos','Cédula','Cargo','Firma'].forEach((h,i)=>{
    doc.setFillColor(CP[0],CP[1],CP[2]);doc.rect(sx,y,sstW[i],6,'F');
    doc.setFontSize(6.5);doc.setFont('helvetica','bold');doc.setTextColor(255,255,255);
    doc.text(h,sx+2,y+4); sx+=sstW[i];
  });
  y+=6;
  sx=M;
  ['Yuli Betancur','','Coordinadora SST',''].forEach((v,i)=>{
    doc.setFillColor(248,250,255);doc.rect(sx,y,sstW[i],10,'F');
    doc.setDrawColor(180,200,220);doc.rect(sx,y,sstW[i],10);
    if(i===3){ try{ doc.addImage(YULI_SIG,'PNG',sx+2,y+1,sstW[i]-4,8); }catch(e){} }
    else{ doc.setFontSize(7.5);doc.setFont('helvetica','normal');doc.setTextColor(26,44,43); doc.text(v,sx+2,y+6); }
    sx+=sstW[i];
  });
  y+=14;

  // Revisión histórica
  cY(24);
  doc.setFillColor(CP[0],CP[1],CP[2]);
  doc.roundedRect(M,y,CW,6,1,1,'F');
  doc.setFontSize(7);doc.setFont('helvetica','bold');doc.setTextColor(255,255,255);
  doc.text('REVISIÓN HISTÓRICA',M+3,y+4); y+=8;
  const rw=[14,28,CW-14-28-30,30]; let rx=M;
  ['Versión #','Fecha de Efectividad','Descripción del cambio','Reemplaza a:'].forEach((h,i)=>{
    doc.setFillColor(CP[0],CP[1],CP[2]);doc.rect(rx,y,rw[i],6,'F');
    doc.setFontSize(6.5);doc.setFont('helvetica','bold');doc.setTextColor(255,255,255);
    doc.text(h,rx+2,y+4); rx+=rw[i];
  });
  y+=6; rx=M;
  ['01','13-01-2022','Versión Inicial','N/A'].forEach((v,i)=>{
    doc.setFillColor(245,248,252);doc.rect(rx,y,rw[i],7,'F');
    doc.setDrawColor(180,200,220);doc.rect(rx,y,rw[i],7);
    doc.setFontSize(7.5);doc.setFont('helvetica','normal');doc.setTextColor(26,44,43);
    doc.text(v,rx+2,y+4.5); rx+=rw[i];
  });
  y+=11;

  doc.setFontSize(7.5);doc.setFont('helvetica','italic');doc.setTextColor(84,110,122);
  const nota='Este documento es propiedad de GRUPO HELSE SAS y no está permitida su reproducción total o parcial; salvo autorización de esta empresa. Toda copia impresa autorizada debe llevar el sello húmedo de color rojo "Copia Controlada".';
  doc.text(doc.splitTextToSize(nota,CW),M,y);
  piePDF();
  return doc;
}

function renderDotacion(doc, r){
  const W=210,M=14,CW=W-M*2;
  const CP=[27,58,107]; // azul Helse
  const fR=r.fecha&&r.fecha.toDate?r.fecha.toDate():new Date();
  let y=0;

  function nPag(){ piePDF(); doc.addPage(); y=0; cabPDF(); }
  function cY(n){ if(y+n>272) nPag(); }

  function cabPDF(){
    // Banda azul superior
    doc.setFillColor(CP[0],CP[1],CP[2]); doc.rect(0,0,W,18,'F');
    // Logo
    try{ doc.addImage(MB64,'PNG',M,2,22,14); }catch(e){}
    // Nombre empresa
    doc.setFontSize(7.5);doc.setFont('helvetica','bold');doc.setTextColor(255,255,255);
    doc.text('GRUPO HELSE SAS',M+25,9);
    doc.setFont('helvetica','normal');doc.setFontSize(6.5);doc.setTextColor(200,215,240);
    doc.text('NIT 901.401.880-4',M+25,14);
    // Título del documento centrado
    doc.setFontSize(8.5);doc.setFont('helvetica','bold');doc.setTextColor(255,255,255);
    doc.text('PROCEDIMIENTO DE OPERACIÓN ESTÁNDAR (POS)',W/2,8,'center');
    doc.setFontSize(9.5);doc.text('ACTA DE ENTREGA DE DOTACIÓN',W/2,14,'center');
    // Código/Versión derecha
    doc.setFontSize(6.5);doc.setFont('helvetica','normal');doc.setTextColor(200,215,240);
    doc.text('Código: CO-SSG-15-V02',W-M,8,'right');
    doc.text('Versión: 02 · 17-06-2025',W-M,13,'right');
    y=22;
  }

  function piePDF(){
    doc.setDrawColor(180,195,220);doc.setLineWidth(0.2);doc.line(M,283,W-M,283);
    doc.setFontSize(6.5);doc.setFont('helvetica','normal');doc.setTextColor(130,140,160);
    doc.text('Grupo Helse SAS · NIT 901.401.880-4 · Este documento es propiedad de GRUPO HELSE SAS. Prohibida su reproducción sin autorización.',M,287);
    doc.text('Pág. '+doc.internal.getNumberOfPages(),W-M,287,'right');
  }

  // ── PÁGINA 1 ──
  cabPDF();

  // Tabla de encabezado con elaboró/revisó/aprobó
  const colW=CW/3;
  // Fila superior – títulos
  doc.setFillColor(CP[0],CP[1],CP[2]);
  doc.rect(M,y,colW,7,'F'); doc.rect(M+colW,y,colW,7,'F'); doc.rect(M+colW*2,y,colW,7,'F');
  doc.setFontSize(7);doc.setFont('helvetica','bold');doc.setTextColor(255,255,255);
  doc.text('Elaboró:',M+2,y+4.5);
  doc.text('Revisó:',M+colW+2,y+4.5);
  doc.text('Aprobó:',M+colW*2+2,y+4.5);
  y+=7;
  // Fila nombre
  doc.setDrawColor(CP[0],CP[1],CP[2]);doc.setLineWidth(0.3);
  doc.rect(M,y,colW,6); doc.rect(M+colW,y,colW,6); doc.rect(M+colW*2,y,colW,6);
  doc.setFontSize(7.5);doc.setFont('helvetica','bold');doc.setTextColor(26,44,43);
  doc.text('Yuli Betancur',M+2,y+4);
  doc.text('Yorman Monroy',M+colW+2,y+4);
  doc.text('Yorman Monroy',M+colW*2+2,y+4);
  y+=6;
  // Fila cargo
  doc.rect(M,y,colW,5.5); doc.rect(M+colW,y,colW,5.5); doc.rect(M+colW*2,y,colW,5.5);
  doc.setFontSize(7);doc.setFont('helvetica','normal');doc.setTextColor(84,110,122);
  doc.text('Coordinadora SST',M+2,y+3.8);
  doc.text('Gerente General',M+colW+2,y+3.8);
  doc.text('Gerente General',M+colW*2+2,y+3.8);
  y+=5.5;
  // Fila firma – imágenes reales
  const fH=14;
  doc.rect(M,y,colW,fH); doc.rect(M+colW,y,colW,fH); doc.rect(M+colW*2,y,colW,fH);
  const YULI_B64='data:image/png;base64,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';
  const YORMAN_B64='data:image/jpeg;base64,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';
  try{ doc.addImage(YULI_B64,'PNG',M+2,y+1,colW-4,fH-2); }catch(e){}
  try{ doc.addImage(YORMAN_B64,'JPEG',M+colW+2,y+1,colW-4,fH-2); }catch(e){}
  try{ doc.addImage(YORMAN_B64,'JPEG',M+colW*2+2,y+1,colW-4,fH-2); }catch(e){}
  y+=fH+2;

  // Datos del colaborador
  y+=3;
  doc.setFillColor(CP[0],CP[1],CP[2]);
  doc.roundedRect(M,y,CW,6,1,1,'F');
  doc.setFontSize(7);doc.setFont('helvetica','bold');doc.setTextColor(255,255,255);
  doc.text('DATOS DEL COLABORADOR',M+3,y+4); y+=8;

  const lw=38;
  function datoPar(l1,v1,l2,v2){
    cY(6);
    doc.setFontSize(7.5);doc.setFont('helvetica','bold');doc.setTextColor(84,110,122);
    doc.text(l1,M,y); doc.setFont('helvetica','normal');doc.setTextColor(26,44,43);
    doc.text(v1||'—',M+lw,y);
    if(l2){
      doc.setFont('helvetica','bold');doc.setTextColor(84,110,122);
      doc.text(l2,W/2+2,y); doc.setFont('helvetica','normal');doc.setTextColor(26,44,43);
      doc.text(v2||'—',W/2+2+lw,y);
    }
    y+=5.5;
  }
  datoPar('Nombre y Apellidos:',r.nombre,'Fecha de Entrega:',r.fecha_entrega||'');
  datoPar('Cargo:',r.cargo,'Área:',r.area);
  datoPar('N° Identificación:',r.cedula,'','');
  y+=2;

  // Tabla de dotación
  doc.setFillColor(CP[0],CP[1],CP[2]);
  doc.roundedRect(M,y,CW,6,1,1,'F');
  doc.setFontSize(7);doc.setFont('helvetica','bold');doc.setTextColor(255,255,255);
  doc.text('DOTACIÓN ENTREGADA',M+3,y+4); y+=8;

  doc.setFontSize(7.5);doc.setTextColor(255,255,255);
  const cw1=22,cw2=CW-cw1-60,cw3=60;
  doc.setFillColor(CP[0],CP[1],CP[2]);
  doc.rect(M,y,cw1,6,'F');doc.rect(M+cw1,y,cw2,6,'F');doc.rect(M+cw1+cw2,y,cw3,6,'F');
  doc.setFontSize(7);doc.setFont('helvetica','bold');
  doc.text('Cantidad',M+2,y+4);
  doc.text('Descripción del elemento',M+cw1+2,y+4);
  doc.text('Observaciones',M+cw1+cw2+2,y+4);
  y+=6;

  const items=r.dotacion||[];
  items.forEach((item,i)=>{
    cY(8);
    const bg=i%2===0?[245,248,252]:[255,255,255];
    doc.setFillColor(bg[0],bg[1],bg[2]);
    doc.rect(M,y,cw1,7,'F');doc.rect(M+cw1,y,cw2,7,'F');doc.rect(M+cw1+cw2,y,cw3,7,'F');
    doc.setDrawColor(180,200,220);doc.setLineWidth(0.2);
    doc.rect(M,y,cw1,7);doc.rect(M+cw1,y,cw2,7);doc.rect(M+cw1+cw2,y,cw3,7);
    doc.setFontSize(8);doc.setFont('helvetica','normal');doc.setTextColor(26,44,43);
    doc.text(item.cantidad||'',M+2,y+4.5);
    doc.text(doc.splitTextToSize(item.descripcion||'',cw2-4)[0],M+cw1+2,y+4.5);
    doc.text(doc.splitTextToSize(item.observaciones||'',cw3-4)[0],M+cw1+cw2+2,y+4.5);
    y+=7;
  });
  y+=4;

  // Declaración
  cY(40);
  doc.setFillColor(CP[0],CP[1],CP[2]);
  doc.roundedRect(M,y,CW,6,1,1,'F');
  doc.setFontSize(7);doc.setFont('helvetica','bold');doc.setTextColor(255,255,255);
  doc.text('EL COLABORADOR QUE FIRMA LA PRESENTE ACTA MANIFIESTA QUE:',M+3,y+4); y+=8;

  const decls=[
    'La dotación que aquí se entrega es y será de la empresa en todo momento. En caso de terminación del contrato de trabajo o entrega de una nueva dotación, me comprometo a hacer la devolución de forma inmediata cuando la misma contenga elementos distintivos que lo identifiquen como colaborador de la empresa.',
    'En caso de daño de la dotación o parte de ella, el trabajador debe devolverla a la empresa.',
    'Comprende que es una obligación el uso de la dotación de calzado y vestido de labor que se le está suministrando, que deberá cuidar de esta y destinar su uso exclusivo a la ejecución de labores contratadas.',
    'Es consciente que la indebida utilización de la dotación de calzado y vestido de labor es un incumplimiento a sus obligaciones y podrá conllevar una sanción disciplinaria.',
  ];
  decls.forEach((d,i)=>{
    const ls=doc.splitTextToSize((i+1)+'. '+d,CW-6);
    cY(ls.length*4.5+2);
    doc.setFillColor(235,241,250);doc.roundedRect(M,y-3,CW,ls.length*4.5+4,1,1,'F');
    doc.setFontSize(8);doc.setFont('helvetica','normal');doc.setTextColor(26,44,43);
    doc.text(ls,M+3,y); y+=ls.length*4.5+5;
  });
  y+=4;

  // Firmas finales
  cY(45);
  doc.setFillColor(CP[0],CP[1],CP[2]);
  doc.roundedRect(M,y,CW,6,1,1,'F');
  doc.setFontSize(7);doc.setFont('helvetica','bold');doc.setTextColor(255,255,255);
  doc.text('FIRMAS',M+3,y+4); y+=8;

  const fw=(CW-10)/2;
  // Caja entregado por – Yuli Betancur con firma real
  doc.setDrawColor(CP[0],CP[1],CP[2]);doc.setLineWidth(0.4);
  doc.rect(M,y,fw,32);
  doc.setFontSize(7);doc.setFont('helvetica','bold');doc.setTextColor(84,110,122);
  doc.text('Entregado por:',M+2,y+5);
  try{ doc.addImage(YULI_B64,'PNG',M+4,y+6,fw-8,16); }catch(e){}
  doc.setFontSize(7.5);doc.setFont('helvetica','bold');doc.setTextColor(26,44,43);
  doc.text('Yuli Betancur',M+2,y+25);
  doc.setFont('helvetica','normal');doc.setFontSize(7);doc.setTextColor(84,110,122);
  doc.text('Coordinadora SST',M+2,y+29);

  // Caja recibido por (firma del colaborador)
  doc.rect(M+fw+10,y,fw,32);
  doc.setFont('helvetica','bold');doc.setTextColor(84,110,122);
  doc.text('Recibido por:',M+fw+12,y+5);
  if(r.firma_recibo){
    try{ doc.addImage(r.firma_recibo,'PNG',M+fw+12,y+6,fw-14,16); }catch(e){}
  }
  doc.setFontSize(7.5);doc.setFont('helvetica','bold');doc.setTextColor(26,44,43);
  doc.text(r.nombre||'',M+fw+12,y+25);
  doc.setFont('helvetica','normal');doc.setFontSize(7);doc.setTextColor(84,110,122);
  doc.text('C.C. '+(r.cedula||''),M+fw+12,y+29);
  y+=36;

  // ── Pág 2 – Revisión histórica ──
  nPag();
  doc.setFillColor(CP[0],CP[1],CP[2]);
  doc.roundedRect(M,y,CW,6,1,1,'F');
  doc.setFontSize(7);doc.setFont('helvetica','bold');doc.setTextColor(255,255,255);
  doc.text('REVISIÓN HISTÓRICA',M+3,y+4); y+=8;

  const rev=[
    ['01','13-01-2022','Versión Inicial','N/A'],
    ['02','17-06-2025','Tabla de Descripción Elementos de Dotación','Versión Inicial'],
  ];
  const rw=[14,28,CW-14-28-30,30];
  doc.setFillColor(CP[0],CP[1],CP[2]);
  let rx=M;
  ['Versión #','Fecha de Efectividad','Descripción del cambio','Reemplaza a'].forEach((h,i)=>{
    doc.rect(rx,y,rw[i],6,'F');
    doc.setFontSize(6.5);doc.setFont('helvetica','bold');doc.setTextColor(255,255,255);
    doc.text(h,rx+2,y+4); rx+=rw[i];
  });
  y+=6;
  rev.forEach((row,ri)=>{
    rx=M;
    const bg=ri%2===0?[245,248,252]:[255,255,255];
    doc.setFillColor(bg[0],bg[1],bg[2]);
    row.forEach((cell,ci)=>{
      doc.rect(rx,y,rw[ci],7,'F');
      doc.setDrawColor(180,200,220);doc.rect(rx,y,rw[ci],7);
      doc.setFontSize(7.5);doc.setFont('helvetica','normal');doc.setTextColor(26,44,43);
      doc.text(doc.splitTextToSize(cell,rw[ci]-4)[0],rx+2,y+4.5);
      rx+=rw[ci];
    });
    y+=7;
  });

  y+=10;
  doc.setFontSize(7.5);doc.setFont('helvetica','italic');doc.setTextColor(84,110,122);
  const nota='Este documento es propiedad de GRUPO HELSE SAS y no está permitida su reproducción total o parcial; salvo autorización de esta empresa. Toda copia impresa autorizada debe llevar el sello húmedo de color rojo "Copia Controlada".';
  const nls=doc.splitTextToSize(nota,CW);
  doc.text(nls,M,y);

  piePDF();
  return doc;
}

function nuevo() {
  var J = G.jspdf && G.jspdf.jsPDF;
  if (!J) throw new Error('jsPDF no está cargado (jspdf.umd.min.js).');
  return new J({ unit: 'mm', format: 'a4' });
}

function limpia(t) {
  return String(t == null ? '' : t).replace(/\s+/g, '_').replace(/[^\w\-]+/g, '');
}

function archivo(tipo, r) {
  var base = tipo === 'dotacion' ? 'Acta_Dotacion' : 'Acta_Herramientas';
  var n = limpia(r && r.nombre) || 'sin_nombre';
  var c = limpia(r && r.cedula);
  return base + '_' + n + (c ? '_' + c : '') + '.pdf';
}

function dibujar(tipo, doc, r) {
  if (tipo === 'dotacion') return renderDotacion(doc, r);
  if (tipo === 'herramientas') return renderHerramientas(doc, r);
  throw new Error('Tipo de acta desconocido: ' + tipo);
}

function descargar(tipo, r, docExistente) {
  var doc = docExistente || nuevo();
  dibujar(tipo, doc, r);
  doc.save(archivo(tipo, r));
  return doc;
}

function descargarLote(tipo, lista) {
  if (!lista || !lista.length) throw new Error('No hay actas para descargar.');
  var doc = nuevo();
  for (var i = 0; i < lista.length; i++) {
    if (i > 0) doc.addPage();
    dibujar(tipo, doc, lista[i]);
  }
  var hoy = new Date().toISOString().slice(0, 10);
  doc.save('Actas_' + (tipo === 'dotacion' ? 'Dotacion' : 'Herramientas') + '_' + hoy + '.pdf');
  return doc;
}

G.ActaPDF = {
  nuevo: nuevo,
  archivo: archivo,
  renderDotacion: renderDotacion,
  renderHerramientas: renderHerramientas,
  descargar: descargar,
  descargarLote: descargarLote
};
})();
