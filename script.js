/* =========================================================
   TACBO FINANCE & FARM MANAGEMENT
   Version: 2.0
   Features:
   - Finance income / expense
   - Edit transactions
   - Delete transactions
   - Farm records
   - Edit farm records
   - Delete farm records
   - Automatic totals
   - LocalStorage persistence
   - Mobile friendly
========================================================= */

"use strict";

/* =========================================================
   HELPERS
========================================================= */

const $ = (id) => document.getElementById(id);

function number(value) {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : 0;
}

function money(value) {
    return number(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function today() {
    return new Date().toISOString().split("T")[0];
}

function uid(prefix = "id") {
    return prefix + "_" + Date.now() + "_" +
        Math.random().toString(36).substring(2, 8);
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* =========================================================
   STORAGE
========================================================= */

const STORAGE = {
    transactions: "tacbo_transactions_v2",
    farms: "tacbo_farms_v2"
};

function loadData(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key));
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Storage error:", error);
        return [];
    }
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

let transactions = loadData(STORAGE.transactions);
let farms = loadData(STORAGE.farms);

let editingTransactionId = null;
let editingFarmId = null;

/* =========================================================
   ELEMENTS
========================================================= */

const form = $("transactionForm");
const description = $("description");
const amount = $("amount");
const type = $("type");

const transactionsEl = $("transactions");
const emptyEl = $("empty");

const incomeEl = $("income");
const expenseEl = $("expense");
const farmEl = $("farm");
const balanceEl = $("balance");

const farmType = $("farmType");
const farmDescription = $("farmDescription");
const farmQuantity = $("farmQuantity");
const farmPrice = $("farmPrice");
const addFarm = $("addFarm");

/* =========================================================
   FINANCE
========================================================= */

function getIncome() {
    return transactions
        .filter(item => item.type === "income")
        .reduce((sum, item) => sum + number(item.amount), 0);
}

function getExpense() {
    return transactions
        .filter(item => item.type === "expense")
        .reduce((sum, item) => sum + number(item.amount), 0);
}

function getFarmValue() {
    return farms.reduce((sum, item) => {
        return sum + (number(item.quantity) * number(item.price));
    }, 0);
}

function updateDashboard() {
    const income = getIncome();
    const expense = getExpense();
    const farmValue = getFarmValue();
    const balance = income - expense;

    if (incomeEl) {
        incomeEl.textContent = "$" + money(income);
    }

    if (expenseEl) {
        expenseEl.textContent = "$" + money(expense);
    }

    if (farmEl) {
        farmEl.textContent = "$" + money(farmValue);
    }

    if (balanceEl) {
        balanceEl.textContent = "$" + money(balance);
    }
}

/* =========================================================
   RENDER TRANSACTIONS
========================================================= */

function renderTransactions() {

    if (!transactionsEl) return;

    if (transactions.length === 0) {
        transactionsEl.innerHTML = "";
        if (emptyEl) emptyEl.style.display = "block";
        return;
    }

    if (emptyEl) emptyEl.style.display = "none";

    const sorted = [...transactions].sort((a, b) => {
        return new Date(b.date || 0) - new Date(a.date || 0);
    });

    transactionsEl.innerHTML = sorted.map(item => {

        const isIncome = item.type === "income";

        return `
            <div class="transaction-item" data-id="${escapeHTML(item.id)}">

                <div class="transaction-info">

                    <div class="transaction-title">
                        ${escapeHTML(item.description)}
                    </div>

                    <div class="transaction-date">
                        ${escapeHTML(item.date || "")}
                    </div>

                    <div class="transaction-type">
                        ${isIncome ? "💰 Income" : "💸 Expense"}
                    </div>

                </div>

                <div class="transaction-amount"
                     style="font-weight:700;
                     color:${isIncome ? "#16803c" : "#c62828"}">
                    ${isIncome ? "+" : "-"}$${money(item.amount)}
                </div>

                <div class="transaction-actions">

                    <button
                        type="button"
                        class="edit-btn"
                        onclick="editTransaction('${escapeHTML(item.id)}')">
                        ✏️ Edit
                    </button>

                    <button
                        type="button"
                        class="delete-btn"
                        onclick="deleteTransaction('${escapeHTML(item.id)}')">
                        🗑️ Delete
                    </button>

                </div>

            </div>
        `;
    }).join("");
}

/* =========================================================
   ADD / EDIT TRANSACTION
========================================================= */

function saveTransaction(event) {

    if (event) event.preventDefault();

    if (!description || !amount || !type) return;

    const desc = description.value.trim();
    const value = number(amount.value);
    const transactionType = type.value;

    if (!desc) {
        alert("Fadlan geli magaca / description-ka.");
        description.focus();
        return;
    }

    if (value <= 0) {
        alert("Fadlan geli lacag ka weyn 0.");
        amount.focus();
        return;
    }

    if (!transactionType) {
        alert("Fadlan dooro Income ama Expense.");
        return;
    }

    if (editingTransactionId) {

        const index = transactions.findIndex(
            item => item.id === editingTransactionId
        );

        if (index !== -1) {
            transactions[index].description = desc;
            transactions[index].amount = value;
            transactions[index].type = transactionType;
            transactions[index].updatedAt = new Date().toISOString();
        }

        editingTransactionId = null;

        const submitButton = form?.querySelector(
            'button[type="submit"], button'
        );

        if (submitButton) {
            submitButton.textContent = "Add Transaction";
        }

    } else {

        transactions.push({
            id: uid("transaction"),
            description: desc,
            amount: value,
            type: transactionType,
            date: today(),
            createdAt: new Date().toISOString()
        });
    }

    saveData(STORAGE.transactions, transactions);

    if (form) form.reset();

    renderTransactions();
    updateDashboard();
}

function editTransaction(id) {

    const item = transactions.find(transaction => {
        return transaction.id === id;
    });

    if (!item) {
        alert("Transaction-ka lama helin.");
        return;
    }

    if (description) description.value = item.description;
    if (amount) amount.value = item.amount;
    if (type) type.value = item.type;

    editingTransactionId = id;

    const submitButton = form?.querySelector(
        'button[type="submit"], button'
    );

    if (submitButton) {
        submitButton.textContent = "Update Transaction";
    }

    form?.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

function deleteTransaction(id) {

    const item = transactions.find(
        transaction => transaction.id === id
    );

    if (!item) return;

    const confirmed = confirm(
        `Ma hubtaa inaad tirtirayso "${item.description}"?`
    );

    if (!confirmed) return;

    transactions = transactions.filter(
        transaction => transaction.id !== id
    );

    saveData(STORAGE.transactions, transactions);

    if (editingTransactionId === id) {
        editingTransactionId = null;
        form?.reset();
    }

    renderTransactions();
    updateDashboard();
}

/* =========================================================
   FARM
========================================================= */

function saveFarmRecord(event) {

    if (event) event.preventDefault();

    if (!farmType || !farmDescription ||
        !farmQuantity || !farmPrice) {
        return;
    }

    const category = farmType.value.trim();
    const desc = farmDescription.value.trim();
    const quantity = number(farmQuantity.value);
    const price = number(farmPrice.value);

    if (!category) {
        alert("Fadlan dooro nooca beerta.");
        farmType.focus();
        return;
    }

    if (!desc) {
        alert("Fadlan geli magaca / description-ka.");
        farmDescription.focus();
        return;
    }

    if (quantity <= 0) {
        alert("Quantity waa inuu ka weyn yahay 0.");
        farmQuantity.focus();
        return;
    }

    if (price < 0) {
        alert("Price ma noqon karo negative.");
        farmPrice.focus();
        return;
    }

    if (editingFarmId) {

        const index = farms.findIndex(
            item => item.id === editingFarmId
        );

        if (index !== -1) {

            farms[index].type = category;
            farms[index].description = desc;
            farms[index].quantity = quantity;
            farms[index].price = price;
            farms[index].date = farms[index].date || today();
            farms[index].updatedAt = new Date().toISOString();
        }

        editingFarmId = null;

        if (addFarm) {
            addFarm.textContent = "Add Farm";
        }

    } else {

        farms.push({
            id: uid("farm"),
            type: category,
            description: desc,
            quantity: quantity,
            price: price,
            date: today(),
            createdAt: new Date().toISOString()
        });
    }

    saveData(STORAGE.farms, farms);

    clearFarmForm();
    renderFarms();
    updateDashboard();
}

function clearFarmForm() {

    if (farmType) farmType.value = "";
    if (farmDescription) farmDescription.value = "";
    if (farmQuantity) farmQuantity.value = "";
    if (farmPrice) farmPrice.value = "";

    editingFarmId = null;

    if (addFarm) {
        addFarm.textContent = "Add Farm";
    }
}

/* =========================================================
   RENDER FARM
========================================================= */

function renderFarms() {

    const containers = [
        $("farms"),
        $("farmList"),
        $("farmItems"),
        $("farmTable")
    ].filter(Boolean);

    if (containers.length === 0) return;

    const html = farms.length === 0
        ? `
            <div class="empty-farm">
                🌾 Weli xog beereed laguma darin.
            </div>
          `
        : farms.map(item => {

            const total =
                number(item.quantity) * number(item.price);

            return `
                <div class="farm-item"
                     data-id="${escapeHTML(item.id)}">

                    <div class="farm-info">

                        <strong>
                            🌾 ${escapeHTML(item.description)}
                        </strong>

                        <div>
                            Nooc:
                            ${escapeHTML(item.type)}
                        </div>

                        <div>
                            Quantity:
                            ${money(item.quantity)}
                        </div>

                        <div>
                            Price:
                            $${money(item.price)}
                        </div>

                        <div>
                            Taariikh:
                            ${escapeHTML(item.date || "")}
                        </div>

                    </div>

                    <div class="farm-total">
                        <strong>
                            $${money(total)}
                        </strong>
                    </div>

                    <div class="farm-actions">

                        <button
                            type="button"
                            class="edit-btn"
                            onclick="editFarm('${escapeHTML(item.id)}')">
                            ✏️ Edit
                        </button>

                        <button
                            type="button"
                            class="delete-btn"
                            onclick="deleteFarm('${escapeHTML(item.id)}')">
                            🗑️ Delete
                        </button>

                    </div>

                </div>
            `;
        }).join("");

    containers.forEach(container => {
        container.innerHTML = html;
    });
}

/* =========================================================
   EDIT FARM
========================================================= */

function editFarm(id) {

    const item = farms.find(farm => farm.id === id);

    if (!item) {
        alert("Farm record-ka lama helin.");
        return;
    }

    if (farmType) farmType.value = item.type || "";
    if (farmDescription) {
        farmDescription.value = item.description || "";
    }
    if (farmQuantity) {
        farmQuantity.value = item.quantity ?? "";
    }
    if (farmPrice) {
        farmPrice.value = item.price ?? "";
    }

    editingFarmId = id;

    if (addFarm) {
        addFarm.textContent = "Update Farm";
    }

    const target =
        farmDescription ||
        farmType ||
        addFarm;

    target?.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

/* =========================================================
   DELETE FARM
========================================================= */

function deleteFarm(id) {

    const item = farms.find(farm => farm.id === id);

    if (!item) return;

    const confirmed = confirm(
        `Ma hubtaa inaad tirtirayso "${item.description}"?`
    );

    if (!confirmed) return;

    farms = farms.filter(
        farm => farm.id !== id
    );

    saveData(STORAGE.farms, farms);

    if (editingFarmId === id) {
        clearFarmForm();
    }

    renderFarms();
    updateDashboard();
}

/* =========================================================
   MAKE FUNCTIONS AVAILABLE TO HTML
========================================================= */

window.editTransaction = editTransaction;
window.deleteTransaction = deleteTransaction;
window.editFarm = editFarm;
window.deleteFarm = deleteFarm;

/* =========================================================
   FORM EVENTS
========================================================= */

if (form) {
    form.addEventListener("submit", saveTransaction);
}

if (addFarm) {

    addFarm.addEventListener("click", function(event) {

        /*
         If the button is inside a form, prevent the
         browser from submitting the finance form.
        */

        if (event) {
            event.preventDefault();
        }

        saveFarmRecord(event);
    });
}

/* =========================================================
   OPTIONAL FARM FORM SUPPORT
========================================================= */

const farmForm =
    $("farmForm") ||
    $("farm-form") ||
    $("farmFormElement");

if (farmForm) {

    farmForm.addEventListener("submit", function(event) {
        event.preventDefault();
        saveFarmRecord(event);
    });
}

/* =========================================================
   CANCEL EDIT BUTTONS
========================================================= */

document.addEventListener("click", function(event) {

    const button = event.target.closest(
        "[data-cancel-transaction], .cancel-transaction"
    );

    if (button) {

        editingTransactionId = null;

        if (form) {
            form.reset();
        }

        const submitButton = form?.querySelector(
            'button[type="submit"], button'
        );

        if (submitButton) {
            submitButton.textContent = "Add Transaction";
        }
    }

    const farmCancel = event.target.closest(
        "[data-cancel-farm], .cancel-farm"
    );

    if (farmCancel) {
        clearFarmForm();
    }
});

/* =========================================================
   KEYBOARD SUPPORT
========================================================= */

document.addEventListener("keydown", function(event) {

    /*
       ESC = cancel current editing
    */

    if (event.key === "Escape") {

        if (editingTransactionId) {

            editingTransactionId = null;

            if (form) {
                form.reset();
            }

            const button = form?.querySelector(
                'button[type="submit"], button'
            );

            if (button) {
                button.textContent = "Add Transaction";
            }
        }

        if (editingFarmId) {
            clearFarmForm();
        }
    }
});

/* =========================================================
   STORAGE EVENT
   Keeps multiple browser tabs synchronized.
========================================================= */

window.addEventListener("storage", function(event) {

    if (event.key === STORAGE.transactions) {
        transactions = loadData(STORAGE.transactions);
        renderTransactions();
        updateDashboard();
    }

    if (event.key === STORAGE.farms) {
        farms = loadData(STORAGE.farms);
        renderFarms();
        updateDashboard();
    }
});

/* =========================================================
   GLOBAL REFRESH FUNCTION
========================================================= */

window.refreshTACBO = function() {

    transactions = loadData(STORAGE.transactions);
    farms = loadData(STORAGE.farms);

    renderTransactions();
    renderFarms();
    updateDashboard();
};

/* =========================================================
   EXPORT DATA
========================================================= */

window.exportTACBOData = function() {

    const data = {
        transactions,
        farms,
        exportedAt: new Date().toISOString()
    };

    const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download =
        "TACBO-Finance-Farm-Backup-" +
        today() +
        ".json";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
};

/* =========================================================
   IMPORT DATA
========================================================= */

window.importTACBOData = function(file) {

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(event) {

        try {

            const data = JSON.parse(
                event.target.result
            );

            if (!Array.isArray(data.transactions) ||
                !Array.isArray(data.farms)) {

                alert("Backup file-ku ma saxna.");
                return;
            }

            const confirmed = confirm(
                "Import-ku wuxuu beddeli doonaa xogta hadda jirta. " +
                "Ma rabtaa inaad sii waddo?"
            );

            if (!confirmed) return;

            transactions = data.transactions;
            farms = data.farms;

            saveData(
                STORAGE.transactions,
                transactions
            );

            saveData(
                STORAGE.farms,
                farms
            );

            refreshTACBO();

            alert("Xogta si guul leh ayaa loo soo celiyay.");

        } catch (error) {

            console.error(error);

            alert(
                "Backup file-ka lama akhrin karin."
            );
        }
    };

    reader.readAsText(file);
};

/* =========================================================
   CLEAR ALL DATA
========================================================= */

window.clearTACBOData = function() {

    const confirmed = confirm(
        "DIGNIIN: Tani waxay tirtiraysaa dhammaan " +
        "Finance iyo Farm data. Ma hubtaa?"
    );

    if (!confirmed) return;

    localStorage.removeItem(STORAGE.transactions);
    localStorage.removeItem(STORAGE.farms);

    transactions = [];
    farms = [];

    editingTransactionId = null;
    editingFarmId = null;

    form?.reset();
    clearFarmForm();

    renderTransactions();
    renderFarms();
    updateDashboard();
};

/* =========================================================
   INITIALIZE
========================================================= */

function initializeTACBO() {

    /*
       Set default date where a date input exists.
    */

    const dateInputs = document.querySelectorAll(
        'input[type="date"]'
    );

    dateInputs.forEach(input => {

        if (!input.value) {
            input.value = today();
        }
    });

    renderTransactions();
    renderFarms();
    updateDashboard();

    console.log(
        "✅ TACBO Finance & Farm App initialized"
    );

    console.log(
        "Transactions:",
        transactions.length
    );

    console.log(
        "Farm records:",
        farms.length
    );
}

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeTACBO
    );

} else {

    initializeTACBO();
}
