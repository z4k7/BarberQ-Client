import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { initFlowbite } from 'flowbite';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/models/user';
import { ChatService } from 'src/app/services/chat.service';
import { selectUserDetails } from 'src/app/state/user-store/user.selector';

@Component({
  selector: 'app-user-contactus',
  templateUrl: './user-contactus.component.html',
  styleUrls: ['./user-contactus.component.css'],
})
export class UserContactusComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild('userMessagesContainer', { static: false })
  userMessagesContainer!: ElementRef;

  messages: any[] = [];
  newMessage: string = '';
  messageSubscription!: Subscription;
  conversationId: string | null = null;

  userState$ = this.store.select(selectUserDetails);
  userData!: IUser;
  userSubscription!: Subscription;
  adminId: string = '65c322d07d0b32acb206dbea';

  constructor(
    private chatService: ChatService,
    private toastr: ToastrService,
    private store: Store,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    initFlowbite();

    this.userSubscription = this.userState$.subscribe((user) => {
      if (user) {
        this.userData = user;
        this.chatService.addUser(this.userData._id);
        this.createConversation();
      }
    });

    this.chatService.listen('receive-message').subscribe((data) => {
      this.updateMessage(data);
    });
  }
  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.chatService.disconnectSocket();
    this.messageSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  scrollToBottom(): void {
    try {
      this.userMessagesContainer.nativeElement.scrollTop =
        this.userMessagesContainer.nativeElement.scrollHeight;
    } catch (error) {
      console.error('Failed to scroll to bottom', error);
    }
  }

  createConversation() {
    const members = {
      senderId: this.userData._id,
      receiverId: this.adminId,
    };

    this.chatService.createConversation(members).subscribe({
      next: (response) => {
        this.conversationId = response._id;
        if (this.conversationId) {
          this.getMessages(this.conversationId);
        }
      },
      error: (error) => {
        this.toastr.error(error, 'Error creating conversation');
      },
    });
  }

  getMessages(conversationId: string) {
    this.chatService.getMessages(conversationId).subscribe({
      next: (response) => {
        this.messages = response;
        this.scrollToBottom();
      },
      error: (error) => {
        console.log(`Error in get message`, error);
        this.toastr.error(error, 'Error getting messages');
      },
    });
  }
  updateMessage(res: any): void {
    this.messages.push(res.data);
    this.cdr.detectChanges();
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      if (!this.conversationId) {
        console.error('Conversation ID not set');
        return;
      }
      const messageData = {
        conversationId: this.conversationId,
        senderId: this.userData._id,
        receiverId: this.adminId,
        text: this.newMessage,
        createdAt: new Date(),
      };
      this.messages.push(messageData);
      this.newMessage = '';
      this.cdr.detectChanges();
      this.scrollToBottom();
      this.chatService.emit('send-message', messageData);
    }
  }
}
