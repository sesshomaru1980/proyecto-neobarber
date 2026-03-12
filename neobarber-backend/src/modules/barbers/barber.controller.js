/**
 * barber.controller.js
 * Controlador HTTP del módulo barbers.
 * Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 */

const service = require("./barber.service");

/**
 * Lista barberos registrados.
 * - Admin ve activos e inactivos
 * - Otros usuarios ven solo activos
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
async function list(req, res, next) {
  try {
    const data = await service.list(req.user || null);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

/**
 * Crea un nuevo usuario con rol Barber y luego su perfil.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
async function createBarber(req, res, next) {
  try {
    const barber = await service.createBarber(req.body);

    res.status(201).json({
      success: true,
      message: "Barbero creado correctamente",
      data: barber
    });
  } catch (e) {
    next(e);
  }
}

/**
 * Actualiza datos del usuario barbero y su perfil.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
async function updateBarber(req, res, next) {
  try {
    const barber = await service.updateBarber(req.body.userId, req.body);

    res.json({
      success: true,
      message: "Barbero actualizado correctamente",
      data: barber
    });
  } catch (e) {
    next(e);
  }
}

/**
 * Activa o desactiva el usuario del barbero.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
async function setActive(req, res, next) {
  try {
    const result = await service.setActive(req.params.userId, req.body.isActive);

    res.json({
      success: true,
      message: req.body.isActive
        ? "Barbero activado correctamente"
        : "Barbero desactivado correctamente",
      data: result
    });
  } catch (e) {
    next(e);
  }
}

/**
 * Crea o actualiza el perfil del barbero existente.
 * Se mantiene por compatibilidad.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
async function upsert(req, res, next) {
  try {
    const barber = await service.upsert(req.body.userId, req.body);

    res.json({
      success: true,
      message: "Perfil del barbero guardado correctamente",
      data: barber
    });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  list,
  createBarber,
  updateBarber,
  setActive,
  upsert
};