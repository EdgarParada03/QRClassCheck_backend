const express = require('express');
const router = express.Router();
const {
  crearAsignatura,
  getAsignaturas
} = require('../controllers/asignaturasController');

// Crear asignatura
router.post('/', crearAsignatura);

// Obtener todas las asignaturas
router.get('/', getAsignaturas);

module.exports = router;
