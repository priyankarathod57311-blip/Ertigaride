
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("admin-login-form");
    const message = document.getElementById("login-message");

    // Determine API URL based on environment
    const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://localhost:5000"
        : "https://ertigaride-backend.onrender.com";

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        message.textContent = "Logging in...";

        try {
            const response = await fetch(
                `${API_BASE}/api/admin/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, password })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            sessionStorage.setItem(
                "ertigaRideAdminToken",
                data.token
            );

            window.location.href = "admin.html";

        } catch (error) {
            message.textContent = error.message;
        }
    });

});
