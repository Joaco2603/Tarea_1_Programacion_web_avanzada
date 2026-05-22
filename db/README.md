# Tarea 1 - Programación Web Avanzada — DB

Carpeta con los datos para la Tarea 1.

- `productos.json` — archivo JSON con al menos 12 productos (cada objeto contiene `id`, `nombre`, `categoria`, `precio`, `descripcion`, `imagen`, `disponible`).
- `imgs/` — carpeta para imágenes locales (opcional).

Uso y despliegue:

- Si ejecutas el servidor Node incluido en la raíz `tarea1` (`npm install` + `npm start`), la API queda disponible en `/api/productos` y el frontend (`ui/index.html`) puede consumirla.
- Si sirves la carpeta con un servidor estático simple (por ejemplo `python -m http.server`), el frontend debe obtener el JSON desde `../db/productos.json`.

Notas importantes:
- El navegador bloquea fetch desde `file://` por CORS; siempre abre la UI vía `http://`.
- No borres ni renombres `productos.json` si quieres que la API funcione correctamente.
