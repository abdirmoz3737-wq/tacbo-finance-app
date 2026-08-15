const form = document.getElementById("transactionForm");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const transactions = document.getElementById("transactions");
const empty = document.getElementById("empty");

const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");

let data = JSON.parse(localStorage.getItem("tacboTransactions")) || [];

function render() {
  transactions.innerHTML = "";

  let totalIncome = 0;
  let totalExpense = 0;

  data.forEach((item, index) => {
    const money = Number(item.amount);

    if (item.type === "income") {
      totalIncome += money;
    } else {
      totalExpense += money;
    }

    const row = document.createElement("div");

    row.innerHTML = `
      <strong>${item.description}</strong>
      - ${money.toFixed(2)} $
      - ${item.type === "income" ? "Dakhliga" : "Kharashka"}
      <button onclick="removeTransaction(${index})">Tirtir</button>
    `;

    transactions.appendChild(row);
  });

  incomeEl.textContent = "$" + totalIncome.toFixed(2);
  expenseEl.textContent = "$" + totalExpense.toFixed(2);
  balanceEl.textContent = "$" + (totalIncome - totalExpense).toFixed(2);

  empty.style.display = data.length === 0 ? "block" : "none";
}

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const desc = description.value.trim();
  const money = Number(amount.value);

  if (!desc || money <= 0) {
    alert("Fadlan geli xog sax ah.");
    return;
  }

  data.push({
    description: desc,
    amount: money,
    type: type.value
  });

  localStorage.setItem(
    "tacboTransactions",
    JSON.stringify(data)
  );

  form.reset();
  render();
});

function removeTransaction(index) {
  data.splice(index, 1);

  localStorage.setItem(
    "tacboTransactions",
    JSON.stringify(data)
  );

  render();
}

document.getElementById("clearBtn").addEventListener("click", function() {
  if (confirm("Ma hubtaa inaad dhammaan tirtirayso?")) {
    data = [];

    localStorage.setItem(
      "tacboTransactions",
      JSON.stringify(data)
    );

    render();
  }
});

render();
