/**
 * auth.service.js
 * Lógica de negocio del módulo **auth**. Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES } = require("../../config/env");
const userRepo = require("../users/user.repository");

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, email: user.email, fullName: user.fullName },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

async function register({ fullName, email, password, role }) {
  const normalizedEmail = String(email).trim().toLowerCase();
  const exists = await userRepo.findByEmail(normalizedEmail);
  if (exists) { const err = new Error("El correo ya está registrado"); err.statusCode = 400; throw err; }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userRepo.create({ fullName, email: normalizedEmail, passwordHash, role });

  const token = signToken(user);
  return { accessToken: token, user: { id: user._id, fullName, email: normalizedEmail, role } };
}

async function login({ email, password }) {
  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await userRepo.findByEmail(normalizedEmail);
  if (!user || !user.isActive) { const err = new Error("Credenciales inválidas"); err.statusCode = 401; throw err; }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) { const err = new Error("Credenciales inválidas"); err.statusCode = 401; throw err; }

  const token = signToken(user);
  return { accessToken: token, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } };
}

module.exports = { register, login };
