/**
 * service.controller.js
 * Controlador HTTP del módulo services.
 * Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 */

const service = require("./service.service");

/**
 * Lista todos los servicios.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
async function list(req, res, next) {
  try {
    res.json(await service.list());
  } catch (e) {
    next(e);
  }
}

/**
 * Crea un nuevo servicio.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
async function create(req, res, next) {
  try {
    res.status(201).json(await service.create(req.body));
  } catch (e) {
    next(e);
  }
}

/**
 * Actualiza un servicio existente.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
async function update(req, res, next) {
  try {
    res.json(await service.update(req.params.id, req.body));
  } catch (e) {
    next(e);
  }
}

/**
 * Elimina un servicio existente.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
async function remove(req, res, next) {
  try {
    await service.remove(req.params.id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

module.exports = {
  list,
  create,
  update,
  remove
};