/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/10.10.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging-compat.js"
);
firebase.initializeApp({
  apiKey: "AIzaSyBOecxo9tBhZgTVKXmZsYxb7d3jXbi4Ty4",
  authDomain: "ng-z4k7.firebaseapp.com",
  databaseURL:
    "https://ng-z4k7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ng-z4k7",
  storageBucket: "ng-z4k7.appspot.com",
  messagingSenderId: "167975273704",
  appId: "1:167975273704:web:38b8a65e5a3cb2f0d6f55d",
  measurementId: "G-WR7LSPS77G",
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const messaging = firebase.messaging();
