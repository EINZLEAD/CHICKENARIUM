// Global variable
let historyData = [];

document.addEventListener("DOMContentLoaded", function() {
    loadHistory();
    setInterval(loadHistory, 5000); 

    // Excel Download Event
    document.getElementById("downloadBtn").addEventListener("click", downloadExcel);
});

function loadHistory() {
    const tableBody = document.getElementById("recordsBody");
    
    fetch("api/get_history.php?t=" + new Date().getTime()) 
        .then(response => response.json())
        .then(data => {
            historyData = data; // Save for export
            tableBody.innerHTML = ""; 

            if (!data || data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No records found.</td></tr>`;
                return;
            }

            data.forEach(item => {
                let finalTime = item.display_date || "Time Error";
                let status = item.health_status || "Unknown";
                
                // Colors
                let statusClass = "status-healthy";
                let rowBg = "";
                if(status === "Critical" || status === "Problem Detected") {
                    statusClass = "status-critical";
                    rowBg = "rgba(255, 0, 0, 0.05)";
                } else if(status === "Warning") {
                    statusClass = "status-warning";
                }

                const row = `
                    <tr style="background:${rowBg}">
                        <td style="font-weight:bold; color:#555;">${finalTime}</td>
                        <td class="${statusClass}">${status}</td>
                        <td>${item.symptoms || '-'}</td>
                        <td>${item.remarks || '-'} ${item.zone ? `(Zone ${item.zone})` : ''}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        })
        .catch(err => console.error(err));
}

// --- EXCEL GENERATOR FUNCTION ---
function downloadExcel() {
    if (historyData.length === 0) {
        alert("No data to export!");
        return;
    }

    // 1. I-format ang data para malinis sa Excel
    // Gumagawa tayo ng bagong listahan na malinis ang headers
    const formattedData = historyData.map(item => ({
        "Date & Time": item.display_date || "",
        "Health Status": item.health_status || "",
        "Symptoms": item.symptoms || "",
        "Remarks": item.remarks || "",
        "Zone": item.zone || ""
    }));

    // 2. Gumawa ng Worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // 3. SET COLUMN WIDTHS (ETO YUNG GUSTO MO)
    // wch = "width characters" (bilang ng characters na kasya)
    const columnWidths = [
        { wch: 25 }, // Lapad ng Date & Time (Mga 25 letters kasya)
        { wch: 15 }, // Lapad ng Status
        { wch: 25 }, // Lapad ng Symptoms
        { wch: 40 }, // Lapad ng Remarks (Pinakamahaba)
        { wch: 10 }  // Lapad ng Zone
    ];
    worksheet['!cols'] = columnWidths;

    // 4. Create Workbook and Append
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Farm_History");

    // 5. Generate File Name with Date
    let today = new Date();
    let dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
    let fileName = `Chickenarium_Report_${dateStr}.xlsx`;

    // 6. Download
    XLSX.writeFile(workbook, fileName);
}