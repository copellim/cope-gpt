import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThreadSummary } from '../../types/thread-summary';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="transition bg-dark text-light overflow-x-hidden vh-100">
      <button class="hamburger">&#9776;</button>
      <ul class="list-group list-group-flush">
        @for (thread of threadList; track $index) {
        <li
          class="list-group-item list-group-item-dark"
          (click)="selectThread(thread.id)"
          [ngClass]="{ active: selectedThreadId === thread.id }"
        >
          {{ thread.title }}
        </li>
        }
      </ul>
    </div>
  `,
  styles: `
      .transition {
        transition: 0.5s;
      }

      .hamburger {
        background-color: #333;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
      }
    `,
})
export class SidebarComponent {
  @Input() threadList: ThreadSummary[] = [];
  @Output() onSelectThread = new EventEmitter<string>();

  selectedThreadId?: string;

  // toggleSidebar() {
  //   this.sidebarWidth =
  //     this.sidebarWidth === this.sidebarWidthClosed
  //       ? this.sidebarWidthOpen
  //       : this.sidebarWidthClosed;
  // }

  // isSidebarOpen() {
  //   return this.sidebarWidth !== this.sidebarWidthClosed;
  // }

  selectThread(threadId: string) {
    this.selectedThreadId = threadId;
    this.onSelectThread.emit(this.selectedThreadId);
  }
}
