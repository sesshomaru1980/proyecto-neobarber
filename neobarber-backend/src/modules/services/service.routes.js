/**
 * service.routes.js
 * Rutas del módulo services.
 * Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 */

const router = require("express").Router();
const Joi = require("joi");
const { validate } = require("../../middlewares/validate.middleware");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { requireRoles } = require("../../middlewares/roles.middleware");
const controller = require("./service.controller");

/**
 * Validador de URL de imagen.
 * Permite cadena vacía o null.
 */
const imageUrlRule = Joi.string()
  .uri({ scheme: ["http", "https"] })
  .allow("", null);

const createSchema = Joi.object({
  name: Joi.string().min(3).max(80).required(),
  description: Joi.string().allow("", null),
  durationMinutes: Joi.number().integer().min(10).max(240).required(),
  price: Joi.number().min(0).required(),
  imageUrl: imageUrlRule
});

const updateSchema = Joi.object({
  name: Joi.string().min(3).max(80),
  description: Joi.string().allow("", null),
  durationMinutes: Joi.number().integer().min(10).max(240),
  price: Joi.number().min(0),
  imageUrl: imageUrlRule,
  isActive: Joi.boolean()
});

/**
 * Listar todos los servicios
 */
router.get("/", controller.list);

/**
 * Crear servicio (solo Admin)
 */
router.post(
  "/",
  authMiddleware,
  requireRoles("Admin"),
  validate(createSchema),
  controller.create
);

/**
 * Actualizar servicio (solo Admin)
 */
router.put(
  "/:id",
  authMiddleware,
  requireRoles("Admin"),
  validate(updateSchema),
  controller.update
);

/**
 * Eliminar servicio (solo Admin)
 */
router.delete(
  "/:id",
  authMiddleware,
  requireRoles("Admin"),
  controller.remove
);

module.exports = router;