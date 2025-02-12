import React, { useEffect, useState } from "react";
import axios from "axios";

interface Dosen {
  id: number;
  nama: string;
  nid: string;
}

const DosenList: React.FC = () => {
  const [dosen, setDosen] = useState<Dosen[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editDosen, setEditDosen] = useState<Dosen | null>(null);

  useEffect(() => {
    fetchDosen();
  }, []);

  const fetchDosen = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/dosen");
      setDosen(response.data);
      setLoading(false);
    } catch (err) {
      setError("Gagal mengambil data dosen.");
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5001/api/dosen/${id}`);
      fetchDosen(); // Refresh the list after deletion
    } catch (err) {
      setError("Gagal menghapus dosen.");
    }
  };

  const handleEdit = (dosen: Dosen) => {
    setEditDosen(dosen);
  };

  const handleSaveEdit = async () => {
    if (!editDosen) return;
    try {
      await axios.put(`http://localhost:5001/api/dosen/${editDosen.id}`, {
        nama: editDosen.nama,
        nid: editDosen.nid,
      });
      setEditDosen(null);
      fetchDosen(); // Refresh the list after editing
    } catch (err) {
      setError("Gagal memperbarui dosen.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Daftar Dosen</h2>
      {loading && <p>Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && dosen.length > 0 ? (
        <table className="table table-striped mt-3">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>NID</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dosen.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.nama}</td>
                <td>{d.nid}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(d)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(d.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>Tidak ada dosen yang ditemukan.</p>
      )}

      {/* Edit Dosen Form */}
      {editDosen && (
        <div className="mt-4">
          <h3>Edit Dosen</h3>
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
                value={editDosen.nama}
                onChange={(e) =>
                  setEditDosen({ ...editDosen, nama: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">NID</label>
              <input
                type="text"
                className="form-control"
                value={editDosen.nid}
                onChange={(e) =>
                  setEditDosen({ ...editDosen, nid: e.target.value })
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
              onClick={() => setEditDosen(null)}
            >
              Batal
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DosenList;
