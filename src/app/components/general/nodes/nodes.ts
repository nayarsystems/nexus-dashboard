import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { TranslateDirective } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

import { NexusService } from '../../../services/nexus';
import { formatLoad } from '../../../shared/functions';

@Component({
  selector: 'app-nodes',
  imports: [ MatCardModule, MatIconModule, MatTableModule, TranslateDirective,],
  templateUrl: './nodes.html',
  styleUrl: './nodes.css',
})
export class NodesComponent implements OnInit {
  private readonly nexus = inject(NexusService);

  displayedColumns = ['node', 'version', 'clients', 'listening', 'load'];
  dataSource!: NodesDataSource;

  ngOnInit(): void {
    this.dataSource = new NodesDataSource(this.nexus);
  }

  formatLoadFn(load: any): string {
    return formatLoad(load);
  }
}

export class NodesDataSource extends DataSource<any> {
  constructor(private nexus: NexusService) {
    super();
  }

  connect(): Observable<any[]> {
    return this.nexus.nodesObservable();
  }

  disconnect(): void {}
}
