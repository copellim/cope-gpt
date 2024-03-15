import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  isLoading = signal(false);
}
