const PDFDocument = require('pdfkit');
const { db } = require('../firebase/adminConfig');

const generarPDFBuffer = async (idClase) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // --- Datos de la clase ---
      const claseSnap = await db.collection('clases').doc(idClase).get();
      if (!claseSnap.exists) throw new Error('Clase no encontrada');
      const clase = claseSnap.data();

      const asignaturaSnap = await db.collection('asignaturas').doc(clase.asignatura_id).get();
      const asignatura = asignaturaSnap.exists ? asignaturaSnap.data() : {};

      // --- Encabezado ---
      doc.fontSize(16).text(`Reporte de Asistencia`, { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Asignatura: ${asignatura.nombre} (${asignatura.codigo})`);
      doc.text(`Horario: ${clase.dia} de ${clase.hora_inicio} a ${clase.hora_fin}`);
      doc.moveDown();

      // --- Asistencias ---
      const asistenciasSnap = await db.collection('asistencias')
        .where('clase_id', '==', idClase)
        .get();

      doc.fontSize(12).text(`Asistencias registradas:`);
      doc.moveDown();

      for (const docSnap of asistenciasSnap.docs) {
        const asistencia = docSnap.data();
        const usuarioSnap = await db.collection('usuarios').doc(asistencia.usuario_id).get();
        const nombre = usuarioSnap.exists ? usuarioSnap.data().nombre_completo : 'Desconocido';

        const fechaObj = new Date(asistencia.timestamp);
        const fecha = fechaObj.toISOString().split('T')[0];
        const hora = fechaObj.toTimeString().split(' ')[0].slice(0, 5);

        doc.text(`• ${nombre} — ${fecha} ${hora}`);
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generarPDFBuffer };
