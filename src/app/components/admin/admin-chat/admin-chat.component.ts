import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-admin-chat',
  templateUrl: './admin-chat.component.html',
  styleUrls: ['./admin-chat.component.css'],
})
export class AdminChatComponent implements OnInit, OnDestroy, AfterViewInit {
  conversations: any[] = [];
  selectedConversationId: string | null = null;
  messages: any[] = [];
  newMessage: string = '';
  selectedUserName: string = '';
  selectedUserId: string = '';
  adminId: string = '65c322d07d0b32acb206dbea';

  conversationSubscription!: Subscription;
  messageSubscription!: Subscription;

  @ViewChild('adminMessagesContainer', { static: false })
  adminMessagesContainer!: ElementRef;

  constructor(
    private chatService: ChatService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAllConversations();
    this.chatService.addUser(this.adminId);
    this.chatService.listen('receive-message').subscribe((data) => {
      this.updateMessage(data);
    });
  }
  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.chatService.disconnectSocket();
    this.conversationSubscription?.unsubscribe();
    this.messageSubscription?.unsubscribe();
  }

  scrollToBottom(): void {
    try {
      this.adminMessagesContainer.nativeElement.scrollTop =
        this.adminMessagesContainer.nativeElement.scrollHeight;
    } catch (error) {
      console.error('Failed to scroll to bottom', error);
    }
  }

  getAllConversations() {
    this.chatService.getAllConversations().subscribe({
      next: (response) => {
        this.conversations = response.data;
      },
      error: (error) => {
        console.log(`Error:`, error);
      },
    });
  }

  selectConversation(conversationId: string, userName: string, userId: string) {
    this.selectedConversationId = conversationId;
    this.selectedUserName = userName;
    this.selectedUserId = userId;
    this.fetchMessages(conversationId);
  }

  fetchMessages(conversationId: string) {
    this.chatService.getMessagesForAdmin(conversationId).subscribe({
      next: (messages) => {
        this.messages = messages;
      },
      error: (error) => {
        console.log(`Error fetching messages:`, error);
        this.toastr.error('Error Fetching Messages', 'Error!');
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
      if (!this.selectedConversationId) {
        console.error('Conversation ID not set');
        return;
      }
      const messageData = {
        conversationId: this.selectedConversationId,
        senderId: this.adminId,
        receiverId: this.selectedUserId,
        text: this.newMessage,
        createdAt: new Date(),
      };

      this.messages.push(messageData);
      this.cdr.detectChanges();
      this.scrollToBottom();

      this.chatService.emit('send-message', messageData);
      this.newMessage = '';
    }
  }
}
