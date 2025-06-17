import React from "react";

function DashboardHome() {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        minHeight: "70vh",
        background: "linear-gradient(120deg, #e0eafc, #cfdef3)"
      }}
    >
      <h2 className="fw-bold mb-3 text-primary">
        Selamat Datang di Sistem E-SEKJUR JURUSAN ELEKTRO
      </h2>
      <p className="lead">Silakan pilih menu di sidebar untuk mulai bekerja.</p>
    </div>
  );
}

export default DashboardHome;
