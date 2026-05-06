import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { DataService } from '@/core/services/data.service';
import { AuthService } from '@/core/services/auth.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideUserCircle, lucideLogOut, lucideHelpCircle, lucidePhoneCall } from '@ng-icons/lucide';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NgIcon],
  providers: [provideIcons({ lucideUserCircle, lucideLogOut, lucideHelpCircle, lucidePhoneCall })],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <!-- Logo & Title -->
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <img class="h-10 w-auto" src="assets/images/Swasthya.png" alt="Logo">
                <span class="ml-4 text-xl font-semibold text-gray-800 hidden sm:block">Helpline 104</span>
              </div>
            </div>

            <!-- Right Nav Items -->
            <div class="flex items-center space-x-6">
              
              <!-- Language Selector (Mock for now) -->
              <div class="hidden md:flex items-center">
                <span class="text-sm text-gray-500 mr-2">Language:</span>
                <select class="block w-full pl-3 pr-10 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-gray-50">
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </div>

              <!-- User Info -->
              <div class="flex items-center text-sm">
                <span class="text-gray-500">Welcome,</span>
                <span class="ml-1 font-medium text-gray-900">{{ dataService.uname }}</span>
              </div>

              <!-- Action Icons -->
              <div class="flex items-center space-x-4 text-gray-400">
                <button class="hover:text-primary transition-colors focus:outline-none" title="Emergency Contacts">
                  <ng-icon name="lucidePhoneCall" size="20" />
                </button>
                
                <div class="relative group cursor-pointer">
                  <button class="hover:text-primary transition-colors flex items-center focus:outline-none" title="Profile">
                    <ng-icon name="lucideUserCircle" size="24" />
                  </button>
                  <!-- Profile Dropdown (Hover) -->
                  <div class="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div class="px-4 py-3">
                      <p class="text-sm">Signed in as</p>
                      <p class="text-sm font-medium text-gray-900 truncate">{{ dataService.uname }}</p>
                    </div>
                    <div class="px-4 py-3 text-xs text-gray-500">
                      <p>ID: {{ dataService.agentID }}-{{ dataService.current_roleName || 'Unknown' }}-{{ dataService.current_service?.serviceName || 'Unknown' }}</p>
                    </div>
                  </div>
                </div>

                <button class="hover:text-primary transition-colors focus:outline-none" title="Help">
                  <ng-icon name="lucideHelpCircle" size="20" />
                </button>

                <button (click)="logout()" class="hover:text-red-500 transition-colors focus:outline-none" title="Logout">
                  <ng-icon name="lucideLogOut" size="20" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="flex-1 w-full max-w-full mx-auto p-4 sm:p-6 lg:p-8 relative">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200 mt-auto">
        <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <div>Powered by: WIPRO</div>
            <div class="flex items-center space-x-1 mt-2 md:mt-0">
              <span>2025</span>
              <span>©</span>
              <span>PSMRI</span>
            </div>
            <div class="flex space-x-6 mt-2 md:mt-0">
              <a href="#" class="hover:text-primary transition-colors">Feedback</a>
              <span>Version 19.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class MainLayoutComponent implements OnInit {
  dataService = inject(DataService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    // If no user data is present in DataService, they probably refreshed. 
    // In a real app, we'd fetch it from session/localStorage or redirect to login.
    if (!this.dataService.Userdata) {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    sessionStorage.clear();
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }
}
