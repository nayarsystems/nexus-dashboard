import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { EventBusService } from '../services/event-bus.service';

@Injectable()
export class LoggedInGuard implements CanActivate {
  logged: boolean;

  constructor(private bus: EventBusService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('Route', route);
    if (state.url !== '' && !this.logged) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }

  listenEventBus() {
    console.log('LoggedInGuard loaded');
    this.bus.listen('logged').subscribe((result) => {
      this.logged = result.value;
    });
  }

}
