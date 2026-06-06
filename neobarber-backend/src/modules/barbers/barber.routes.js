/**
 * barber.routes.js
 * Rutas del módulo barbers.
 * Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 */

const router = require("express").Router();
const Joi = require("joi");
const { validate } = require("../../middlewares/validate.middleware");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { requireRoles } = require("../../middlewares/roles.middleware");
const controller = require("./barber.controller");

/**
 * Regla reutilizable para URL de imagen.
 * Permite vacío o null.
 */
const imageUrlRule = Joi.string()
  .uri({ scheme: ["http", "https"] })
  .allow("", null);

/**
 * Esquema para crear un barbero completo desde admin.
 */
const createBarberSchema = Joi.object({
  fullName: Joi.string().trim().required(),
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(6).required(),
  bio: Joi.string().allow("", null).default(""),
  imageUrl: imageUrlRule,
  weeklyAvailability: Joi.array().items(
    Joi.object({
      dayOfWeek: Joi.number().integer().min(0).max(6).required(),
      start: Joi.string().required(),
      end: Joi.string().required()
    })
  ).default([])
});

/**
 * Esquema para actualizar un barbero existente.
 */
const updateBarberSchema = Joi.object({
  userId: Joi.string().required(),
  fullName: Joi.string().trim().required(),
  email: Joi.string().email().trim().required(),
  bio: Joi.string().allow("", null).default(""),
  imageUrl: imageUrlRule,
  weeklyAvailability: Joi.array().items(
    Joi.object({
      dayOfWeek: Joi.number().integer().min(0).max(6).required(),
      start: Joi.string().required(),
      end: Joi.string().required()
    })
  ).default([])
});

/**
 * Esquema para activar o desactivar un barbero.
 */
const setActiveSchema = Joi.object({
  isActive: Joi.boolean().required()
});

/**
 * Listar barberos.
 */
router.get("/", authMiddleware, controller.list);

/**
 * Crear un nuevo barbero.
 * Solo admin.
 */
router.post(
  "/admin-create",
  authMiddleware,
  requireRoles("Admin"),
  validate(createBarberSchema),
  controller.createBarber
);

/**
 * Actualizar datos del barbero y su perfil.
 * Solo admin.
 */
router.put(
  "/admin-update",
  authMiddleware,
  requireRoles("Admin"),
  validate(updateBarberSchema),
  controller.updateBarber
);

/**
 * Activar o desactivar usuario barbero.
 * Solo admin.
 */
router.patch(
  "/:userId/active",
  authMiddleware,
  requireRoles("Admin"),
  validate(setActiveSchema),
  controller.setActive
);

/**
 * Crear o actualizar perfil del barbero.
 * Admin o el propio barbero.
 */
router.post(
  "/upsert",
  authMiddleware,
  requireRoles("Admin", "Barber"),
  controller.upsert
);

module.exports = router;