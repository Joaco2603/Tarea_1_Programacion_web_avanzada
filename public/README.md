# Tarea 1 - Programación Web Avanzada — UI

Interfaz para la Tarea 1. Contenido:

- `index.html` — página principal con el contenedor de productos.
- `css/styles.css` — estilos de diseño minimalista.
- `js/main.js` — lógica para cargar y filtrar productos (usa `fetch`).

Ejecución local (recomendado: servidor HTTP):

1. Con Node (sirve UI y API):

```powershell
cd "C:\Users\joaco\Desktop\clases-2026-2\Programacion_web_avanzada\tarea1"
npm install
npm start
```
Abrir: http://localhost:8000/ui/index.html — el frontend consume `/api/productos`.

2. Alternativa sin Node — servidor estático (Python o Live Server):

```powershell
cd "C:\Users\joaco\Desktop\clases-2026-2\Programacion_web_avanzada\tarea1"
python -m http.server 8000
```
Abrir: http://localhost:8000/ui/index.html — en este caso ajuste `ui/js/main.js` para apuntar a `../db/productos.json`.

3. Live Server (VS Code): abrir `ui/index.html` con la extensión Live Server.

Notas:
- Para cumplir la actividad que pide consumir un archivo JSON externo, debe abrirse la página vía `http://` (no `file://`).
- Si usas el servidor Node incluido, la API disponible es `/api/productos`.
