const express = require('express');
const router = express.Router();
const { registrarAsistencia, registrarAsistenciaConToken } = require('../controllers/asistenciaController');

router.post('/', registrarAsistencia); // Registrar asistencia al escanear QR
router.post('/con-token', registrarAsistenciaConToken); // nuevo

module.exports = router;
