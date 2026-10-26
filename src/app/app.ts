import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NexusService } from './services/nexus';
import { host } from '../environments/environment.local';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatDividerModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly translate = inject(TranslateService);

  readonly nexus = inject(NexusService);
  readonly nexusHost = host;

  readonly linkGroups = [
    {
      name: 'General',
      links: [
        { name: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
        { name: 'Nodes', route: '/nodes', icon: 'cloud' },
        { name: 'Topics', route: '/topics', icon: 'format_quote' },
        { name: 'Sync', route: '/sync', icon: 'lock' },
      ],
    },
    {
      name: 'Users',
      links: [
        { name: 'Users', route: '/users', icon: 'people' },
        { name: 'Sessions', route: '/sessions', icon: 'person_pin' },
      ],
    },
    {
      name: 'Services',
      links: [
        { name: 'Tasks', route: '/tasks', icon: 'assignment' },
        { name: 'Push', route: '/push', icon: 'arrow_forward' },
        { name: 'Pull', route: '/pull', icon: 'arrow_back' },
        { name: 'Services', route: '/services', icon: 'explore' },
      ],
    },
  ];

  setLang(lang: string): void {
    this.translate.use(lang);
  }

  logout(): void {
    this.nexus.logout();
  }
}
