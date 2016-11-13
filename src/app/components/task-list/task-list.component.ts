import { Component, OnInit } from '@angular/core';

import { NexusService } from '../../services/nexus.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: any[];

  constructor(
    private nexus: NexusService
  ) { }

  ngOnInit() {
    this.nexus.taskList()
        .then(res => {
          console.log('Tasks:', res);
          this.tasks = res;
        });
  }

}
