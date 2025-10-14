// firebase/adminConfig.js

const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config(); // ← Asegúrate de tener esto para leer .env

// Leer la ruta desde la variable de entorno
const serviceAccountPath = process.env.FIREBASE_KEY_PATH;

// Cargar el archivo de credenciales dinámicamente
const serviceAccount = require(path.resolve(serviceAccountPath));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "qrclasscheck-6e75e"
});

const db = admin.firestore();

module.exports = { admin, db };
