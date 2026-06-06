/**
 * auth.controller.js
 * Controlador HTTP del módulo **auth**. Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

const service = require("./auth.service");

async function register(req, res, next) {
  try { res.status(201).json(await service.register(req.body)); } catch (e) { next(e); }
}
async function login(req, res, next) {
  try { res.json(await service.login(req.body)); } catch (e) { next(e); }
}

module.exports = { register, login };
