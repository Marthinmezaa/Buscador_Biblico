/**
 * Script de prueba para rate limiting
 * Hace 101 peticiones a /api/buscar/paz para verificar el límite
 */

const http = require("http");

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/api/buscar/paz",
  method: "GET",
};

let requestCount = 0;
let errorCount = 0;

function makeRequest() {
  requestCount++;

  const req = http.request(options, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      if (
        requestCount <= 5 ||
        requestCount % 10 === 0 ||
        res.statusCode === 429
      ) {
        console.log(
          `Petición ${requestCount}: ${res.statusCode} - ${data.substring(0, 50)}${data.length > 50 ? "..." : ""}`,
        );
      }

      if (requestCount < 101) {
        makeRequest();
      } else {
        console.log("\n=== RESUMEN ===");
        console.log(`Total peticiones: ${requestCount}`);
        console.log(`Errores 429: ${errorCount}`);
      }
    });
  });

  req.on("error", (error) => {
    console.error(`Error en petición ${requestCount}:`, error.message);
  });

  req.on("response", (res) => {
    if (res.statusCode === 429) {
      errorCount++;
    }
  });

  req.end();
}

console.log("Iniciando prueba de rate limiting (101 peticiones)...\n");
makeRequest();
