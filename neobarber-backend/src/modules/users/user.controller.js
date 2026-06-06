/**
 * user.controller.js
 * Controlador HTTP del módulo Users.
 * Arquitectura por capas: routes → controller → service → repository/model
 */

const service = require("./user.service");

/**
 * Retorna el perfil del usuario autenticado.
 */
async function getMe(req, res, next) {
  try {
    const user = await service.getById(req.user.sub);
    return res.json(user);
  } catch (e) {
    return next(e);
  }
}

/**
 * Desactiva un usuario (solo Admin).
 * Marca isActive=false (no borra documentos).
 */
async function deactivate(req, res, next) {
  try {
    const user = await service.deactivateUser(req.params.id);
    return res.json(user);
  } catch (e) {
    return next(e);
  }
}

module.exports = { getMe, deactivate };