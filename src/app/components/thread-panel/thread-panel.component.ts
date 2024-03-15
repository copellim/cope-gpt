import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { Thread } from '../../types/thread';

@Component({
  selector: 'app-thread-panel',
  standalone: true,
  imports: [CommonModule, MarkdownModule, FormsModule],
  template: `
    <div class="content vh-100">
      @if (selectedThread) {
      <div>
        <div class="thread-header">
          <h2>{{ selectedThread.title }}</h2>
          <span
            ><button (click)="clearThread()">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  d="M7 4h10v2H7zm13 6v10c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V10h2v10h12V10h2zM9 12h2v8H9zm2 0h2v8h-2zm2 0h2v8h-2z"
                />
              </svg></button
          ></span>
        </div>
        <div class="conversation">
          @for (message of selectedThread.messages; track $index) {
          <div
            class="message"
            [ngClass]="{
              received: message.role !== 'user',
              sent: message.role === 'user'
            }"
            [innerHTML]="message.content | markdown | async"
          ></div>
          }
        </div>
        <textarea
          [(ngModel)]="newMessage"
          placeholder="Type a message..."
          (keydown.control.enter)="sendMessage()"
        ></textarea>
        <button (click)="sendMessage()">Send</button>
      </div>
      }
    </div>
  `,
  styles: `
    .thread-header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    .content {
      flex-grow: 1;
      padding: 0 1rem;
      background-color: #bbb;
      overflow-y: scroll;
    }

    .conversation {
      display: flex;
      flex-direction: column;
    }

    .message {
      max-width: 70%;
      padding: 8px;
      margin: 4px;
      border-radius: 8px;
    }

    .received {
      align-self: flex-start;
      background-color: #e0e0e0;
    }

    .sent {
      align-self: flex-end;
      background-color: #4caf50;
      color: white;
    }

    textarea {
      width: calc(100% - 16px);
      margin: 8px;
      padding: 8px;
    }

    button {
      background-color: #4caf50;
      color: white;
      border: none;
      padding: 8px;
      cursor: pointer;
    }
  `,
})
export class ThreadPanelComponent {
  @Input() selectedThread?: Thread;
  @Output() onClearThread = new EventEmitter<void>();
  @Output() onSendMessage = new EventEmitter<string>();

  newMessage: string = '';

  clearThread() {
    this.onClearThread.emit();
  }

  sendMessage() {
    if (this.selectedThread === undefined) {
      return;
    }
    if (this.newMessage === '') {
      return;
    }
    this.onSendMessage.emit(this.newMessage);
    this.newMessage = '';
  }
}
