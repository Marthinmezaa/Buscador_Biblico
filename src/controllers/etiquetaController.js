// 1. Importar modelo
const Etiqueta = require("../models/etiquetaModel");

const etiquetaController = {
  listarEtiquetas: (req, res) => {
    // 2. Usar el modelo de arriba
    Etiqueta.obtenerTodas((err, datos) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al obtener las etiquetas" });
      }
      res.status(200).json(datos);
    });
  },
};

module.exports = etiquetaController;
