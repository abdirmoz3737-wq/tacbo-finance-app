const form = document.getElementById("transactionForm");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const transactions = document.getElementById("transactions");
const empty = document.getElementById("empty");

let data = JSON.parse(localStorage.getItem("tacboTransactions") || "[]");

function render() {
  transactions.innerHTML = "";

  if (data.length === 0) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";

  data.forEach((item, index) => {
    const row = document.createElement("div");

    row.innerHTML = `
      <strong>${item.description}</strong>
      - ${item.amount} $
      - ${item.type === "income" ? "Dakhliga" : "Kharashka"}
      <button onclick="removeTransaction(${index})">Tirtir</button>
    `;

    transactions.appendChild(row);
  });
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

  localStorage.setItem("tacboTransactions", JSON.stringify(data));

  form.reset();
  render();
});

function removeTransaction(index) {
  data.splice(index, 1);
  localStorage.setItem("tacboTransactions", JSON.stringify(data));
  render();
}

render();
