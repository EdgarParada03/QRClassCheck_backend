const express = require('express');
const router = express.Router();
const { registrarAsistencia } = require('../controllers/asistenciaController');

router.post('/', registrarAsistencia); // Registrar asistencia al escanear QR

module.exports = router;
