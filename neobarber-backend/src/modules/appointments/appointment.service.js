/**
 * appointment.service.js
 * Servicio del módulo appointments.
 * Contiene la lógica de negocio para la gestión de citas.
 */

const Appointment = require("./appointment.model");
const User = require("../users/user.model");
const Service = require("../services/service.model");

/**
 * Convierte un valor a Date y valida que sea correcto.
 * @param {string|Date} value - Valor de fecha recibido
 * @returns {Date|null} Fecha válida o null
 */
const toValidDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * Obtiene la duración del servicio.
 * En este proyecto la duración real viene en el campo durationMinutes.
 * @param {Object} service - Documento del servicio
 * @returns {number} Duración en minutos
 */
const getServiceDuration = (service) => {
  const duration = Number(service?.durationMinutes);
  return duration > 0 ? duration : 0;
};

/**
 * Crea una nueva cita en el sistema
 * @param {Object} appointmentData - Datos de la cita
 * @param {string} appointmentData.barberId - ID del barbero
 * @param {string} appointmentData.serviceId - ID del servicio
 * @param {string} appointmentData.clientId - ID del cliente
 * @param {string} appointmentData.startAt - Fecha y hora de inicio
 * @param {string} appointmentData.notes - Notas adicionales
 * @returns {Promise<Object>} Cita creada con datos poblados
 */
const create = async (appointmentData) => {
  const { barberId, serviceId, startAt, clientId, notes } = appointmentData;

  if (!barberId) {
    throw new Error("El ID del barbero es obligatorio");
  }

  if (!serviceId) {
    throw new Error("El ID del servicio es obligatorio");
  }

  if (!clientId) {
    throw new Error("El ID del cliente es obligatorio");
  }

  if (!startAt) {
    throw new Error("La fecha de inicio es obligatoria");
  }

  const startDate = toValidDate(startAt);
  if (!startDate) {
    throw new Error("La fecha de inicio no es válida");
  }

  const barber = await User.findOne({
    _id: barberId,
    role: "Barber",
    isActive: true
  });

  if (!barber) {
    throw new Error("Barbero no encontrado");
  }

  const client = await User.findOne({
    _id: clientId,
    role: "Client",
    isActive: true
  });

  if (!client) {
    throw new Error("Cliente no encontrado");
  }

  const service = await Service.findById(serviceId);
  if (!service) {
    throw new Error("Servicio no encontrado");
  }

  const duration = getServiceDuration(service);

  if (!duration) {
    throw new Error("La duración del servicio no es válida");
  }

  const existingAppointment = await Appointment.findOne({
    barberId,
    startAt: startDate,
    status: { $in: ["Pendiente", "Confirmada"] }
  });

  if (existingAppointment) {
    throw new Error("El horario seleccionado no está disponible");
  }

  const endDate = new Date(startDate.getTime() + duration * 60000);

  if (Number.isNaN(endDate.getTime())) {
    throw new Error("No se pudo calcular la hora de finalización");
  }

  const appointment = new Appointment({
    barberId,
    clientId,
    serviceId,
    startAt: startDate,
    endAt: endDate,
    notes: notes?.trim?.() || "",
    status: "Pendiente"
  });

  await appointment.save();

  return await Appointment.findById(appointment._id)
    .populate("barberId", "fullName email phone")
    .populate("clientId", "fullName email phone")
    .populate("serviceId", "name durationMinutes price");
};

/**
 * Lista las citas de un usuario específico
 * @param {string} userId - ID del usuario cliente
 * @returns {Promise<Array>} Lista de citas
 */
const listByUser = async (userId) => {
  return await Appointment.find({ clientId: userId })
    .populate("barberId", "fullName email phone")
    .populate("clientId", "fullName email phone")
    .populate("serviceId", "name durationMinutes price")
    .sort({ startAt: -1 });
};

/**
 * Lista las citas de un barbero específico
 * @param {string} barberId - ID del barbero
 * @param {Object} filters - Filtros adicionales
 * @returns {Promise<Array>} Lista de citas
 */
const listByBarber = async (barberId, filters = {}) => {
  const query = { barberId };

  if (filters.status) {
    query.status = filters.status;
  }

  return await Appointment.find(query)
    .populate("clientId", "fullName email phone")
    .populate("serviceId", "name durationMinutes price")
    .populate("barberId", "fullName email phone")
    .sort({ startAt: 1 });
};

/**
 * Lista todas las citas
 * @param {Object} filters - Filtros de búsqueda
 * @returns {Promise<Array>} Lista completa de citas
 */
const listAll = async (filters = {}) => {
  const query = {};

  if (filters.status) query.status = filters.status;
  if (filters.barberId) query.barberId = filters.barberId;

  if (filters.startDate || filters.endDate) {
    query.startAt = {};

    if (filters.startDate) {
      const startDate = toValidDate(filters.startDate);
      if (startDate) query.startAt.$gte = startDate;
    }

    if (filters.endDate) {
      const endDate = toValidDate(filters.endDate);
      if (endDate) query.startAt.$lte = endDate;
    }
  }

  return await Appointment.find(query)
    .populate("barberId", "fullName email phone")
    .populate("clientId", "fullName email phone")
    .populate("serviceId", "name durationMinutes price description")
    .sort({ startAt: -1 });
};

/**
 * Obtiene una cita por ID
 * @param {string} appointmentId - ID de la cita
 * @param {Object} user - Usuario autenticado
 * @returns {Promise<Object>} Cita encontrada
 */
const getById = async (appointmentId, user) => {
  const appointment = await Appointment.findById(appointmentId)
    .populate("barberId", "fullName email phone")
    .populate("clientId", "fullName email phone")
    .populate("serviceId", "name durationMinutes price description");

  if (!appointment) {
    throw new Error("Cita no encontrada");
  }

  if (user.role === "Client" && appointment.clientId._id.toString() !== user.id) {
    throw new Error("No tienes permiso para ver esta cita");
  }

  if (user.role === "Barber" && appointment.barberId._id.toString() !== user.id) {
    throw new Error("No tienes permiso para ver esta cita");
  }

  return appointment;
};

/**
 * Actualiza el estado de una cita
 * @param {string} appointmentId - ID de la cita
 * @param {string} status - Nuevo estado
 * @param {Object} user - Usuario autenticado
 * @returns {Promise<Object>} Cita actualizada
 */
const updateStatus = async (appointmentId, status, user) => {
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new Error("Cita no encontrada");
  }

  if (user.role === "Client") {
    if (appointment.clientId.toString() !== user.id) {
      throw new Error("No tienes permiso para modificar esta cita");
    }

    if (status !== "Cancelada") {
      throw new Error("Los clientes solo pueden cancelar citas");
    }
  }

  if (user.role === "Barber") {
    if (appointment.barberId.toString() !== user.id) {
      throw new Error("No tienes permiso para modificar esta cita");
    }

    if (status === "Cancelada") {
      throw new Error("Los barberos no pueden cancelar citas");
    }
  }

  appointment.status = status;
  await appointment.save();

  return await Appointment.findById(appointment._id)
    .populate("barberId", "fullName email phone")
    .populate("clientId", "fullName email phone")
    .populate("serviceId", "name durationMinutes price");
};

/**
 * Cancela una cita
 * @param {string} appointmentId - ID de la cita
 * @param {Object} user - Usuario autenticado
 * @returns {Promise<Object>} Cita cancelada
 */
const cancel = async (appointmentId, user) => {
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new Error("Cita no encontrada");
  }

  if (user.role === "Client" && appointment.clientId.toString() !== user.id) {
    throw new Error("No tienes permiso para cancelar esta cita");
  }

  if (user.role === "Barber" && appointment.barberId.toString() !== user.id) {
    throw new Error("No tienes permiso para cancelar esta cita");
  }

  if (appointment.status === "Cancelada") {
    throw new Error("La cita ya está cancelada");
  }

  if (appointment.status === "Completada") {
    throw new Error("No se puede cancelar una cita completada");
  }

  appointment.status = "Cancelada";
  await appointment.save();

  return await Appointment.findById(appointment._id)
    .populate("barberId", "fullName email phone")
    .populate("clientId", "fullName email phone")
    .populate("serviceId", "name durationMinutes price");
};

module.exports = {
  create,
  listByUser,
  listByBarber,
  listAll,
  getById,
  updateStatus,
  cancel
};