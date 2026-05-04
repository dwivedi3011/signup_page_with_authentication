const API = "https://signup-page-with-authentication.onrender.com/api";

// ================= SIGNUP =================
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    await fetch(`${API}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    alert("Signup successful");
    window.location.href = "/login.html";
  });
}

// ================= LOGIN =================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard.html";
    } else {
      alert("Login failed");
    }
  });
}

// ================= DASHBOARD =================
async function loadData() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  // decode userId
  const payload = JSON.parse(atob(token.split(".")[1]));
  const userId = payload.id;

  const res = await fetch(`${API}/transactions/${userId}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await res.json();

  const list = document.getElementById("list");
  if (!list) return;

  list.innerHTML = "";

  let income = 0;
  let expense = 0;

  data.forEach(t => {
    const li = document.createElement("li");
    li.innerText = `${t.category} ₹${t.amount} (${t.type})`;
    list.appendChild(li);

    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  document.getElementById("income").innerText = income;
  document.getElementById("expense").innerText = expense;
  document.getElementById("balance").innerText = income - expense;
}

// ================= ADD =================
async function addTransaction() {
  const token = localStorage.getItem("token");

  const payload = JSON.parse(atob(token.split(".")[1]));
  const userId = payload.id;

  const amount = document.getElementById("amount").value;
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;

  await fetch(`${API}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ userId, amount, type, category })
  });

  loadData();
}

window.onload = loadData;
