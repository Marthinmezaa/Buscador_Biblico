const express = require("express");
const router = express.Router();

// Importar los dos controladores
const etiquetaController = require("../controllers/etiquetaController");
const busquedaController = require("../controllers/busquedaController");

// Mostrar el menu de equitquetas
router.get("/etiquetas", etiquetaController.listarEtiquetas);

// Buscador por emociones
router.get("/buscar/:emocion", busquedaController.buscarPorEmocion);

module.exports = router;
