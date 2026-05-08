const themeToggle = document.querySelector("#theme-toggle");

const savedTheme = localStorage.getItem("theme") || "dark";

document.body.classList.add(`${savedTheme}-theme`);

updateThemeIcon(savedTheme);

themeToggle.addEventListener("click", function () {
  const isDark = document.body.classList.contains("dark-theme");

  document.body.classList.remove(
    isDark ? "dark-theme" : "light-theme"
  );

  document.body.classList.add(
    isDark ? "light-theme" : "dark-theme"
  );

  const newTheme = isDark ? "light" : "dark";

  localStorage.setItem("theme", newTheme);

  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

activateInitialLayout();
hideResultSections();

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const origin = originInput.value.trim();
  const destination = destinationInput.value.trim();

  const selectedTransportInput = document.querySelector(
    'input[name="transport"]:checked'
  );

  if (!origin || origin.length < 5) {
    renderError("Informe um local de partida mais completo.");
    return;
  }

  if (!destination || destination.length < 5) {
    renderError("Informe um local de chegada mais completo.");
    return;
  }

  if (origin.toLowerCase() === destination.toLowerCase()) {
    renderError("O local de partida e chegada não podem ser iguais.");
    return;
  }

  if (!selectedTransportInput) {
    renderError("Selecione um meio de transporte.");
    return;
  }

  const transport = getTransportData(selectedTransportInput.value);

  try {
    showLoading();

    const routeData = await calculateRealRoute(
      origin,
      destination,
      transport
    );

    const emissionData = calculateEmission(
      routeData.distanceKm,
      transport
    );

    const comparisonData = calculateComparison(routeData.distanceKm);

    renderResult(routeData, emissionData);
    renderComparison(comparisonData);
    renderCarbonCredit(emissionData);

    showResultSections();
  } catch (error) {
    renderError(error.message || CONFIG.messages.apiError);
  } finally {
    hideLoading();
  }
});

clearButton.addEventListener("click", function () {
  form.reset();
  clearResults();
});