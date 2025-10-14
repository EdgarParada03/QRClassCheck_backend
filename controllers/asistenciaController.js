const { db } = require('../firebase/adminConfig');

const registrarAsistencia = async (req, res) => {
  try {
    const { usuario_id, clase_id } = req.body;

    const nuevaAsistencia = {
      usuario_id,
      clase_id,
      timestamp: new Date().toISOString()
    };

    const docRef = await db.collection('asistencias').add(nuevaAsistencia);

    res.status(201).json({ id: docRef.id, ...nuevaAsistencia });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar asistencia' });
  }
};

module.exports = { registrarAsistencia };
