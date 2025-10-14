const express = require('express');
const router = express.Router();
const { registrarUsuario } = require('../controllers/usuariosController');

router.post('/', registrarUsuario); // Registrar usuario (docente o estudiante)

module.exports = router;
