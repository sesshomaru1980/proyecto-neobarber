/**
 * error.middleware.js
 * Middleware reutilizable para Express (validación, autenticación, roles, errores).
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

function errorMiddleware(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.message || "Error interno del servidor";
  return res.status(status).json({ error: message });
}

module.exports = { errorMiddleware };
