const API = "https://signup-page-with-authentication.onrender.com/api/auth";

// ================= SIGNUP =================
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 🔐 basic validation
    if (password.value.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.value,
          email: email.value,
          password: password.value
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful ✅");

        // 🔁 redirect to login
        window.location.href = "/login";
      } else {
        alert(data.message || "Signup failed ❌");
      }

    } catch (err) {
      alert("Server error ❌");
      console.error(err);
    }
  });
}


// ================= LOGIN =================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail.value,
          password: loginPassword.value
        })
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);

        alert("Login successful ✅");

        // 🔁 redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        alert(data.message || "Invalid credentials ❌");
      }

    } catch (err) {
      alert("Server error ❌");
      console.error(err);
    }
  });
}