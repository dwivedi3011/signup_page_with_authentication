const AUTH_API = "https://your-backend.onrender.com/api/auth";
const EXPENSE_API = "https://your-backend.onrender.com/api/transactions";

// ================= SIGNUP =================
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${AUTH_API}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    alert("Signup done");
    window.location.href = "/login";
  });
}

// ================= LOGIN =================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const res = await fetch(`${AUTH_API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    localStorage.setItem("token", data.token);
    window.location.href = "/dashboard";
  });
}

// ================= ADD =================
async function addTransaction() {
  const amount = document.querySelector("input").value;
  const type = document.querySelector("select").value;
  const category = document.querySelectorAll("input")[1].value;

  const token = localStorage.getItem("token");

  await fetch(`${EXPENSE_API}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({ amount, type, category })
  });

  loadData();
}

// ================= LOAD =================
async function loadData() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${EXPENSE_API}/summary`, {
    headers: { "Authorization": token }
  });

  const data = await res.json();

  document.getElementById("income").innerText = data.income;
  document.getElementById("expense").innerText = data.expense;
  document.getElementById("balance").innerText = data.balance;
}

window.onload = loadData;