/**
 * user.service.js
 * Capa service: Reglas de negocio del módulo Users.
 * Arquitectura por capas: routes → controller → service → repository/model
 */

const repo = require("./user.repository");

/**
 * Obtiene usuario por id (sin passwordHash).
 * @param {string} id
 */
async function getById(id) {
  const userDoc = await repo.findById(id);

  if (!userDoc) {
    const err = new Error("Usuario no encontrado");
    err.statusCode = 404;
    throw err;
  }

  const user = userDoc.toObject ? userDoc.toObject() : userDoc;
  delete user.passwordHash;
  return user;
}

/**
 * Desactiva usuario (isActive=false) sin borrar.
 * Recomendado para desactivar barberos sin perder historial.
 * @param {string} id
 */
async function deactivateUser(id) {
  const userDoc = await repo.deactivate(id);

  if (!userDoc) {
    const err = new Error("Usuario no encontrado");
    err.statusCode = 404;
    throw err;
  }

  const user = userDoc.toObject ? userDoc.toObject() : userDoc;
  delete user.passwordHash;
  return user;
}

module.exports = { getById, deactivateUser };