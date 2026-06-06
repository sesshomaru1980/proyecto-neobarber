/**
 * availability.routes.js
 * Rutas del módulo **availability**. Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */
/**
 * @openapi
 * tags:
 *   - name: Availability
 *     description: Disponibilidad (slots) y bloqueos de agenda
 */
const router = require("express").Router();
const Joi = require("joi");
const { validate } = require("../../middlewares/validate.middleware");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { requireRoles } = require("../../middlewares/roles.middleware");
const controller = require("./availability.controller");

const blockSchema = Joi.object({
  barberId: Joi.string().required(),
  startAt: Joi.date().iso().required(),
  endAt: Joi.date().iso().required(),
  reason: Joi.string().allow("", null),
});
/**
 * @openapi
 * /api/availability/daily-slots:
 *   get:
 *     tags: [Availability]
 *     summary: Obtener slots de disponibilidad de un día (UTC)
 *     description: Genera franjas horarias (slotMinutes) entre 09:00 y 18:00 UTC y marca si están disponibles, considerando citas y bloqueos.
 *     parameters:
 *       - in: query
 *         name: barberId
 *         required: true
 *         schema: { type: string }
 *         example: 69a45fcfbe4b11b7307acc22
 *       - in: query
 *         name: dateUtc
 *         required: true
 *         schema: { type: string, format: date-time }
 *         example: 2026-09-03T00:00:00.000Z
 *       - in: query
 *         name: slotMinutes
 *         required: false
 *         schema: { type: integer, example: 30 }
 *     responses:
 *       200:
 *         description: Lista de slots con bandera available
 *       400:
 *         description: Parámetros inválidos
 */
router.get("/daily-slots", controller.dailySlots);
/**
 * @openapi
 * /api/availability/block:
 *   post:
 *     tags: [Availability]
 *     summary: Crear bloqueo de agenda (Admin o Barber)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [barberId, startAt, endAt]
 *             properties:
 *               barberId:
 *                 type: string
 *                 example: 69a45fcfbe4b11b7307acc22
 *               startAt:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-09-03T12:00:00.000Z
 *               endAt:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-09-03T13:00:00.000Z
 *               reason:
 *                 type: string
 *                 example: Almuerzo
 *     responses:
 *       201:
 *         description: Bloqueo creado
 *       401:
 *         description: Token requerido o inválido
 *       403:
 *         description: No autorizado
 *       409:
 *         description: Bloqueo se solapa con otro bloqueo
 */
router.post("/block", authMiddleware, requireRoles("Admin", "Barber"), validate(blockSchema), controller.createBlock);
/**
 * @openapi
 * /api/availability/block/{id}:
 *   delete:
 *     tags: [Availability]
 *     summary: Eliminar bloqueo (Admin o Barber)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Bloqueo eliminado
 *       401:
 *         description: Token requerido o inválido
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Bloqueo no encontrado
 */
router.delete("/block/:id", authMiddleware, requireRoles("Admin", "Barber"), controller.deleteBlock);

module.exports = router;
