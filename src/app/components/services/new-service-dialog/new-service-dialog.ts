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
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NexusService } from '../../../services/nexus';

@Component({
  selector: 'app-new-service-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule, TranslatePipe, TranslateDirective,],
  templateUrl: './new-service-dialog.html',
  styleUrl: './new-service-dialog.css',
})
export class NewServiceDialogComponent {
  private readonly dialogRef = inject(
    MatDialogRef<NewServiceDialogComponent>,
  );
  private readonly fb = inject(FormBuilder);
  private readonly nexus = inject(NexusService);
  private readonly snackBar = inject(MatSnackBar);

  creating = false;

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  addService(): void {
    this.creating = true;
    const v = this.form.getRawValue();
    this.nexus
      .userSetTags('web.nexus-dashboard', 'services', { [v.name]: true })
      .then(() => {
        this.dialogRef.close(true);
      })
      .catch(err => {
        this.snackBar.open('Error setting new service: ' + err.message, 'OK');
        this.dialogRef.close(false);
      });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
