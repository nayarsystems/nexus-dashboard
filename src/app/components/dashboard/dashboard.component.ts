import { Component, OnInit } from '@angular/core';

import { NexusService } from '../../services/nexus.service';

declare function graphsInit(): any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  sessionsData: any[];
  sessionsCounter: number;
  sessionsChart: any;
  tasksData: any[];
  tasksCounter: number;
  tasksChart: any;
  createLineChart: any;

  constructor(
    private nexus: NexusService
  ) {
    this.sessionsData = [];
    this.tasksData = [];
    this.sessionsCounter = 0;
    this.tasksCounter = 0;
  }

  ngOnInit() {
    this.updatesessionsChart();
    this.updateTasksChart();
    
    this.createLineChart = graphsInit();
    this.sessionsChart = this.createLineChart('sessions', this.sessionsData, 'y', ['a'], ['Numero de usuarios'], ['0.9'], ['#ffffff'], ['#999999'], ['#97BE0C']);
    this.tasksChart = this.createLineChart('tasks', this.tasksData, 'y', ['a'], ['Numero de tareas'], ['0.9'], ['#ffffff'], ['#999999'], ['#97BE0C']);
  }
  
  updatesessionsChart() {
    setTimeout(() => {
      this.getsessionsCount().then(res => {
        this.sessionsCounter++;
        this.sessionsData.push({y: this.sessionsCounter, a: res});
        this.sessionsChart.setData(this.sessionsData);
        this.updatesessionsChart();
      })
    }, 2000)
  }
  
  updateTasksChart() {
    setTimeout(() => {
      this.getTasksCount().then(res => {
        this.tasksCounter++;
        this.tasksData.push({y: this.tasksCounter, a: res});
        this.tasksChart.setData(this.tasksData);
        this.updateTasksChart();
      })
    }, 2000)
  }

  // TODO correct, number of sessions not gotten correctly
  getsessionsCount(): Promise<number> {
    return this.nexus.sessionList()
      .then(sessions => sessions.length);
  }

  getTasksCount(): Promise<number> {
    return this.nexus.taskList()
      .then(tasks => tasks.length);
  }





}
