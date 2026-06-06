/**
 * roles.middleware.js
 * Middleware reutilizable para Express para validar roles (RBAC).
 *
 * Nota: Este archivo NO debe contener JSON de respuestas ni tokens.
 */

function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(401).json({ error: "No autenticado" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "No autorizado" });
    }

    return next();
  };
}

module.exports = { requireRoles };