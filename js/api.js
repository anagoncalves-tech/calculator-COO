async function geocodeAddress(address) {
  const url = new URL(CONFIG.api.nominatimBaseUrl);

  url.searchParams.set("q", address);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("addressdetails", "1");

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(CONFIG.messages.apiError);
  }

  const data = await response.json();

  if (!data || data.length === 0) {
    throw new Error(CONFIG.messages.addressNotFound);
  }

  return {
    displayName: data[0].display_name,
    latitude: Number(data[0].lat),
    longitude: Number(data[0].lon)
  };
}

async function getRouteDistance(originCoordinates, destinationCoordinates, profile) {
  const baseUrl = CONFIG.api.osrmBaseUrls[profile];

  const coordinates = [
    `${originCoordinates.longitude},${originCoordinates.latitude}`,
    `${destinationCoordinates.longitude},${destinationCoordinates.latitude}`
  ].join(";");

  const url = new URL(`${baseUrl}/${coordinates}`);

  url.searchParams.set("overview", "false");
  url.searchParams.set("alternatives", "false");
  url.searchParams.set("steps", "false");

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(CONFIG.messages.routeNotFound);
  }

  const data = await response.json();

  if (!data.routes || data.routes.length === 0) {
    throw new Error(CONFIG.messages.routeNotFound);
  }

  const route = data.routes[0];

  return {
    distanceKm: route.distance / 1000,
    durationMinutes: route.duration / 60
  };
}

async function calculateRealRoute(origin, destination, transport) {
  const originCoordinates = await geocodeAddress(origin);

  await wait(1100);

  const destinationCoordinates = await geocodeAddress(destination);

  const route = await getRouteDistance(
    originCoordinates,
    destinationCoordinates,
    transport.routeProfile
  );

  return {
    origin: originCoordinates,
    destination: destinationCoordinates,
    distanceKm: route.distanceKm,
    durationMinutes: route.durationMinutes
  };
}

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}