const express = require('express');
const router = express.Router();
const {
  crearSemestre,
  getSemestres
} = require('../controllers/semestresController');

// Registrar semestre
router.post('/', crearSemestre);

// Obtener todos los semestres
router.get('/', getSemestres);

module.exports = router;

