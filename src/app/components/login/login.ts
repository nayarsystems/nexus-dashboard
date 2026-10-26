import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NexusService } from '../../services/nexus';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule, TranslatePipe, TranslateDirective,],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly nexus = inject(NexusService);
  private readonly cdr = inject(ChangeDetectorRef);

  loggingIn = false;
  hide = true;

  form = this.fb.nonNullable.group({
    user: ['', Validators.required],
    password: ['', Validators.required],
  });

  login(): void {
    this.loggingIn = true;
    const v = this.form.getRawValue();
    // NexusService.login navigates to /dashboard on success.
    this.nexus.login(v.user, v.password).catch(() => {
      this.loggingIn = false;
      this.cdr.markForCheck();
    });
  }
}
