// tests/api.test.js

const request = require("supertest");
const app = require("../server"); // Importamos tu servidor completo
const db = require("../src/config/db"); // Importamos la base de datos

// Agrupamos nuestras pruebas de la API
describe("Pruebas de Integracion: API del Buscador Biblico", () => {
  // Prueba 1: Tu Health Check
  test("1. [GET /health] El servidor debe responder que esta vivo (Status 200)", async () => {
    // Simulamos que un usuario entra a /health
    const respuesta = await request(app).get("/health");

    // Verificamos la respuesta
    expect(respuesta.status).toBe(200);
    expect(respuesta.body.status).toBe("ok");
    expect(respuesta.body.timestamp).toBeDefined(); // Verificamos que traiga la hora
  });

  // Prueba 2: Tu Ruta de Etiquetas
  test("2. [GET /api/etiquetas] Debe devolver el menu de emociones", async () => {
    const respuesta = await request(app).get("/api/etiquetas");

    expect(respuesta.status).toBe(200);
    // Verificamos que la respuesta sea un Array (una lista)
    expect(Array.isArray(respuesta.body)).toBe(true);
  });
});

// Apagar la base de datos al terminar
afterAll((done) => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    done();
  });
});
