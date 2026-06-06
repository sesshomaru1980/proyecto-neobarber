/**
 * service.service.js
 * Lógica de negocio del módulo services.
 */

const repo = require("./service.repository");

async function list() {
  return repo.getAll();
}

async function create(data) {
  return repo.create(data);
}

async function update(id, data) {
  const updated = await repo.update(id, data);

  if (!updated) {
    const err = new Error("Servicio no encontrado");
    err.statusCode = 404;
    throw err;
  }

  return updated;
}

async function remove(id) {
  const deleted = await repo.remove(id);

  if (!deleted) {
    const err = new Error("Servicio no encontrado");
    err.statusCode = 404;
    throw err;
  }

  return deleted;
}

module.exports = {
  list,
  create,
  update,
  remove
};