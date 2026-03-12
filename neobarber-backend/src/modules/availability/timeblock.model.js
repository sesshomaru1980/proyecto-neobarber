/**
 * timeblock.model.js
 * Modelo/Mongoose schema del módulo **availability**. Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

const mongoose = require("mongoose");

const TimeBlockSchema = new mongoose.Schema(
  {
    barberId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    reason: { type: String },
  },
  { timestamps: true }
);

TimeBlockSchema.index({ barberId: 1, startAt: 1, endAt: 1 });

module.exports = mongoose.model("TimeBlock", TimeBlockSchema);
