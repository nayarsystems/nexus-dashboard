import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { NexusService } from '../services/nexus';

export const loggedInGuard: CanActivateFn = () => {
  const nexus = inject(NexusService);
  const router = inject(Router);

  if (nexus.isLogged()) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
