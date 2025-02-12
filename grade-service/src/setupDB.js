const { Client } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

// Koneksi sementara ke PostgreSQL default (tanpa database pernnilai)
const client = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE, // Default database untuk koneksi awal
});

async function setupDatabase() {
  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL - Checking Database");

    // Cek apakah database sudah ada
    const res = await client.query(
      "SELECT 1 FROM pg_database WHERE datname='pernnilai'"
    );

    if (res.rowCount === 0) {
      // Jika database belum ada, buat database
      await client.query("CREATE DATABASE pernnilai;");
      console.log("✅ Database 'pernnilai' created!");
    } else {
      console.log("✅ Database 'pernnilai' already exists!");
    }
  } catch (err) {
    console.error("❌ Database setup error:", err);
  } finally {
    await client.end();
  }
}

// Jalankan setup database
setupDatabase();
