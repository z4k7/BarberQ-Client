import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

const { backendURL } = environment;

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket!: Socket;
  private messageObserver!: Observer<string>;
  private messageObservable!: Observable<string>;

  constructor() {
    this.socket = io(backendURL);
    this.createMessageObservable();
  }

  private createMessageObservable() {
    this.messageObservable = new Observable<string>((observer) => {
      this.socket.on('message', (data: string) => {
        observer.next(data);
      });
      this.messageObserver = observer;
    });
  }

  sendMessage(message: string) {
    this.socket.emit('message', message);
  }

  getMessage(): Observable<string> {
    return this.messageObservable;
  }

  disconnectSocket(): void {
    this.socket.disconnect();
  }
}
