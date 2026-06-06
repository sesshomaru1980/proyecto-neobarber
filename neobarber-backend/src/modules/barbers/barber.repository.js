/**
 * barber.repository.js
 * Acceso a datos (repositorio) del módulo barbers.
 * Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 */

const BarberProfile = require("./barber.model");

/**
 * Lista perfiles de barberos.
 * @param {Object} options - Opciones de consulta
 * @param {boolean} options.includeInactive - Si es true, incluye usuarios inactivos
 * @returns {Promise<Array>}
 */
const list = async ({ includeInactive = false } = {}) => {
  const populateConfig = {
    path: "userId",
    select: "fullName email role isActive"
  };

  // Si no se deben incluir inactivos, filtra solo activos
  if (!includeInactive) {
    populateConfig.match = { isActive: true };
  }

  const barbers = await BarberProfile.find()
    .populate(populateConfig)
    .lean();

  // Si populate dejó userId en null, se filtran
  return barbers.filter((b) => b.userId);
};

/**
 * Obtiene perfil de barbero por userId.
 * @param {string} userId
 * @returns {Promise<Object|null>}
 */
const getByUserId = (userId) => BarberProfile.findOne({ userId }).lean();

/**
 * Crea o actualiza un perfil de barbero por userId.
 * @param {string} userId
 * @param {Object} data
 * @returns {Promise<Object>}
 */
const upsert = (userId, data) =>
  BarberProfile.findOneAndUpdate(
    { userId },
    { userId, ...data },
    { upsert: true, new: true }
  ).lean();

module.exports = {
  list,
  getByUserId,
  upsert
};