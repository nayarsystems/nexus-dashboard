import { Component, OnInit } from '@angular/core';

import { EventBusService } from '../../services/event-bus.service';
import { NexusService } from '../../services/nexus.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private bus: EventBusService,
    private nexus: NexusService
  ) { }

  ngOnInit() {
    this.nexus.login(environment.nexus.user, environment.nexus.pass)
      .then(() => {
        this.bus.dispatch({ name: 'logged', value: true });
      })
      .catch(err => {
        console.log(err);
      });
  }

}
