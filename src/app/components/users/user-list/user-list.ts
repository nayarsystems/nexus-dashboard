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
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { UserCreateDialogComponent } from '../user-create-dialog/user-create-dialog';
import { MacrosService } from '../../../services/macros';
import { NexusService } from '../../../services/nexus';

@Component({
  selector: 'app-user-list',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule, TranslatePipe, TranslateDirective,],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserListComponent implements OnInit {
  private readonly nexus = inject(NexusService);
  private readonly macros = inject(MacrosService);
  private readonly createDialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly paginator = viewChild.required(MatPaginator);

  readonly lengthUpdated = new EventEmitter<any>();
  readonly updateLength = new EventEmitter<any>();
  readonly triggerUpdateUsers = new EventEmitter<any>();

  prefix = new FormControl('');
  displayedColumns = ['actions', 'username', 'maxSessions', 'enabled'];
  dataSource!: UserDataSource;

  readonly USER_DELETE_TEXT = 'If you accept, the user will be permanently deleted.';
  readonly DISABLE_TEXT = 'If you accept, the user will be disabled.';
  readonly ENABLE_TEXT = 'If you accept, the user will be enabled.';

  ngOnInit(): void {
    this.dataSource = new UserDataSource(
      this.nexus,
      this.paginator(),
      this.triggerUpdateUsers,
    );
    this.subscribeUsersLength();
    this.updateLength.emit(null); // trigger first get users
  }

  subscribeUsersLength(): void {
    merge(
      this.updateLength,
      (this.prefix.valueChanges as Observable<string>).pipe(debounceTime(300)),
      this.paginator().page,
    ).subscribe(() => {
      this.nexus
        .userTotal(this.prefix.value || '')
        .then(total => {
          this.paginator().length = total;
          this.cdr.markForCheck();
          this.triggerUpdateUsers.emit({
            prefix: this.prefix.value,
            limit: this.paginator().pageSize,
            skip: this.paginator().pageSize * this.paginator().pageIndex,
          });
        })
        .catch(e => console.log(e));
    });
  }

  openUserCreateDialog(): void {
    const dialogRef = this.createDialog.open(UserCreateDialogComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateLength.emit(null);
      }
    });
  }

  userDelete(username: string): void {
    this.macros.areYouSureAction(
      this.USER_DELETE_TEXT,
      'Error deleting user: ',
      () => this.nexus.userDelete(username),
      () => this.updateLength.emit(null),
    );
  }

  setDisabled(username: string, disable: boolean): void {
    const text = disable ? this.DISABLE_TEXT : this.ENABLE_TEXT;
    this.macros.areYouSureAction(
      text,
      'Error changing user disabled state: ',
      () => this.nexus.userSetDisabled(username, disable),
      () => this.updateLength.emit(null),
    );
  }
}

export class UserDataSource extends DataSource<any> {
  constructor(
    private nexus: NexusService,
    private paginator: MatPaginator,
    private changes: EventEmitter<any>,
  ) {
    super();
  }

  connect(): Observable<any[]> {
    return this.nexus.userListObservable(this.changes);
  }

  disconnect(): void {}
}
