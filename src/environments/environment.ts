export const environment = {
  production: false,
  baseURL: import.meta.env.NG_APP_BASE_URL,
  backendURL: import.meta.env.NG_APP_BACKEND_URL,

  mapbox: {
    accessToken: import.meta.env.NG_APP_MAPBOX_ACCESSTOKEN,
    // accessToken:
    //   'pk.eyJ1IjoiejRrNyIsImEiOiJjbHN5dHhrbmIwaXh2MmtwMjFoM2Yxb3RsIn0.QeFgU3C80LR54ED9Ur3jyA',
  },

  geoapify: {
    apiKey: import.meta.env.NG_APP_GEOAPIFY_APIKEY,
    url: import.meta.env.NG_APP_GEOAPIFY_URL,
  },
};
