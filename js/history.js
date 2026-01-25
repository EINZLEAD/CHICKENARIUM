document.addEventListener("DOMContentLoaded", () => {
  fetch("api/get_history.php")
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("recordsBody");
      tbody.innerHTML = "";

      if(data.length === 0){
        tbody.innerHTML = "<tr><td colspan='4'>No records found</td></tr>";
        return;
      }

      data.forEach(row => {
        tbody.innerHTML += `
          <tr>
            <td>${row.detected_at}</td>
            <td>${row.health_status}</td>
            <td>${row.symptoms}</td>
            <td>${row.remarks}</td>
          </tr>
        `;
      });
    });
});
