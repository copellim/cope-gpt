import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CoreService } from '../../core.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: ` <div *ngIf="loading()" class="loading-spinner"></div> `,
  styles: `
    .loading-spinner {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 8px solid #f3f3f3;
      border-top: 8px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`,
})
export class LoadingSpinnerComponent {
  loading = inject(CoreService).isLoading;
}
