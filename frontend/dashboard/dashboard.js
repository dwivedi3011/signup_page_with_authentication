const API = "https://signup-page-with-authentication.onrender.com/api";

const token = localStorage.getItem("token");

// 🔒 Protect route
if (!token) {
  window.location.href = "/login.html";
}

// Decode token safely
let userId;
try {
  const payload = JSON.parse(atob(token.split(".")[1]));
  userId = payload.id;
} catch {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}

const list = document.getElementById("list");
const form = document.getElementById("expenseForm");

const amount = document.getElementById("amount");
const type = document.getElementById("type");
const category = document.getElementById("category");

// ➕ Add transaction
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  await fetch(`${API}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      userId,
      amount: amount.value,
      type: type.value,
      category: category.value
    })
  });

  form.reset();
  loadData();
});

// 📥 Load transactions
async function loadData() {
  const res = await fetch(`${API}/transactions/${userId}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await res.json();

  list.innerHTML = "";

  let income = 0;
  let expense = 0;

  data.forEach(t => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${t.category} ₹${t.amount} (${t.type})
      <button onclick="deleteTx('${t._id}')">❌</button>
    `;

    list.appendChild(li);

    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  document.getElementById("income").innerText = income;
  document.getElementById("expense").innerText = expense;
  document.getElementById("balance").innerText = income - expense;
}

// ❌ Delete transaction
async function deleteTx(id) {
  await fetch(`${API}/transactions/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  loadData();
}

// 🚪 Logout
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}

// Initial load
loadData();
