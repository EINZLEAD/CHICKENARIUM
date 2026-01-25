document.addEventListener("DOMContentLoaded", () => {

  // Load current settings
  fetch("api/get_settings.php")
    .then(res => res.json())
    .then(data => {
      document.getElementById("farm_name").value = data.farm_name;
      document.getElementById("owner_name").value = data.owner_name;
      document.getElementById("owner_phone").value = data.owner_phone;
      document.getElementById("owner_email").value = data.owner_email;
      document.getElementById("suspected_threshold").value = data.suspected_threshold;
    })
    .catch(err => console.error("Failed to load settings", err));

  // Submit form
  document.getElementById("settingsForm").addEventListener("submit", e => {
    e.preventDefault();

    const payload = {
      farm_name: document.getElementById("farm_name").value,
      owner_name: document.getElementById("owner_name").value,
      owner_phone: document.getElementById("owner_phone").value,
      owner_email: document.getElementById("owner_email").value,
      suspected_threshold: document.getElementById("suspected_threshold").value
    };

    fetch("api/save_settings.php", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload)
    })
    .then(res => res.text())
    .then(msg => {
      const statusEl = document.getElementById("msg");
      statusEl.textContent = msg;
      statusEl.classList.remove("error");
    })
    .catch(err => {
      const statusEl = document.getElementById("msg");
      statusEl.textContent = "Failed to save settings";
      statusEl.classList.add("error");
      console.error(err);
    });
  });

});
