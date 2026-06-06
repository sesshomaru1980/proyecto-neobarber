const express =
  require('express');

const router =
  express.Router();

const controller =
  require('./admin.controller');

const middleware =
  require('../../middlewares/auth.middleware');

const authMiddleware =

  middleware.auth ||

  middleware.authMiddleware ||

  middleware.protect ||

  middleware.verifyToken ||

  middleware;

router.get(

  '/dashboard',

  authMiddleware,

  controller.dashboard
);

module.exports =
  router;