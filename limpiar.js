const sqlite3 = require("sqlite3").verbose();
const readline = require("readline");
const db = new sqlite3.Database("./biblia.db");

// Creamos la herramienta para preguntarte en la terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("=========================================");
console.log("ATENCIÓN: SECUENCIA DE AUTODESTRUCCIÓN");
console.log("=========================================");

rl.question(
  '¿Estás absolutamente seguro de borrar TODOS los versículos? Escribe "SI" para confirmar: ',
  (respuesta) => {
    if (respuesta === "SI") {
      console.log("\nIniciando limpieza extrema de la base de datos...");

      db.serialize(() => {
        db.run("DELETE FROM versiculo_etiqueta");
        db.run("DELETE FROM versiculos");
        db.run("DELETE FROM etiquetas");
        db.run("DELETE FROM sqlite_sequence WHERE name='versiculos'");
        db.run("DELETE FROM sqlite_sequence WHERE name='etiquetas'");
      });

      setTimeout(() => {
        console.log("¡Base de datos completamente vacía y como nueva!");
        db.close();
        rl.close();
      }, 1000);
    } else {
      console.log("\nOperación cancelada. Tus datos están a salvo.");
      db.close();
      rl.close();
    }
  },
);
