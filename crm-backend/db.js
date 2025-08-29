// db.js
const mysql = require('mysql2/promise');

let pool = null;

async function initDB() {
  if (pool) return pool;

  pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'crm_db',
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONN_LIMIT || 10),
    queueLimit: 0
  });

  // Test de conexión al iniciar
  const conn = await pool.getConnection();
  try {
    await conn.query('SELECT 1');
    console.log('✅ Conexión a MySQL establecida correctamente');
  } finally {
    conn.release();
  }

  return pool;
}

function getDB() {
  if (!pool) throw new Error('DB no inicializada. Llama a initDB() primero.');
  return pool;
}

module.exports = { initDB, getDB };