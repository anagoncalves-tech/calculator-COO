const appLayout = document.querySelector("#app-layout");

const form = document.querySelector("#carbon-form");

const originInput = document.querySelector("#origin");
const destinationInput = document.querySelector("#destination");

const clearButton = document.querySelector("#clear-button");
const submitButton = document.querySelector(".btn-primary");

const resultPanel = document.querySelector("#result-panel");

const loadingSection = document.querySelector("#loading-section");
const resultSection = document.querySelector("#result-section");
const comparisonSection = document.querySelector("#comparison-section");
const carbonCreditSection = document.querySelector("#carbon-credit-section");

const resultElement = document.querySelector("#result");
const comparisonElement = document.querySelector("#comparison");

const carbonCreditValueElement = document.querySelector("#carbon-credit-value");
const carbonCreditCostElement = document.querySelector("#carbon-credit-cost");

function activateInitialLayout() {
  appLayout.classList.remove("calculated-layout");
  appLayout.classList.add("initial-layout");

  resultPanel.classList.add("hidden");
}

function activateCalculatedLayout() {
  appLayout.classList.remove("initial-layout");
  appLayout.classList.add("calculated-layout");

  resultPanel.classList.remove("hidden");
}

function hideResultSections() {
  loadingSection.classList.add("hidden");
  resultSection.classList.add("hidden");
  comparisonSection.classList.add("hidden");
  carbonCreditSection.classList.add("hidden");
}

function showResultSections() {
  activateCalculatedLayout();

  resultSection.classList.remove("hidden");
  comparisonSection.classList.remove("hidden");
  carbonCreditSection.classList.remove("hidden");
}

function showLoading() {
  activateCalculatedLayout();

  loadingSection.classList.remove("hidden");
  resultSection.classList.add("hidden");
  comparisonSection.classList.add("hidden");
  carbonCreditSection.classList.add("hidden");

  submitButton.disabled = true;
  submitButton.textContent = "Calculando...";
}

function hideLoading() {
  loadingSection.classList.add("hidden");

  submitButton.disabled = false;
  submitButton.textContent = "Calcular emissão";
}

function clearResults() {
  resultElement.innerHTML = "";
  comparisonElement.innerHTML = "";

  carbonCreditValueElement.innerHTML = "";
  carbonCreditCostElement.innerHTML = "";

  hideResultSections();
  activateInitialLayout();
}

function formatNumber(value) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function renderResult(routeData, emissionData) {
  resultElement.innerHTML = `
    <div class="result-grid">

      <div class="result-card result-route">
        <span class="result-label">🗺️ Rota</span>

        <div class="result-value">
          ${routeData.origin.displayName}
          <br />
          →
          <br />
          ${routeData.destination.displayName}
        </div>
      </div>

      <div class="result-card">
        <span class="result-label">📏 Distância</span>

        <div class="result-big">
          ${formatNumber(routeData.distanceKm)} km
        </div>
      </div>

      <div class="result-card">
        <span class="result-label">🌱 Emissão de CO₂</span>

        <div class="result-big">
          ${formatNumber(emissionData.emissionKg)} kg
        </div>
      </div>

      <div class="result-card">
        <span class="result-label">⏱️ Tempo estimado</span>

        <div class="result-value">
          ${formatNumber(routeData.durationMinutes)} minutos
        </div>
      </div>

      <div class="result-card">
        <span class="result-label">🚘 Transporte</span>

        <div class="result-value">
          ${emissionData.transport.icon} ${emissionData.transport.label}
        </div>
      </div>

    </div>
  `;
}

function renderComparison(comparisonData) {
  const maxEmission = Math.max(
    ...comparisonData.map((item) => item.emissionKg)
  );

  comparisonElement.innerHTML = comparisonData
    .map((item) => {
      const percentage =
        maxEmission > 0
          ? (item.emissionKg / maxEmission) * 100
          : 0;

      return `
        <div class="comparison-card">

          <div class="comparison-transport">
            <span>${item.icon} ${item.label}</span>

            <span class="comparison-percent">
              ${percentage.toFixed(0)}%
            </span>
          </div>

          <div class="comparison-data">
            <span>
              Emissão:
              <strong>${formatNumber(item.emissionKg)} kg CO₂</strong>
            </span>

            <span>
              Comparativo:
              <strong>${percentage.toFixed(0)}%</strong>
            </span>
          </div>

          <div class="comparison-progress">
            <div
              class="comparison-progress-bar"
              style="width: ${percentage}%"
            ></div>
          </div>

        </div>
      `;
    })
    .join("");
}

function renderCarbonCredit(emissionData) {
  carbonCreditValueElement.innerHTML = `
    ${formatNumber(emissionData.emissionTon)}
  `;

  carbonCreditCostElement.innerHTML = `
    ${formatCurrency(emissionData.carbonCreditCost)}
  `;
}

function renderError(message) {
  activateCalculatedLayout();

  resultElement.innerHTML = `
    <p class="warning">${message}</p>
  `;

  comparisonElement.innerHTML = "";

  carbonCreditValueElement.innerHTML = "";
  carbonCreditCostElement.innerHTML = "";

  resultSection.classList.remove("hidden");
  comparisonSection.classList.add("hidden");
  carbonCreditSection.classList.add("hidden");
}