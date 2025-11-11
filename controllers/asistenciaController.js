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

const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '485928313600-12l15gbi99ic35bp92gv2iud166fh1qk.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

const registrarAsistenciaConToken = async (req, res) => {
  try {
    const { idToken, clase_id } = req.body;

    const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email } = payload;

    // Buscar usuario en Firestore
    const usuariosRef = db.collection('usuarios');
    const snapshot = await usuariosRef.where('correo', '==', email).get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Usuario no registrado' });
    }

    const usuario_id = snapshot.docs[0].id;

    const nuevaAsistencia = {
      usuario_id,
      clase_id,
      // Guardar hora local de Colombia
      timestamp: new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })
    };

    const docRef = await db.collection('asistencias').add(nuevaAsistencia);

    res.status(201).json({ id: docRef.id, ...nuevaAsistencia });
  } catch (error) {
    console.error('Error al registrar asistencia con token:', error);
    res.status(500).json({ error: 'Error al registrar asistencia con token' });
  }
};

module.exports = { registrarAsistencia, registrarAsistenciaConToken };