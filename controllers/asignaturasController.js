const { db } = require('../firebase/adminConfig');

const crearAsignatura = async (req, res) => {
  try {
    const { nombre, codigo } = req.body;

    const nuevaAsignatura = { nombre, codigo };
    const docRef = await db.collection('asignaturas').add(nuevaAsignatura);

    res.status(201).json({ id: docRef.id, ...nuevaAsignatura });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear asignatura' });
  }
};

const getAsignaturas = async (req, res) => {
  try {
    const snapshot = await db.collection('asignaturas').get();
    const asignaturas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(asignaturas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener asignaturas' });
  }
};

module.exports = {
  crearAsignatura,
  getAsignaturas
};
