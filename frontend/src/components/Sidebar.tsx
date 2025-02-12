import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar: React.FC = () => {
  return (
    <div className="d-flex flex-column p-3 text-white bg-dark vh-100">
      <Link
        to="/"
        className="d-flex align-items-center mb-3 text-white text-decoration-none fs-4"
      >
        Grade
      </Link>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/mahasiswa" className="nav-link text-white">
            Mahasiswa
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/mahasiswa/add" className="nav-link text-white">
            Add Mahasiswa
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/dosen" className="nav-link text-white">
            Dosen
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/dosen/add" className="nav-link text-white">
            Add Dosen
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/nilai" className="nav-link text-white">
            Nilai
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/nilai/add" className="nav-link text-white">
            Add Nilai
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
