/**
 * server.js
 * Punto de entrada del servidor: carga configuración, conecta a MongoDB e inicia Express.
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

const app = require("./app");
const { connectDB } = require("./config/db");
const { PORT } = require("./config/env");
async function bootstrap() {
  await connectDB();
  app.listen(PORT, () => console.log(`🚀 API corriendo en http://localhost:${PORT}`));
}

bootstrap().catch((err) => {
  console.error("❌ Error al iniciar:", err);
  process.exit(1);
});
