/**
 * app.js
 * Configuración principal de Express: middlewares globales, rutas y manejo de errores.
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const { errorMiddleware } = require("./middlewares/error.middleware");

const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const serviceRoutes = require("./modules/services/service.routes");
const barberRoutes = require("./modules/barbers/barber.routes");
const appointmentRoutes = require("./modules/appointments/appointment.routes");
const availabilityRoutes = require("./modules/availability/availability.routes");

const app = express();

app.use(helmet());

// Permitir Angular (puerto 4200)
app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 60 * 1000, max: 120 }));

app.get("/health", (req, res) =>
  res.json({ ok: true, name: "NeoBarber API FULL" })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/barbers", barberRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/availability", availabilityRoutes);

// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "NeoBarber API Docs",
  })
);

app.use(errorMiddleware);

module.exports = app;