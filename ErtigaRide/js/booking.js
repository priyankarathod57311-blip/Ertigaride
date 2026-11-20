
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("booking-form");
    if (!form) return;

    const today = new Date().toISOString().split("T")[0];
    const dateInput = document.getElementById("travel-date");

    if (dateInput) dateInput.min = today;

    // Determine API URL based on environment
    const API_BASE = "https://ertigaride-backend.onrender.com";

    console.log("API Base URL:", API_BASE);
    console.log("Hostname:", window.location.hostname);

    // Direct WhatsApp button - bypasses API
    const whatsappDirectBtn = document.getElementById("whatsapp-direct");
    if (whatsappDirectBtn) {
        whatsappDirectBtn.addEventListener("click", () => {
            const data = Object.fromEntries(new FormData(form).entries());
            const bookingId = "ER" + Date.now().toString().slice(-8);
            
            const message =
`Hello ErtigaRide! I would like to enquire about a booking.

Booking ID: ${bookingId}
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
            
            openWhatsApp(message);
        });
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        

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
            console.log("Submitting booking to:", `${API_BASE}/api/bookings`);
            console.log("Booking data:", data);

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

            console.log("Response status:", response.status);
            const responseData = await response.json();
            console.log("Response data:", responseData);

            if (!response.ok) {
                throw new Error(responseData.message || "Booking failed");
            }

            result.textContent =
                "Booking saved successfully! Reference: " + data.bookingId;
            result.style.color = "#146b49";
            result.style.background = "#eef8f3";

            whatsappButton.onclick = () => openWhatsApp(message);
            whatsappButton.style.display = "inline-flex";

            form.reset();
            dateInput.min = today;

        } catch (error) {
            console.error("Booking Error:", error);

            // Fallback: Save to localStorage if API fails
            try {
                const existingBookings = JSON.parse(localStorage.getItem("ertigaRideBookings") || "[]");
                existingBookings.push(data);
                localStorage.setItem("ertigaRideBookings", JSON.stringify(existingBookings));
                
                result.textContent =
                    "Booking saved locally! Reference: " + data.bookingId + " (Server unavailable - data saved in browser)";
                result.style.color = "#78501d";
                result.style.background = "#fff8e9";

                whatsappButton.onclick = () => openWhatsApp(message);
                whatsappButton.style.display = "inline-flex";

                form.reset();
                dateInput.min = today;
            } catch (localError) {
                result.textContent =
                    "Booking could not be saved. Please try again or contact us directly via WhatsApp.";
                result.style.color = "#c0392b";
                result.style.background = "#fee";

                whatsappButton.onclick = () => openWhatsApp(message);
                whatsappButton.style.display = "inline-flex";
                whatsappButton.textContent = "Send via WhatsApp";
            }
        }
    });
});
