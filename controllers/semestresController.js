const { db } = require('../firebase/adminConfig');

const crearSemestre = async (req, res) => {
  try {
    const { nombre, año, periodo, fecha_inicio, fecha_fin } = req.body;

    const nuevoSemestre = {
      nombre,
      año,
      periodo,
      fecha_inicio,
      fecha_fin,
      fecha_registro: new Date().toISOString()
    };

    const docRef = await db.collection('semestres').add(nuevoSemestre);

    res.status(201).json({ id: docRef.id, ...nuevoSemestre });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear semestre' });
  }
};

const getSemestres = async (req, res) => {
  try {
    const snapshot = await db.collection('semestres').get();
    const semestres = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(semestres);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener semestres' });
  }
};

module.exports = {
  crearSemestre,
  getSemestres
};
