// js/monitoring.js

document.addEventListener("DOMContentLoaded", function() {
    // 1. Activate Mobile Menu
    const menuBtn = document.getElementById("menuBtn");
    if(menuBtn) {
        menuBtn.addEventListener("click", () => {
            document.getElementById("siteNav").classList.toggle("open");
        });
    }

    // 2. Start Live Monitoring
    updateMonitoring();
    
    // 3. Repeat every 2 seconds
    setInterval(updateMonitoring, 2000);
});

// --- CORE FUNCTIONS ---

function updateMonitoring() {
    // Cache busting (?t=...) para iwas lumang data
    fetch("api/get_monitoring.php?t=" + new Date().getTime())
        .then(res => res.json())
        .then(data => {
            renderTable(data);
            updateGrid(data);
        })
        .catch(err => console.error("Connection Error:", err));
}

function renderTable(data) {
    const body = document.getElementById("monitoringBody");
    body.innerHTML = "";

    if (!data || data.length === 0) {
        body.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#888; padding:20px;">No recent detections.</td></tr>`;
        return;
    }

    data.forEach(e => {
        let statusClass = "text-healthy";
        // Check spelling variations just in case
        let status = e.health_status || "Unknown";

        if (status === "Critical" || status === "Problem Detected") {
            statusClass = "text-critical";
        } else if (status === "Warning") {
            statusClass = "text-warning";
        }

        let timeDisplay = e.short_time || "Just Now";

        body.innerHTML += `
            <tr>
              <td>${timeDisplay}</td>
              <td>${e.zone || '-'}</td>
              <td class="${statusClass}">${status}</td>
              <td>${e.remarks || ''}</td>
            </tr>`;
    });
}

function updateGrid(data) {
    // 1. Reset Grid (Tanggalin muna lahat ng kulay)
    document.querySelectorAll(".zone").forEach(z => {
        z.className = "zone"; // Reset to default class
    });

    if (!data || data.length === 0) {
        updateBanner("Healthy");
        return;
    }

    // 2. Scan Logic (Priority: Critical > Warning)
    let zoneStatusMap = {};
    let globalWorstStatus = 0; // 0=Healthy, 1=Warning, 2=Critical

    data.forEach(item => {
        let severity = 0;
        if (item.health_status === "Warning") severity = 1;
        if (item.health_status === "Critical" || item.health_status === "Problem Detected") severity = 2;

        // Update Global Severity (para sa Banner)
        if (severity > globalWorstStatus) globalWorstStatus = severity;

        // Identify Zones (Handle groups like "A-B-C")
        let zones = [];
        if (item.zone && item.zone.includes("-")) {
            zones = item.zone.split("-");
        } else if (item.zone) {
            zones = [item.zone];
        }

        // Apply Severity to specific Zones
        zones.forEach(zID => {
            // Kung mas malala ang bagong status, yun ang masusunod
            if (!zoneStatusMap[zID] || severity > zoneStatusMap[zID]) {
                zoneStatusMap[zID] = severity;
            }
        });
    });

    // 3. Apply Colors to HTML Elements
    for (const [zoneID, severity] of Object.entries(zoneStatusMap)) {
        const el = document.getElementById(zoneID);
        if (el) {
            if (severity === 2) {
                el.classList.add("active-critical"); // RED BLINKING
            } else if (severity === 1) {
                el.classList.add("active-warning"); // ORANGE STEADY
            }
        }
    }

    // 4. Update Status Banner
    updateBanner(globalWorstStatus);
}

function updateBanner(severityLevel) {
    const farmStatus = document.getElementById("farmStatus");
    
    if (severityLevel === 2) {
        farmStatus.textContent = "🚨 ALARM: CRITICAL ISSUE DETECTED!";
        farmStatus.className = "status-banner critical";
    } else if (severityLevel === 1) {
        farmStatus.textContent = "⚠️ WARNING: Abnormal Sound Detected";
        farmStatus.className = "status-banner warning";
    } else {
        farmStatus.textContent = "✅ Farm Status: Healthy";
        farmStatus.className = "status-banner";
    }
}