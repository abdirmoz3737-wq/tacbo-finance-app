// ==========================================
// 🌾 TACBO FINANCE & FARM
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
// 💾 XOGTA
// ==========================================

let data = JSON.parse(
    localStorage.getItem("tacboTransactions") || "[]"
);


// ==========================================
// 📅 TAARIIKHDA
// DD/MM/YYYY
// ==========================================

function getDate() {

    const now = new Date();

    const day =
        String(now.getDate()).padStart(2, "0");

    const month =
        String(now.getMonth() + 1).padStart(2, "0");

    const year =
        now.getFullYear();

    return `${day}/${month}/${year}`;
}


// ==========================================
// 💰 LACAG
// ==========================================

function money(value) {

    return "$" +
        Number(value || 0).toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
}


// ==========================================
// 💾 SAVE
// ==========================================

function saveData() {

    localStorage.setItem(
        "tacboTransactions",
        JSON.stringify(data)
    );
}


// ==========================================
// 📅 SAX TAARIIKHIIYADII HORE
// ==========================================

function fixOldDates() {

    let changed = false;

    data.forEach(item => {

        if (!item.date) {

            item.date = getDate();

            changed = true;

            return;
        }


        const match =
            String(item.date).match(
                /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
            );


        if (!match) return;


        const first =
            Number(match[1]);

        const second =
            Number(match[2]);

        const year =
            match[3];


        // Tusaale:
        // 8/15/2026
        // wuxuu noqonayaa:
        // 15/08/2026

        if (
            first <= 12 &&
            second <= 31
        ) {

            const newDate =
                String(second).padStart(2, "0") +
                "/" +
                String(first).padStart(2, "0") +
                "/" +
                year;


            if (item.date !== newDate) {

                item.date = newDate;

                changed = true;
            }
        }

    });


    if (changed) {

        saveData();
    }
}


// ==========================================
// 📊 XISAABTA DASHBOARD
// ==========================================

function calculateTotals() {

    let income = 0;

    let expense = 0;

    let farm = 0;


    data.forEach(item => {

        const value =
            Number(item.amount || 0);


        // 💰 DAKHLI
        if (item.category === "income") {

            income += value;
        }


        // 💸 KHARASH
        if (item.category === "expense") {

            expense += value;
        }


        // 🌾 BEER / XOOLO
        if (item.category === "farm") {

            farm += value;

            /*
             Xoolaha la iibsaday
             waxay sidoo kale yihiin kharash.
            */

            expense += value;
        }

    });


    const balance =
        income - expense;


    if (incomeEl) {

        incomeEl.textContent =
            money(income);
    }


    if (expenseEl) {

        expenseEl.textContent =
            money(expense);
    }


    if (farmEl) {

        farmEl.textContent =
            money(farm);
    }


    if (balanceEl) {

        balanceEl.textContent =
            money(balance);
    }
}


// ==========================================
// 🎨 ICON XOOLAHA / BEERTA
// ==========================================

function getIcon(item) {

    if (item.category === "income") {

        return "💰";
    }


    if (item.category === "expense") {

        return "💸";
    }


    if (item.farmType === "Ari") {

        return "🐑";
    }


    if (item.farmType === "Lo") {

        return "🐄";
    }


    if (item.farmType === "Beer") {

        return "🌾";
    }


    return "🌱";
}


// ==========================================
// 📋 DIIWAANKA
// ==========================================

function render() {

    if (!transactions) {

        calculateTotals();

        return;
    }


    transactions.innerHTML = "";


    if (data.length === 0) {

        if (empty) {

            empty.style.display =
                "block";
        }

        calculateTotals();

        return;
    }


    if (empty) {

        empty.style.display =
            "none";
    }


    data.forEach((item, index) => {

        const card =
            document.createElement("div");


        card.className =
            "transaction-card";


        const icon =
            getIcon(item);


        let title =
            item.description ||
            "Diiwaan";


        let details = "";


        // ==================================
        // 🐑🐄 XOOLAHA
        // ==================================

        if (
            item.category === "farm" &&
            (
                item.farmType === "Ari" ||
                item.farmType === "Lo"
            )
        ) {

            title =
                item.farmType;


            details = `

                <div style="
                    margin:8px 0;
                    font-size:18px;
                    color:#66736d;
                ">

                    ${Number(
                        item.quantity || 0
                    ).toLocaleString()}

                    neef

                    ×

                    ${money(item.price)}

                </div>

            `;
        }


        // ==================================
        // 🌾 BEER
        // ==================================

        if (
            item.category === "farm" &&
            item.farmType === "Beer"
        ) {

            title = "Beeraha";


            details = `

                <div style="
                    margin:8px 0;
                    font-size:18px;
                    color:#66736d;
                ">

                    🌾 ${item.quantity || 0}
                    hektar

                </div>

            `;
        }


        // ==================================
        // 💰 DAKHLI / KHARASH
        // ==================================

        if (
            item.category === "income" ||
            item.category === "expense"
        ) {

            title =
                item.description;
        }


        card.innerHTML = `

            <div style="
                background:#f7faf8;
                border-left:6px solid #4b9b52;
                border-radius:18px;
                padding:18px;
                margin-bottom:14px;
            ">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:10px;
                ">

                    <h3 style="
                        margin:0;
                        font-size:22px;
                    ">

                        ${icon}
                        ${title}

                    </h3>

                </div>


                ${details}


                <div style="
                    color:#68736e;
                    margin-top:8px;
                ">

                    📅 ${item.date}

                </div>


                <div style="
                    font-size:27px;
                    font-weight:bold;
                    margin-top:10px;
                ">

                    ${money(item.amount)}

                </div>


                <button
                    class="delete-one"
                    data-index="${index}"
                    style="
                        width:100%;
                        padding:12px;
                        margin-top:12px;
                        border:0;
                        border-radius:12px;
                        background:#d1433d;
                        color:white;
                        font-weight:bold;
                        font-size:16px;
                    "
                >

                    🗑️ Tirtir

                </button>

            </div>

        `;


        transactions.appendChild(card);

    });


    // ==================================
    // 🗑️ TIRTIR HAL DIIWAAN
    // ==================================

    document
        .querySelectorAll(".delete-one")
        .forEach(button => {

            button.addEventListener(
                "click",
                function() {

                    const index =
                        Number(
                            this.dataset.index
                        );


                    const confirmDelete =
                        confirm(
                            "Ma hubtaa inaad rabto inaad tirtirto diiwaankan?"
                        );


                    if (!confirmDelete) {

                        return;
                    }


                    data.splice(index, 1);

                    saveData();

                    render();

                }
            );

        });


    calculateTotals();
}


// ==========================================
// 💰 KU DAR DAKHLI / KHARASH
// ==========================================

if (form) {

    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const desc =
                description.value.trim();


            const value =
                Number(amount.value);


            const selectedType =
                type.value;


            if (!desc) {

                alert(
                    "Fadlan geli faahfaahinta."
                );

                return;
            }


            if (!value || value <= 0) {

                alert(
                    "Fadlan geli lacag sax ah."
                );

                return;
            }


            let category =
                "expense";


            if (
                selectedType === "income" ||
                selectedType === "Dakhliga"
            ) {

                category =
                    "income";
            }


            data.push({

                id: Date.now(),

                description: desc,

                amount: value,

                category: category,

                date: getDate()

            });


            saveData();

            render();

            form.reset();

        }
    );
}


// ==========================================
// 🐑🐄🌾 KU DAR XOOLAHA / BEER
// ==========================================

if (addFarm) {

    addFarm.addEventListener(
        "click",
        function() {

            const selected =
                farmType.value;


            const desc =
                farmDescription.value.trim();


            const quantity =
                Number(
                    farmQuantity.value
                );


            const price =
                Number(
                    farmPrice.value
                );


            if (!selected) {

                alert(
                    "Fadlan dooro nooca."
                );

                return;
            }


            if (!desc) {

                alert(
                    "Fadlan geli faahfaahinta."
                );

                return;
            }


            if (!quantity || quantity <= 0) {

                alert(
                    "Fadlan geli tirada."
                );

                return;
            }


            if (!price || price <= 0) {

                alert(
                    "Fadlan geli qiimaha."
                );

                return;
            }


            const total =
                quantity * price;


            let farmName =
                selected;


            if (
                selected === "Ari" ||
                selected === "ari"
            ) {

                farmName = "Ari";
            }


            if (
                selected === "Lo" ||
                selected === "lo"
            ) {

                farmName = "Lo";
            }


            if (
                selected === "Beer" ||
                selected === "beer"
            ) {

                farmName = "Beer";
            }


            data.push({

                id: Date.now(),

                description: desc,

                amount: total,

                category: "farm",

                farmType: farmName,

                quantity: quantity,

                price: price,

                date: getDate()

            });


            saveData();

            render();


            farmDescription.value =
                "";

            farmQuantity.value =
                "";

            farmPrice.value =
                "";

        }
    );
}


// ==========================================
// 🗑️ TIRTIR DHAMMAAN
// ==========================================

if (clearBtn) {

    clearBtn.addEventListener(
        "click",
        function() {

            if (data.length === 0) {

                alert(
                    "Diiwaanku waa madhan yahay."
                );

                return;
            }


            const confirmAll =
                confirm(
                    "MA HUBTAA?\n\n" +
                    "Dhammaan diiwaannada waa la tirtirayaa."
                );


            if (!confirmAll) {

                return;
            }


            data = [];

            saveData();

            render();

        }
    );
}


// ==========================================
// 🚀 BILOW
// ==========================================

fixOldDates();

render();
