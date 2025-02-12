// Import Dependencies
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();

// Middleware Configuration
app.use(cors());
app.use(express.json());

// Import & Use Routes
const nilaiRoutes = require("./routes/NilaiRoutes");
app.use("/api", nilaiRoutes);

// Start the Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Grade Service running on port ${PORT}`));
