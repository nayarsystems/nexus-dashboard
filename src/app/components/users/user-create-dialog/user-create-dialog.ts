import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NexusService } from '../../../services/nexus';

@Component({
  selector: 'app-user-create-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule, TranslatePipe, TranslateDirective,],
  templateUrl: './user-create-dialog.html',
  styleUrl: './user-create-dialog.css',
})
export class UserCreateDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<UserCreateDialogComponent>);
  private readonly fb = inject(FormBuilder);
  private readonly nexus = inject(NexusService);
  private readonly snackBar = inject(MatSnackBar);

  creating = false;
  hide = true;

  form = this.fb.nonNullable.group({
    user: ['', Validators.required],
    password: ['', Validators.required],
  });

  createUser(): void {
    this.creating = true;
    const v = this.form.getRawValue();
    this.nexus
      .userCreate(v.user, v.password)
      .then(() => {
        this.dialogRef.close(true);
      })
      .catch(err => {
        this.snackBar.open('Error creating user: ' + err.message, 'OK');
        this.dialogRef.close(false);
      });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
