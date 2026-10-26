import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';

import { JsonEditorComponent } from '../../shared/json-editor/json-editor';
import { MacrosService } from '../../../services/macros';
import { NexusService } from '../../../services/nexus';

@Component({
  selector: 'app-pull',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    JsonEditorComponent, TranslatePipe, TranslateDirective,],
  templateUrl: './pull.html',
  styleUrl: './pull.css',
})
export class PullComponent implements OnInit {
  private readonly nexus = inject(NexusService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly macros = inject(MacrosService);
  private readonly fb = inject(FormBuilder);

  task: any = '';
  taskstring = '';
  waiting = false;
  result: any;
  errordata: any;
  resultOrErrorValue = 'result';

  // The 2019 app rendered the error response with angular2-json-schema-form
  // (code: integer, message: string); plain material forms replicate it.
  errorForm!: ReturnType<FormBuilder['group']>;

  form!: ReturnType<FormBuilder['group']>;

  ngOnInit(): void {
    this.form = this.fb.group({
      path: ['', Validators.required],
    });
    this.errorForm = this.fb.nonNullable.group({
      code: this.fb.control<number>(0, Validators.required),
      message: ['', Validators.required],
    });
  }

  pull(): void {
    this.waiting = true;
    this.macros.directActionFull(
      'Could not pull:',
      () => this.nexus.taskPull(this.form.get('path')!.value, 36001),
      task => {
        this.task = task;
        this.taskstring = JSON.stringify(this.task, null, 2);
        this.cdr.markForCheck();
      },
      () => {
        this.taskstring = '';
        this.task = '';
        this.waiting = false;
        this.cdr.markForCheck();
      },
    );
  }

  sendResult(): void {
    this.task.sendResult(this.result, (res: any, err: any) => {
      console.log('RESULT OF SEND RESULT:', res);
      console.log('ERROR OF SEND RESULT:', err);
      this.task = '';
      this.taskstring = '';
      this.waiting = false;
      this.cdr.markForCheck();
    });
  }

  sendError(): void {
    const event = this.errorForm.getRawValue();
    this.task.sendError(event.code, event.message, this.errordata, (res: any, err: any) => {
      console.log('RESULT OF SEND ERROR:', res);
      console.log('ERROR OF SEND ERROR:', err);
      this.task = '';
      this.taskstring = '';
      this.waiting = false;
      this.cdr.markForCheck();
    });
  }
}
