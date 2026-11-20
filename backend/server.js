
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const bookingRoutes = require("./bookingRoutes");
const adminRoutes = require("./adminRoutes");

app.use(cors({
    origin: [
        "https://ertigaride.netlify.app",
        "http://localhost:5503",
        "http://127.0.0.1:5503",
        "http://localhost:8080"
    ],
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// Test route

// Backend Home Route
app.get("/", (req, res) => {
    res.send("Welcome to ErtigaRide Backend!");
});

// Connect MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`ErtigaRide server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB Connection Failed:", error.message);
    });
