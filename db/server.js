const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

// serve UI static files from this db/public folder (index.html is here)
const UI_DIR = path.join(__dirname, 'public');
const DB_DIR = __dirname;

app.use(express.static(UI_DIR));
// serve images from db/imgs at /imgs
app.use('/imgs', express.static(path.join(DB_DIR, 'imgs')));

// API endpoint for productos (reads productos.json from this db folder)
app.get('/api/productos', (req, res) => {
  const dbPath = path.join(DB_DIR, 'productos.json');
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error leyendo productos.json', err);
      return res.status(500).json({ error: 'Error interno leyendo productos' });
    }
    try {
      const parsed = JSON.parse(data);
      return res.json(parsed);
    } catch (e) {
      console.error('JSON inválido', e);
      return res.status(500).json({ error: 'JSON inválido' });
    }
  });
});

// fallback: serve index.html for any other route (SPA friendly)
app.get('*', (req, res) => res.sendFile(path.join(UI_DIR, 'index.html')));

app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
