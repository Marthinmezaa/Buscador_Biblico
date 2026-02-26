const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// 1. Donde vive el archivo .db
const dbPath = path.resolve(__dirname, "../../biblia.db");

// 2. Conexion a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(
      "Error al conectar con la base de datos SQLite:",
      err.message,
    );
  } else {
    console.log("Conectado a la base de datos SQLite (biblia.db).");
  }
});

// 3. Tablas estructurales (3)
db.serialize(() => {
  // Tabla de Libros (Principal)
  db.run(`CREATE TABLE IF NOT EXISTS versiculos (
        id INTEGER PRIMARY KEY,
        libro TEXT NOT NULL,
        capitulo INTEGER NOT NULL,
        numero_versiculo INTEGER NOT NULL,
        texto TEXT NOT NULL
        )`);

  // Tabla de menu de emociones y temas
  db.run(`CREATE TABLE IF NOT EXISTS etiquetas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE
        )`);

  // Tabla de relacion entre versiculos y etiquetas (muchos a muchos)
  db.run(`CREATE TABLE IF NOT EXISTS versiculo_etiqueta (
    versiculo_id INTEGER,
    etiqueta_id INTEGER,
    PRIMARY KEY (versiculo_id, etiqueta_id),
    FOREIGN KEY (versiculo_id) REFERENCES versiculos(id),
    FOREIGN KEY (etiqueta_id) REFERENCES etiquetas(id)
    )`);

  console.log("Estructura de tablas lista y verificada.");
});

// Exportar
module.exports = db;
