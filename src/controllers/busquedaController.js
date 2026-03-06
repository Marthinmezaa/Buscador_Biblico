/**
 * CONTROLADOR DE BÚSQUEDA (Busqueda Controller)
 * Maneja la lógica cuando un usuario intenta buscar versículos por emoción.
 */

const Versiculo = require("../models/versiculoModel");
const Diccionario = require("../models/diccionarioModel");

const busquedaController = {
  buscarPorEmocion: (req, res) => {
    // 1. La "emocion" que llega de la URL ahora puede ser una frase entera (ej: "estoy triste")
    const fraseDelUsuario = req.params.emocion;

    // 2. Primero, pasamos la frase por nuestro Diccionario en la base de datos
    Diccionario.traducirFrase(fraseDelUsuario, (err, emocionOficial) => {
      if (err) {
        console.error("Error en el diccionario:", err);
        return res
          .status(500)
          .json({ error: "Error al interpretar la frase." });
      }

      // 3. Lógica de Fallback (Plan B)
      let emocionFinal = emocionOficial;

      if (!emocionFinal) {
        emocionFinal =
          fraseDelUsuario.charAt(0).toUpperCase() + fraseDelUsuario.slice(1);
      }

      // 4. AHORA SÍ: Con la emoción oficial en mano, mandamos a buscar los versículos.
      Versiculo.buscarPorEtiqueta(emocionFinal, (err, resultados) => {
        if (err) {
          console.error("Error de busqueda:", err);
          return res
            .status(500)
            .json({ error: "Error interno del servidor al buscar." });
        }

        if (resultados.length === 0) {
          return res.status(404).json({
            mensaje: `Aún no tenemos versículos registrados para: ${emocionFinal}`,
          });
        }

        res.status(200).json(resultados);
      });
    });
  },
};

module.exports = busquedaController;
