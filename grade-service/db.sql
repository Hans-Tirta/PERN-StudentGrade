CREATE TABLE nilai (
    id SERIAL PRIMARY KEY,
    mahasiswa_id INT NOT NULL,
    dosen_id INT NOT NULL,
    nilai INT NOT NULL CHECK (nilai BETWEEN 0 AND 100),
    grade CHAR(1) NOT NULL,
    FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa(id),
    FOREIGN KEY (dosen_id) REFERENCES dosen(id)
);
