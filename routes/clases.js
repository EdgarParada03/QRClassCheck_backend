const express = require('express');
const router = express.Router();
const { crearClase, getClasesPorDocente } = require('../controllers/clasesController');

router.post('/', crearClase);
router.get('/', getClasesPorDocente);


module.exports = router;
