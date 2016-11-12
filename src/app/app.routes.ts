import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { LoggedInGuard } from './guards/logged-in.guard';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: WrapperComponent }
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
