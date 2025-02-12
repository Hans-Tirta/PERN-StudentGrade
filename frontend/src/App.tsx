import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

// Import Halaman
import MahasiswaList from "./pages/MahasiswaList";
import MahasiswaForm from "./pages/MahasiswaForm";
import DosenList from "./pages/DosenList";
import DosenForm from "./pages/DosenForm";
import NilaiList from "./pages/NilaiList";
import NilaiForm from "./pages/NilaiForm";
import "bootstrap/dist/css/bootstrap.min.css";

const App: React.FC = () => {
  return (
    <Router>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar: Menggunakan col-md-3 agar sidebar memiliki lebar tetap */}
          <div className="col-md-3 col-lg-2 bg-dark p-0">
            <Sidebar />
          </div>

          {/* Konten utama: Menggunakan col-md-9 agar responsif */}
          <div className="col-md-9 col-lg-10 p-4" style={{ overflow: "auto" }}>
            <Routes>
              <Route
                path="/"
                element={
                  <div className="container mt-4">
                    <h1 className="text-primary">Welcome to the App</h1>
                    <p className="text-muted">
                      Manage Mahasiswa, Dosen, dan Nilai easily with our system.
                    </p>
                  </div>
                }
              />
              <Route path="/mahasiswa" element={<MahasiswaList />} />
              <Route path="/mahasiswa/add" element={<MahasiswaForm />} />
              <Route path="/dosen" element={<DosenList />} />
              <Route path="/dosen/add" element={<DosenForm />} />
              <Route path="/nilai" element={<NilaiList />} />
              <Route path="/nilai/add" element={<NilaiForm />} />

              <Route
                path="*"
                element={
                  <div className="text-center mt-5">
                    <h1 className="text-danger">404 - Page Not Found</h1>
                    <p>Oops! The page you are looking for does not exist.</p>
                  </div>
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
