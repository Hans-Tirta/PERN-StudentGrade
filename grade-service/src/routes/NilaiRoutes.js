const express = require("express");
const pool = require("../config/db"); // Koneksi ke database
const router = express.Router();

// Ambil semua nilai dengan nama mahasiswa & dosen
router.get("/nilai", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT n.id, 
             m.nama AS mahasiswa_nama, 
             d.nama AS dosen_nama, 
             n.nilai, 
             n.grade 
      FROM nilai n
      JOIN mahasiswa m ON n.mahasiswa_id = m.id
      JOIN dosen d ON n.dosen_id = d.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Gagal mengambil data nilai:", error);
    res.status(500).json({ error: "Gagal mengambil data nilai" });
  }
});

// Ambil nilai berdasarkan ID
router.get("/nilai/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const nilai = await pool.query("SELECT * FROM nilai WHERE id = $1", [id]);
    if (nilai.rows.length === 0) {
      return res.status(404).json({ error: "Data tidak ditemukan" });
    }
    res.json(nilai.rows[0]);
  } catch (error) {
    console.error("Gagal mengambil data nilai:", error);
    res.status(500).json({ error: "Gagal mengambil data nilai" });
  }
});

// Simpan nilai baru
router.post("/nilai", async (req, res) => {
  try {
    const { mahasiswaId, dosenId, nilai, grade } = req.body;

    if (!mahasiswaId || !dosenId || !nilai || !grade) {
      return res.status(400).json({ error: "Semua field harus diisi" });
    }

    await pool.query(
      "INSERT INTO nilai (mahasiswa_id, dosen_id, nilai, grade) VALUES ($1, $2, $3, $4)",
      [mahasiswaId, dosenId, nilai, grade]
    );

    res.status(201).json({ message: "Nilai berhasil disimpan!" });
  } catch (error) {
    console.error("Gagal menyimpan nilai:", error);
    res.status(500).json({ error: "Gagal menyimpan nilai" });
  }
});

// Edit nilai
router.put("/nilai/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { mahasiswaId, dosenId, nilai, grade } = req.body;

    if (!nilai || !grade) {
      return res.status(400).json({ error: "Semua field harus diisi" });
    }

    const result = await pool.query(
      "UPDATE nilai SET mahasiswa_id = $1, dosen_id = $2, nilai = $3, grade = $4 WHERE id = $5",
      [mahasiswaId, dosenId, nilai, grade, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Data tidak ditemukan" });
    }

    res.json({ message: "Nilai berhasil diperbarui!" });
  } catch (error) {
    console.error("Gagal memperbarui nilai:", error);
    res.status(500).json({ error: "Gagal memperbarui nilai" });
  }
});

// Hapus nilai
router.delete("/nilai/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM nilai WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Data tidak ditemukan" });
    }

    res.json({ message: "Nilai berhasil dihapus!" });
  } catch (error) {
    console.error("Gagal menghapus nilai:", error);
    res.status(500).json({ error: "Gagal menghapus nilai" });
  }
});

module.exports = router;
