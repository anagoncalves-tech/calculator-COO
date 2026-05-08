const CONFIG = {
  carbonCreditPricePerTon: 50,

  api: {
    nominatimBaseUrl: "https://nominatim.openstreetmap.org/search",
    osrmBaseUrls: {
      car: "https://routing.openstreetmap.de/routed-car/route/v1/driving",
      bike: "https://routing.openstreetmap.de/routed-bike/route/v1/bike",
      foot: "https://routing.openstreetmap.de/routed-foot/route/v1/foot"
    }
  },

  messages: {
    invalidOrigin: "Informe o local de partida.",
    invalidDestination: "Informe o local de chegada.",
    invalidTransport: "Selecione um meio de transporte.",
    routeNotFound: "Não foi possível calcular a rota entre os locais informados.",
    addressNotFound: "Não foi possível localizar um dos endereços informados.",
    apiError: "Ocorreu um erro ao consultar a API de rotas."
  }
};