document.addEventListener("DOMContentLoaded", () => {

  // Load current settings
  fetch("api/get_settings.php")
    .then(res => res.json())
    .then(data => {
      document.getElementById("farm_name").value = data.farm_name || "";
      document.getElementById("owner_name").value = data.owner_name || "";
      document.getElementById("owner_phone").value = data.owner_phone || "";
      document.getElementById("owner_email").value = data.owner_email || "";
      document.getElementById("suspected_threshold").value = data.suspected_threshold || "";
      document.getElementById("farm_location").value = data.farm_location || "";
      if(document.getElementById("timezone")) document.getElementById("timezone").value = data.timezone || "UTC";
      if(document.getElementById("units")) document.getElementById("units").value = data.units || "metric";
      document.getElementById("notify_sms").checked = !!data.notify_sms;
      document.getElementById("notify_email").checked = !!data.notify_email;
      document.getElementById("notify_push").checked = !!data.notify_push;
      document.getElementById("sampling_interval").value = data.sampling_interval || 60;
      document.getElementById("enable_alerts").checked = !!data.enable_alerts;
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
      suspected_threshold: parseInt(document.getElementById("suspected_threshold").value, 10) || 0,
      farm_location: document.getElementById("farm_location").value,
      timezone: document.getElementById("timezone").value,
      units: document.getElementById("units").value,
      notify_sms: document.getElementById("notify_sms").checked,
      notify_email: document.getElementById("notify_email").checked,
      notify_push: document.getElementById("notify_push").checked,
      sampling_interval: parseInt(document.getElementById("sampling_interval").value, 10) || 60,
      enable_alerts: document.getElementById("enable_alerts").checked
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
