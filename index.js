const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/usuarios', require('./routes/usuarios'));
app.use('/asignaturas', require('./routes/asignaturas'));
app.use('/semestres', require('./routes/semestres'));
app.use('/clases', require('./routes/clases'));
app.use('/asistencia', require('./routes/asistencia'));

//Validacion o autenticación cuentas google
const authRoutes = require('./routes/auth');
app.use(express.json());
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
