import { Routes } from '@angular/router';

import { loggedInGuard } from './guards/logged-in.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [loggedInGuard],
    loadComponent: () =>
      import('./components/general/dashboard/dashboard').then(
        m => m.DashboardComponent,
      ),
  },
  {
    path: 'nodes',
    canActivate: [loggedInGuard],
    loadComponent: () =>
      import('./components/general/nodes/nodes').then(m => m.NodesComponent),
  },
  {
    path: 'topics',
    canActivate: [loggedInGuard],
    loadComponent: () =>
      import('./components/general/topics/topics').then(m => m.TopicsComponent),
  },
  {
    path: 'sync',
    canActivate: [loggedInGuard],
    loadComponent: () =>
      import('./components/general/sync/sync').then(m => m.SyncComponent),
  },
  {
    path: 'users',
    canActivate: [loggedInGuard],
    loadComponent: () =>
      import('./components/users/user-list/user-list').then(
        m => m.UserListComponent,
      ),
  },
  {
    path: 'users/:name',
    canActivate: [loggedInGuard],
    loadComponent: () =>
      import('./components/users/user/user').then(m => m.UserComponent),
  },
  {
    path: 'sessions',
    canActivate: [loggedInGuard],
    loadComponent: () =>
      import('./components/users/session-list/session-list').then(
        m => m.SessionListComponent,
      ),
  },
  {
    path: 'tasks',
    canActivate: [loggedInGuard],
    loadComponent: () =>
      import('./components/services/tasks/tasks').then(m => m.TasksComponent),
  },
  {
    path: 'push',
    canActivate: [loggedInGuard],
    loadComponent: () =>
      import('./components/services/push/push').then(m => m.PushComponent),
  },
  {
    path: 'pull',
    canActivate: [loggedInGuard],
    loadComponent: () =>
      import('./components/services/pull/pull').then(m => m.PullComponent),
  },
  {
    path: 'services',
    canActivate: [loggedInGuard],
    loadComponent: () =>
      import('./components/services/services/services').then(
        m => m.ServicesComponent,
      ),
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
