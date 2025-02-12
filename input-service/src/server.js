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
const mahasiswaRoutes = require("./routes/mahasiswaRoutes");
const dosenRoutes = require("./routes/dosenRoutes");
app.use("/api", mahasiswaRoutes);
app.use("/api", dosenRoutes);

// Start the Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Input Service running on port ${PORT}`));
