import React, { useEffect, useState } from "react";
import axios from "axios";

interface Mahasiswa {
  id: number;
  nama: string;
  nim: string;
}

const MahasiswaList: React.FC = () => {
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editMahasiswa, setEditMahasiswa] = useState<Mahasiswa | null>(null);

  useEffect(() => {
    fetchMahasiswa();
  }, []);

  const fetchMahasiswa = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/mahasiswa");
      setMahasiswa(response.data);
      setLoading(false);
    } catch (err) {
      setError("Gagal mengambil data mahasiswa.");
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5001/api/mahasiswa/${id}`);
      fetchMahasiswa(); // Refresh data setelah penghapusan
    } catch (err) {
      setError("Gagal menghapus mahasiswa.");
    }
  };

  const handleEdit = (mahasiswa: Mahasiswa) => {
    setEditMahasiswa(mahasiswa);
  };

  const handleSaveEdit = async () => {
    if (!editMahasiswa) return;
    try {
      await axios.put(
        `http://localhost:5001/api/mahasiswa/${editMahasiswa.id}`,
        {
          nama: editMahasiswa.nama,
          nim: editMahasiswa.nim,
        }
      );
      setEditMahasiswa(null);
      fetchMahasiswa(); // Refresh data setelah edit
    } catch (err) {
      setError("Gagal mengupdate mahasiswa.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Daftar Mahasiswa</h2>
      {loading && <p>Memuat data...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && mahasiswa.length > 0 ? (
        <table className="table table-striped mt-3">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>NIM</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {mahasiswa.map((mhs) => (
              <tr key={mhs.id}>
                <td>{mhs.id}</td>
                <td>{mhs.nama}</td>
                <td>{mhs.nim}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(mhs)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(mhs.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>Data mahasiswa tidak ditemukan.</p>
      )}

      {/* Form Edit Mahasiswa */}
      {editMahasiswa && (
        <div className="mt-4">
          <h3>Edit Mahasiswa</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveEdit();
            }}
          >
            <div className="mb-3">
              <label className="form-label">Nama</label>
              <input
                type="text"
                className="form-control"
                value={editMahasiswa.nama}
                onChange={(e) =>
                  setEditMahasiswa({ ...editMahasiswa, nama: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">NIM</label>
              <input
                type="text"
                className="form-control"
                value={editMahasiswa.nim}
                onChange={(e) =>
                  setEditMahasiswa({ ...editMahasiswa, nim: e.target.value })
                }
                required
              />
            </div>
            <button type="submit" className="btn btn-primary me-2">
              Simpan
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditMahasiswa(null)}
            >
              Batal
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MahasiswaList;
