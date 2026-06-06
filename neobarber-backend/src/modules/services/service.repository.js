/**
 * service.repository.js
 * Acceso a datos (repositorio) del módulo **services**. Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

const Service = require("./service.model");

const getAll = () => Service.find().lean();
const getById = (id) => Service.findById(id).lean();
const create = (data) => Service.create(data);
const update = (id, data) => Service.findByIdAndUpdate(id, data, { new: true }).lean();
const remove = (id) => Service.findByIdAndDelete(id).lean();

module.exports = { getAll, getById, create, update, remove };
