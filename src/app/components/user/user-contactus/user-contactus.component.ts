import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/models/user';
import { ChatService } from 'src/app/services/chat.service';
import { selectUserDetails } from 'src/app/state/user-store/user.selector';

@Component({
  selector: 'app-user-contactus',
  templateUrl: './user-contactus.component.html',
  styleUrls: ['./user-contactus.component.css'],
})
export class UserContactusComponent implements OnInit, OnDestroy {
  messages: string[] = [];
  newMessage: string = '';
  messageSubscription!: Subscription;

  constructor(private chatService: ChatService, private store: Store) {}

  userState$ = this.store.select(selectUserDetails);
  userData!: IUser;
  userSubscription!: Subscription;

  date:Date = new Date()

  ngOnInit(): void {
    this.userSubscription = this.userState$.subscribe((user) => {
      if (user) this.userData = user;
    });

    this.messageSubscription = this.chatService
      .getMessage()
      .subscribe((message: string) => {
        this.messages.push(message);
      });
  }

  ngOnDestroy(): void {
    this.chatService.disconnectSocket();
    this.messageSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.chatService.sendMessage(this.newMessage);
      this.newMessage = '';
    }
  }
}
