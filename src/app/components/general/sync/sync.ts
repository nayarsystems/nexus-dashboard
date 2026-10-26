import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable } from 'rxjs';
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

@Component({
  selector: 'app-sync',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule, TranslatePipe, TranslateDirective,],
  templateUrl: './sync.html',
  styleUrl: './sync.css',
})
export class SyncComponent implements OnInit {
  private readonly nexus = inject(NexusService);
  private readonly macros = inject(MacrosService);

  displayedColumns = ['actions', 'name'];
  newLock = new FormControl('');
  changes = new EventEmitter<void>();
  dataSource!: LocksDataSource;

  ngOnInit(): void {
    this.dataSource = new LocksDataSource(this.changes);
  }

  unlock(name: string): void {
    this.macros.directAction(
      'Could not unlock path ' + name + ': ',
      () => this.nexus.unlock(name),
      () => {
        this.dataSource.delete(name);
        this.changes.emit();
      },
    );
  }

  lock(): void {
    this.macros.directAction(
      'Could not lock path ' + this.newLock.value + ': ',
      () => this.nexus.lock(this.newLock.value!),
      () => {
        this.dataSource.add(this.newLock.value!);
        this.changes.emit();
      },
    );
  }
}

class LocksDataSource extends DataSource<any> {
  locks: any[] = [];

  constructor(private changes: EventEmitter<void>) {
    super();
  }

  connect(): Observable<any[]> {
    return new Observable(observer => {
      observer.next([...this.locks, { lock: true }]);
      this.changes.subscribe(() => {
        observer.next([...this.locks, { lock: true }]);
      });
    });
  }

  disconnect(): void {}

  add(name: string): void {
    this.locks.push(name);
  }

  delete(name: string): void {
    const index = this.locks.indexOf(name);
    if (index !== -1) {
      this.locks.splice(index, 1);
    }
  }
}
