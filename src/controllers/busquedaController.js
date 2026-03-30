/**
 * CONTROLADOR DE BÚSQUEDA (Busqueda Controller)
 * Maneja la lógica cuando un usuario intenta buscar versículos por emoción.
 */

const Versiculo = require("../models/versiculoModel");
const Diccionario = require("../models/diccionarioModel");
const { sanitizeHtml } = require("../utils/sanitizer");

// 1. EL BOLSILLO DEL CRUPIER (Caché en Memoria RAM del Servidor)
const cacheInterno = {};

// 2. FUNCIÓN PURA PARA MEZCLAR Y CORTAR (Clean Code)
const mezclarYCortar = (array, cantidad) => {
  const arrayCopiado = [...array]; // Copiamos para no modificar el original
  return arrayCopiado.sort(() => Math.random() - 0.5).slice(0, cantidad);
};

const validateEmotionInput = (emotion) => {
  if (!emotion || emotion.trim().length === 0) {
    return { isValid: false, error: "La emoción no puede estar vacía" };
  }
  if (emotion.length > 100) {
    return {
      isValid: false,
      error: "La emoción es demasiado larga (máximo 100 caracteres)",
    };
  }
  const emotionRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s/]+$/;
  if (!emotionRegex.test(emotion)) {
    return {
      isValid: false,
      error: "La emoción contiene caracteres no permitidos",
    };
  }
  return { isValid: true, error: null };
};

const busquedaController = {
  buscarPorEmocion: (req, res) => {
    const fraseDelUsuario = decodeURIComponent(req.params.emocion);

    const validation = validateEmotionInput(fraseDelUsuario);
    if (!validation.isValid) {
      console.error("Validación de entrada fallida:", validation.error);
      return res.status(400).json({ error: validation.error });
    }

    Diccionario.traducirFrase(fraseDelUsuario, (err, emocionOficial) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Error interno al interpretar la frase." });
      if (!emocionOficial)
        return res.status(404).json({
          error: `Aun no tenemos versiculos para: ${fraseDelUsuario}.`,
        });

      // 3. CACHÉ
      if (cacheInterno[emocionOficial]) {
        console.log(
          `[Caché Activo] Sirviendo 3 versículos aleatorios de: "${emocionOficial}"`,
        );
        const versiculosMezclados = mezclarYCortar(
          cacheInterno[emocionOficial],
          3,
        );
        return res.status(200).json(versiculosMezclados);
      }

      // 4. Si no está en caché, buscamos TODOS los versículos en la base de datos
      Versiculo.buscarPorEtiqueta(emocionOficial, (err, resultados) => {
        if (err)
          return res.status(500).json({
            error: "Error interno del servidor al buscar versículos.",
          });
        if (resultados.length === 0)
          return res.status(404).json({
            mensaje: `Aún no tenemos versículos registrados para: ${emocionOficial}`,
          });

        const resultadosSanitizados = resultados.map((versiculo) => ({
          ...versiculo,
          texto: sanitizeHtml(versiculo.texto),
        }));

        // Guardado de versiculos compeltos en cache para futura solicitudes.
        cacheInterno[emocionOficial] = resultadosSanitizados;
        console.log(
          `[Base de Datos] Mazo completo de "${emocionOficial}" guardado en memoria.`,
        );

        // Mezclamos y enviamos 3
        const versiculosMezclados = mezclarYCortar(resultadosSanitizados, 3);
        res.status(200).json(versiculosMezclados);
      });
    });
  },

  validateEmotionInput: validateEmotionInput,
};

module.exports = busquedaController;
