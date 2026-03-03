const db = require("./db");

console.log("Iniciando la siembra de datos...");

// Ejecucion paso a paso
db.serialize(() => {
  // 1. Limpieza de tablas
  db.run("DELETE FROM versiculo_etiqueta");
  db.run("DELETE FROM etiquetas");
  db.run("DELETE FROM versiculos");

  //2. Insercion de etiquetas
  db.run(`INSERT INTO etiquetas (id, nombre) VALUES
        (1, 'Miedo'),
        (2, 'Ansiedad'),
        (3, 'Paz'),
        (4, 'Fuerza'),
        (5, 'Esperanza')`);

  // 3. Insercion de versiculos
  db.run(`INSERT INTO versiculos (id, libro, capitulo, numero_versiculo, texto) VALUES 
        (101, 'Josué', 1, 9, 'Ya te lo he ordenado: ¡Sé fuerte y valiente! ¡No tengas miedo ni te desanimes! Porque el Señor tu Dios te acompañará dondequiera que vayas.'),
        (102, 'Filipenses', 4, 6, 'No se inquieten por nada; más bien, en toda ocasión, con oración y ruego, presenten sus peticiones a Dios y denle gracias.'),
        (103, 'Jeremías', 29, 11, 'Porque yo sé muy bien los planes que tengo para ustedes —afirma el Señor—, planes de bienestar y no de calamidad, a fin de darles un futuro y una esperanza.')`);

  // 4. Conectar versiculos con etiquetas
  db.run(`INSERT INTO versiculo_etiqueta (versiculo_id, etiqueta_id) VALUES 
        (101, 1), (101, 4),
        (102, 2), (102, 3),
        (103, 5), (103, 3)`);

  console.log("Base de datos poblada con exito!!.");
});

// Cerrar la conexion
db.close();
