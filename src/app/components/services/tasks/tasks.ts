import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  inject,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DataSource } from '@angular/cdk/collections';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { MacrosService } from '../../../services/macros';
import { NexusService } from '../../../services/nexus';

@Component({
  selector: 'app-tasks',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule, TranslatePipe, TranslateDirective,],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class TasksComponent implements OnInit {
  private readonly nexus = inject(NexusService);
  private readonly macros = inject(MacrosService);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly paginator = viewChild.required(MatPaginator);

  readonly triggerUpdateTasks = new EventEmitter<any>();
  readonly updateLength = new EventEmitter<any>();

  prefix = new FormControl('');
  displayedColumns = ['session', 'id', 'path', 'method', 'user', 'status'];
  dataSource!: TasksDataSource;

  ngOnInit(): void {
    this.dataSource = new TasksDataSource(
      this.nexus,
      this.paginator(),
      this.triggerUpdateTasks,
    );
    this.subscribeTasksLength();
    this.updateLength.emit(null);
  }

  // TODO refactor in macros to reuse this and user-list (2016 note)
  subscribeTasksLength(): void {
    merge(
      (this.prefix.valueChanges as Observable<string>).pipe(debounceTime(300)),
      this.paginator().page,
      this.updateLength,
    ).subscribe(() => {
      this.nexus
        .taskTotal(this.prefix.value || '')
        .then(total => {
          this.paginator().length = total;
          this.cdr.markForCheck();
          this.triggerUpdateTasks.emit({
            prefix: this.prefix.value,
            limit: this.paginator().pageSize,
            skip: this.paginator().pageSize * this.paginator().pageIndex,
          });
        })
        .catch(e => console.log(e));
    });
  }
}

export class TasksDataSource extends DataSource<any> {
  constructor(
    private nexus: NexusService,
    private paginator: MatPaginator,
    private changes: EventEmitter<any>,
  ) {
    super();
  }

  connect(): Observable<any[]> {
    return this.nexus.taskListObservable(this.changes);
  }

  disconnect(): void {}
}
