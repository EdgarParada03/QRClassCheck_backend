const getClasesPorDocente = async (req, res) => {
  try {
    const { docente_id } = req.query;
    const clasesSnap = await db.collection('clases')
      .where('docente_id', '==', docente_id)
      .get();

    const clases = [];

    for (const doc of clasesSnap.docs) {
      const clase = doc.data();

      // Obtener asignatura
      const asignaturaSnap = await db.collection('asignaturas').doc(clase.asignatura_id).get();
      const asignatura = asignaturaSnap.exists ? asignaturaSnap.data() : null;

      // Obtener semestre
      const semestreSnap = await db.collection('semestres').doc(clase.semestre_id).get();
      const semestre = semestreSnap.exists ? semestreSnap.data() : null;

      clases.push({
        id: doc.id,
        dia: clase.dia,
        hora_inicio: clase.hora_inicio,
        hora_fin: clase.hora_fin,
        qrHash: clase.qrHash,
        asignatura,
        semestre
      });
    }

    res.status(200).json(clases);
  } catch (error) {
    console.error('Error al obtener clases:', error);
    res.status(500).json({ error: 'Error al obtener clases' });
  }
};

module.exports = { getClasesPorDocente };
