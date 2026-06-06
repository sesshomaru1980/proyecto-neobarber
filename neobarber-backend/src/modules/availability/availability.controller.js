/**
 * availability.controller.js
 * Controlador HTTP del módulo **availability**. Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

const service = require("./availability.service");

async function dailySlots(req, res, next) {
  try {
    const { barberId, dateUtc, slotMinutes } = req.query;
    const slots = await service.getDailySlots({ barberId, dateUtc, slotMinutes });
    res.json(slots);
  } catch (e) {
    next(e);
  }
}

async function createBlock(req, res, next) {
  try {
    const block = await service.createBlock(req.body);
    res.status(201).json(block);
  } catch (e) {
    next(e);
  }
}

async function deleteBlock(req, res, next) {
  try {
    await service.deleteBlock(req.params.id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

module.exports = { dailySlots, createBlock, deleteBlock };
