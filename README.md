# Buscador Bíblico

Este proyecto es una aplicación web que permite buscar versículos de la Biblia.

## Estructura del Proyecto

- `public/`: Contiene los archivos estáticos (HTML, CSS, JavaScript) del frontend.
- `src/`: Contiene el código fuente del backend.
  - `config/`: Configuración de la base de datos y scripts de inicialización.
  - `controllers/`: Lógica de negocio para las rutas de la API.
  - `models/`: Modelos de datos para interactuar con la base de datos.
  - `routes/`: Definición de las rutas de la API.
- `scripts/`: Scripts utilitarios para la gestión de la base de datos y otras tareas.
- `biblia.db`: Base de datos SQLite que almacena los versículos de la Biblia.
- `server.js`: Archivo principal del servidor Node.js/Express.

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/Marthinmezaa/Buscador_Biblico.git
   cd Buscador_Biblico
   ```

2. Instala las dependencias de Node.js:

   ```bash
   npm install
   ```

3. Inicializa la base de datos (si es necesario):

   ```bash
   node scripts/reset_db.js
   node scripts/importador.js
   ```

## Ejecución

Para iniciar el servidor, ejecuta:

```bash
node server.js
```

Luego, abre tu navegador y visita `http://localhost:3000`.

## Características

- Búsqueda de versículos por palabras clave.
- Gestión de etiquetas para versículos.

## Contribución

Si deseas contribuir a este proyecto, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-caracteristica`).
3. Realiza tus cambios y commitea (`git commit -am 'Agrega nueva característica'`).
4. Sube tus cambios a tu fork (`git push origin feature/nueva-caracteristica`).
5. Abre un Pull Request.
