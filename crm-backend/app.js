// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./db');

const contactsRouter = require('./routes/contacts');
const salesRouter = require('./routes/sales');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/contacts', contactsRouter);
app.use('/sales', salesRouter);

// Ingresos totales (suma de importe)
app.get('/income', async (req, res) => {
  const { getDB } = require('./db');
  try {
    const pool = getDB();
    const [rows] = await pool.query('SELECT IFNULL(SUM(importe),0) AS total_income FROM sales');
    res.json({ total_income: rows[0].total_income });
  } catch (err) {
    console.error('Error en /income:', err);
    res.status(500).json({ error: 'DB Error' });
  }
});

// Healthcheck rápido
app.get('/health', async (req, res) => {
  const { getDB } = require('./db');
  try {
    const pool = getDB();
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Boot
(async () => {
  try {
    await initDB(); // ⛔ si no conecta, no arranca
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor levantado en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ No se pudo establecer conexión a MySQL. Revisa credenciales/servicio.');
    console.error('Detalle:', err.message);
    process.exit(1);
  }
})();
