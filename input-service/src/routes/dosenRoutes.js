const express = require("express");
const pool = require("../config/db"); // Koneksi database
const router = express.Router();

// Validasi input dosen
const validateDosen = (nama, nid) => {
  const errors = {};
  if (!nama || nama.trim() === "") {
    errors.nama = "Nama tidak boleh kosong.";
  }
  if (!nid || nid.trim() === "") {
    errors.nid = "NID tidak boleh kosong.";
  }
  return errors;
};

// **1. Tambah Dosen**
router.post("/dosen", async (req, res) => {
  const { nama, nid } = req.body;
  const errors = validateDosen(nama, nid);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Cek apakah NID sudah ada di database
    const check = await pool.query("SELECT * FROM dosen WHERE nid = $1", [nid]);
    if (check.rows.length > 0) {
      return res.status(400).json({ error: "NID sudah terdaftar." });
    }

    // Simpan ke database jika valid
    const result = await pool.query(
      "INSERT INTO dosen (nama, nid) VALUES ($1, $2) RETURNING *",
      [nama, nid]
    );

    res.status(201).json({
      message: "Dosen berhasil ditambahkan.",
      dosen: result.rows[0],
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});

// **2. Ambil Semua Dosen**
router.get("/dosen", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM dosen ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});

// **3. Hapus Dosen**
router.delete("/dosen/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM dosen WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Dosen tidak ditemukan." });
    }

    res.json({ message: "Dosen berhasil dihapus." });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});

// **4. Update Dosen**
router.put("/dosen/:id", async (req, res) => {
  const { id } = req.params;
  const { nama, nid } = req.body;
  const errors = validateDosen(nama, nid);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Cek apakah dosen ada
    const check = await pool.query("SELECT * FROM dosen WHERE id = $1", [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Dosen tidak ditemukan." });
    }

    // Update data dosen
    const result = await pool.query(
      "UPDATE dosen SET nama = $1, nid = $2 WHERE id = $3 RETURNING *",
      [nama, nid, id]
    );

    res.json({
      message: "Data dosen berhasil diperbarui.",
      dosen: result.rows[0],
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});

module.exports = router;
