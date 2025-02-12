const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool
  .connect()
  .then(async (client) => {
    console.log("✅ Connected to PostgreSQL - Input Service");

    // Buat tabel mahasiswa jika belum ada
    await client.query(`
      CREATE TABLE IF NOT EXISTS mahasiswa (
        id SERIAL PRIMARY KEY,
        nama VARCHAR(100) NOT NULL,
        nim VARCHAR(20) UNIQUE NOT NULL
      );
    `);

    // Buat tabel dosen jika belum ada
    await client.query(`
      CREATE TABLE IF NOT EXISTS dosen (
        id SERIAL PRIMARY KEY,
        nama VARCHAR(100) NOT NULL,
        nid VARCHAR(20) UNIQUE NOT NULL
      );
    `);

    console.log("✅ Tabel mahasiswa & dosen siap digunakan!");
  })
  .catch((err) => console.error("❌ Database connection error", err));

module.exports = pool;
