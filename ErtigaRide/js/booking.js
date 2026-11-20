
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("booking-form");
    if (!form) return;

    const today = new Date().toISOString().split("T")[0];
    const dateInput = document.getElementById("travel-date");

    if (dateInput) dateInput.min = today;

    // Determine API URL based on environment
    const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://localhost:5000"
        : "https://ertigaride-backend.onrender.com";

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const data = Object.fromEntries(
            new FormData(form).entries()
        );

        data.bookingId = "ER" + Date.now().toString().slice(-8);
        data.createdAt = new Date().toISOString();
        data.status = "Enquiry received";

        const message =
`Hello ErtigaRide! I would like to enquire about a booking.

Booking ID: ${data.bookingId}
Name: ${data.name}
Phone: ${data.phone}
Trip type: ${data.tripType}
Pickup: ${data.pickup}
Destination: ${data.destination}
Travel date: ${data.travelDate}
Pickup time: ${data.pickupTime}
Passengers: ${data.passengers}
Driver option: ${data.driverOption}
Return trip: ${data.returnTrip}
Notes: ${data.notes || "None"}

Please confirm availability and final fare.`;

        const result = document.getElementById("booking-result");
        const whatsappButton = document.getElementById("send-whatsapp");

        result.style.display = "block";
        result.textContent = "Saving your booking...";

        try {
            const response = await fetch(
                `${API_BASE}/api/bookings`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        bookingId: data.bookingId,
                        customerName: data.name,
                        phone: data.phone,
                        tripType: data.tripType,
                        driverOption: data.driverOption,
                        pickup: data.pickup,
                        destination: data.destination,
                        travelDate: data.travelDate,
                        pickupTime: data.pickupTime,
                        passengers: data.passengers,
                        returnTrip: data.returnTrip,
                        notes: data.notes,
                        status: data.status,
                        createdAt: data.createdAt
                    })
                }
            );

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || "Booking failed");
            }

            result.textContent =
                "Booking saved successfully! Reference: " + data.bookingId;

            whatsappButton.onclick = () => openWhatsApp(message);
            whatsappButton.style.display = "inline-flex";

            form.reset();
            dateInput.min = today;

        } catch (error) {
            console.error("Booking Error:", error);

            result.textContent =
                "Booking could not be saved. Please try again. " + error.message;

            whatsappButton.style.display = "none";
        }
    });
});
