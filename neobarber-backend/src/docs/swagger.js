const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    tags: [
  { name: "Auth", description: "Registro e inicio de sesión" },
  { name: "Users", description: "Perfil del usuario" },
  { name: "Services", description: "Servicios de barbería" },
  { name: "Barbers", description: "Perfiles de barberos" },
  { name: "Appointments", description: "Gestión de citas" },
  { name: "Availability", description: "Disponibilidad y bloqueos" }
],
    openapi: "3.0.3",
    info: {
      title: "NeoBarber API",
      version: "1.0.0",
      description: "API para sistema de citas de barbería NeoBarber",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/**/*.js"], // Lee comentarios en tus routes
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;