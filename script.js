// ==========================================
// TACBO FINANCE & FARM
// ==========================================

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

// ==========================================
// XOGTA KAYDINTA
// ==========================================

let data = JSON.parse(
    localStorage.getItem("tacboTransactions") || "[]"
);

// ==========================================
// DATE - QAABKA: 15/08/2026
// ==========================================

function getDate() {
    return new Date().toLocaleDateString("en-GB");
}

// ==========================================
// LACAGTA
// ==========================================

function money(value) {
    return "$" + Number(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// ==========================================
// SAVE
// ==========================================

function saveData() {
    localStorage.setItem(
        "tacboTransactions",
        JSON.stringify(data)
    );
}

// ==========================================
// MAGACA XOOLAHA
// ==========================================

function animalName(value) {
    if (value === "lo") return "🐄 Lo";
    if (value === "ari") return "🐑 Ari";
    return value;
}

// ==========================================
// RENDER
// ==========================================

function render() {

    if (!transactions) return;

    transactions.innerHTML = "";

    let totalIncome = 0;
    let totalExpense = 0;
    let totalFarm = 0;
    let totalAnimals = 0;

    data.forEach((item, index) => {

        const value = Number(item.amount || 0);

        if (item.type === "income") {
            totalIncome += value;
        }

        if (item.type === "expense") {
            totalExpense += value;
        }

        if (item.type === "farm") {
            totalFarm += value;

            if (item.quantity) {
                totalAnimals += Number(item.quantity);
            }
        }

        const card = document.createElement("div");

        card.className = "transaction";

        let extra = "";

        if (item.type === "farm") {

            extra = `
                <div class="farm-info">
                    ${animalName(item.farmType)}
                </div>

                <div class="quantity">
                    ${Number(item.quantity).toLocaleString()}
                    neef × ${money(item.price)}
                </div>
            `;
        }

        card.innerHTML = `
            <div class="transaction-content">

                <h3>
                    ${item.icon || "💰"}
                    ${item.description}
                </h3>

                ${extra}

                <p class="date">
                    ${item.date}
                </p>

                <strong>
                    ${money(item.amount)}
                </strong>

            </div>

            <button
                class="delete-btn"
                data-index="${index}"
            >
                🗑️ Tirtir
            </button>
        `;

        transactions.appendChild(card);
    });

    // ==========================================
    // TOTALS
    // ==========================================

    const balance =
        totalIncome - totalExpense - totalFarm;

    if (incomeEl) {
        incomeEl.textContent = money(totalIncome);
    }

    if (expenseEl) {
        expenseEl.textContent = money(totalExpense);
    }

    if (farmEl) {
        farmEl.textContent = money(totalFarm);
    }

    if (balanceEl) {
        balanceEl.textContent = money(balance);
    }

    // ==========================================
    // EMPTY
    // ==========================================

    if (empty) {
        empty.style.display =
            data.length === 0 ? "block" : "none";
    }

    // ==========================================
    // TIRTIR
    // ==========================================

    document.querySelectorAll(".delete-btn").forEach(button => {

        button.addEventListener("click", () => {

            const index = Number(
                button.dataset.index
            );

            const hubi = confirm(
                "Ma hubtaa inaad rabto inaad tirtirto diiwaankan?"
            );

            if (!hubi) return;

            data.splice(index, 1);

            saveData();

            render();
        });
    });
}

// ==========================================
// KU DAR DAKHLIGA / KHARASHKA
// ==========================================

if (form) {

    form.addEventListener("submit", function(e) {

        e.preventDefault();

        const desc = description.value.trim();
        const moneyValue = Number(amount.value);
        const selectedType = type.value;

        if (!desc) {
            alert("Fadlan geli magaca ama faahfaahinta.");
            return;
        }

        if (!moneyValue || moneyValue <= 0) {
            alert("Fadlan geli lacag sax ah.");
            return;
        }

        let icon = "💰";

        if (selectedType === "income") {
            icon = "💰";
        }

        if (selectedType === "expense") {
            icon = "💸";
        }

        data.push({

            id: Date.now(),

            description: desc,

            amount: moneyValue,

            type: selectedType,

            icon: icon,

            date: getDate()

        });

        saveData();

        render();

        form.reset();
    });
}

// ==========================================
// KU DAR BEER / XOOLAHA
// ==========================================

if (addFarm) {

    addFarm.addEventListener("click", function() {

        const selectedAnimal = farmType.value;

        const desc = farmDescription.value.trim();

        const quantity = Number(farmQuantity.value);

        const price = Number(farmPrice.value);

        if (!selectedAnimal) {
            alert("Fadlan dooro Lo ama Ari.");
            return;
        }

        if (!desc) {
            alert("Fadlan geli faahfaahinta.");
            return;
        }

        if (!quantity || quantity <= 0) {
            alert("Fadlan geli tirada.");
            return;
        }

        if (!price || price <= 0) {
            alert("Fadlan geli qiimaha neefkiiba.");
            return;
        }

        const total = quantity * price;

        let icon = "🌾";

        if (selectedAnimal === "lo") {
            icon = "🐄";
        }

        if (selectedAnimal === "ari") {
            icon = "🐑";
        }

        data.push({

            id: Date.now(),

            description: desc,

            type: "farm",

            farmType: selectedAnimal,

            quantity: quantity,

            price: price,

            amount: total,

            icon: icon,

            date: getDate()

        });

        saveData();

        render();

        farmDescription.value = "";

        farmQuantity.value = "";

        farmPrice.value = "";
    });
}

// ==========================================
// TIRTIR DHAMMAAN
// ==========================================

if (clearBtn) {

    clearBtn.addEventListener("click", function() {

        if (data.length === 0) {
            alert("Diwaanku waa madhan yahay.");
            return;
        }

        const hubi = confirm(
            "MA HUBTAA?\n\nDhammaan diiwaanka waa la tirtirayaa."
        );

        if (!hubi) return;

        data = [];

        saveData();

        render();
    });
}

// ==========================================
// BILOW APP-KA
// ==========================================

render();
