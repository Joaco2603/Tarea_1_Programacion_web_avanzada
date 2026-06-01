# Tarea 1 - Programación Web Avanzada — Catalogo de Productos

Proyecto para la Tarea 1. Incluye un backend simple con Node/Express que sirve el frontend y expone una API para consumir un catalogo de productos definido en un JSON local.

## Que hace el proyecto

- Muestra un catalogo de productos en tarjetas.
- Permite buscar por nombre o categoria.
- Permite filtrar por categoria exacta.
- Muestra detalle del producto en un alert.
- Soporta imagenes locales en la carpeta `imgs/` y usa un placeholder si no hay.

## Estructura principal

- `server.js` — servidor Express que sirve la UI y la API `/api/productos`.
- `productos.json` — base de datos local (arreglo de productos).
- `imgs/` — imagenes locales opcionales.
- `public/` — frontend estatico (HTML, CSS y JS).

## Datos

El archivo `productos.json` debe ser un arreglo con al menos 12 objetos. Cada producto incluye:

- `id`
- `nombre`
- `categoria`
- `precio`
- `descripcion`
- `imagen` (opcional, nombre de archivo en `imgs/` o URL)
- `disponible` (boolean)

## Uso local (recomendado)

Requisitos: Node.js LTS.

1. `npm install`
2. `npm start`
3. Abre `http://localhost:8000`

La API queda disponible en `http://localhost:8000/api/productos`.

## Uso con servidor estatico (opcional)

Si quieres servir solo la carpeta con un servidor estatico, debes ajustar la ruta de datos en el frontend.

1. Cambia `dataPath` en `public/js/main.js` a `/productos.json`.
2. Ejecuta `python -m http.server` en la raiz del proyecto.
3. Abre `http://localhost:8000`.

## Notas importantes

- El navegador bloquea `fetch` desde `file://`; siempre abre la UI via `http://`.
- No borres ni renombres `productos.json` si quieres que la API funcione correctamente.
