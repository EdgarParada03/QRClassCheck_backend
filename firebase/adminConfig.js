require('dotenv').config();
const admin = require('firebase-admin');

// Leer el JSON desde la variable de entorno
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id
});

const db = admin.firestore();

module.exports = { admin, db };
