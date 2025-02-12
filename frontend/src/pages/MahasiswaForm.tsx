import React, { useState } from "react";
import axios from "axios";

const MahasiswaForm: React.FC = () => {
  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const [errors, setErrors] = useState<{ nama?: string; nim?: string }>({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors: { nama?: string; nim?: string } = {};
    if (!nama.trim()) newErrors.nama = "Nama is required.";
    if (!nim.trim()) newErrors.nim = "NIM is required.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(""); // Reset success message
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post("http://localhost:5001/api/mahasiswa", { nama, nim });
      setNama("");
      setNim("");
      setErrors({});
      setSuccessMessage("Mahasiswa added successfully!");
    } catch (err) {
      setErrors({ nim: "Failed to add mahasiswa. Try again!" });
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Mahasiswa</h2>
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nama</label>
          <input
            type="text"
            className={`form-control ${errors.nama ? "is-invalid" : ""}`}
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
          {errors.nama && <div className="invalid-feedback">{errors.nama}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">NIM</label>
          <input
            type="text"
            className={`form-control ${errors.nim ? "is-invalid" : ""}`}
            value={nim}
            onChange={(e) => setNim(e.target.value)}
          />
          {errors.nim && <div className="invalid-feedback">{errors.nim}</div>}
        </div>

        <button type="submit" className="btn btn-primary">
          Add Mahasiswa
        </button>
      </form>
    </div>
  );
};

export default MahasiswaForm;
