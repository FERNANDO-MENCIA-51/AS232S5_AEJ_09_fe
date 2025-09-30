import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    <div class="flex items-center justify-center p-8">
      <div class="relative">
        <div class="w-8 h-8 border-4 border-php-purple/20 border-t-php-purple rounded-full animate-spin"></div>
        <div class="absolute inset-0 w-8 h-8 border-4 border-transparent border-t-php-light-purple rounded-full animate-spin" style="animation-delay: 0.15s;"></div>
      </div>
      <span class="ml-3 text-text-muted">Loading...</span>
    </div>
  `
})
export class LoadingComponent {}