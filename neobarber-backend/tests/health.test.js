/**
 * health.test.js
 * Pruebas automatizadas (Jest/Supertest) para validar endpoints y reglas de negocio.
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

const request = require("supertest");
const app = require("../src/app");

describe("Health", () => {
  it("should return ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
  // Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "NeoBarber API Docs",
  })
);
});
