
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    bookingId: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    tripType: {
        type: String,
        required: true
    },
    driverOption: String,
    pickup: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    travelDate: String,
    pickupTime: String,
    passengers: String,
    returnTrip: String,
    notes: String,
    status: {
        type: String,
        default: "Enquiry received"
    },
    distance: Number,
    totalFare: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Booking", bookingSchema);
