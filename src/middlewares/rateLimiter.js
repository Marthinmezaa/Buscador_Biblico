/**
 * MIDDLEWARE DE RATE LIMITING
 * Protege las rutas de la API contra abuso y ataques DDoS.
 * Aplica límites de peticiones por dirección IP.
 */

const rateLimit = require("express-rate-limit");

/**
 * Crea un middleware de rate limiting configurado para la API de búsqueda.
 * @param {Object} options - Opciones de configuración personalizadas
 * @returns {Function} Middleware de rate limiting
 */
const crearRateLimiter = (options = {}) => {
  // Configuración por defecto
  const configuracionDefault = {
    windowMs: 15 * 60 * 1000, // 15 minutos en milisegundos
    max: 100, // Máximo 100 peticiones por ventana
    message: {
      error:
        "Demasiadas peticiones. Por favor, intente de nuevo en 15 minutos.",
      retryAfter: "Fecha de desbloqueo",
    },
    standardHeaders: true, // Incluye headers estándar (X-RateLimit-*)
    legacyHeaders: false, // Deshabilita headers antiguos
    handler: (req, res) => {
      // Respuesta personalizada en formato JSON
      const remainingTime = Math.ceil(
        (req.rateLimit.resetTime * 1000 - Date.now()) / 1000 / 60,
      );
      console.log(
        `[RATE LIMIT] IP: ${req.ip} - Límite excedido. Current: ${req.rateLimit.current}, Limit: ${req.rateLimit.limit}`,
      );
      res.status(429).json({
        error: configuracionDefault.message.error,
        retryAfter: `${remainingTime} minutos`,
        limit: req.rateLimit.limit,
        current: req.rateLimit.current,
      });
    },
    ...options, // Permite sobrescribir opciones
  };

  const limiter = rateLimit(configuracionDefault);
  console.log(
    `[RATE LIMIT] Middleware creado - Window: ${configuracionDefault.windowMs}ms, Max: ${configuracionDefault.max} peticiones`,
  );
  return limiter;
};

// Exportamos el middleware configurado para la ruta de búsqueda
module.exports = {
  rateLimiterBusqueda: crearRateLimiter(),
};
