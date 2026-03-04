const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("../biblia.db");

const libroABorrar = "I";
const capituloABorrar = 41;
const versiculoABorrar = "10";
// =========================================================

console.log(
  `\nBuscando ${libroABorrar} ${capituloABorrar}:${versiculoABorrar} para eliminarlo...`,
);

db.serialize(() => {
  // 1. Primero buscamr el ID secreto que SQLite le dio a este versículo
  const consultaBuscar =
    "SELECT id FROM versiculos WHERE libro = ? AND capitulo = ? AND numero_versiculo = ?";

  db.get(
    consultaBuscar,
    [libroABorrar, capituloABorrar, versiculoABorrar],
    (err, fila) => {
      if (err) return console.error("Error al buscar:", err.message);

      if (!fila) {
        console.log(
          "No encontré ese versículo. Revisa si escribiste exactamente igual el libro y los números.",
        );
        return db.close();
      }

      const id = fila.id;

      // 2. Si lo encontramos, cortamos el "cable" que lo une a la emoción
      db.run(
        "DELETE FROM versiculo_etiqueta WHERE versiculo_id = ?",
        [id],
        (err) => {
          if (err) return console.error(err.message);

          // 3. Y finalmente borramos el versículo de la tabla principal
          db.run("DELETE FROM versiculos WHERE id = ?", [id], (err) => {
            if (err) return console.error(err.message);
            console.log(
              `¡Eliminado con éxito! El versículo ha desaparecido de tu aplicación.\n`,
            );
            db.close();
          });
        },
      );
    },
  );
});
