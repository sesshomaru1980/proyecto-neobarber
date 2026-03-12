/**
 * service.model.js
 * Modelo/Mongoose schema del módulo services.
 * Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 */

const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    // Nombre del servicio
    name: { type: String, required: true, trim: true },

    // Descripción corta del servicio
    description: { type: String, default: "" },

    // Duración en minutos
    durationMinutes: { type: Number, required: true, min: 10, max: 240 },

    // Precio del servicio
    price: { type: Number, required: true, min: 0 },

    // URL de imagen del servicio
    imageUrl: { type: String, trim: true, default: "" },

    // Estado del servicio
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", ServiceSchema);