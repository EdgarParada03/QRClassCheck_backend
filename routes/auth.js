const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const { db } = require('../firebase/adminConfig');

const CLIENT_ID = '485928313600-12l15gbi99ic35bp92gv2iud166fh1qk.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

router.post('/google', async (req, res) => {
  const { idToken, es_docente } = req.body; // ← ahora se acepta es_docente

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email, sub: uid } = payload;

    // Buscar o registrar usuario en Firestore
    const usuariosRef = db.collection('usuarios');
    const snapshot = await usuariosRef.where('correo', '==', email).get();

    let userDoc;
    if (snapshot.empty) {
      const nuevoUsuario = {
        nombre_completo: name,
        correo: email,
        es_docente: es_docente === false ? false : true // ← usa el valor enviado, por defecto true
      };
      const docRef = await usuariosRef.add(nuevoUsuario);
      userDoc = { id: docRef.id, ...nuevoUsuario };
    } else {
      userDoc = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }

    // Simular token de sesión
    const sessionToken = 'mock-session-token-' + uid;

    res.status(200).json({
      token: sessionToken,
      user: userDoc,
    });
  } catch (error) {
    console.error('Error al verificar el token de Google:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
});

module.exports = router;
