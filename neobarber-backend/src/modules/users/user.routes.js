/**
 * user.routes.js
 * Rutas del módulo Users.
 * Arquitectura por capas: routes → controller → service → repository/model
 */

const router = require("express").Router();
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { requireRoles } = require("../../middlewares/roles.middleware");
const controller = require("./user.controller");

/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: Gestión de usuarios y perfil
 */

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     tags: [Users]
 *     summary: Obtener perfil del usuario autenticado
 *     description: Retorna la información del usuario autenticado sin el campo passwordHash.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario autenticado
 *       401:
 *         description: Token inválido o ausente
 */
router.get("/me", authMiddleware, controller.getMe);

/**
 * @openapi
 * /api/users/{id}/deactivate:
 *   patch:
 *     tags: [Users]
 *     summary: Desactivar usuario (solo Admin)
 *     description: Marca el campo isActive=false. No elimina el usuario de la base de datos.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a desactivar
 *     responses:
 *       200:
 *         description: Usuario desactivado correctamente
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: No autorizado (solo Admin)
 *       404:
 *         description: Usuario no encontrado
 */
router.patch(
  "/:id/deactivate",
  authMiddleware,
  requireRoles("Admin"),
  controller.deactivate
);

module.exports = router;