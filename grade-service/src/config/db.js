const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool
  .connect()
  .then(async (client) => {
    console.log("✅ Connected to PostgreSQL - Grade Service");

    // Buat tabel nilai jika belum ada
    await client.query(`
      CREATE TABLE IF NOT EXISTS nilai (
        id SERIAL PRIMARY KEY,
        mahasiswa_id INT REFERENCES mahasiswa(id) ON DELETE CASCADE,
        dosen_id INT REFERENCES dosen(id) ON DELETE CASCADE,
        nilai INT NOT NULL,
        grade CHAR(1) NOT NULL CHECK (grade IN ('A', 'B', 'C', 'D', 'E'))
      );
    `);

    console.log("✅ Tabel nilai siap digunakan!");
  })
  .catch((err) => console.error("❌ Database connection error", err));

module.exports = pool;
