/**
 * db.js
 * Configuración del proyecto (variables de entorno, conexión a BD, constantes).
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

const mongoose = require("mongoose");
const { MONGO_URI } = require("./env");

async function connectDB() {
  if (!MONGO_URI) throw new Error("MONGO_URI no definido en .env");
  mongoose.set("strictQuery", true);
  await mongoose.connect(MONGO_URI);
  console.log("✅ MongoDB conectado");
}

module.exports = { connectDB };
