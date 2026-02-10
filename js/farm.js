document.addEventListener("DOMContentLoaded", () => {
    // Generate Random Farm ID (e.g., FARM-2026-X9A2)
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    document.getElementById("farm_id").value = `FARM-${year}-${random}`;
});

document.getElementById("settingsForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const payload = {
    farm_name: document.getElementById("farm_name").value,
    farm_id: document.getElementById("farm_id").value,
    owner_name: document.getElementById("owner_name").value,
    owner_phone: document.getElementById("owner_phone").value,
    owner_email: document.getElementById("owner_email").value,
    farm_location: document.getElementById("farm_location").value,
    farm_type: document.getElementById("farm_type").value,
    number_of_chickens: document.getElementById("number_of_chickens").value,
    units: document.getElementById("units").value,
    notify_sms: document.getElementById("notify_sms").checked ? 1 : 0,
    notify_email: document.getElementById("notify_email").checked ? 1 : 0,
    notify_push: document.getElementById("notify_push").checked ? 1 : 0,
    enable_alerts: document.getElementById("enable_alerts").checked ? 1 : 0
  };

  fetch("api/save_farm.php", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(json => {
    if (json.success) {
        document.getElementById("msg").innerText = "Success! New Farm Created.";
        document.getElementById("msg").style.color = "green";
        setTimeout(() => window.location.href = "settings.html", 1500); // Redirect
    } else {
        document.getElementById("msg").innerText = "Error: " + json.error;
    }
  });
});