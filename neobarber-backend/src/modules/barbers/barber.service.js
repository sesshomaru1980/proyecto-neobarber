/**
 * barber.service.js
 * Lógica de negocio del módulo barbers.
 * Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 */

const bcrypt = require("bcryptjs");
const repo = require("./barber.repository");
const User = require("../users/user.model");

/**
 * Lista perfiles de barberos.
 * - Admin: puede ver activos e inactivos
 * - Otros usuarios: solo activos
 * @param {Object|null} user - Usuario autenticado opcional
 * @returns {Promise<Array>}
 */
const list = (user = null) => {
  const includeInactive = user?.role === "Admin";
  return repo.list({ includeInactive });
};

/**
 * Crea un usuario con rol Barber y luego crea/actualiza su perfil.
 * @param {Object} data
 * @returns {Promise<Object>}
 */
const createBarber = async (data) => {
  const {
    fullName,
    email,
    password,
    bio,
    imageUrl,
    weeklyAvailability = []
  } = data;

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    throw new Error("Ya existe un usuario con ese correo electrónico");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName: fullName.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
    role: "Barber",
    isActive: true
  });

  const barberProfile = await repo.upsert(user._id.toString(), {
    userId: user._id.toString(),
    bio: bio || "",
    imageUrl: imageUrl || "",
    weeklyAvailability
  });

  return barberProfile;
};

/**
 * Actualiza datos del usuario barbero y su perfil.
 * @param {string} userId
 * @param {Object} data
 * @returns {Promise<Object>}
 */
const updateBarber = async (userId, data) => {
  const {
    fullName,
    email,
    bio,
    imageUrl,
    weeklyAvailability = []
  } = data;

  const user = await User.findOne({
    _id: userId,
    role: "Barber"
  });

  if (!user) {
    throw new Error("No existe un usuario barbero con ese ID");
  }

  const emailInUse = await User.findOne({
    email: email.toLowerCase().trim(),
    _id: { $ne: userId }
  });

  if (emailInUse) {
    throw new Error("Ya existe otro usuario con ese correo electrónico");
  }

  user.fullName = fullName.trim();
  user.email = email.toLowerCase().trim();
  await user.save();

  return repo.upsert(userId, {
    userId,
    bio: bio || "",
    imageUrl: imageUrl || "",
    weeklyAvailability
  });
};

/**
 * Activa o desactiva el usuario del barbero.
 * @param {string} userId
 * @param {boolean} isActive
 * @returns {Promise<Object>}
 */
const setActive = async (userId, isActive) => {
  const user = await User.findOne({
    _id: userId,
    role: "Barber"
  });

  if (!user) {
    throw new Error("No existe un usuario barbero con ese ID");
  }

  user.isActive = !!isActive;
  await user.save();

  return {
    userId: user._id,
    fullName: user.fullName,
    email: user.email,
    isActive: user.isActive
  };
};

/**
 * Crea o actualiza el perfil de un barbero ya existente.
 * Se mantiene por compatibilidad.
 * @param {string} userId
 * @param {Object} data
 * @returns {Promise<Object>}
 */
const upsert = async (userId, data) => {
  const user = await User.findOne({
    _id: userId,
    role: "Barber"
  });

  if (!user) {
    throw new Error("No existe un usuario barbero con ese ID");
  }

  return repo.upsert(userId, data);
};

module.exports = {
  list,
  createBarber,
  updateBarber,
  setActive,
  upsert
};