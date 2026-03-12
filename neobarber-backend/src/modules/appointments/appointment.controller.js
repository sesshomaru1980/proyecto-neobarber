/**
 * appointment.controller.js
 * Controlador del módulo appointments.
 * Maneja las peticiones HTTP y respuestas.
 */

const appointmentService = require("./appointment.service");

/**
 * Obtiene de forma segura el ID del usuario autenticado.
 * Algunos middlewares lo guardan como user.id y otros como user.sub.
 * Esta función soporta ambas posibilidades.
 * @param {Object} user - Usuario autenticado
 * @returns {string|null} ID del usuario o null
 */
const getAuthUserId = (user) => {
  if (!user) return null;
  return user.id || user.sub || null;
};

/**
 * Obtiene de forma segura el nombre visible del usuario.
 * En este proyecto normalmente viene en fullName.
 * @param {Object} user
 * @param {string} fallback
 * @returns {string}
 */
const getUserDisplayName = (user, fallback = "Usuario") => {
  return user?.fullName || user?.name || fallback;
};

/**
 * Crea una nueva cita
 */
const create = async (req, res, next) => {
  try {
    const authUserId = getAuthUserId(req.user);

    if (!authUserId) {
      return res.status(401).json({
        success: false,
        error: "Usuario no autenticado correctamente"
      });
    }

    const appointmentData = {
      ...req.body,
      clientId: authUserId
    };

    const appointment = await appointmentService.create(appointmentData);

    res.status(201).json({
      success: true,
      message: "Cita agendada exitosamente",
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lista las citas del cliente autenticado
 */
const listMine = async (req, res, next) => {
  try {
    const authUserId = getAuthUserId(req.user);

    if (!authUserId) {
      return res.status(401).json({
        success: false,
        error: "Usuario no autenticado correctamente"
      });
    }

    const appointments = await appointmentService.listByUser(authUserId);

    const formattedAppointments = appointments.map(app => ({
      _id: app._id,
      startAt: app.startAt,
      endAt: app.endAt,
      status: app.status,
      notes: app.notes,
      barber: {
        id: app.barberId?._id,
        name: getUserDisplayName(app.barberId, "Barbero"),
        email: app.barberId?.email,
        phone: app.barberId?.phone
      },
      client: {
        id: app.clientId?._id,
        name: getUserDisplayName(app.clientId, "Cliente"),
        email: app.clientId?.email,
        phone: app.clientId?.phone
      },
      service: {
        id: app.serviceId?._id,
        name: app.serviceId?.name,
        duration: app.serviceId?.durationMinutes || app.serviceId?.duration,
        price: app.serviceId?.price
      }
    }));

    res.json({
      success: true,
      data: formattedAppointments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lista las citas del panel barbero.
 * - Si el usuario es Barber, ve solo sus citas.
 * - Si el usuario es Admin, ve todas las citas.
 */
const listByBarber = async (req, res, next) => {
  try {
    const authUserId = getAuthUserId(req.user);

    if (!authUserId) {
      return res.status(401).json({
        success: false,
        error: "Usuario no autenticado correctamente"
      });
    }

    let appointments = [];

    if (req.user?.role === "Admin") {
      appointments = await appointmentService.listAll(req.query);
    } else {
      appointments = await appointmentService.listByBarber(authUserId, req.query);
    }

    const formattedAppointments = appointments.map(app => ({
      _id: app._id,
      startAt: app.startAt,
      endAt: app.endAt,
      status: app.status,
      notes: app.notes,
      client: {
        id: app.clientId?._id,
        name: getUserDisplayName(app.clientId, "Cliente"),
        email: app.clientId?.email,
        phone: app.clientId?.phone
      },
      service: {
        id: app.serviceId?._id,
        name: app.serviceId?.name,
        duration: app.serviceId?.durationMinutes || app.serviceId?.duration,
        price: app.serviceId?.price
      },
      barber: {
        id: app.barberId?._id,
        name: getUserDisplayName(app.barberId, "Barbero"),
        email: app.barberId?.email,
        phone: app.barberId?.phone
      }
    }));

    res.json({
      success: true,
      data: formattedAppointments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lista todas las citas (solo admin)
 */
const listAll = async (req, res, next) => {
  try {
    const appointments = await appointmentService.listAll(req.query);

    const formattedAppointments = appointments.map(app => ({
      _id: app._id,
      startAt: app.startAt,
      endAt: app.endAt,
      status: app.status,
      notes: app.notes,
      barber: {
        id: app.barberId?._id,
        name: getUserDisplayName(app.barberId, "Barbero"),
        email: app.barberId?.email,
        phone: app.barberId?.phone
      },
      client: {
        id: app.clientId?._id,
        name: getUserDisplayName(app.clientId, "Cliente"),
        email: app.clientId?.email,
        phone: app.clientId?.phone
      },
      service: {
        id: app.serviceId?._id,
        name: app.serviceId?.name,
        duration: app.serviceId?.durationMinutes || app.serviceId?.duration,
        price: app.serviceId?.price,
        description: app.serviceId?.description
      }
    }));

    res.json({
      success: true,
      data: formattedAppointments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene los detalles de una cita por ID
 */
const getById = async (req, res, next) => {
  try {
    const authUser = {
      ...req.user,
      id: getAuthUserId(req.user)
    };

    if (!authUser.id) {
      return res.status(401).json({
        success: false,
        error: "Usuario no autenticado correctamente"
      });
    }

    const appointment = await appointmentService.getById(req.params.id, authUser);

    res.json({
      success: true,
      data: {
        _id: appointment._id,
        startAt: appointment.startAt,
        endAt: appointment.endAt,
        status: appointment.status,
        notes: appointment.notes,
        barber: {
          id: appointment.barberId?._id,
          name: getUserDisplayName(appointment.barberId, "Barbero"),
          email: appointment.barberId?.email,
          phone: appointment.barberId?.phone
        },
        client: {
          id: appointment.clientId?._id,
          name: getUserDisplayName(appointment.clientId, "Cliente"),
          email: appointment.clientId?.email,
          phone: appointment.clientId?.phone
        },
        service: {
          id: appointment.serviceId?._id,
          name: appointment.serviceId?.name,
          duration: appointment.serviceId?.durationMinutes || appointment.serviceId?.duration,
          price: appointment.serviceId?.price,
          description: appointment.serviceId?.description
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza el estado de una cita
 */
const updateStatus = async (req, res, next) => {
  try {
    const authUser = {
      ...req.user,
      id: getAuthUserId(req.user)
    };

    if (!authUser.id) {
      return res.status(401).json({
        success: false,
        error: "Usuario no autenticado correctamente"
      });
    }

    const appointment = await appointmentService.updateStatus(
      req.params.id,
      req.body.status,
      authUser
    );

    res.json({
      success: true,
      message: "Estado actualizado exitosamente",
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancela una cita
 */
const cancel = async (req, res, next) => {
  try {
    const authUser = {
      ...req.user,
      id: getAuthUserId(req.user)
    };

    if (!authUser.id) {
      return res.status(401).json({
        success: false,
        error: "Usuario no autenticado correctamente"
      });
    }

    const appointment = await appointmentService.cancel(req.params.id, authUser);

    res.json({
      success: true,
      message: "Cita cancelada exitosamente",
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  listMine,
  listByBarber,
  listAll,
  getById,
  updateStatus,
  cancel
};