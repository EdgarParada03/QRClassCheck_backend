const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
//app.use(cors());

//manejo del cors
const cors = require('cors');

app.use(cors({
  origin: 'https://qr-class-check-frontend.vercel.app', // dominio del frontend
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(express.json()); // ya no lo repetimos más abajo

// Rutas principales
app.use('/usuarios', require('./routes/usuarios'));
app.use('/asignaturas', require('./routes/asignaturas'));
app.use('/semestres', require('./routes/semestres'));
app.use('/clases', require('./routes/clases'));
app.use('/asistencia', require('./routes/asistencia'));
app.use('/auth', require('./routes/auth'));

// 🚀 Nueva ruta para reportes
app.use('/reporte', require('./routes/reporte'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
