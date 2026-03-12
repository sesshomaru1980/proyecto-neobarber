/**
 * appointment.model.js
 * Modelo de MongoDB para las citas.
 * Define la estructura y validaciones de los documentos de citas.
 */

const mongoose = require("mongoose");

/**
 * Esquema de citas para MongoDB
 */
const appointmentSchema = new mongoose.Schema({
  barberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "El ID del barbero es obligatorio"],
    description: "Referencia al usuario con rol de barbero"
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "El ID del cliente es obligatorio"],
    description: "Referencia al usuario con rol de cliente"
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: [true, "El ID del servicio es obligatorio"],
    description: "Referencia al servicio solicitado"
  },
  startAt: {
    type: Date,
    required: [true, "La fecha y hora de inicio son obligatorias"],
    description: "Fecha y hora de inicio de la cita"
  },
  endAt: {
    type: Date,
    required: [true, "La fecha y hora de finalización son obligatorias"],
    description: "Fecha y hora de finalización calculada según duración del servicio"
  },
  status: {
    type: String,
    enum: {
      values: ["Pendiente", "Confirmada", "Cancelada", "Completada"],
      message: "Estado no válido: {VALUE}"
    },
    default: "Pendiente",
    description: "Estado actual de la cita"
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, "Las notas no pueden exceder los 500 caracteres"],
    description: "Notas o comentarios adicionales sobre la cita"
  }
}, {
  timestamps: true, // Añade createdAt y updatedAt automáticamente
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para optimizar búsquedas frecuentes
appointmentSchema.index({ barberId: 1, startAt: 1 }); // Para buscar disponibilidad de barbero
appointmentSchema.index({ clientId: 1, startAt: -1 }); // Para listar citas de cliente
appointmentSchema.index({ status: 1 }); // Para filtrar por estado
appointmentSchema.index({ startAt: 1 }); // Para búsquedas por fecha

/**
 * Virtual para obtener la duración en minutos
 */
appointmentSchema.virtual('duration').get(function() {
  if (this.startAt && this.endAt) {
    return Math.round((this.endAt - this.startAt) / 60000);
  }
  return null;
});

/**
 * Virtual para obtener información resumida
 */
appointmentSchema.virtual('summary').get(function() {
  return {
    id: this._id,
    date: this.startAt,
    status: this.status
  };
});

/**
 * Middleware pre-save para validar fechas
 */
appointmentSchema.pre('save', function(next) {
  if (this.startAt && this.endAt && this.startAt >= this.endAt) {
    next(new Error("La fecha de inicio debe ser anterior a la fecha de finalización"));
  }
  next();
});

/**
 * Método estático para verificar disponibilidad
 */
appointmentSchema.statics.isTimeSlotAvailable = async function(barberId, startAt, excludeAppointmentId = null) {
  const query = {
    barberId,
    startAt,
    status: { $in: ["Pendiente", "Confirmada"] }
  };
  
  if (excludeAppointmentId) {
    query._id = { $ne: excludeAppointmentId };
  }
  
  const existing = await this.findOne(query);
  return !existing;
};

/**
 * Método de instancia para cancelar cita
 */
appointmentSchema.methods.cancel = function() {
  if (this.status === "Completada") {
    throw new Error("No se puede cancelar una cita completada");
  }
  if (this.status === "Cancelada") {
    throw new Error("La cita ya está cancelada");
  }
  this.status = "Cancelada";
  return this.save();
};

/**
 * Método de instancia para confirmar cita
 */
appointmentSchema.methods.confirm = function() {
  if (this.status !== "Pendiente") {
    throw new Error(`No se puede confirmar una cita en estado: ${this.status}`);
  }
  this.status = "Confirmada";
  return this.save();
};

/**
 * Método de instancia para completar cita
 */
appointmentSchema.methods.complete = function() {
  if (this.status !== "Confirmada") {
    throw new Error(`No se puede completar una cita en estado: ${this.status}`);
  }
  this.status = "Completada";
  return this.save();
};

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;