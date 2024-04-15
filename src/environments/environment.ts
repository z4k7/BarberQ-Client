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

  firebase: {
    apiKey: 'AIzaSyBOecxo9tBhZgTVKXmZsYxb7d3jXbi4Ty4',
    authDomain: 'ng-z4k7.firebaseapp.com',
    databaseURL:
      'https://ng-z4k7-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'ng-z4k7',
    storageBucket: 'ng-z4k7.appspot.com',
    messagingSenderId: '167975273704',
    appId: '1:167975273704:web:38b8a65e5a3cb2f0d6f55d',
    measurementId: 'G-WR7LSPS77G',
    vapidKey:
      'BEJI2dr7uVqPOIeupXQceuc10SfKsaV8kr9f11WYUa3bZwM0VpG-8vlzubUUcnrEM3zhrinxSZrQqqftw0uevGk',
  },
};
