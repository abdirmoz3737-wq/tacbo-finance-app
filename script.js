// ============================================
// 🌾 TACBO FINANCE & FARM
// Maamulka Dakhliga, Kharashaadka iyo Beeraha
// ============================================

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


// ============================================
// 📦 XOGTA KAYDINTA
// ============================================

let data = JSON.parse(
    localStorage.getItem("tacboTransactions") || "[]"
);


// ============================================
// 📅 TAARIIKHDA
// DD/MM/YYYY
// ============================================

function getDate() {
    const today = new Date();

    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    return `${day}/${month}/${year}`;
}


// ============================================
// 💰 LACAGTA
// ============================================

function money(value) {
    return "$" + Number(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


// ============================================
// 💾 SAVE DATA
// ============================================

function saveData() {
    localStorage.setItem(
        "tacboTransactions",
        JSON.stringify(data)
    );
}


// ============================================
// 🔢 XISAABINTA
// ============================================

function calculateTotals() {

    let income = 0;
    let expense = 0;
    let farm = 0;

    data.forEach(item => {

        if (item.category === "income") {
            income += Number(item.amount);
        }

        if (item.category === "expense") {
            expense += Number(item.amount);
        }

        if (item.category === "farm") {
            farm += Number(item.amount);
        }

    });

    const balance = income - expense - farm;

    if (incomeEl) {
        incomeEl.textContent = money(income);
    }

    if (expenseEl) {
        expenseEl.textContent = money(expense);
    }

    if (farmEl) {
        farmEl.textContent = money(farm);
    }

    if (balanceEl) {
        balanceEl.textContent = money(balance);
    }
}


// ============================================
// 🎨 ICON
// ============================================

function getIcon(category, farmTypeValue) {

    if (category === "income") {
        return "💰";
    }

    if (category === "expense") {
        return "💸";
    }

    if (farmTypeValue === "Lo") {
        return "🐄";
    }

    if (farmTypeValue === "Ari") {
        return "🐑";
    }

    if (farmTypeValue === "Beer") {
        return "🌾";
    }

    return "🌱";
}


// ============================================
// 📋 RENDER DIWAANKA
// ============================================

function render() {

    if (!transactions) {
        calculateTotals();
        return;
    }

    transactions.innerHTML = "";

    if (data.length === 0) {

        if (empty) {
            empty.style.display = "block";
        }

        calculateTotals();
        return;
    }

    if (empty) {
        empty.style.display = "none";
    }


    data.forEach((item, index) => {

        const card = document.createElement("div");

        card.className = "transaction-card";

        const icon = getIcon(
            item.category,
            item.farmType
        );

        let title = item.description || "Diiwaan";

        let extra = "";

        if (item.category === "farm") {

            extra = `
                <div class="farm-details">
                    ${item.quantity || 0} neef × ${money(item.price || 0)}
                </div>
            `;

            title = item.farmType || "Beer";
        }

        card.innerHTML = `

            <div class="transaction-header">

                <h3>
                    ${icon} ${title}
                </h3>

                <button
                    class="delete-one"
                    data-index="${index}">
                    🗑️ Tirtir
                </button>

            </div>

            ${extra}

            <div class="transaction-date">
                ${item.date || getDate()}
            </div>

            <div class="transaction-amount">
                ${money(item.amount)}
            </div>

            <button
                class="delete-one"
                data-index="${index}">
                🗑️ Tirtir
            </button>

        `;

        transactions.appendChild(card);

    });


    // Delete buttons
    document.querySelectorAll(".delete-one")
        .forEach(button => {

            button.addEventListener("click", function () {

                const index = Number(
                    this.dataset.index
                );

                data.splice(index, 1);

                saveData();
                render();

            });

        });


    calculateTotals();
}


// ============================================
// 💰 DAKHLIGA & KHARASHKA
// ============================================

if (form) {

    form.addEventListener("submit", function(event) {

        event.preventDefault();

        const desc = description.value.trim();
        const value = Number(amount.value);
        const selectedType = type.value;


        if (!desc) {
            alert("Fadlan geli magaca.");
            return;
        }

        if (!value || value <= 0) {
            alert("Fadlan geli lacag sax ah.");
            return;
        }


        let category = "expense";

        if (
            selectedType === "income" ||
            selectedType === "Dakhliga"
        ) {
            category = "income";
        }


        data.push({

            id: Date.now(),

            description: desc,

            amount: value,

            category: category,

            icon: category === "income"
                ? "💰"
                : "💸",

            date: getDate()

        });


        saveData();

        render();

        form.reset();

    });

}


// ============================================
// 🌾 BEER & XOOLAHA
// ============================================

if (addFarm) {

    addFarm.addEventListener("click", function() {

        const selectedFarm =
            farmType.value;

        const desc =
            farmDescription.value.trim();

        const quantity =
            Number(farmQuantity.value);

        const price =
            Number(farmPrice.value);


        if (!selectedFarm) {

            alert("Fadlan dooro nooca.");

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

            alert("Fadlan geli qiimaha.");

            return;
        }


        const total =
            quantity * price;


        data.push({

            id: Date.now(),

            description: desc,

            amount: total,

            category: "farm",

            farmType: selectedFarm,

            quantity: quantity,

            price: price,

            icon: getIcon(
                "farm",
                selectedFarm
            ),

            date: getDate()

        });


        saveData();

        render();


        farmDescription.value = "";
        farmQuantity.value = "";
        farmPrice.value = "";

    });

}


// ============================================
// 🗑️ TIRTIR DHAMMAAN
// ============================================

if (clearBtn) {

    clearBtn.addEventListener("click", function() {

        if (data.length === 0) {

            alert(
                "Diwaanku waa madhan yahay."
            );

            return;
        }


        const hubi = confirm(
            "MA HUBTAA?\n\n" +
            "Dhammaan diiwaanka waa la tirtirayaa."
        );


        if (!hubi) {
            return;
        }


        data = [];

        saveData();

        render();

    });

}


// ============================================
// 🔄 SOO CELI XOGTA
// ============================================

render();


// ============================================
// 📱 DATE FIX
// Xogtii hore ee 8/15/2026
// ============================================

function fixOldDates() {

    let changed = false;

    data.forEach(item => {

        if (!item.date) {

            item.date = getDate();

            changed = true;

            return;
        }


        // 8/15/2026
        const match =
            item.date.match(
                /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
            );


        if (match) {

            const month = match[1];
            const day = match[2];
            const year = match[3];


            if (Number(month) <= 12 &&
                Number(day) <= 31) {

                item.date =
                    String(day).padStart(2, "0")
                    + "/" +
                    String(month).padStart(2, "0")
                    + "/" +
                    year;

                changed = true;
            }

        }

    });


    if (changed) {

        saveData();

        render();

    }

}


// Run date correction
fixOldDates();


// ============================================
// 🌾 TACBO FINANCE & FARM
// ============================================
