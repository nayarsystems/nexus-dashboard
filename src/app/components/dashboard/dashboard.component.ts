import { Component, OnInit } from '@angular/core';

import { NexusService } from '../../services/nexus.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  usersCount: number;
  tasksCount: number;

  constructor(
    private nexus: NexusService
  ) {
    this.usersCount = 0;
    this.tasksCount = 0;
  }

  ngOnInit() {
    this.getUsersCount().then(res => this.usersCount = res);
    this.getTasksCount().then(res => this.tasksCount = res);
  }
  
  getUsersCount(): Promise<number> {
    return this.nexus.userList()
               .then(users => users.length);
  }
  
  getTasksCount(): Promise<number> {
    return this.nexus.taskList()
               .then(tasks => tasks.length);
  }

}
