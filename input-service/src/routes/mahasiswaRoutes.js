const express = require("express");
const pool = require("../config/db"); // Koneksi database
const router = express.Router();

// Validasi input mahasiswa
const validateMahasiswa = (nama, nim) => {
  const errors = {};
  if (!nama || nama.trim() === "") {
    errors.nama = "Nama tidak boleh kosong.";
  }
  if (!nim || nim.trim() === "") {
    errors.nim = "NIM tidak boleh kosong.";
  }
  return errors;
};

// **1. Tambah Mahasiswa**
router.post("/mahasiswa", async (req, res) => {
  const { nama, nim } = req.body;
  const errors = validateMahasiswa(nama, nim);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Cek apakah NIM sudah ada di database
    const check = await pool.query("SELECT * FROM mahasiswa WHERE nim = $1", [
      nim,
    ]);
    if (check.rows.length > 0) {
      return res.status(400).json({ error: "NIM sudah terdaftar." });
    }

    // Simpan ke database jika valid
    const result = await pool.query(
      "INSERT INTO mahasiswa (nama, nim) VALUES ($1, $2) RETURNING *",
      [nama, nim]
    );

    res.status(201).json({
      message: "Mahasiswa berhasil ditambahkan.",
      mahasiswa: result.rows[0],
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});

// **2. Ambil Semua Mahasiswa**
router.get("/mahasiswa", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM mahasiswa ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});

// **3. Hapus Mahasiswa**
router.delete("/mahasiswa/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM mahasiswa WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Mahasiswa tidak ditemukan." });
    }

    res.json({ message: "Mahasiswa berhasil dihapus." });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});

// **4. Update Mahasiswa**
router.put("/mahasiswa/:id", async (req, res) => {
  const { id } = req.params;
  const { nama, nim } = req.body;
  const errors = validateMahasiswa(nama, nim);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Cek apakah mahasiswa ada
    const check = await pool.query("SELECT * FROM mahasiswa WHERE id = $1", [
      id,
    ]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Mahasiswa tidak ditemukan." });
    }

    // Update data mahasiswa
    const result = await pool.query(
      "UPDATE mahasiswa SET nama = $1, nim = $2 WHERE id = $3 RETURNING *",
      [nama, nim, id]
    );

    res.json({
      message: "Data mahasiswa berhasil diperbarui.",
      mahasiswa: result.rows[0],
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});

module.exports = router;
