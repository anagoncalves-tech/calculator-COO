function getTransportData(transportId) {
  return ROUTES_DATA.transportOptions.find((transport) => {
    return transport.id === transportId;
  });
}

function calculateEmission(distanceKm, transport) {
  const emissionKg = distanceKm * transport.emissionFactor;
  const emissionTon = emissionKg / 1000;
  const carbonCreditCost = emissionTon * CONFIG.carbonCreditPricePerTon;

  return {
    distanceKm,
    transport,
    emissionKg,
    emissionTon,
    carbonCreditCost
  };
}

function calculateComparison(distanceKm) {
  return ROUTES_DATA.transportOptions.map((transport) => {
    return {
      id: transport.id,
      label: transport.label,
      icon: transport.icon,
      emissionKg: distanceKm * transport.emissionFactor
    };
  });
}