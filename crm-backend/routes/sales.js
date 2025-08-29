// routes/sales.js
const express = require('express');
const router = express.Router();
const { getDB } = require('../db');

// Listar ventas (con datos del contacto)
router.get('/', async (req, res) => {
  try {
    const [rows] = await getDB().query(
      `SELECT s.*, c.name AS contact_name, c.email AS contact_email, c.phone AS contact_phone
       FROM sales s
       LEFT JOIN contacts c ON s.contact_id = c.id
       ORDER BY s.id DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /sales', err);
    res.status(500).json({ error: 'DB Error' });
  }
});

// Obtener una venta
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await getDB().query('SELECT * FROM sales WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'No Encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('GET /sales/:id', err);
    res.status(500).json({ error: 'DB Error' });
  }
});

// Crear venta: { contact_id, producto, cantidad, importe }
router.post('/', async (req, res) => {
  const { contact_id, producto, cantidad, importe } = req.body;
  try {
    const [result] = await getDB().query(
      'INSERT INTO sales (contact_id, producto, cantidad, importe) VALUES (?,?,?,?)',
      [contact_id || null, producto, cantidad, importe]
    );
    const [rows] = await getDB().query('SELECT * FROM sales WHERE id=?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /sales', err);
    res.status(500).json({ error: 'DB Error' });
  }
});

// Actualizar venta
router.put('/:id', async (req, res) => {
  const { contact_id, producto, cantidad, importe } = req.body;
  try {
    await getDB().query(
      'UPDATE sales SET contact_id=?, producto=?, cantidad=?, importe=? WHERE id=?',
      [contact_id || null, producto, cantidad, importe, req.params.id]
    );
    const [rows] = await getDB().query('SELECT * FROM sales WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'No Encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('PUT /sales/:id', err);
    res.status(500).json({ error: 'DB Error' });
  }
});

// Eliminar venta
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await getDB().query('DELETE FROM sales WHERE id=?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'No Encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    console.error('DELETE /sales/:id', err);
    res.status(500).json({ error: 'DB Error' });
  }
});

module.exports = router;