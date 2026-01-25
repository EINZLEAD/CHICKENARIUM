function loadMonitoring(){
  fetch("api/get_monitoring.php")
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("monitoringBody");
      tbody.innerHTML = "";

      data.records.forEach(row => {
        tbody.innerHTML += `
          <tr>
            <td>${row.detected_at}</td>
            <td>${row.health_status}</td>
            <td>${row.symptoms}</td>
            <td>${row.remarks}</td>
          </tr>
        `;
      });

      document.getElementById("suspectedCount").textContent = data.suspected;

      const farm = document.getElementById("farmStatus");
      if(data.suspected > 0){
        farm.textContent = "Farm Status: Problem Detected";
        farm.classList.add("problem");
      } else {
        farm.textContent = "Farm Status: Healthy";
        farm.classList.remove("problem");
      }
    });
}

setInterval(loadMonitoring, 15000);
loadMonitoring();
