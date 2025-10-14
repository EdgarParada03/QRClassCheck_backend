const { db } = require('../firebase/adminConfig');

const registrarUsuario = async (req, res) => {
  try {
    const { nombre_completo, correo, es_docente } = req.body;

    const nuevoUsuario = { nombre_completo, correo, es_docente };
    const docRef = await db.collection('usuarios').add(nuevoUsuario);

    res.status(201).json({ id: docRef.id, ...nuevoUsuario });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

module.exports = { registrarUsuario };
