import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { environment } from 'src/environments/environment';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { SwPush } from '@angular/service-worker';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Client';
  message: any = null;
  constructor(private swPush: SwPush) {}

  ngOnInit(): void {
    initFlowbite();
    this.registerServiceWorker();
    this.requestPermission();
    this.listen();
  }

  registerServiceWorker() {
    if (this.swPush.isEnabled) {
      this.swPush
        .requestSubscription({
          serverPublicKey: environment.firebase.vapidKey,
        })
        .then((subscription) => {
          console.log('Subscription object:', subscription);
        })
        .catch((error) => {
          console.error('Error subscribing to push notifications', error);
        });
    } else {
      console.log('Service Worker is not enabled');
    }
  }

  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: environment.firebase.vapidKey })
      .then((currentToken) => {
        if (currentToken) {
          console.log('Hurraaa!!! we got the token.....');
          console.log(currentToken);
        } else {
          console.log(
            'No registration token available. Request permission to generate one.'
          );
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });
  }
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.showPushNotification(payload);
    });
  }

  showPushNotification(payload: any) {
    if (payload.notification) {
      this.message = payload;
    }
  }
}
