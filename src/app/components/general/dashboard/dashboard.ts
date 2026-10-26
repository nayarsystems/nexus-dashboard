import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { TranslateDirective } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NexusService } from '../../../services/nexus';
import { NexusFacade } from '../../../services/nexus-facade';
import { formatLoad } from '../../../shared/functions';

@Component({
  selector: 'app-dashboard',
  imports: [ MatCardModule, MatGridListModule, MatProgressSpinnerModule, TranslateDirective,],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly nexus = inject(NexusService);
  private readonly nxf = inject(NexusFacade);
  // Angular 21+ only refreshes views on notification; plain property writes
  // from nexus callbacks must mark the view dirty explicitly.
  private readonly cdr = inject(ChangeDetectorRef);

  loadingServices = true;
  loadingUsers = true;
  loadingTasks = true;
  loadingNodes = true;
  totalServices = 0;
  services = 0;
  users: any = 0;
  tasks: any = 0;
  nodes: any = {};

  private interval: any;

  ngOnInit(): void {
    this.reloadInfo();
    this.interval = setInterval(() => this.reloadInfo(), 60000);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  async reloadInfo(): Promise<void> {
    this.loadingServices = true;
    this.loadingUsers = true;
    this.loadingTasks = true;
    this.loadingNodes = true;

    this.nexus
      .userTotal('')
      .then(res => {
        this.users = res;
        this.loadingUsers = false;
        this.cdr.markForCheck();
      })
      .catch(err => {
        console.log('Error getting user total:', err);
        this.loadingUsers = false;
        this.users = err.message || JSON.stringify(err);
        this.cdr.markForCheck();
      });

    this.nexus
      .taskTotal('')
      .then(res => {
        this.tasks = res;
        this.loadingTasks = false;
        this.cdr.markForCheck();
      })
      .catch(err => {
        console.log('Error getting task total:', err);
        this.loadingTasks = false;
        this.tasks = err.message || JSON.stringify(err);
        this.cdr.markForCheck();
      });

    this.nexus
      .nodeList(0, 0)
      .then(nodes => {
        this.nodes.count = nodes.length;
        this.nodes.Load = { Load1: 0, Load5: 0, Load15: 0 };
        for (const node of nodes) {
          this.nodes.Load['Load1'] += node.Load['Load1'];
          this.nodes.Load['Load5'] += node.Load['Load5'];
          this.nodes.Load['Load15'] += node.Load['Load15'];
        }
        this.loadingNodes = false;
        this.cdr.markForCheck();
      })
      .catch(err => {
        console.log('Error getting nodes:', err);
        this.nodes.Load = { Load1: 0, Load5: 0, Load15: 0 };
        this.loadingNodes = false;
        this.nodes.count = err.message || JSON.stringify(err);
        this.cdr.markForCheck();
      });

    let servicesVisited = 0;
    this.services = 0;
    const services = await this.nxf.getServices();
    this.totalServices = services.length;
    if (this.totalServices === 0) {
      this.loadingServices = false;
      this.cdr.markForCheck();
    }
    for (const service of services) {
      this.nexus
        .taskPush(service + '.@info', null, 2)
        .then(() => {
          servicesVisited++;
          this.services++;
          if (servicesVisited === this.totalServices) {
            this.loadingServices = false;
            this.cdr.markForCheck();
          }
        })
        .catch(() => {
          servicesVisited++;
          if (servicesVisited === this.totalServices) {
            this.loadingServices = false;
            this.cdr.markForCheck();
          }
        });
    }
  }

  formatLoadFn(load: any): string {
    return formatLoad(load);
  }
}
