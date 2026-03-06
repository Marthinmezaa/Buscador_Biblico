/**
 * MODELO DE DICCIONARIO (Diccionario Model)
 * Se encarga de traducir frases del usuario a emociones oficiales
 * buscando coincidencias en la tabla 'sinonimos'.
 */

const db = require("../config/db");

const Diccionario = {
  /**
   * Busca si alguna palabra clave existe dentro de la frase del usuario.
   * @param {string} frase
   * @param {function} callback
   */
  traducirFrase: (frase, callback) => {
    const fraseMinuscula = frase.toLowerCase();

    const sql = `
        SELECT emocion_oficial 
        FROM sinonimos 
        WHERE ? LIKE '%' || palabra_clave || '%'
        LIMIT 1
    `;

    db.get(sql, [fraseMinuscula], (err, fila) => {
      if (err) {
        return callback(err, null);
      }

      if (fila) {
        return callback(null, fila.emocion_oficial);
      }

      return callback(null, null);
    });
  },
};

module.exports = Diccionario;
