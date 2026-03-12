/**
 * auth.validation.test.js
 * Pruebas automatizadas (Jest/Supertest) para validar endpoints y reglas de negocio.
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

const request = require("supertest");
const app = require("../src/app");

describe("Auth validation (smoke)", () => {
  it("register should return 400 on empty payload", async () => {
    const res = await request(app).post("/api/auth/register").send({});
    expect(res.status).toBe(400);
  });

  it("login should return 400 on empty payload", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.status).toBe(400);
  });
});
