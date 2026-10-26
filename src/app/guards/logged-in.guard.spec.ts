import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { vi } from 'vitest';

import { loggedInGuard } from './logged-in.guard';
import { NexusService } from '../services/nexus';

describe('loggedInGuard', () => {
  let router: Router;

  describe('when not logged in', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideTranslateService(),
          { provide: NexusService, useValue: { isLogged: () => false } },
        ],
      });
      router = TestBed.inject(Router);
    });

    it('redirects to login', () => {
      vi.spyOn(router, 'navigate');

      const result = TestBed.runInInjectionContext(() =>
        loggedInGuard(
          {} as ActivatedRouteSnapshot,
          { url: '/dashboard' } as RouterStateSnapshot,
        ),
      );

      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideTranslateService(),
          { provide: NexusService, useValue: { isLogged: () => true } },
        ],
      });
    });

    it('allows navigation', () => {
      const result = TestBed.runInInjectionContext(() =>
        loggedInGuard(
          {} as ActivatedRouteSnapshot,
          { url: '/dashboard' } as RouterStateSnapshot,
        ),
      );

      expect(result).toBe(true);
    });
  });
});
