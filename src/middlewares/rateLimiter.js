/**
 * MIDDLEWARE DE RATE LIMITING
 * Protege las rutas de la API contra abuso y ataques DDoS.
 * Aplica limites de peticiones por direccion IP.
 */

const rateLimit = require("express-rate-limit");

// Configuracion centralizada
const windowMs = 15 * 60 * 1000; // 15 minutos en milisegundos
const maxRequests = 100; // Maximo 100 peticiones por ventana

const crearRateLimiter = () => {
  const rateLimitMiddleware = rateLimit({
    windowMs: windowMs,
    max: maxRequests,
    message: {
      error:
        "Demasiadas peticiones. Por favor, intente de nuevo en 15 minutos.",
      retryAfter: "Fecha de desbloqueo",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Solo imprimir que el escudo esta activo si NO estamos haciendo tests
  if (process.env.NODE_ENV !== "test") {
    console.log(
      `[RATE LIMIT] Middleware creado - Window: ${windowMs}ms, Max: ${maxRequests} peticiones`,
    );
  }

  return rateLimitMiddleware;
};

// Exportamos el middleware configurado para la ruta de busqueda
module.exports = {
  rateLimiterBusqueda: crearRateLimiter(),
};
