import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { JsonEditorComponent } from '../../shared/json-editor/json-editor';
import { MacrosService } from '../../../services/macros';
import { NexusService } from '../../../services/nexus';

@Component({
  selector: 'app-topics',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    JsonEditorComponent, TranslatePipe, TranslateDirective,],
  templateUrl: './topics.html',
  styleUrl: './topics.css',
})
export class TopicsComponent implements OnInit {
  private readonly nexus = inject(NexusService);
  private readonly fb = inject(FormBuilder);
  private readonly macros = inject(MacrosService);

  topicParams: any = '';
  messages: string[] = [];
  subscribed = false;

  form!: ReturnType<FormBuilder['group']>;
  formSubscribe!: ReturnType<FormBuilder['group']>;

  ngOnInit(): void {
    this.form = this.fb.group({
      topic: ['', Validators.required],
    });
    this.formSubscribe = this.fb.group({
      topic: ['', Validators.required],
    });
  }

  publish(): void {
    const topic = this.form.get('topic')!.value;
    this.macros.directAction(
      'Could not publish on topic ' + topic + ': ',
      () => this.nexus.topicPublish(topic, this.topicParams),
      () => {},
    );
  }

  subscribe(): void {
    this.nexus.pipeCreate().then(pipe => {
      this.nexus
        .topicSubscribe(pipe, this.formSubscribe.get('topic')!.value)
        .then(() => {
          this.subscribed = true;
          this.nexus.pipeObservable(pipe).subscribe(v => {
            this.messages.push(JSON.stringify(v, null, 2));
          });
        });
    });
  }
}
