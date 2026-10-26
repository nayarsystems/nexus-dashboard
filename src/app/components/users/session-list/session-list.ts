import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DataSource } from '@angular/cdk/collections';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

import { MacrosService } from '../../../services/macros';
import { NexusService } from '../../../services/nexus';
import { Session } from '../../../shared/models';

@Component({
  selector: 'app-session-list',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule, TranslatePipe, TranslateDirective,],
  templateUrl: './session-list.html',
  styleUrl: './session-list.css',
})
export class SessionListComponent implements OnInit {
  private readonly nexus = inject(NexusService);
  private readonly macros = inject(MacrosService);

  kicked = new EventEmitter<any>();

  prefix = new FormControl('');
  displayedColumns = ['actions', 'username', 'id', 'remoteAddress', 'protocol', 'creationTime'];
  dataSource!: SessionDataSource;

  ngOnInit(): void {
    const changes = new EventEmitter<any>();
    merge(
      this.kicked,
      (this.prefix.valueChanges as Observable<string>).pipe(debounceTime(300)),
    ).subscribe(() => {
      changes.emit({ prefix: this.prefix.value });
    });
    this.dataSource = new SessionDataSource(this.nexus, changes);
    setTimeout(() => this.kicked.emit(), 50);
  }

  sessionKick(connID: string): void {
    this.macros.directAction(
      'Could not kick session: ',
      () => this.nexus.sessionKick(connID),
      () => this.kicked.emit(),
    );
  }

  sessionReload(connID: string): void {
    this.macros.directAction(
      'Could not reload session: ',
      () => this.nexus.sessionReload(connID),
      () => {},
    );
  }

  formatTime(time: number): string {
    return new Date(time).toLocaleString();
  }
}

export class SessionDataSource extends DataSource<Session> {
  constructor(
    private nexus: NexusService,
    private changes: EventEmitter<any>,
  ) {
    super();
  }

  connect(): Observable<Session[]> {
    return this.nexus.sessionsObservable(this.changes);
  }

  disconnect(): void {}
}
