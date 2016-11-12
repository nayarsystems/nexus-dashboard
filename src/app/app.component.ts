import { Component, OnInit } from '@angular/core';

import { LoggedInGuard } from './guards/logged-in.guard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  constructor(
    private log: LoggedInGuard
  ) { }
  
  ngOnInit() {
    this.log.listenEventBus();
  }
}
