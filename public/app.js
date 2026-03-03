// Seleccion de elemento HTML
const btnMenu = document.getElementById("btn-menu");
const menuLateral = document.getElementById("menu-lateral");
const contenedorEtiquetas = document.getElementById("contenedor-etiquetas");
const contenedorResultados = document.getElementById("contenedor-resultados");
const tituloResultados = document.getElementById("titulo-resultados");

// Menu hamburguesa (Abrir y cerrar el menú lateral)
btnMenu.addEventListener("click", () => {
  menuLateral.classList.toggle("activo");
});

// Carga de meni (Conectando con API)
async function cargarEtiquetas() {
  try {
    const respuesta = await fetch("/api/etiquetas");
    const etiquetas = await respuesta.json();

    // Limpieza de menú
    contenedorEtiquetas.innerHTML = "";

    // Por cada emocion, se crea un boton en el menu lateral
    etiquetas.forEach((etiqueta) => {
      const boton = document.createElement("button");
      boton.classList.add("btn-etiqueta");
      boton.textContent = etiqueta.nombre;

      // Dando la orden al apretar el click
      boton.addEventListener("click", () => {
        buscarVersiculos(etiqueta.nombre);
        menuLateral.classList.remove("activo");
      });

      // Agregar boton al menu visual
      contenedorEtiquetas.appendChild(boton);
    });
  } catch (error) {
    console.error("Error al cargar el menú:", error);
  }
}

// Buscar versiculos
async function buscarVersiculos(emocion) {
  // Actualizar pantalla a la hora de buscar
  tituloResultados.textContent = `Versículos sobre: ${emocion}`;
  contenedorResultados.innerHTML =
    '<p class="mensaje-bienvenida">Buscando en la Biblia...</p>';

  try {
    const respuesta = await fetch(`/api/buscar/${emocion}`);
    const datos = await respuesta.json();

    contenedorResultados.innerHTML = "";

    // Si el Backend devolvio un 404 (No se encontro nada)
    if (!respuesta.ok) {
      contenedorResultados.innerHTML = `<p class="mensaje-bienvenida">${datos.mensaje}</p>`;
      return;
    }

    // Dibujar tarjetas
    datos.forEach((versiculo) => {
      const tarjeta = document.createElement("div");
      tarjeta.classList.add("tarjeta-versiculo");

      // Inyectar el texto exacto del versículo
      tarjeta.innerHTML = `
                <span class="cita-biblica">${versiculo.libro} ${versiculo.capitulo}:${versiculo.numero_versiculo}</span>
                <p class="texto-versiculo">"${versiculo.texto}"</p>
            `;

      contenedorResultados.appendChild(tarjeta);
    });
  } catch (error) {
    console.error("Error al buscar:", error);
    contenedorResultados.innerHTML =
      '<p class="mensaje-bienvenida">Hubo un problema de conexión.</p>';
  }
}

// Encendido inicial de la app
cargarEtiquetas();
