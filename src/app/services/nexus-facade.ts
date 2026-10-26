import { Injectable } from '@angular/core';

import { NexusService } from './nexus';

@Injectable({ providedIn: 'root' })
export class NexusFacade {
  constructor(private nexus: NexusService) {}

  // Services are the tag entries under 'services' on the dashboard's own
  // user ('web.nexus-dashboard').
  async getServices(): Promise<string[]> {
    const userTags = await this.nexus.userGetTags('web.nexus-dashboard');
    if (userTags && userTags.tags && userTags.tags.services) {
      return Object.keys(userTags.tags.services);
    }
    return [];
  }
}
