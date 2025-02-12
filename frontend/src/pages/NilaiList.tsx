import React, { useEffect, useState } from "react";
import axios from "axios";

interface Nilai {
  id: number;
  mahasiswa_nama: string;
  dosen_nama: string;
  nilai: number;
  grade: string;
}

const NilaiList: React.FC = () => {
  const [nilaiList, setNilaiList] = useState<Nilai[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingNilai, setEditingNilai] = useState<Nilai | null>(null); // Tambahkan state untuk edit form

  useEffect(() => {
    fetchNilai();
  }, []);

  const fetchNilai = async () => {
    try {
      const response = await axios.get("http://localhost:5002/api/nilai");
      setNilaiList(response.data);
    } catch (error) {
      setError("Gagal mengambil data nilai.");
      console.error("Error fetching nilai:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus nilai ini?")) return;

    try {
      await axios.delete(`http://localhost:5002/api/nilai/${id}`);
      setNilaiList(nilaiList.filter((nilai) => nilai.id !== id));
    } catch (error) {
      console.error("Gagal menghapus nilai:", error);
    }
  };

  const handleEditClick = (nilai: Nilai) => {
    setEditingNilai(nilai);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingNilai) return;
    const { name, value } = e.target;
    const updatedNilai = { ...editingNilai, [name]: value };

    // Update grade otomatis
    if (name === "nilai") {
      const numericValue = parseInt(value) || 0;
      updatedNilai.grade =
        numericValue >= 90
          ? "A"
          : numericValue >= 80
          ? "B"
          : numericValue >= 70
          ? "C"
          : numericValue >= 60
          ? "D"
          : "E";
      updatedNilai.nilai = numericValue;
    }

    setEditingNilai(updatedNilai);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNilai) return;

    console.log("Data yang dikirim ke backend:", editingNilai); // Debugging

    try {
      await axios.put(`http://localhost:5002/api/nilai/${editingNilai.id}`, {
        nilai: editingNilai.nilai,
        grade: editingNilai.grade,
      });

      // Perbarui daftar nilai tanpa reload
      setNilaiList((prevList) =>
        prevList.map((n) =>
          n.id === editingNilai.id
            ? { ...n, nilai: editingNilai.nilai, grade: editingNilai.grade }
            : n
        )
      );

      setEditingNilai(null); // Sembunyikan form edit setelah submit
    } catch (error) {
      console.error("Gagal mengupdate nilai:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Daftar Nilai</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : nilaiList.length === 0 ? (
        <p className="text-muted">Tidak ada data nilai.</p>
      ) : (
        <>
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>No</th>
                <th>Mahasiswa</th>
                <th>Dosen</th>
                <th>Nilai</th>
                <th>Grade</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {nilaiList.map((nilai, index) => (
                <tr key={nilai.id}>
                  <td>{index + 1}</td>
                  <td>{nilai.mahasiswa_nama}</td>
                  <td>{nilai.dosen_nama}</td>
                  <td>{nilai.nilai}</td>
                  <td>{nilai.grade}</td>
                  <td>
                    <button
                      onClick={() => handleEditClick(nilai)}
                      className="btn btn-warning btn-sm me-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(nilai.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Form Edit di Bawah Tabel */}
          {editingNilai && (
            <div className="mt-4">
              <h3>Edit Nilai</h3>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-3">
                  <label className="form-label">Mahasiswa</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingNilai.mahasiswa_nama}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Dosen</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingNilai.dosen_nama}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Nilai (0 - 100)</label>
                  <input
                    type="number"
                    name="nilai"
                    className="form-control"
                    value={editingNilai.nilai}
                    onChange={handleEditChange}
                    required
                    min="0"
                    max="100"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Grade</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingNilai.grade}
                    readOnly
                  />
                </div>

                <button type="submit" className="btn btn-primary me-2">
                  Simpan
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingNilai(null)}
                >
                  Batal
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NilaiList;
