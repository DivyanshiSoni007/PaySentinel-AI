// ==========================================================
// PAY SENTINEL AI - COMPLETE FRONTEND SCRIPT
// ==========================================================

const API_URL = "http://127.0.0.1:8000/risk/check";


// ==========================================================
// DOM ELEMENTS
// ==========================================================

const riskForm = document.getElementById("riskForm");
const analyzeButton = document.getElementById("analyzeButton");

const riskScore = document.getElementById("riskScore");
const riskLevel = document.getElementById("riskLevel");
const probability = document.getElementById("probability");
const probabilityBar = document.getElementById("probabilityBar");

const decisionBadge = document.getElementById("decisionBadge");
const decisionText = document.getElementById("decisionText");

const riskFactors = document.getElementById("riskFactors");
const protectiveFactors = document.getElementById("protectiveFactors");

const transactionHistory =
    document.getElementById("transactionHistory");


// ==========================================================
// TRANSACTION DATA
// ==========================================================

let transactionCounter = 0;

const transactions = [];


// ==========================================================
// SETTINGS STATE
// ==========================================================

const settingsState = {

    aiRiskEngine: true,

    highRiskAlerts: true,

    newDeviceDetection: true,

    locationMonitoring: true

};


// ==========================================================
// SIDEBAR ELEMENTS
// ==========================================================

const dashboardNav =
    document.getElementById("dashboardNav");

const analyzeNav =
    document.getElementById("analyzeNav");

const transactionsNav =
    document.getElementById("transactionsNav");

const analyticsNav =
    document.getElementById("analyticsNav");

const alertsNav =
    document.getElementById("alertsNav");

const settingsNav =
    document.getElementById("settingsNav");


// ==========================================================
// SECTIONS
// ==========================================================

const dashboardSection =
    document.getElementById("dashboard");

const analyzeSection =
    document.getElementById("analyze-section");

const transactionsSection =
    document.getElementById("transactions-section");

const analyticsSection =
    document.getElementById("analytics-section");

const alertsSection =
    document.getElementById("alertsSection");

const settingsSection =
    document.getElementById("settingsSection");


// ==========================================================
// UTILITY - SET ACTIVE NAV
// ==========================================================

function setActiveNav(activeButton) {

    document
        .querySelectorAll(".nav-item")
        .forEach(function (item) {

            item.classList.remove("active");

        });


    if (activeButton) {

        activeButton.classList.add("active");

    }

}


// ==========================================================
// UTILITY - SCROLL TO SECTION
// ==========================================================

function goToSection(
    button,
    section
) {

    if (!button || !section) {

        return;

    }


    setActiveNav(button);


    section.style.display = "block";

    section.style.visibility = "visible";

    section.style.opacity = "1";


    setTimeout(function () {

        section.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }, 50);

}


// ==========================================================
// DASHBOARD BUTTON
// ==========================================================

if (dashboardNav) {

    dashboardNav.addEventListener(
        "click",
        function () {

            setActiveNav(
                dashboardNav
            );


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


// ==========================================================
// ANALYZE BUTTON - SIDEBAR
// ==========================================================

if (analyzeNav) {

    analyzeNav.addEventListener(
        "click",
        function () {

            goToSection(
                analyzeNav,
                analyzeSection
            );

        }
    );

}


// ==========================================================
// TRANSACTIONS BUTTON - SIDEBAR
// ==========================================================

if (transactionsNav) {

    transactionsNav.addEventListener(
        "click",
        function () {

            goToSection(
                transactionsNav,
                transactionsSection
            );

        }
    );

}


// ==========================================================
// ANALYTICS BUTTON - SIDEBAR
// ==========================================================

if (analyticsNav) {

    analyticsNav.addEventListener(
        "click",
        function () {

            goToSection(
                analyticsNav,
                analyticsSection
            );

            updateAnalytics();

        }
    );

}


// ==========================================================
// ALERTS BUTTON - SIDEBAR
// ==========================================================

if (alertsNav) {

    alertsNav.addEventListener(
        "click",
        function () {

            goToSection(
                alertsNav,
                alertsSection
            );

        }
    );

}


// ==========================================================
// SETTINGS BUTTON - SIDEBAR
// ==========================================================

if (settingsNav) {

    settingsNav.addEventListener(
        "click",
        function () {

            goToSection(
                settingsNav,
                settingsSection
            );

        }
    );

}


// ==========================================================
// RISK ANALYSIS FORM
// ==========================================================

if (riskForm) {

    riskForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ==================================================
            // CHECK AI RISK ENGINE
            // ==================================================

            if (!settingsState.aiRiskEngine) {

                alert(
                    "AI Risk Engine is currently disabled. Please enable it from Settings."
                );

                return;

            }


            // ==================================================
            // DISABLE ANALYZE BUTTON
            // ==================================================

            if (analyzeButton) {

                analyzeButton.disabled =
                    true;

                analyzeButton.textContent =
                    "ANALYZING...";

            }


            try {

                // ==================================================
                // GET FORM DATA
                // ==================================================

                const formData =
                    new FormData(riskForm);

                const data = {};


                formData.forEach(
                    function (value, key) {

                        if (value === "") {

                            data[key] = 0;

                        }

                        else if (!isNaN(value)) {

                            data[key] =
                                Number(value);

                        }

                        else {

                            data[key] =
                                value;

                        }

                    }
                );


                console.log(
                    "Transaction sent:",
                    data
                );


                // ==================================================
                // NEW DEVICE DETECTION
                // ==================================================

                if (
                    !settingsState.newDeviceDetection
                ) {

                    if (
                        data.new_device !== undefined
                    ) {

                        data.new_device = 0;

                    }

                    if (
                        data.is_new_device !== undefined
                    ) {

                        data.is_new_device = 0;

                    }

                }


                // ==================================================
                // LOCATION MONITORING
                // ==================================================

                if (
                    !settingsState.locationMonitoring
                ) {

                    if (
                        data.location_changed !== undefined
                    ) {

                        data.location_changed = 0;

                    }

                    if (
                        data.location_change !== undefined
                    ) {

                        data.location_change = 0;

                    }

                }


                console.log(
                    "Final transaction data:",
                    data
                );


                // ==================================================
                // CALL FASTAPI
                // ==================================================

                const response =
                    await fetch(
                        API_URL,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(data)

                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "API Error: " +
                        response.status
                    );

                }


                // ==================================================
                // GET RESULT
                // ==================================================

                const result =
                    await response.json();


                console.log(
                    "AI Result:",
                    result
                );


                // ==================================================
                // UPDATE RISK SCORE
                // ==================================================

                updateRiskScore(
                    result
                );


                // ==================================================
                // UPDATE PROBABILITY
                // ==================================================

                updateProbability(
                    result
                );


                // ==================================================
                // UPDATE RISK LEVEL
                // ==================================================

                updateRiskLevel(
                    result
                );


                // ==================================================
                // UPDATE DECISION
                // ==================================================

                updateDecision(
                    result
                );


                // ==================================================
                // UPDATE FACTORS
                // ==================================================

                updateRiskFactors(
                    result
                );


                updateProtectiveFactors(
                    result
                );


                // ==================================================
                // SAVE TRANSACTION
                // ==================================================

                addTransactionToHistory(
                    data,
                    result
                );


                // ==================================================
                // UPDATE ANALYTICS
                // ==================================================

                updateAnalytics();


            }

            catch (error) {

                console.error(
                    "Risk analysis failed:",
                    error
                );


                alert(
                    "Unable to analyze transaction. Please make sure the FastAPI server is running."
                );

            }

            finally {

                if (analyzeButton) {

                    analyzeButton.disabled =
                        false;

                    analyzeButton.textContent =
                        "ANALYZE TRANSACTION";

                }

            }

        }
    );

}


// ==========================================================
// UPDATE RISK SCORE
// ==========================================================

function updateRiskScore(result) {

    if (!riskScore) {

        return;

    }


    const score =
        result.risk_score ??
        result.score ??
        0;


    riskScore.textContent =
        Number(score).toFixed(2);

}


// ==========================================================
// UPDATE PROBABILITY
// ==========================================================

function updateProbability(result) {

    const probabilityValue =
        result.probability ??
        result.risk_probability ??
        0;


    let percentage =
        Number(probabilityValue);


    if (percentage <= 1) {

        percentage *= 100;

    }


    percentage =
        Math.max(
            0,
            Math.min(
                100,
                percentage
            )
        );


    if (probability) {

        probability.textContent =
            percentage.toFixed(1) +
            "%";

    }


    if (probabilityBar) {

        probabilityBar.style.width =
            percentage + "%";

    }


    return percentage;

}


// ==========================================================
// UPDATE RISK LEVEL
// ==========================================================

function updateRiskLevel(result) {

    if (!riskLevel) {

        return;

    }


    const level =
        result.risk_level ??
        result.riskLevel ??
        "UNKNOWN";


    riskLevel.textContent =
        String(level).toUpperCase();


    riskLevel.className = "";


    const riskClass =
        getRiskClass(level);


    if (riskClass) {

        riskLevel.classList.add(
            riskClass
        );

    }

}


// ==========================================================
// UPDATE DECISION
// ==========================================================

function updateDecision(result) {

    const decision =
        result.decision ??
        result.recommendation ??
        "REVIEW";


    if (decisionBadge) {

        decisionBadge.textContent =
            String(decision).toUpperCase();


        decisionBadge.className =
            "decision-badge " +
            getDecisionClass(
                decision
            );

    }


    if (decisionText) {

        decisionText.textContent =
            String(decision).toUpperCase();

    }

}


// ==========================================================
// UPDATE RISK FACTORS
// ==========================================================

function updateRiskFactors(result) {

    if (!riskFactors) {

        return;

    }


    riskFactors.innerHTML = "";


    const factors =
        result.risk_factors ??
        result.riskFactors ??
        result.factors ??
        [];


    if (
        Array.isArray(factors) &&
        factors.length > 0
    ) {

        factors.forEach(
            function (factor) {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "factor-row";


                let featureName;

                let value;


                if (
                    typeof factor ===
                    "object"
                ) {

                    featureName =
                        factor.feature ??
                        factor.name ??
                        factor.factor ??
                        "Unknown";


                    value =
                        factor.value ??
                        factor.contribution ??
                        factor.shap_value ??
                        0;

                }

                else {

                    featureName =
                        factor;

                    value = 0;

                }


                row.innerHTML = `

                    <span>
                        ${formatFeatureName(
                            featureName
                        )}
                    </span>

                    <strong>
                        ${Number(value).toFixed(4)}
                    </strong>

                `;


                riskFactors.appendChild(
                    row
                );

            }
        );

    }

    else {

        riskFactors.innerHTML = `

            <p class="empty-message">
                No major risk factors detected.
            </p>

        `;

    }

}


// ==========================================================
// UPDATE PROTECTIVE FACTORS
// ==========================================================

function updateProtectiveFactors(result) {

    if (!protectiveFactors) {

        return;

    }


    protectiveFactors.innerHTML = "";


    const factors =
        result.protective_factors ??
        result.protectiveFactors ??
        [];


    if (
        Array.isArray(factors) &&
        factors.length > 0
    ) {

        factors.forEach(
            function (factor) {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "factor-row";


                let featureName;

                let value;


                if (
                    typeof factor ===
                    "object"
                ) {

                    featureName =
                        factor.feature ??
                        factor.name ??
                        factor.factor ??
                        "Unknown";


                    value =
                        factor.value ??
                        factor.contribution ??
                        factor.shap_value ??
                        0;

                }

                else {

                    featureName =
                        factor;

                    value = 0;

                }


                row.innerHTML = `

                    <span>
                        ${formatFeatureName(
                            featureName
                        )}
                    </span>

                    <strong>
                        ${Number(value).toFixed(4)}
                    </strong>

                `;


                protectiveFactors.appendChild(
                    row
                );

            }
        );

    }

    else {

        protectiveFactors.innerHTML = `

            <p class="empty-message">
                No protective factors detected.
            </p>

        `;

    }

}


// ==========================================================
// ADD TRANSACTION TO HISTORY
// ==========================================================

function addTransactionToHistory(
    inputData,
    result
) {

    if (!transactionHistory) {

        return;

    }


    transactionCounter++;


    const transaction = {

        id:
            transactionCounter,

        input:
            inputData,

        result:
            result

    };


    transactions.push(
        transaction
    );


    const riskScoreValue =
        result.risk_score ??
        result.score ??
        0;


    const probabilityValue =
        result.probability ??
        result.risk_probability ??
        0;


    let probabilityPercentage =
        Number(probabilityValue);


    if (
        probabilityPercentage <= 1
    ) {

        probabilityPercentage *=
            100;

    }


    const riskLevelValue =
        result.risk_level ??
        result.riskLevel ??
        "UNKNOWN";


    const decisionValue =
        result.decision ??
        result.recommendation ??
        "REVIEW";


    // ==================================================
    // CREATE HIGH RISK ALERT
    // ==================================================

    if (
        settingsState.highRiskAlerts &&
        String(
            riskLevelValue
        )
            .toLowerCase()
            .includes("high")
    ) {

        createHighRiskAlert(
            transaction,
            riskScoreValue,
            probabilityPercentage
        );

    }


    // ==================================================
    // CREATE TRANSACTION ROW
    // ==================================================

    const row =
        document.createElement(
            "tr"
        );


    row.className =
        "transaction-row";


    row.innerHTML = `

        <td>
            TXN-${String(
                transactionCounter
            ).padStart(4, "0")}
        </td>

        <td>
            ₹${getTransactionAmount(
                inputData
            )}
        </td>

        <td>
            ${Number(
                riskScoreValue
            ).toFixed(2)}
        </td>

        <td>
            ${Number(
                probabilityPercentage
            ).toFixed(2)}%
        </td>

        <td class="${getRiskClass(
            riskLevelValue
        )}">
            ${String(
                riskLevelValue
            ).toUpperCase()}
        </td>

        <td class="${getDecisionClass(
            decisionValue
        )}">
            ${String(
                decisionValue
            ).toUpperCase()}
        </td>

    `;


    row.style.cursor =
        "pointer";


    row.addEventListener(
        "click",
        function () {

            showTransactionDetails(
                transaction
            );

        }
    );


    // ==================================================
    // REMOVE EMPTY HISTORY MESSAGE
    // ==================================================

    const emptyRow =
        transactionHistory.querySelector(
            ".empty-history"
        );


    if (emptyRow) {

        const emptyTableRow =
            emptyRow.closest("tr");

        if (emptyTableRow) {

            emptyTableRow.remove();

        }

    }


    transactionHistory.prepend(
        row
    );

}


// ==========================================================
// CREATE HIGH RISK ALERT
// ==========================================================

function createHighRiskAlert(
    transaction,
    riskScoreValue,
    probabilityPercentage
) {

    const alertsGrid =
        document.querySelector(
            ".alerts-grid"
        );


    if (!alertsGrid) {

        return;

    }


    const alertCard =
        document.createElement(
            "div"
        );


    alertCard.className =
        "alert-card high-alert";


    alertCard.innerHTML = `

        <div class="alert-icon">
            ⚠
        </div>

        <div class="alert-content">

            <span class="alert-type">
                HIGH RISK TRANSACTION
            </span>

            <h3>
                Transaction TXN-${String(
                    transaction.id
                ).padStart(4, "0")} flagged
            </h3>

            <p>
                Risk score:
                ${Number(
                    riskScoreValue
                ).toFixed(2)}
                |
                Probability:
                ${Number(
                    probabilityPercentage
                ).toFixed(1)}%
            </p>

        </div>

    `;


    alertsGrid.prepend(
        alertCard
    );


    console.log(
        "High Risk Alert created:",
        transaction.id
    );

}


// ==========================================================
// GET TRANSACTION AMOUNT
// ==========================================================

function getTransactionAmount(
    inputData
) {

    const amount =
        inputData.amount ??
        inputData.transaction_amount ??
        inputData.payment_amount ??
        0;


    return Number(
        amount
    ).toLocaleString(
        "en-IN",
        {
            maximumFractionDigits:
                2
        }
    );

}


// ==========================================================
// SHOW TRANSACTION DETAILS
// ==========================================================

function showTransactionDetails(
    transaction
) {

    const result =
        transaction.result;


    const input =
        transaction.input;


    const riskScoreValue =
        result.risk_score ??
        result.score ??
        0;


    const probabilityValue =
        result.probability ??
        result.risk_probability ??
        0;


    let percentage =
        Number(
            probabilityValue
        );


    if (percentage <= 1) {

        percentage *=
            100;

    }


    const riskLevelValue =
        result.risk_level ??
        result.riskLevel ??
        "UNKNOWN";


    const decisionValue =
        result.decision ??
        result.recommendation ??
        "REVIEW";


    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "transaction-modal";


    modal.innerHTML = `

        <div class="transaction-modal-overlay"></div>

        <div class="transaction-modal-content">

            <div class="transaction-modal-header">

                <div>

                    <span class="panel-label">
                        TRANSACTION DETAILS
                    </span>

                    <h2>
                        TXN-${String(
                            transaction.id
                        ).padStart(4, "0")}
                    </h2>

                </div>

                <button class="modal-close">
                    ×
                </button>

            </div>


            <div class="transaction-detail-grid">

                <div class="detail-card">

                    <span>
                        AMOUNT
                    </span>

                    <strong>
                        ₹${getTransactionAmount(
                            input
                        )}
                    </strong>

                </div>


                <div class="detail-card">

                    <span>
                        RISK SCORE
                    </span>

                    <strong>
                        ${Number(
                            riskScoreValue
                        ).toFixed(2)}
                    </strong>

                </div>


                <div class="detail-card">

                    <span>
                        PROBABILITY
                    </span>

                    <strong>
                        ${percentage.toFixed(1)}%
                    </strong>

                </div>


                <div class="detail-card">

                    <span>
                        RISK LEVEL
                    </span>

                    <strong class="${getRiskClass(
                        riskLevelValue
                    )}">

                        ${String(
                            riskLevelValue
                        ).toUpperCase()}

                    </strong>

                </div>

            </div>


            <div class="transaction-decision">

                <span>
                    DECISION
                </span>

                <strong class="${getDecisionClass(
                    decisionValue
                )}">

                    ${String(
                        decisionValue
                    ).toUpperCase()}

                </strong>

            </div>


            <div class="transaction-factors">

                <div>

                    <h3>
                        Risk Factors
                    </h3>

                    <div class="modal-risk-factors">

                        ${createFactorHTML(
                            result.risk_factors ??
                            result.riskFactors ??
                            []
                        )}

                    </div>

                </div>


                <div>

                    <h3>
                        Protective Factors
                    </h3>

                    <div class="modal-protective-factors">

                        ${createFactorHTML(
                            result.protective_factors ??
                            result.protectiveFactors ??
                            []
                        )}

                    </div>

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    const closeButton =
        modal.querySelector(
            ".modal-close"
        );


    const overlay =
        modal.querySelector(
            ".transaction-modal-overlay"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function () {

                modal.remove();

            }
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            function () {

                modal.remove();

            }
        );

    }

}


// ==========================================================
// CREATE FACTOR HTML
// ==========================================================

function createFactorHTML(
    factors
) {

    if (
        !Array.isArray(factors) ||
        factors.length === 0
    ) {

        return `

            <p class="empty-message">
                None detected.
            </p>

        `;

    }


    return factors.map(
        function (factor) {

            let featureName;

            let value;


            if (
                typeof factor ===
                "object"
            ) {

                featureName =
                    factor.feature ??
                    factor.name ??
                    factor.factor ??
                    "Unknown";


                value =
                    factor.value ??
                    factor.contribution ??
                    factor.shap_value ??
                    0;

            }

            else {

                featureName =
                    factor;

                value = 0;

            }


            return `

                <div class="factor-row">

                    <span>
                        ${formatFeatureName(
                            featureName
                        )}
                    </span>

                    <strong>
                        ${Number(
                            value
                        ).toFixed(4)}
                    </strong>

                </div>

            `;

        }
    ).join("");

}


// ==========================================================
// RISK CLASS
// ==========================================================

function getRiskClass(
    level
) {

    const value =
        String(level)
            .toLowerCase();


    if (
        value.includes("high")
    ) {

        return "risk-high";

    }


    if (
        value.includes("medium")
    ) {

        return "risk-medium";

    }


    if (
        value.includes("low")
    ) {

        return "risk-low";

    }


    return "";

}


// ==========================================================
// DECISION CLASS
// ==========================================================

function getDecisionClass(
    decision
) {

    const value =
        String(decision)
            .toLowerCase();


    if (
        value.includes("approve") ||
        value.includes("approved")
    ) {

        return "decision-approved";

    }


    if (
        value.includes("block") ||
        value.includes("blocked") ||
        value.includes("reject") ||
        value.includes("rejected")
    ) {

        return "decision-blocked";

    }


    return "decision-review";

}


// ==========================================================
// FORMAT FEATURE NAME
// ==========================================================

function formatFeatureName(
    name
) {

    return String(name)

        .replace(
            /_/g,
            " "
        )

        .replace(
            /\b\w/g,
            function (letter) {

                return letter.toUpperCase();

            }
        );

}


// ==========================================================
// ANALYTICS
// ==========================================================

function updateAnalytics() {

    const highRiskElement =
        document.getElementById(
            "highRiskCount"
        );

    const mediumRiskElement =
        document.getElementById(
            "mediumRiskCount"
        );

    const lowRiskElement =
        document.getElementById(
            "lowRiskCount"
        );


    let highCount = 0;

    let mediumCount = 0;

    let lowCount = 0;


    transactions.forEach(
        function (transaction) {

            const level =
                String(
                    transaction.result.risk_level ??
                    transaction.result.riskLevel ??
                    ""
                ).toLowerCase();


            if (
                level.includes("high")
            ) {

                highCount++;

            }

            else if (
                level.includes("medium")
            ) {

                mediumCount++;

            }

            else if (
                level.includes("low")
            ) {

                lowCount++;

            }

        }
    );


    if (highRiskElement) {

        highRiskElement.textContent =
            highCount;

    }


    if (mediumRiskElement) {

        mediumRiskElement.textContent =
            mediumCount;

    }


    if (lowRiskElement) {

        lowRiskElement.textContent =
            lowCount;

    }

}


// ==========================================================
// SETTINGS TOGGLES
// ==========================================================

const settingToggles =
    document.querySelectorAll(
        '#settingsSection input[type="checkbox"]'
    );


settingToggles.forEach(
    function (toggle, index) {

        toggle.addEventListener(
            "change",
            function () {

                const settingCard =
                    toggle.closest(
                        ".setting-card"
                    );


                if (!settingCard) {

                    return;

                }


                const settingName =
                    settingCard
                        .querySelector(
                            "strong"
                        )
                        .textContent
                        .trim();


                // ==================================================
                // AI RISK ENGINE
                // ==================================================

                if (
                    settingName ===
                    "AI Risk Engine"
                ) {

                    settingsState.aiRiskEngine =
                        toggle.checked;


                    console.log(
                        "AI Risk Engine:",
                        toggle.checked
                            ? "ON"
                            : "OFF"
                    );


                    if (!toggle.checked) {

                        console.log(
                            "AI analysis disabled."
                        );

                    }

                }


                // ==================================================
                // HIGH RISK ALERTS
                // ==================================================

                else if (
                    settingName ===
                    "High Risk Alerts"
                ) {

                    settingsState.highRiskAlerts =
                        toggle.checked;


                    console.log(
                        "High Risk Alerts:",
                        toggle.checked
                            ? "ON"
                            : "OFF"
                    );

                }


                // ==================================================
                // NEW DEVICE DETECTION
                // ==================================================

                else if (
                    settingName ===
                    "New Device Detection"
                ) {

                    settingsState.newDeviceDetection =
                        toggle.checked;


                    console.log(
                        "New Device Detection:",
                        toggle.checked
                            ? "ON"
                            : "OFF"
                    );

                }


                // ==================================================
                // LOCATION MONITORING
                // ==================================================

                else if (
                    settingName ===
                    "Location Monitoring"
                ) {

                    settingsState.locationMonitoring =
                        toggle.checked;


                    console.log(
                        "Location Monitoring:",
                        toggle.checked
                            ? "ON"
                            : "OFF"
                    );

                }

            }
        );

    });


// ==========================================================
// API STATUS CHECK
// ==========================================================

async function checkAPIStatus() {

    try {

        const response =
            await fetch(
                "http://127.0.0.1:8000/docs"
            );


        if (response.ok) {

            console.log(
                "PaySentinel AI API: ONLINE"
            );


            return true;

        }

    }

    catch (error) {

        console.warn(
            "PaySentinel AI API: OFFLINE"
        );

    }


    return false;

}


checkAPIStatus();


// ==========================================================
// INITIAL ANALYTICS
// ==========================================================

updateAnalytics();


// ==========================================================
// END OF PAY SENTINEL AI SCRIPT
// ==========================================================