const token = sessionStorage.getItem("ertigaRideAdminToken");

if (!token) {
    window.location.href = "admin-login.html";
}
document.addEventListener("DOMContentLoaded", () => {
  const rows = document.getElementById("booking-rows");
  const empty = document.getElementById("empty-state");
  const search = document.getElementById("booking-search");
  const filter = document.getElementById("status-filter");

  let bookings = [];

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;",
      '"': "&quot;", "'": "&#39;"
    }[char]));
  }

  function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value + "T00:00:00");
    return Number.isNaN(date.getTime())
      ? escapeHTML(value)
      : date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        });
  }

  function updateStats() {
    document.getElementById("total-count").textContent = bookings.length;

    document.getElementById("new-count").textContent =
      bookings.filter(b => (b.status || "Enquiry received") === "Enquiry received").length;

    document.getElementById("confirmed-count").textContent =
      bookings.filter(b => b.status === "Confirmed").length;

    document.getElementById("completed-count").textContent =
      bookings.filter(b => b.status === "Completed").length;
  }

  async function loadBookings() {
    rows.innerHTML = `<tr><td colspan="7">Loading bookings...</td></tr>`;

    try {
      const response = await fetch("https://ertigaride-backend.onrender.com/api/bookings", {
    headers: {
        "Authorization": "Bearer " + token
    }
});

      if (!response.ok) {
        throw new Error("Could not load bookings");
      }

      bookings = await response.json();
      updateStats();
      render();

    } catch (error) {
      console.error("Loading Error:", error);
      rows.innerHTML = `<tr><td colspan="7">Unable to load bookings. Please check backend.</td></tr>`;
    }
  }

  function render() {
    const term = search.value.trim().toLowerCase();
    const selectedStatus = filter.value;

    const filtered = bookings.filter(b => {
      const searchable = [
        b.bookingId,
        b.customerName,
        b.phone,
        b.pickup,
        b.destination
      ].join(" ").toLowerCase();

      const status = b.status || "Enquiry received";

      return searchable.includes(term) &&
        (selectedStatus === "All" || status === selectedStatus);
    });

    rows.innerHTML = filtered.map(b => `
      <tr>
        <td>
          <strong>${escapeHTML(b.bookingId)}</strong><br>
          <span class="muted">${escapeHTML(
            new Date(b.createdAt).toLocaleString("en-IN")
          )}</span>
        </td>

        <td>
          <strong>${escapeHTML(b.customerName)}</strong><br>
          ${escapeHTML(b.phone)}
        </td>

        <td>
          ${escapeHTML(b.tripType)}<br>
          <span class="muted">
            ${escapeHTML(b.pickup)} → ${escapeHTML(b.destination)}
          </span>
        </td>

        <td>
          ${formatDate(b.travelDate)}<br>
          ${escapeHTML(b.pickupTime || "—")}
        </td>

        <td>
          ${escapeHTML(b.driverOption || "—")}<br>
          ${escapeHTML(b.passengers || "—")} passenger(s)
        </td>

        <td>
          <select class="status-select"
            data-id="${escapeHTML(b._id)}"
            aria-label="Update status for ${escapeHTML(b.bookingId)}">
            ${["Enquiry received", "Confirmed", "Completed", "Cancelled"].map(s =>
              `<option value="${s}" ${(b.status || "Enquiry received") === s ? "selected" : ""}>${s}</option>`
            ).join("")}
          </select>
        </td>

        <td>
          <button class="small-action whatsapp-action"
            data-id="${escapeHTML(b._id)}">WhatsApp</button>
        </td>
      </tr>
    `).join("");

    empty.hidden = filtered.length > 0;
  }

  // Update booking status in MongoDB
  rows.addEventListener("change", async event => {
    if (!event.target.matches(".status-select")) return;

    const id = event.target.dataset.id;
    const status = event.target.value;

    try {
      const response = await fetch(
        `https://ertigaride-backend.onrender.com/api/bookings/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
             "Authorization": "Bearer " + token
          },
          body: JSON.stringify({ status })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Status update failed");
      }

      alert("Booking status updated successfully!");
      await loadBookings();

    } catch (error) {
      alert(error.message);
      await loadBookings();
    }
  });

  // WhatsApp message
  rows.addEventListener("click", event => {
    if (!event.target.matches(".whatsapp-action")) return;

    const id = event.target.dataset.id;
    const booking = bookings.find(b => b._id === id);

    if (booking) {
      const message =
        `Hello ${booking.customerName}, regarding your ErtigaRide enquiry ${booking.bookingId}: ${booking.status || "Enquiry received"}.`;

      openWhatsApp(message);
    }
  });

  // Export bookings to CSV
  function exportCSV() {
    if (!bookings.length) {
      alert("There are no bookings to export yet.");
      return;
    }

    const columns = [
      "bookingId", "customerName", "phone", "tripType",
      "pickup", "destination", "travelDate", "pickupTime",
      "passengers", "driverOption", "status", "notes", "createdAt"
    ];

    const csv = [
      columns.join(","),
      ...bookings.map(b =>
        columns.map(key =>
          `"${String(b[key] ?? "").replace(/"/g, '""')}"`
        ).join(",")
      )
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "ertigaride-bookings.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  search.addEventListener("input", render);
  filter.addEventListener("change", render);

  document.getElementById("refresh-btn")
    .addEventListener("click", loadBookings);

  document.getElementById("export-btn")
    .addEventListener("click", exportCSV);

  loadBookings();
});
const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        sessionStorage.removeItem("ertigaRideAdminToken");
        window.location.href = "admin-login.html";
    });
}