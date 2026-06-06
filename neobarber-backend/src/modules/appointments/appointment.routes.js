/**
 * appointment.routes.js
 */

const express =
  require('express');

const router =
  express.Router();

const controller =
  require(
    './appointment.controller'
  );

const middleware =
  require(
    '../../middlewares/auth.middleware'
  );

const authMiddleware =

  middleware.auth ||

  middleware.authMiddleware ||

  middleware.protect ||

  middleware.verifyToken ||

  middleware;

// ============================================
// CREAR CITA
// ============================================

router.post(
  '/',
  authMiddleware,
  controller.create
);

// ============================================
// BLOQUEAR HORARIO
// ============================================

router.post(
  '/block',
  authMiddleware,
  controller.blockSchedule
);

// ============================================
// MIS CITAS
// ============================================

router.get(
  '/me',
  authMiddleware,
  controller.myAppointments
);

// ============================================
// PANEL BARBERO
// ============================================

router.get(
  '/barber',
  authMiddleware,
  controller.barberAgenda
);
// ============================================
// CONFIRMAR
// ============================================

router.patch(
  '/:id/confirm',
  authMiddleware,
  controller.confirmAppointment
);
// ============================================
// CANCELAR
// ============================================

router.patch(
  '/:id/cancel',
  authMiddleware,
  controller.cancelAppointment
);

module.exports = router;