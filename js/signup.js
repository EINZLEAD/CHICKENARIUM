document.getElementById("signupForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm_password").value;
    const note = document.getElementById("note");

    // Simple validation
    if(password !== confirm) {
        note.innerText = "❌ Passwords do not match!";
        note.style.color = "red";
        return;
    }

    if(password.length < 6) {
        note.innerText = "❌ Password must be at least 6 characters.";
        note.style.color = "red";
        return;
    }

    const payload = {
        fullname: fullname,
        email: email,
        username: username,
        password: password
    };

    fetch("api/signup.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            note.innerText = "✅ Account created! Redirecting...";
            note.style.color = "green";
            setTimeout(() => {
                window.location.href = "login.html"; // Redirect sa login
            }, 2000);
        } else {
            note.innerText = "❌ " + (data.error || "Signup failed");
            note.style.color = "red";
        }
    })
    .catch(err => {
        console.error(err);
        note.innerText = "❌ Connection Error";
        note.style.color = "red";
    });
});