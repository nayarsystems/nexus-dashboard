import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { EventBusService } from '../../services/event-bus.service';
import { NexusService } from '../../services/nexus.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private bus: EventBusService,
    private nexus: NexusService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.nexus.login(this.loginForm.value.username, this.loginForm.value.password)
        .then(() => {
          this.bus.dispatch({ name: 'logged', value: true });
          this.router.navigate(['/dashboard']);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

}
