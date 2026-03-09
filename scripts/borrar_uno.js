/**
 * SCRIPT DE ELIMINACIÓN DE VERSÍCULOS
 *
 * Este script elimina un versículo específico de la base de datos de forma segura.
 * Aplica el principio de "Integridad Referencial": elimina primero las relaciones en
 * las tablas intermedias antes de borrar el registro principal para evitar datos huérfanos.
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Configuración de la conexión a la base de datos.
// path.join garantiza la resolución correcta de la ruta independientemente
// del directorio desde donde se ejecute el comando en la terminal.
const rutaDB = path.join(__dirname, "../biblia.db");
const db = new sqlite3.Database(rutaDB);

// =========================================================
// PARÁMETROS DE BÚSQUEDA
// Define las coordenadas exactas del registro a eliminar.
// =========================================================
const libroABorrar = "Santiago";
const capituloABorrar = 5;
const versiculoABorrar = "13";

console.log(
  `\nIniciando proceso de eliminación para: ${libroABorrar} ${capituloABorrar}:${versiculoABorrar}...`,
);

// db.serialize asegura un flujo de ejecución síncrono para las consultas de SQLite.
db.serialize(() => {
  /**
   * PASO 1: Búsqueda del registro principal.
   * Recuperamos el identificador único (ID) interno generado por SQLite.
   * Este ID es crucial para operar sobre las demás tablas relacionadas.
   */
  const consultaBuscar =
    "SELECT id FROM versiculos WHERE libro = ? AND capitulo = ? AND numero_versiculo = ?";

  db.get(
    consultaBuscar,
    [libroABorrar, capituloABorrar, versiculoABorrar],
    (err, fila) => {
      if (err) {
        return console.error(
          "Error en la base de datos durante la búsqueda:",
          err.message,
        );
      }

      // Validación temprana: Si el registro no existe, cerramos la conexión y abortamos de forma segura.
      if (!fila) {
        console.log(
          "Registro no encontrado. Verifica la exactitud de los parámetros de búsqueda.",
        );
        return db.close();
      }

      const id = fila.id;
      console.log(
        `Registro encontrado (ID: ${id}). Iniciando eliminación en cascada...`,
      );

      /**
       * PASO 2: Eliminación de dependencias.
       * Se eliminan los registros en la tabla relacional ('versiculo_etiqueta').
       * Esto previene que la base de datos conserve etiquetas apuntando a un versículo inexistente.
       */
      db.run(
        "DELETE FROM versiculo_etiqueta WHERE versiculo_id = ?",
        [id],
        (err) => {
          if (err) {
            return console.error(
              "Error al eliminar las relaciones (etiquetas):",
              err.message,
            );
          }

          /**
           * PASO 3: Eliminación del registro maestro.
           * Con las dependencias limpias, es seguro borrar la entidad principal.
           */
          db.run("DELETE FROM versiculos WHERE id = ?", [id], (err) => {
            if (err) {
              return console.error(
                "Error al eliminar el registro principal:",
                err.message,
              );
            }

            console.log(
              `¡Operación exitosa! El versículo ha sido purgado del sistema.\n`,
            );

            // Cierre de la conexión para liberar recursos de memoria del servidor.
            db.close();
          });
        },
      );
    },
  );
});
