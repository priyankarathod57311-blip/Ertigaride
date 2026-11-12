// ERtigaRide shared JavaScript
// IMPORTANT: Replace this demo number with your WhatsApp number including country code.
// Example India: 919876543210 (do not include + or spaces).
const WHATSAPP_NUMBER = "8767398660";

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
  }

  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(link => {
    if (link.getAttribute("href") === current) link.classList.add("active");
  });

  document.querySelectorAll(".faq-question").forEach(button => {
    button.addEventListener("click", () => {
      button.parentElement.classList.toggle("open");
    });
  });

  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});

function openWhatsApp(message) {
  if (WHATSAPP_NUMBER.includes("X")) {
    alert("Please add your WhatsApp number in js/main.js first.");
    return;
  }
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
}

function getBookings() {
  try { return JSON.parse(localStorage.getItem("ertigaRideBookings") || "[]"); }
  catch { return []; }
}
function saveBooking(booking) {
  const bookings = getBookings();
  bookings.unshift(booking);
  localStorage.setItem("ertigaRideBookings", JSON.stringify(bookings));
}
