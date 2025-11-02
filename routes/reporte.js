const express = require('express');
const router = express.Router();
const {
  obtenerReporte,
  generarPDFReporte,
  enviarReportePorCorreo
} = require('../controllers/reporteController');

// Obtener datos del reporte
router.get('/:idClase', obtenerReporte);

// Generar y descargar PDF
router.get('/:idClase/pdf', generarPDFReporte);

// Enviar PDF por correo
router.post('/:idClase/enviar', enviarReportePorCorreo);

module.exports = router;
