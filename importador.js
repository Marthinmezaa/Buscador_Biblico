const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

// Conectarse a la base de datos y se lee el archivo JSON
const db = new sqlite3.Database("./biblia.db");
const datos = require("./datos.json");

console.log("Iniciando la importación de versículos...");

db.serialize(() => {
  datos.forEach((dato) => {
    // Verificar la existencia de la emocuion antes de insertarla
    db.run(`INSERT INTO etiquetas (nombre) 
                SELECT '${dato.emocion}' 
                WHERE NOT EXISTS (SELECT 1 FROM etiquetas WHERE nombre = '${dato.emocion}')`);

    // Insertar versiculo en tabla
    db.run(
      `INSERT INTO versiculos (libro, capitulo, numero_versiculo, texto) VALUES (?, ?, ?, ?)`,
      [dato.libro, dato.capitulo, dato.versiculo, dato.texto],
      function (err) {
        if (err)
          return console.error("Error al insertar versículo:", err.message);

        const versiculoId = this.lastID;

        // Buscar el ID de la etiqueta y conectar con el versículo
        db.get(
          `SELECT id FROM etiquetas WHERE nombre = ?`,
          [dato.emocion],
          (err, row) => {
            if (row) {
              db.run(
                `INSERT INTO versiculo_etiqueta (versiculo_id, etiqueta_id) VALUES (?, ?)`,
                [versiculoId, row.id],
              );
            }
          },
        );
      },
    );
  });
});

// Dar tiempo para que todas las inserciones se completen antes de cerrar la conexión
setTimeout(() => {
  console.log(
    "¡Importación terminada con éxito! Ya puedes probarlos en tu buscador.",
  );
  db.close();
}, 2000);
