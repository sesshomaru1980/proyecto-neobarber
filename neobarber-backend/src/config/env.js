/**
 * env.js
 * Configuración del proyecto (variables de entorno, conexión a BD, constantes).
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES: process.env.JWT_EXPIRES || "2h",
  NODE_ENV: process.env.NODE_ENV || "development",
};
