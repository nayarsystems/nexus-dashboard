import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { JsonEditorComponent } from '../../shared/json-editor/json-editor';
import { NexusService } from '../../../services/nexus';

@Component({
  selector: 'app-push',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    JsonEditorComponent, TranslatePipe, TranslateDirective,],
  templateUrl: './push.html',
  styleUrl: './push.css',
})
export class PushComponent implements OnInit {
  private readonly nexus = inject(NexusService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly fb = inject(FormBuilder);

  pushParams: any = '';
  result = '';
  error = '';

  form!: ReturnType<FormBuilder['group']>;

  ngOnInit(): void {
    this.form = this.fb.group({
      path: ['', Validators.required],
    });
  }

  push(): void {
    this.error = '';
    this.result = '';
    this.nexus
      .taskPush(this.form.get('path')!.value, this.pushParams, 20)
      .then(res => {
        this.result = JSON.stringify(res, null, 2);
        this.error = '';
        this.cdr.markForCheck();
      })
      .catch(err => {
        this.result = '';
        this.error = JSON.stringify(err, null, 2);
        this.cdr.markForCheck();
      });
  }
}
