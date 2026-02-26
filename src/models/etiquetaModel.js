const db = require("../config/db");

// Objeto para guardar las funciones relacionadas con la etiqueta
const Etiqueta = {
  // Función para obtener todas las etiquetas
  obtenerTodas: (Callback) => {
    const sql = "SELECT * FROM etiquetas";

    db.all(sql, [], (err, rows) => {
      if (err) {
        return Callback(err, null);
      }
      return Callback(null, rows);
    });
  },
};

module.exports = Etiqueta;
