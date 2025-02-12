import React, { useState } from "react";
import axios from "axios";

const DosenForm: React.FC = () => {
  const [nama, setNama] = useState("");
  const [nid, setNid] = useState("");
  const [errors, setErrors] = useState<{ nama?: string; nid?: string }>({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors: { nama?: string; nid?: string } = {};
    if (!nama.trim()) newErrors.nama = "Nama is required.";
    if (!nid.trim()) newErrors.nid = "NID is required.";
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
      await axios.post("http://localhost:5001/api/dosen", { nama, nid });
      setNama("");
      setNid("");
      setErrors({});
      setSuccessMessage("Dosen added successfully!");
    } catch (err) {
      setErrors({ nid: "Failed to add dosen. Try again!" });
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Dosen</h2>
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
          <label className="form-label">NID</label>
          <input
            type="text"
            className={`form-control ${errors.nid ? "is-invalid" : ""}`}
            value={nid}
            onChange={(e) => setNid(e.target.value)}
          />
          {errors.nid && <div className="invalid-feedback">{errors.nid}</div>}
        </div>

        <button type="submit" className="btn btn-primary">
          Add Dosen
        </button>
      </form>
    </div>
  );
};

export default DosenForm;
