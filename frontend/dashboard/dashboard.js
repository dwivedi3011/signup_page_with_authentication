const API = "https://signup-page-with-authentication.onrender.com/api";

// Get token
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login";
}

// Decode userId
const payload = JSON.parse(atob(token.split(".")[1]));
const userId = payload.id;

const list = document.getElementById("list");
const form = document.getElementById("expenseForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  await fetch(`${API}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      amount: amount.value,
      type: type.value,
      category: category.value
    })
  });

  loadData();
});

async function loadData() {
  const res = await fetch(`${API}/transactions/${userId}`);
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

async function deleteTx(id) {
  await fetch(`${API}/transactions/${id}`, {
    method: "DELETE"
  });
  loadData();
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

loadData();