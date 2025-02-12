import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Mahasiswa {
  id: number;
  nama: string;
}

interface Dosen {
  id: number;
  nama: string;
}

interface Nilai {
  mahasiswaId: number;
  dosenId: number;
  nilai: number;
  grade: string;
}

const NilaiForm: React.FC = () => {
  const navigate = useNavigate();

  // State untuk form
  const [nilai, setNilai] = useState<Nilai>({
    mahasiswaId: 0,
    dosenId: 0,
    nilai: 0,
    grade: "",
  });

  // State untuk daftar Mahasiswa & Dosen
  const [mahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([]);
  const [dosenList, setDosenList] = useState<Dosen[]>([]);

  useEffect(() => {
    fetchMahasiswa();
    fetchDosen();
  }, []);

  // Fetch data Mahasiswa
  const fetchMahasiswa = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/mahasiswa");
      setMahasiswaList(response.data);
    } catch (error) {
      console.error("Gagal mengambil data mahasiswa:", error);
    }
  };

  // Fetch data Dosen
  const fetchDosen = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/dosen");
      setDosenList(response.data);
    } catch (error) {
      console.error("Gagal mengambil data dosen:", error);
    }
  };

  // Fungsi untuk menentukan Grade berdasarkan Nilai
  const calculateGrade = (nilai: number): string => {
    if (nilai >= 90) return "A";
    if (nilai >= 80) return "B";
    if (nilai >= 70) return "C";
    if (nilai >= 60) return "D";
    return "E";
  };

  // Handle perubahan input form
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "nilai") {
      const numericValue = parseInt(value) || 0;
      setNilai({
        ...nilai,
        nilai: numericValue,
        grade: calculateGrade(numericValue),
      });
    } else {
      setNilai({ ...nilai, [name]: value });
    }
  };

  // Submit form (Tambah Nilai)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Data yang dikirim:", nilai); // Debugging
    try {
      await axios.post("http://localhost:5002/api/nilai", nilai);
      navigate("/nilai");
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Tambah Nilai</h2>
      <form onSubmit={handleSubmit}>
        {/* Dropdown Mahasiswa */}
        <div className="mb-3">
          <label className="form-label">Mahasiswa</label>
          <select
            name="mahasiswaId"
            className="form-select"
            value={nilai.mahasiswaId}
            onChange={handleChange}
            required
          >
            <option value="">Pilih Mahasiswa</option>
            {mahasiswaList.map((mhs) => (
              <option key={mhs.id} value={mhs.id}>
                {mhs.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown Dosen */}
        <div className="mb-3">
          <label className="form-label">Dosen</label>
          <select
            name="dosenId"
            className="form-select"
            value={nilai.dosenId}
            onChange={handleChange}
            required
          >
            <option value="">Pilih Dosen</option>
            {dosenList.map((dsn) => (
              <option key={dsn.id} value={dsn.id}>
                {dsn.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Input Nilai */}
        <div className="mb-3">
          <label className="form-label">Nilai (0 - 100)</label>
          <input
            type="number"
            name="nilai"
            className="form-control"
            value={nilai.nilai}
            onChange={handleChange}
            required
            min="0"
            max="100"
          />
        </div>

        {/* Otomatis menampilkan Grade */}
        <div className="mb-3">
          <label className="form-label">Grade</label>
          <input
            type="text"
            className="form-control"
            value={nilai.grade}
            readOnly
          />
        </div>

        <button type="submit" className="btn btn-primary me-2">
          Simpan
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/nilai")}
        >
          Batal
        </button>
      </form>
    </div>
  );
};

export default NilaiForm;
