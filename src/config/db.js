/**
 * CONFIGURACION DE LA BASE DE DATOS (Database Config)
 * Establece la conexion con SQLite y garantiza que la estructura de tablas exista.
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../../biblia.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error critico al conectar con SQLite:", err.message);
  } else if (process.env.NODE_ENV !== "test") {
    // Solo imprime esto si NO estamos haciendo tests
    console.log("Conectado exitosamente a la base de datos (biblia.db).");
  }
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS versiculos (
        id INTEGER PRIMARY KEY,
        libro TEXT NOT NULL,
        capitulo INTEGER NOT NULL,
        numero_versiculo TEXT NOT NULL,
        texto TEXT NOT NULL
        )`);

  db.run(`CREATE TABLE IF NOT EXISTS etiquetas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE,
        categoria TEXT NOT NULL
        )`);

  db.run(`CREATE TABLE IF NOT EXISTS versiculo_etiqueta (
        versiculo_id INTEGER,
        etiqueta_id INTEGER,
        PRIMARY KEY (versiculo_id, etiqueta_id),
        FOREIGN KEY (versiculo_id) REFERENCES versiculos(id),
        FOREIGN KEY (etiqueta_id) REFERENCES etiquetas(id)
        )`);

  db.run(`CREATE TABLE IF NOT EXISTS sinonimos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        palabra_clave TEXT NOT NULL UNIQUE,
        emocion_oficial TEXT NOT NULL
        )`);

  db.run(
    `CREATE INDEX IF NOT EXISTS idx_etiquetas_nombre ON etiquetas(nombre)`,
  );
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_sinonimos_palabra ON sinonimos(palabra_clave)`,
  );

  if (process.env.NODE_ENV !== "test") {
    // Solo imprime esto si NO estamos haciendo tests
    console.log("Estructura de tablas verificada y lista para operar.");
  }
});

module.exports = db;
