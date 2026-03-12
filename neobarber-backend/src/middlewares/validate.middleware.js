/**
 * validate.middleware.js
 * Middleware reutilizable para Express (validación, autenticación, roles, errores).
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return res.status(400).json({ error: error.details.map(d => d.message).join(", ") });
    req.body = value;
    next();
  };
}

module.exports = { validate };
