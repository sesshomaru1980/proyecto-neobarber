/**
 * barber.model.js
 * Modelo/Mongoose schema del módulo barbers.
 * Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 */

const mongoose = require("mongoose");

const WeeklyAvailabilitySchema = new mongoose.Schema(
  {
    dayOfWeek: { type: Number, min: 0, max: 6, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  { _id: false }
);

const BarberSchema = new mongoose.Schema(
  {
    // Usuario asociado al perfil de barbero
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    // Biografía del barbero
    bio: { type: String, default: "" },

    // URL de la imagen/foto del barbero
    imageUrl: { type: String, trim: true, default: "" },

    // Disponibilidad semanal
    weeklyAvailability: { type: [WeeklyAvailabilitySchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BarberProfile", BarberSchema);