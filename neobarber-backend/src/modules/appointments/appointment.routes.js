/**
 * appointment.routes.js
 * Rutas del módulo appointments.
 * Documentación completa con Swagger/OpenAPI
 */

const router = require("express").Router();
const Joi = require("joi");
const { validate } = require("../../middlewares/validate.middleware");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { requireRoles } = require("../../middlewares/roles.middleware");
const controller = require("./appointment.controller");

/**
 * Esquema de validación para crear una cita
 */
const createSchema = Joi.object({
  barberId: Joi.string().required().description("ID del barbero"),
  serviceId: Joi.string().required().description("ID del servicio"),
  startAt: Joi.date().iso().required().description("Fecha y hora de inicio (formato ISO)"),
  notes: Joi.string().allow("", null).description("Notas adicionales para la cita"),
});

/**
 * Esquema de validación para cambio de estado
 */
const statusSchema = Joi.object({
  status: Joi.string()
    .valid("Pendiente", "Confirmada", "Cancelada", "Completada")
    .required()
    .description("Nuevo estado de la cita"),
});

/**
 * Esquema de validación para filtros de búsqueda
 */
const dateRangeSchema = Joi.object({
  startDate: Joi.date().iso().description("Fecha inicial para filtrar"),
  endDate: Joi.date().iso().description("Fecha final para filtrar"),
  barberId: Joi.string().description("ID del barbero para filtrar"),
  status: Joi.string()
    .valid("Pendiente", "Confirmada", "Cancelada", "Completada")
    .description("Estado para filtrar")
});

/**
 * Crear una nueva cita
 * Solo clientes autenticados
 */
router.post(
  "/",
  authMiddleware,
  requireRoles("Client"),
  validate(createSchema),
  controller.create
);

/**
 * Obtener mis citas
 * IMPORTANTE:
 * Las rutas fijas como /me y /mine deben ir antes que /:id
 * para que Express no intente interpretar "me" o "mine" como un ObjectId.
 */
router.get("/me", authMiddleware, controller.listMine);

/**
 * Alias adicional para compatibilidad con el frontend.
 * Así el frontend puede usar /api/appointments/mine sin romper.
 */
router.get("/mine", authMiddleware, controller.listMine);

/**
 * Obtener citas del panel barbero.
 * - Barber: ve solo sus citas
 * - Admin: ve todas las citas
 */
router.get(
  "/barber",
  authMiddleware,
  requireRoles("Barber", "Admin"),
  controller.listByBarber
);

/**
 * Listar todas las citas
 * Solo administrador
 */
router.get(
  "/",
  authMiddleware,
  requireRoles("Admin"),
  validate(dateRangeSchema, "query"),
  controller.listAll
);

/**
 * Obtener detalles de una cita por ID
 * Esta ruta debe ir después de /me y /mine
 */
router.get("/:id", authMiddleware, controller.getById);

/**
 * Actualizar estado de una cita
 */
router.put(
  "/:id/status",
  authMiddleware,
  validate(statusSchema),
  controller.updateStatus
);

/**
 * Cancelar una cita
 */
router.put("/:id/cancel", authMiddleware, controller.cancel);

module.exports = router;