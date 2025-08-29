// routes/contacts.js
const express = require('express');
const router = express.Router();
const { getDB } = require('../db');

// Listar todos
router.get('/', async (req, res) => {
  try {
    const [rows] = await getDB().query('SELECT * FROM contacts ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('GET /contacts', err);
    res.status(500).json({ error: 'DB Error' });
  }
});

// Obtener uno
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await getDB().query('SELECT * FROM contacts WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'No Encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('GET /contacts/:id', err);
    res.status(500).json({ error: 'DB Error' });
  }
});

// Crear
router.post('/', async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const [result] = await getDB().query(
      'INSERT INTO contacts (name, email, phone) VALUES (?,?,?)',
      [name, email, phone]
    );
    const [rows] = await getDB().query('SELECT * FROM contacts WHERE id=?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /contacts', err);
    res.status(500).json({ error: 'DB Error' });
  }
});

// Actualizar
router.put('/:id', async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    await getDB().query(
      'UPDATE contacts SET name=?, email=?, phone=? WHERE id=?',
      [name, email, phone, req.params.id]
    );
    const [rows] = await getDB().query('SELECT * FROM contacts WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'No Encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('PUT /contacts/:id', err);
    res.status(500).json({ error: 'DB Error' });
  }
});

// Eliminar (borra ventas asociadas)
router.delete('/:id', async (req, res) => {
  try {
    await getDB().query('DELETE FROM sales WHERE contact_id=?', [req.params.id]);
    const [result] = await getDB().query('DELETE FROM contacts WHERE id=?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'No Encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    console.error('DELETE /contacts/:id', err);
    res.status(500).json({ error: 'DB Error' });
  }
});

module.exports = router;
