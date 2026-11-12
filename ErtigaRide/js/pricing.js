document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("fare-form");
  if (!form) return;

  const rates = {
    customer: { local: 14, outstation: 15, airport: 16 },
    driver: { local: 15, outstation: 16, airport: 16 }
  };
  const labels = { local: "Local", outstation: "Outstation", airport: "Airport transfer" };
  const money = amount => "₹" + Math.round(amount).toLocaleString("en-IN");
  const tollOption = document.getElementById("toll-option");
  const tollField = document.getElementById("toll-amount-field");
  const parkingField = document.getElementById("parking-amount-field");

  function toggleExpenseFields() {
    const driverPays = tollOption.value === "driver";
    tollField.hidden = !driverPays;
    parkingField.hidden = !driverPays;
  }
  tollOption.addEventListener("change", toggleExpenseFields);
  toggleExpenseFields();

  form.addEventListener("submit", event => {
    event.preventDefault();

    const type = document.getElementById("trip-type").value;
    const km = Number(document.getElementById("distance").value);
    const nights = Number(document.getElementById("nights").value);
    const paymentOption = tollOption.value;
    const toll = paymentOption === "driver" ? Number(document.getElementById("toll-amount").value) : 0;
    const parking = paymentOption === "driver" ? Number(document.getElementById("parking-amount").value) : 0;

    if (!Number.isFinite(km) || km <= 0 || !Number.isInteger(nights) || nights < 1 ||
        !Number.isFinite(toll) || toll < 0 || !Number.isFinite(parking) || parking < 0) {
      alert("Please enter valid distance, nights, toll and parking amounts.");
      return;
    }

    const rate = rates[paymentOption][type];
    const distanceFare = km * rate;
    const stayCharge = nights * 500;
    const total = distanceFare + stayCharge + toll + parking;
    const tollDescription = paymentOption === "customer" ? "Customer pays separately (not included)" : money(toll);
    const parkingDescription = paymentOption === "customer" ? "Customer pays separately (not included)" : money(parking);

    document.getElementById("fare-breakdown").innerHTML = `
      <div class="fare-line"><span>Trip type</span><strong>${labels[type]}</strong></div>
      <div class="fare-line"><span>Total distance (onward + return)</span><strong>${km.toLocaleString("en-IN")} km</strong></div>
      <div class="fare-line"><span>Selected toll/parking payment option</span><strong>${paymentOption === "customer" ? "Customer pays separately" : "Driver pays; actual expense added"}</strong></div>
      <div class="fare-line"><span>Rate per km</span><strong>${money(rate)}</strong></div>
      <div class="fare-line"><span>Distance fare (${km} × ${money(rate)})</span><strong>${money(distanceFare)}</strong></div>
      <div class="fare-line"><span>Driver stay charge (${nights} × ₹500)</span><strong>${money(stayCharge)}</strong></div>
      <div class="fare-line"><span>Driver accommodation</span><strong>Customer must arrange</strong></div>
      <div class="fare-line"><span>Driver meals</span><strong>3 meals/day – customer provides</strong></div>
      <div class="fare-line"><span>Toll</span><strong>${tollDescription}</strong></div>
      <div class="fare-line"><span>Parking</span><strong>${parkingDescription}</strong></div>
    `;
    document.getElementById("fare-value").textContent = money(total);
    document.getElementById("fare-note").textContent = paymentOption === "customer"
      ? "Toll and parking are excluded because the customer pays them separately. Customer must arrange driver accommodation and provide 3 meals per day."
      : "Actual toll and parking amounts entered above are included in the estimate. Customer must arrange driver accommodation and provide 3 meals per day.";
    document.getElementById("fare-result").style.display = "block";
  });
});
