const { db } = require('../firebase/adminConfig');
const { generarPDFBuffer } = require('../utils/pdfGenerator');
const { enviarCorreoConAdjunto } = require('../utils/emailSender');

// 1. Obtener datos del reporte
const obtenerReporte = async (req, res) => {
  try {
    const { idClase } = req.params;

    const claseSnap = await db.collection('clases').doc(idClase).get();
    if (!claseSnap.exists) return res.status(404).json({ error: 'Clase no encontrada' });

    const clase = claseSnap.data();

    // Obtener asignatura
    const asignaturaSnap = await db.collection('asignaturas').doc(clase.asignatura_id).get();
    const asignatura = asignaturaSnap.exists ? asignaturaSnap.data() : null;

    // Obtener asistencias
    const asistenciasSnap = await db.collection('asistencias')
      .where('clase_id', '==', idClase)
      .get();

    const asistencias = [];
    for (const doc of asistenciasSnap.docs) {
      const asistencia = doc.data();
      const usuarioSnap = await db.collection('usuarios').doc(asistencia.usuario_id).get();
      const estudiante = usuarioSnap.exists ? usuarioSnap.data().nombre_completo : 'Desconocido';

      const fechaObj = new Date(asistencia.timestamp);
      const fecha = fechaObj.toISOString().split('T')[0];
      const hora = fechaObj.toTimeString().split(' ')[0].slice(0, 5);

      asistencias.push({ estudiante, fecha, hora });
    }

    res.status(200).json({
      clase: {
        id: idClase,
        asignatura,
        dia: clase.dia,
        hora_inicio: clase.hora_inicio,
        hora_fin: clase.hora_fin
      },
      asistencias
    });
  } catch (error) {
    console.error('Error al obtener reporte:', error);
    res.status(500).json({ error: 'Error al obtener reporte' });
  }
};

// 2. Generar PDF
const generarPDFReporte = async (req, res) => {
  try {
    const { idClase } = req.params;
    const buffer = await generarPDFBuffer(idClase);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(buffer);
  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).json({ error: 'Error al generar PDF' });
  }
};

// 3. Enviar PDF por correo
const enviarReportePorCorreo = async (req, res) => {
  try {
    const { idClase } = req.params;
    const { email } = req.body;

    console.log("📩 Petición recibida para enviar reporte", { idClase, email });

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      console.warn("⚠️ Email inválido:", email);
      return res.status(400).json({ error: 'Email inválido o no proporcionado' });
    }

    const buffer = await generarPDFBuffer(idClase);
    console.log("✅ PDF generado correctamente");

    await enviarCorreoConAdjunto(email, buffer, `Reporte_${idClase}.pdf`);
    console.log("✅ Correo enviado correctamente a", email);

    res.status(200).json({ mensaje: 'Reporte enviado correctamente' });
  } catch (error) {
    console.error("❌ Error en enviarReportePorCorreo:", error);
    res.status(500).json({ error: 'Error al enviar reporte', detalle: error.message });
  }
};



module.exports = {
  obtenerReporte,
  generarPDFReporte,
  enviarReportePorCorreo
};
