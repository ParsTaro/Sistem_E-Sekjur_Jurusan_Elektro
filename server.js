const express = require("express");
const cors = require("cors");
require("dotenv").config(); // ✅ langsung aktifkan dotenv

const app = express();
const db = require("./models/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const mahasiswaRoutes = require("./routes/mahasiswaRoutes");
const sekjurRoutes = require("./routes/sekjurRoutes");
const prodiRoutes = require("./routes/prodiRoutes");
const dosenRoutes = require("./routes/dosenRoutes");
// const adminUserRoutes = require("./routes/adminUserRoutes"); // SUDAH TIDAK DIPAKAI

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/mahasiswa", mahasiswaRoutes);
app.use("/api/sekjur", sekjurRoutes);
app.use("/api/prodi", prodiRoutes);
app.use("/api/dosen", dosenRoutes);
// app.use("/api/users", adminUserRoutes); // SUDAH TIDAK DIPAKAI

// Health check
app.get("/", (req, res) => res.send("API Semester Antara aktif 💖"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
