/**
 * appointment.repository.js
 * Acceso a datos del módulo de citas.
 * Usa populate para devolver cliente, barbero y servicio con datos legibles.
 */

const Appointment = require("./appointment.model");

async function create(data) {
  return Appointment.create(data);
}

async function findById(id) {
  return Appointment.findById(id)
    .populate("clientId", "fullName email")
    .populate("barberId", "fullName email")
    .populate("serviceId", "name durationMinutes price");
}

async function findMyAppointments(userId, role) {
  const filter = {};

  if (role === "Client") {
    filter.clientId = userId;
  }

  if (role === "Barber") {
    filter.barberId = userId;
  }

  return Appointment.find(filter)
    .sort({ startAt: 1 })
    .populate("clientId", "fullName email")
    .populate("barberId", "fullName email")
    .populate("serviceId", "name durationMinutes price");
}

async function updateStatus(id, status) {
  return Appointment.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  )
    .populate("clientId", "fullName email")
    .populate("barberId", "fullName email")
    .populate("serviceId", "name durationMinutes price");
}

module.exports = {
  create,
  findById,
  findMyAppointments,
  updateStatus
};