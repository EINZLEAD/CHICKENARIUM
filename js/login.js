document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const note = document.getElementById("note");
    const btn = document.querySelector(".btn");

    // Loading effect
    btn.disabled = true;
    btn.innerText = "Checking...";
    note.innerText = "";

    fetch("api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, password: password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            note.innerText = "✅ Login Success! Redirecting...";
            note.style.color = "green";
            
            // 👇 DITO ANG REDIRECT PAPUNTANG FPAGE.HTML 👇
            setTimeout(() => {
                window.location.href = "Fpage.html";
            }, 1000); 
            
        } else {
            note.innerText = "❌ " + (data.error || "Invalid Username or Password");
            note.style.color = "red";
            btn.disabled = false;
            btn.innerText = "Log in";
        }
    })
    .catch(err => {
        console.error(err);
        note.innerText = "❌ Server Error";
        note.style.color = "red";
        btn.disabled = false;
        btn.innerText = "Log in";
    });
});

// Toggle Password Eye (Optional pero maganda meron)
document.getElementById("toggleEye").addEventListener("click", function() {
    const pass = document.getElementById("password");
    if(pass.type === "password") {
        pass.type = "text";
        this.innerText = "🙈"; // Icon changes
    } else {
        pass.type = "password";
        this.innerText = "👁️";
    }
});