const form = document.getElementById("transactionForm");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const transactions = document.getElementById("transactions");
const empty = document.getElementById("empty");

const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");


// ===============================
// XOGTA LA KAYDIYO
// ===============================

let data = JSON.parse(
  localStorage.getItem("tacboTransactions") || "[]"
);


// ===============================
// KU DAR XOGTA XOOLAHA
// ===============================

const extraFields = document.createElement("div");

extraFields.innerHTML = `
  <label style="display:block;margin-top:15px;font-weight:bold;">
    Nooca macaamilka
  </label>

  <select id="transactionKind"
    style="width:100%;padding:12px;margin-top:6px;border-radius:10px;border:1px solid #ccc;">
    
    <option value="general">Macaamil guud</option>
    <option value="buyAnimal">Iibsi xoolo</option>
    <option value="sellAnimal">Iib xoolo</option>

  </select>


  <label style="display:block;margin-top:15px;font-weight:bold;">
    Xoolaha
  </label>

  <select id="animalType"
    style="width:100%;padding:12px;margin-top:6px;border-radius:10px;border:1px solid #ccc;">
    
    <option value="">Xoolo ma aha</option>
    <option value="ari">🐑 Ari</option>
    <option value="lo">🐄 Lo'</option>

  </select>


  <label style="display:block;margin-top:15px;font-weight:bold;">
    Tirada xoolaha
  </label>

  <input
    id="animalQty"
    type="number"
    min="0"
    step="1"
    placeholder="Tusaale: 10"
    style="width:100%;padding:12px;margin-top:6px;border-radius:10px;border:1px solid #ccc;"
  >


  <label style="display:block;margin-top:15px;font-weight:bold;">
    Qiimaha neefkiiba ($)
  </label>

  <input
    id="animalPrice"
    type="number"
    min="0"
    step="0.01"
    placeholder="Tusaale: 40"
    style="width:100%;padding:12px;margin-top:6px;border-radius:10px;border:1px solid #ccc;"
  >


  <label style="display:block;margin-top:15px;font-weight:bold;">
    Taariikh
  </label>

  <input
    id="transactionDate"
    type="date"
    style="width:100%;padding:12px;margin-top:6px;border-radius:10px;border:1px solid #ccc;"
  >


  <div id="livestockInfo"
    style="
      margin-top:15px;
      padding:15px;
      background:#f1f8f3;
      border-radius:12px;
      font-weight:bold;
    ">
  </div>
`;

form.insertBefore(extraFields, form.querySelector("button"));


// ===============================
// ELEMENTS
// ===============================

const transactionKind =
  document.getElementById("transactionKind");

const animalType =
  document.getElementById("animalType");

const animalQty =
  document.getElementById("animalQty");

const animalPrice =
  document.getElementById("animalPrice");

const transactionDate =
  document.getElementById("transactionDate");

const livestockInfo =
  document.getElementById("livestockInfo");


// ===============================
// TAARIIKHDA MAANTA
// ===============================

transactionDate.value =
  new Date().toISOString().split("T")[0];


// ===============================
// XOOLAHA XISAABI
// ===============================

function getLivestock() {

  let ari = 0;
  let lo = 0;

  let ariValue = 0;
  let loValue = 0;

  data.forEach(item => {

    if (!item.animal || !item.quantity) return;

    const qty = Number(item.quantity);
    const money = Number(item.amount);

    if (item.animal === "ari") {

      if (item.kind === "buyAnimal") {
        ari += qty;
        ariValue += money;
      }

      if (item.kind === "sellAnimal") {
        ari -= qty;
        ariValue -= money;
      }
    }


    if (item.animal === "lo") {

      if (item.kind === "buyAnimal") {
        lo += qty;
        loValue += money;
      }

      if (item.kind === "sellAnimal") {
        lo -= qty;
        loValue -= money;
      }
    }

  });

  return {
    ari,
    lo,
    ariValue,
    loValue
  };
}


// ===============================
// SOO BANDHIG XOOLAHA
// ===============================

function renderLivestock() {

  const livestock = getLivestock();

  livestockInfo.innerHTML = `
    🐑 Ari: ${livestock.ari} neef
    <br>
    🐄 Lo': ${livestock.lo} neef
    <br>
    💰 Qiimaha xoolaha: 
    $${(livestock.ariValue + livestock.loValue).toFixed(2)}
  `;
}


// ===============================
// RENDER
// ===============================

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

    row.style.padding = "12px";
    row.style.marginBottom = "10px";
    row.style.borderRadius = "10px";
    row.style.background = "#f5f5f5";


    const animalText =
      item.animal === "ari"
        ? `🐑 ${item.quantity} ari`
        : item.animal === "lo"
        ? `🐄 ${item.quantity} lo'`
        : "";


    const kindText =
      item.kind === "buyAnimal"
        ? "🛒 Iibsi xoolo"
        : item.kind === "sellAnimal"
        ? "💰 Iib xoolo"
        : item.type === "income"
        ? "💵 Dakhli"
        : "💸 Kharash";


    row.innerHTML = `
      <strong>${item.description}</strong>

      <br>

      ${animalText}

      <br>

      💵 $${money.toFixed(2)}

      <br>

      ${kindText}

      <br>

      📅 ${item.date || ""}

      <br><br>

      <button
        onclick="removeTransaction(${index})"
        style="
          background:#c0392b;
          color:white;
          border:0;
          padding:8px 14px;
          border-radius:8px;
        ">
        Tirtir
      </button>
    `;


    transactions.appendChild(row);

  });


  incomeEl.textContent =
    "$" + totalIncome.toFixed(2);

  expenseEl.textContent =
    "$" + totalExpense.toFixed(2);

  balanceEl.textContent =
    "$" + (totalIncome - totalExpense).toFixed(2);


  if (data.length === 0) {
    empty.style.display = "block";
  } else {
    empty.style.display = "none";
  }


  renderLivestock();
}


// ===============================
// KU DAR MACAAMIL
// ===============================

form.addEventListener("submit", function(e) {

  e.preventDefault();


  const desc = description.value.trim();

  let money = Number(amount.value);

  const kind = transactionKind.value;

  const animal = animalType.value;

  const quantity = Number(animalQty.value);

  const price = Number(animalPrice.value);

  const date = transactionDate.value;


  // Haddii uu xoolo yahay
  if (
    (kind === "buyAnimal" || kind === "sellAnimal") &&
    animal &&
    quantity > 0 &&
    price > 0
  ) {

    money = quantity * price;

    amount.value = money.toFixed(2);

  }


  if (!desc || money <= 0) {

    alert("Fadlan geli xog sax ah.");

    return;
  }


  let finalType = type.value;


  // Iib xoolo = Dakhli
  if (kind === "sellAnimal") {

    finalType = "income";

  }


  // Iibsi xoolo = Kharash
  if (kind === "buyAnimal") {

    finalType = "expense";

  }


  data.push({

    description: desc,

    amount: money,

    type: finalType,

    kind: kind,

    animal: animal,

    quantity: quantity,

    price: price,

    date: date

  });


  localStorage.setItem(
    "tacboTransactions",
    JSON.stringify(data)
  );


  form.reset();


  transactionDate.value =
    new Date().toISOString().split("T")[0];


  render();

});


// ===============================
// TIRTIR HAL MACAAMIL
// ===============================

function removeTransaction(index) {

  data.splice(index, 1);


  localStorage.setItem(
    "tacboTransactions",
    JSON.stringify(data)
  );


  render();
}


// ===============================
// TIRTIR DHAMMAAN
// ===============================

const clearBtn =
  document.getElementById("clearBtn");


if (clearBtn) {

  clearBtn.addEventListener("click", function() {

    const answer =
      confirm("Ma hubtaa inaad dhammaan diiwaanka tirtirayso?");

    if (!answer) return;


    data = [];


    localStorage.removeItem(
      "tacboTransactions"
    );


    render();

  });

}


// ===============================
// BILOW
// ===============================

render();
