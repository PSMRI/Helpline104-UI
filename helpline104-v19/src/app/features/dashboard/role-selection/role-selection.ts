import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '@/core/services/data.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideActivity, lucideLogOut } from '@ng-icons/lucide';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [CommonModule, ZardButtonComponent, NgIcon],
  providers: [provideIcons({ lucideActivity, lucideLogOut })],
  template: `
    <div class="min-h-screen bg-gray-50 pt-16 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900">Role Selection</h2>
          <p class="mt-2 text-gray-600">Please select your service and role to continue</p>
        </div>

        @if (!privileges || privileges.length === 0) {
          <div class="text-center p-8 bg-white rounded-xl shadow-sm border border-red-100">
            <p class="text-red-600 font-medium">You do not have the required privileges to access this service.</p>
            <button z-button zType="outline" class="mt-4" (click)="logout()">Return to Login</button>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            @for (priv of privileges; track priv.serviceName) {
              <div class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden w-full max-w-sm hover:shadow-lg transition-shadow duration-300">
                <div class="bg-primary/5 p-6 text-center border-b border-gray-100">
                  <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-white mb-4 shadow-inner">
                    <span class="text-2xl font-bold">{{ priv.serviceName }}</span>
                  </div>
                </div>
                <div class="p-6">
                  <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 text-center">Available Roles</h3>
                  <div class="space-y-3">
                    @for (role of priv.roles; track role.RoleID) {
                      <button
                        (click)="selectRole(role, priv)"
                        class="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-200 group"
                      >
                        <span class="font-medium text-gray-700 group-hover:text-primary">
                          {{ role.RoleName === 'HYBRID HAO' ? 'HAO' : role.RoleName }}
                        </span>
                        <ng-icon name="lucideActivity" class="text-gray-400 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class RoleSelectionComponent implements OnInit {
  private dataService = inject(DataService);
  private router = inject(Router);

  privileges: any[] = [];
  hasHAOPrivilege = false;
  hasROPrivilege = false;

  ngOnInit() {
    this.privileges = this.dataService.userPriveliges || [];
    this.checkROHAOPrivilege();
  }

  checkROHAOPrivilege() {
    for (const priv of this.privileges) {
      if (priv.serviceName === '104') {
        for (const role of priv.roles) {
          if (!role.serviceRoleScreenMappings) continue;
          for (const mapping of role.serviceRoleScreenMappings) {
            if (mapping.screen?.screenName === 'Registration') {
              this.hasROPrivilege = true;
            } else if (mapping.screen?.screenName === 'Health_Advice') {
              this.hasHAOPrivilege = true;
            }
          }
        }
      }
    }
  }

  selectRole(role: any, service: any) {
    sessionStorage.setItem('apiman_key', service.apimanClientKey);
    
    // Safety check in case the legacy data structure is missing some layers
    if (role.serviceRoleScreenMappings && role.serviceRoleScreenMappings.length > 0) {
      const mapping = role.serviceRoleScreenMappings[0].providerServiceMapping;
      this.dataService.current_serviceID = mapping?.m_ServiceMaster?.serviceID;
      this.dataService.current_stateID_based_on_role = mapping?.stateID;
      this.dataService.service_providerID = mapping?.serviceProviderID;
    }

    this.getSelectedFeature(role);

    const roleName = role.RoleName;
    const serviceName = service.serviceName;

    this.dataService.current_roleName = roleName;
    this.dataService.current_workingLocationID = role.workingLocationID;
    
    // Setting global agent state
    this.dataService.current_roleID = role.RoleID;
    this.dataService.current_service = service;
    this.dataService.agentID = role.agentID || this.dataService.Userdata?.agentID;

    this.dataService.roleSelected.next({
      id: this.dataService.agentID,
      role: role.RoleName,
      service: service.serviceName,
    });

    // Navigate to the main application layout
    this.router.navigate(['/dashboard']);
  }

  getSelectedFeature(role: any) {
    let current_feature = '';
    let current_role = '';

    if (!role.serviceRoleScreenMappings) return current_feature;

    for (const mapping of role.serviceRoleScreenMappings) {
      current_feature = mapping.screen?.screenName;

      // Legacy logic to default hybrid users to RO first
      if (this.hasHAOPrivilege && this.hasROPrivilege && current_feature === 'Health_Advice') {
        current_feature = 'Registration';
      }

      this.dataService.current_feature = current_feature;

      switch (current_feature) {
        case 'Registration': current_role = 'RO'; break;
        case 'Health_Advice': current_role = 'HAO'; break;
        case 'Counselling': current_role = 'CO'; break;
        case 'Medical_Advice': current_role = 'MO'; break;
        case 'Service_Improvements': current_role = 'SIO'; break;
        case 'Supervising': current_role = 'Supervisor'; break;
        case 'Surveyor': current_role = 'Surveyor'; break;
        case 'Psychiatrist': current_role = 'PD'; break;
      }
      
      if (current_role) break;
    }

    this.dataService.current_role = current_role;
    
    // Store screens
    const screens = role.serviceRoleScreenMappings.map((m: any) => m.screen?.screenName);
    this.dataService.screens = screens;

    return current_feature;
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
