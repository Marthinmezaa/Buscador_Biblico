const express = require("express");
const router = express.Router();
const etiquetaController = require("../controllers/etiquetaController");

router.get("/etiquetas", etiquetaController.listarEtiquetas);

module.exports = router;
