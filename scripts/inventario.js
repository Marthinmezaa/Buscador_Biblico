const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("../biblia.db");

console.log("\nINVENTARIO DETALLADO DE VERSÍCULOS:");
console.log("========================================");

// Ahora le pedimos a SQLite que nos traiga los datos exactos unidos por las tablas
const consulta = `
    SELECT e.nombre as Emocion, v.libro as Libro, v.capitulo as Capitulo, v.numero_versiculo as Versiculo
    FROM etiquetas e
    JOIN versiculo_etiqueta ve ON e.id = ve.etiqueta_id
    JOIN versiculos v ON ve.versiculo_id = v.id
    ORDER BY e.nombre ASC, v.libro ASC, v.capitulo ASC
`;

db.all(consulta, [], (err, filas) => {
  if (err) return console.error("Error al leer la base de datos:", err.message);

  if (filas.length === 0) {
    console.log("Tu base de datos está completamente vacía.");
  } else {
    let emocionActual = ""; // Variable para rastrear cuándo cambiamos de emoción

    filas.forEach((fila) => {
      // Si la emoción de esta fila es diferente a la anterior, imprimimos un nuevo título
      if (fila.Emocion !== emocionActual) {
        console.log(`\n${fila.Emocion.toUpperCase()}:`);
        emocionActual = fila.Emocion;
      }

      // Imprimimos el versículo en forma de lista
      console.log(`   - ${fila.Libro} ${fila.Capitulo}:${fila.Versiculo}`);
    });
  }

  console.log("\n========================================\n");
  db.close();
});
