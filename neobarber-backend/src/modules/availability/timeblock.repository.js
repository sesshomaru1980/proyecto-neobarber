/**
 * timeblock.repository.js
 * Acceso a datos (repositorio) del módulo **availability**. Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

const TimeBlock = require("./timeblock.model");

const create = (data) => TimeBlock.create(data);
const remove = (id) => TimeBlock.findByIdAndDelete(id).lean();

async function hasOverlap(barberId, startAt, endAt) {
  const count = await TimeBlock.countDocuments({
    barberId,
    startAt: { $lt: endAt },
    endAt: { $gt: startAt },
  });
  return count > 0;
}

function listByBarberRange(barberId, fromUtc, toUtc) {
  return TimeBlock.find({
    barberId,
    startAt: { $lt: toUtc },
    endAt: { $gt: fromUtc },
  }).lean();
}

module.exports = { create, remove, hasOverlap, listByBarberRange };
