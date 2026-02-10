document.addEventListener("DOMContentLoaded", function() {
    
    // FETCH DATA
    fetch("api/get_settings.php")
    .then(res => res.json())
    .then(data => {
        if(data.redirect) {
            window.location.href = "login.html";
            return;
        }

        // Set Username
        if(document.getElementById("username")) document.getElementById("username").value = data.username || "";

        if(data.found) {
            console.log("Data Found!", data);
            
            // Populate Fields
            setVal("farm_name", data.farm_name);
            setVal("farm_id", data.farm_id); 
            setVal("farm_type", data.farm_type);
            setVal("number_of_chickens", data.number_of_chickens);
            setVal("farm_location", data.farm_location);
            setVal("owner_name", data.owner_name);
            setVal("owner_email", data.owner_email);
            setVal("owner_phone", data.owner_phone);

            // Kung galing ito sa user_id=0, i-save natin agad para maging user_id=1 na
            if(data.is_orphan) {
                console.log("Fixing orphaned data...");
                document.getElementById("saveBtn").click(); // Auto-save to claim ownership
            }

        } else {
            console.log("No Data. New User.");
            // Dito lang dapat lumabas ang Random ID kung talagang bago
            setVal("farm_id", data.farm_id);
            // I-clear ang "Loading..." text sa ibang fields
            setVal("farm_name", "");
            setVal("farm_address", ""); // Clear text area
        }
    })
    .catch(err => console.error("Error:", err));

    function setVal(id, val) {
        let el = document.getElementById(id);
        if(el) el.value = val || ""; // Kung null, gawing blank
    }

    // --- SAVE BUTTON LOGIC (Yung binigay ko sayo kanina) ---
    const saveBtn = document.getElementById("saveBtn");
    if(saveBtn) {
        saveBtn.addEventListener("click", function(e) {
            // ... (Yung dating code na binigay ko sa previous reply) ...
            // Siguraduhin lang na yung save_settings.php mo ay yung UPDATED version galing sa STEP 3 ng previous reply ko.
             e.preventDefault();
            
            const btn = document.getElementById("saveBtn");
            const msg = document.getElementById("msg"); // Make sure may <p id="msg"></p> ka sa HTML

            btn.innerText = "Saving...";
            
            const payload = {
                farm_name: document.getElementById("farm_name").value,
                farm_id: document.getElementById("farm_id").value,
                farm_type: document.getElementById("farm_type").value,
                number_of_chickens: document.getElementById("number_of_chickens").value,
                farm_location: document.getElementById("farm_location").value,
                owner_name: document.getElementById("owner_name").value,
                owner_email: document.getElementById("owner_email").value,
                owner_phone: document.getElementById("owner_phone").value
            };

            fetch("api/save_settings.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    // Success!
                    btn.innerText = "Save Changes";
                    if(msg) { msg.innerText = "✅ Saved!"; msg.style.color = "green"; }
                    setTimeout(() => location.reload(), 1000); 
                } else {
                    btn.innerText = "Save Changes";
                    if(msg) { msg.innerText = "❌ " + data.error; msg.style.color = "red"; }
                }
            });
        });
    }
});