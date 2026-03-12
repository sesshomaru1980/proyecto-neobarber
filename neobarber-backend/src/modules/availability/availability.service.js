/**
 * availability.service.js
 * Lógica de negocio del módulo **availability**. Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

const timeBlockRepo = require("./timeblock.repository");
const appointmentRepo = require("../appointments/appointment.repository");

async function getDailySlots({ barberId, dateUtc, slotMinutes }) {
  if (!barberId) {
    const err = new Error("barberId es requerido");
    err.statusCode = 400;
    throw err;
  }

  const day = new Date(dateUtc);
  if (isNaN(day.getTime())) {
    const err = new Error("dateUtc inválido (ISO)");
    err.statusCode = 400;
    throw err;
  }

  const slot = Math.max(10, Number(slotMinutes) || 30);

  const from = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), 9, 0, 0));
  const to = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), 18, 0, 0));

  const blocks = await timeBlockRepo.listByBarberRange(barberId, from, to);
  const appts = await appointmentRepo.findByBarber(barberId);

  const slots = [];
  for (let t = new Date(from); t.getTime() + slot * 60000 <= to.getTime(); t = new Date(t.getTime() + slot * 60000)) {
    const end = new Date(t.getTime() + slot * 60000);
    const overlapsBlock = blocks.some(b => t < new Date(b.endAt) && end > new Date(b.startAt));
    const overlapsAppt = appts.some(a => a.status !== "Cancelada" && t < new Date(a.endAt) && end > new Date(a.startAt));
    slots.push({ startAt: t.toISOString(), endAt: end.toISOString(), available: !(overlapsBlock || overlapsAppt) });
  }
  return slots;
}

async function createBlock({ barberId, startAt, endAt, reason }) {
  const start = new Date(startAt);
  const end = new Date(endAt);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    const err = new Error("startAt/endAt inválido (ISO)");
    err.statusCode = 400;
    throw err;
  }
  if (end <= start) {
    const err = new Error("Rango inválido: endAt debe ser mayor a startAt");
    err.statusCode = 400;
    throw err;
  }

  const overlap = await timeBlockRepo.hasOverlap(barberId, start, end);
  if (overlap) {
    const err = new Error("Bloqueo se solapa con otro bloqueo");
    err.statusCode = 409;
    throw err;
  }

  return timeBlockRepo.create({ barberId, startAt: start, endAt: end, reason });
}

async function deleteBlock(id) {
  const deleted = await timeBlockRepo.remove(id);
  if (!deleted) {
    const err = new Error("Bloqueo no encontrado");
    err.statusCode = 404;
    throw err;
  }
  return deleted;
}

module.exports = { getDailySlots, createBlock, deleteBlock };
