import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { Toast, ToastComponent } from '../../shared/components/toast/toast.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent, ToastComponent],
  template: `
    <div class="min-h-screen educational-gradient">
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      
      <main class="ml-72 pt-20 min-h-screen">
        <div class="p-8">
          <router-outlet></router-outlet>
        </div>
      </main>
      
      <!-- Toast Notifications -->
      <app-toast [toasts]="toasts" (remove)="removeToast($event)"></app-toast>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class MainLayoutComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  removeToast(id: string) {
    this.toastService.remove(id);
  }
}