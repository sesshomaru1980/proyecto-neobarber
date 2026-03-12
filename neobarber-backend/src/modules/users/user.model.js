/**
 * user.model.js
 * Modelo/Mongoose schema del módulo **users**. Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["Admin", "Barber", "Client"], required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
