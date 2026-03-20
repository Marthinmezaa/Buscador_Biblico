/**
 * BUSCADOR BIBLICO - LOGICA DE CLIENTE (FRONTEND)
 * Maneja la interfaz de usuario, eventos del DOM y peticiones a la API.
 */

// ==========================================
// 1. SELECCION DE ELEMENTOS DEL DOM
// ==========================================
const btnMenu = document.getElementById("btn-menu");
const btnCerrarMenu = document.getElementById("btn-cerrar-menu");
const menuLateral = document.getElementById("menu-lateral");
const contenedorEtiquetas = document.getElementById("contenedor-etiquetas");
const contenedorResultados = document.getElementById("contenedor-resultados");
const indicadorBusqueda = document.getElementById("indicador-busqueda");

const inputBusqueda = document.getElementById("input-busqueda");
const btnBuscar = document.getElementById("btn-buscar");

// ==========================================
// 1.5. CACHE DE RESULTADOS (Mejora de Performance)
// ==========================================
const cache = new Map();
const TTL = 3600000; // 1 hora en milisegundos

// ==========================================
// 2. CONTROL DEL MENU LATERAL
// ==========================================
btnMenu.addEventListener("click", () => menuLateral.classList.add("activo"));
btnCerrarMenu.addEventListener("click", () =>
  menuLateral.classList.remove("activo"),
);

// Cerrar menu con la tecla Escape (Accesibilidad de teclado)
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape" && menuLateral.classList.contains("activo")) {
    menuLateral.classList.remove("activo");
  }
});

// ==========================================
// 3. CARGA DE MENU DINAMICO (Acordeon Anidado)
// ==========================================
async function cargarEtiquetas() {
  try {
    const respuesta = await fetch("/api/etiquetas");
    const etiquetas = await respuesta.json();

    contenedorEtiquetas.innerHTML = "";

    const btnAtajos = document.createElement("button");
    btnAtajos.textContent = "Atajos Emocionales ▾";
    btnAtajos.classList.add("btn-acordeon-principal");
    contenedorEtiquetas.appendChild(btnAtajos);

    const panelCategorias = document.createElement("div");
    panelCategorias.classList.add("panel-oculto");
    contenedorEtiquetas.appendChild(panelCategorias);

    btnAtajos.addEventListener("click", () => {
      btnAtajos.classList.toggle("activo");
      panelCategorias.style.display =
        panelCategorias.style.display === "block" ? "none" : "block";
    });

    const ordenCategorias = ["Positivos", "Neutros", "Negativos"];

    ordenCategorias.forEach((nombreCat) => {
      const etiquetasDeEstaCat = etiquetas.filter(
        (e) => e.categoria === nombreCat,
      );

      if (etiquetasDeEstaCat.length > 0) {
        const btnCategoria = document.createElement("button");
        btnCategoria.textContent = `${nombreCat} ▾`;
        btnCategoria.classList.add("btn-acordeon-secundario");
        panelCategorias.appendChild(btnCategoria);

        const panelEtiquetas = document.createElement("div");
        panelEtiquetas.classList.add("panel-oculto", "panel-etiquetas");
        panelCategorias.appendChild(panelEtiquetas);

        btnCategoria.addEventListener("click", () => {
          btnCategoria.classList.toggle("activo");
          panelEtiquetas.style.display =
            panelEtiquetas.style.display === "block" ? "none" : "block";
        });

        etiquetasDeEstaCat.forEach((etiqueta) => {
          const boton = document.createElement("button");
          boton.classList.add("btn-etiqueta");
          boton.textContent = `#${etiqueta.nombre}`;

          boton.addEventListener("click", () => {
            buscarVersiculos(etiqueta.nombre);
            menuLateral.classList.remove("activo");
          });

          panelEtiquetas.appendChild(boton);
        });
      }
    });
  } catch (error) {
    console.error("Error al cargar el menu dinamico:", error);
  }
}

// ==========================================
// 4. RENDERIZADO DE RESULTADOS (Funcion Auxiliar)
// ==========================================
function renderizarResultados(versiculos) {
  contenedorResultados.innerHTML = "";

  versiculos.forEach((versiculo) => {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta-versiculo");

    tarjeta.innerHTML = `
            <span class="cita-biblica">${versiculo.libro} ${versiculo.capitulo}:${versiculo.numero_versiculo} (NVI)</span>
            <p class="texto-versiculo">"${versiculo.texto}"</p>
        `;

    contenedorResultados.appendChild(tarjeta);
  });
}

// ==========================================
// 5. BUSQUEDA Y RENDERIZADO DE VERSICULOS (con Cache)
// ==========================================
async function buscarVersiculos(emocion) {
  const claveCache = emocion.toLowerCase().trim();

  // 1. VERIFICAR CACHE
  if (cache.has(claveCache)) {
    const entradaCache = cache.get(claveCache);
    const ahora = Date.now();

    if (ahora - entradaCache.timestamp < TTL) {
      console.log(
        `Resultados obtenidos desde cache (vigente) para: "${emocion}"`,
      );
      indicadorBusqueda.innerHTML = `Ultima busqueda: <strong>"${emocion}"</strong> <span style="color: #4CAF50; font-size: 0.85rem;">(cache vigente)</span>`;
      renderizarResultados(entradaCache.data);
      return;
    } else {
      console.log(`Cache expirado para: "${emocion}"`);
      cache.delete(claveCache);
    }
  }

  // 2. SI NO ESTA EN CACHE
  contenedorResultados.innerHTML =
    '<p class="mensaje-bienvenida">Buscando en la Biblia...</p>';
  indicadorBusqueda.innerHTML = `Ultima busqueda: <strong>"${emocion}"</strong>`;

  try {
    const respuesta = await fetch(`/api/buscar/${encodeURIComponent(emocion)}`);
    const datos = await respuesta.json();

    // 3. MANEJO DE ERRORES INTELIGENTE (Solucion al UNDEFINED)
    if (!respuesta.ok) {
      const textoMostrar =
        datos.mensaje ||
        datos.error ||
        `Aun no tenemos versiculos para '${emocion}'`;
      contenedorResultados.innerHTML = `<p class="mensaje-bienvenida">${textoMostrar}</p>`;
      return;
    }

    // 4. GUARDAR EN CACHE Y RENDERIZAR
    cache.set(claveCache, { data: datos, timestamp: Date.now() });
    console.log(`Resultados guardados en cache (con TTL) para: "${emocion}"`);
    renderizarResultados(datos);
  } catch (error) {
    console.error("Error en la peticion de busqueda:", error);
    contenedorResultados.innerHTML =
      '<p class="mensaje-bienvenida">Hubo un problema de conexion con el servidor.</p>';
  }
}

// ==========================================
// 6. MOTOR DE BUSQUEDA
// ==========================================
function procesarBusqueda() {
  let fraseEscrita = inputBusqueda.value.trim();
  if (fraseEscrita === "") return;

  buscarVersiculos(fraseEscrita);
  inputBusqueda.value = "";
}

btnBuscar.addEventListener("click", procesarBusqueda);
inputBusqueda.addEventListener("keypress", (evento) => {
  if (evento.key === "Enter") procesarBusqueda();
});

// ==========================================
// 7. INICIALIZACION DE LA APLICACION
// ==========================================
cargarEtiquetas();
