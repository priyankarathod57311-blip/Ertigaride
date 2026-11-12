
const express = require("express");
const router = express.Router();

const Booking = require("./Booking");
const verifyAdmin = require("./authMiddleware");
// Get all bookings
router.get("/", verifyAdmin, async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });

        res.json(bookings);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
// Save new booking

// Update booking status
router.patch("/:id/status", verifyAdmin, async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "Enquiry received",
            "Confirmed",
            "Completed",
            "Cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking status"
            });
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true, runValidators: true }
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        res.json({
            success: true,
            message: "Booking status updated successfully!",
            booking
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post("/", async (req, res) => {
    console.log("POST Booking API Called!");
    try {
        const booking = new Booking(req.body);

        await booking.save();

        res.status(201).json({
            success: true,
            message: "Booking saved successfully!",
            booking: booking
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
