/**
 * user.repository.js
 * Capa repository: Acceso a datos del módulo Users (MongoDB/Mongoose).
 * Arquitectura por capas: routes → controller → service → repository/model
 */

const User = require("./user.model");

/**
 * Busca usuario por email.
 * @param {string} email
 */
function findByEmail(email) {
  return User.findOne({ email });
}

/**
 * Busca usuario por id.
 * @param {string} id
 */
function findById(id) {
  return User.findById(id);
}

/**
 * Crea un nuevo usuario.
 * @param {object} user
 */
function create(user) {
  return User.create(user);
}

/**
 * Desactiva un usuario (soft-disable).
 * Nota: No se borra el documento, solo se marca isActive=false.
 * Esto conserva histórico (citas, auditoría, etc.).
 * @param {string} id
 */
function deactivate(id) {
  return User.findByIdAndUpdate(id, { isActive: false }, { new: true });
}

module.exports = { findByEmail, findById, create, deactivate };