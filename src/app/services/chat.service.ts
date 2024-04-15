import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

const { backendURL } = environment;

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket!: Socket;

  constructor(private http: HttpClient) {
    this.socket = io(backendURL);
  }

  disconnectSocket(): void {
    this.socket.disconnect();
  }

  createConversation(members: {
    senderId: string;
    receiverId: string;
  }): Observable<any> {
    return this.http.post(`/user/newConversation`, {
      members,
    });
  }

  addUser(userId: string) {
    this.socket.emit('addUser', userId);
  }

  listen(socketEvent: string): Observable<any> {
    return new Observable((subscribe) => {
      this.socket.on(socketEvent, (data) => {
        subscribe.next(data);
      });
    });
  }

  emit(socketEvent: string, data: any): void {
    this.socket.emit(socketEvent, data);
  }

  getMessagesForAdmin(conversationId: string): Observable<any> {
    return this.http.get(`/admin/getMessages/${conversationId}`);
  }

  getMessages(conversationId: string): Observable<any> {
    return this.http.get(`/user/getMessages/${conversationId}`);
  }

  getAllConversations(): Observable<any> {
    return this.http.get(`/admin/get-all-conversations`);
  }
}
