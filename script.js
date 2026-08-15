const form = document.getElementById("transactionForm");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const type = document.getElementById("type");

const transactions = document.getElementById("transactions");
const empty = document.getElementById("empty");

const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const farmEl = document.getElementById("farm");
const balanceEl = document.getElementById("balance");

const farmType = document.getElementById("farmType");
const farmDescription = document.getElementById("farmDescription");
const farmQuantity = document.getElementById("farmQuantity");
const farmPrice = document.getElementById("farmPrice");
const addFarm = document.getElementById("addFarm");

const clearBtn = document.getElementById("clearBtn");

let data = JSON.parse(
  localStorage.getItem("tacboTransactions") || "[]"
);


// ===============================
// MUUQAALKA APP-KA
// ===============================

function render() {

  transactions.innerHTML = "";

  let totalIncome = 0;
  let totalExpense = 0;
  let totalFarm = 0;

  data.forEach((item, index) => {

    const money = Number(item.amount);

    if (item.type === "income") {
      totalIncome += money;
    }

    if (item.type === "expense") {
      totalExpense += money;
    }

    if (item.type === "farm") {
      totalFarm += money;
    }

    const row = document.createElement("div");

    row.className = "transaction";

    row.innerHTML = `
      <div>
        <strong>${item.description}</strong>
        <br>
        <span>${item.category || ""}</span>
        <br>
        <small>${item.date || ""}</small>
      </div>

      <div>
        <strong>$${money.toFixed(2)}</strong>
        <br>
        <button onclick="removeTransaction(${index})">
          🗑️ Tirtir
        </button>
      </div>
    `;

    transactions.appendChild(row);
  });


  // Lacagaha guud

  incomeEl.textContent =
    "$" + totalIncome.toFixed(2);

  expenseEl.textContent =
    "$" + totalExpense.toFixed(2);

  farmEl.textContent =
    "$" + totalFarm.toFixed(2);

  const balance =
    totalIncome - totalExpense - totalFarm;

  balanceEl.textContent =
    "$" + balance.toFixed(2);


  if (data.length === 0) {
    empty.style.display = "block";
  } else {
    empty.style.display = "none";
  }

}


// ===============================
// KU DAR DAKHLI / KHARASH / BEER
// ===============================

form.addEventListener("submit", function(e) {

  e.preventDefault();

  const desc = description.value.trim();
  const money = Number(amount.value);
  const selectedType = type.value;

  if (!desc || money <= 0) {

    alert("Fadlan geli xog sax ah.");

    return;
  }


  data.push({

    description: desc,

    amount: money,

    type: selectedType,

    category:
      selectedType === "income"
        ? "💰 Dakhliga"
        : selectedType === "expense"
        ? "💸 Kharashka"
        : "🌾 Beeraha",

    date:
      new Date().toLocaleDateString("so-SO")

  });


  saveData();

  form.reset();

  render();

});


// ===============================
// KU DAR BEER / XOOLO
// ===============================

addFarm.addEventListener("click", function() {

  const desc =
    farmDescription.value.trim();

  const quantity =
    Number(farmQuantity.value);

  const price =
    Number(farmPrice.value);


  if (!desc || quantity <= 0 || price <= 0) {

    alert("Fadlan buuxi xogta Beeraha/Xoolaha.");

    return;
  }


  let name = "🌾 Beer";

  if (farmType.value === "cow") {
    name = "🐄 Lo";
  }

  if (farmType.value === "sheep") {
    name = "🐑 Ari";
  }

  if (farmType.value === "tractor") {
    name = "🚜 Tractor/Qalab";
  }


  const total =
    quantity * price;


  data.push({

    description: desc,

    amount: total,

    type: "farm",

    category: name,

    quantity: quantity,

    unitPrice: price,

    date:
      new Date().toLocaleDateString("so-SO")

  });


  saveData();


  farmDescription.value = "";

  farmQuantity.value = "";

  farmPrice.value = "";


  render();

});


// ===============================
// TIRTIR HAL DIWAAN
// ===============================

function removeTransaction(index) {

  if (
    !confirm("Ma hubtaa inaad tirtirayso diiwaankan?")
  ) {
    return;
  }


  data.splice(index, 1);

  saveData();

  render();

}


// ===============================
// TIRTIR DHAMMAAN
// ===============================

clearBtn.addEventListener("click", function() {

  if (
    !confirm(
      "Ma hubtaa inaad tirtirayso dhammaan diiwaanka?"
    )
  ) {
    return;
  }


  data = [];

  saveData();

  render();

});


// ===============================
// KEYDI XOGTA
// ===============================

function saveData() {

  localStorage.setItem(
    "tacboTransactions",
    JSON.stringify(data)
  );

}


// Bilow app-ka

render();
