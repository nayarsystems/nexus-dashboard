import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { signal } from '@angular/core';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

import { JsonEditorComponent } from '../../shared/json-editor/json-editor';
import { KeysPipe } from '../../../shared/keys.pipe';
import { MacrosService } from '../../../services/macros';
import { NexusService } from '../../../services/nexus';

@Component({
  selector: 'app-user',
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    JsonEditorComponent,
    KeysPipe, TranslatePipe, TranslateDirective,],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class UserComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly nexus = inject(NexusService);
  private readonly fb = inject(FormBuilder);
  private readonly macros = inject(MacrosService);

  // Signals: nexus client callbacks update the view regardless of the
  // change-detection scheduler.
  reloading = signal(false);
  user = signal<any>(null);
  sessions = signal<any>(null);
  tags = signal('');
  effectivetags = signal('');

  tagValue: any = '';

  formTemplate!: ReturnType<FormBuilder['group']>;
  formWhitelist!: ReturnType<FormBuilder['group']>;
  formBlacklist!: ReturnType<FormBuilder['group']>;
  addTagsForm!: ReturnType<FormBuilder['group']>;
  formEditPassword!: ReturnType<FormBuilder['group']>;

  // The 2019 app rendered these two forms with angular2-json-schema-form;
  // plain material forms replicate the same fields and behavior.
  tryPasswordForm!: ReturnType<FormBuilder['group']>;
  editMaxsessionsForm!: ReturnType<FormBuilder['group']>;

  ngOnInit(): void {
    this.formTemplate = this.fb.group({
      template: ['', Validators.required],
    });
    this.formWhitelist = this.fb.group({
      ip: ['', Validators.required],
    });
    this.formBlacklist = this.fb.group({
      ip: ['', Validators.required],
    });
    this.addTagsForm = this.fb.group({
      path: ['', Validators.required],
      tag: ['', Validators.required],
    });
    this.formEditPassword = this.fb.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.matchingPasswords },
    );
    this.tryPasswordForm = this.fb.nonNullable.group({
      password: ['', Validators.required],
    });
    this.editMaxsessionsForm = this.fb.nonNullable.group({
      maxSessions: this.fb.control<number>(0, Validators.required),
    });

    this.route.paramMap.subscribe(params => {
      this.username = params.get('name')!;
      this.reloadUser();
    });
  }

  username = '';

  // TODO proper error handling (2016 note, kept)
  reloadUser(): void {
    this.reloading.set(true);
    this.nexus.userList(this.username, 0, 0).then(res => {
      try {
        this.user.set(res.filter((x: any) => x.User === this.username)[0]);
        this.tags.set(JSON.stringify(this.user().Tags, null, 2));
      } catch (e) {
        this.user.set(null);
      }
      this.reloading.set(false);
    });
    this.nexus.userGetTags(this.username).then(res => {
      this.effectivetags.set(JSON.stringify(res.tags, null, 2));
    });
    this.nexus.sessionList(this.username, 0, 0).then(res => {
      try {
        this.sessions.set(res.filter((x: any) => x.User === this.username)[0]);
      } catch (e) {}
    });
  }

  deleteTag(path: string, key: string): void {
    this.genericAction('Error deleting tag: ', () =>
      this.nexus.userDelTags(this.user().User, path, [key]),
    );
  }

  toggleDisabled(): void {
    this.genericAction('Error changing user disabled state: ', () =>
      this.nexus.userSetDisabled(this.user().User, !this.user().Disabled),
    );
  }

  addTemplate(): void {
    this.genericAction('Could not add template: ', () =>
      this.nexus.userAddTemplate(this.username, this.formTemplate.value['template']!),
    );
  }

  deleteTemplate(template: string): void {
    this.genericAction('Could not delete template: ', () =>
      this.nexus.userDelTemplate(this.username, template),
    );
  }

  addWhitelist(): void {
    this.genericAction('Could not add white list ip: ', () =>
      this.nexus.userAddWhitelist(this.username, this.formWhitelist.value['ip']!),
    );
  }

  deleteWhitelist(ip: string): void {
    this.genericAction('Could not delete white list ip: ', () =>
      this.nexus.userDelWhitelist(this.username, ip),
    );
  }

  addBlacklist(): void {
    this.genericAction('Could not add black list ip: ', () =>
      this.nexus.userAddBlacklist(this.username, this.formBlacklist.value['ip']!),
    );
  }

  deleteBlacklist(ip: string): void {
    this.genericAction('Could not delete black list ip: ', () =>
      this.nexus.userDelBlacklist(this.username, ip),
    );
  }

  editPassword(): void {
    this.genericAction('Could not change user password: ', () =>
      this.nexus.userSetPass(this.username, this.formEditPassword.value['password']!),
    );
  }

  editMaxsessions(): void {
    const event = { maxSessions: this.editMaxsessionsForm.value['maxSessions'] };
    this.genericAction('Could not change max sessions: ', () =>
      this.nexus.userSetMaxSessions(this.username, event.maxSessions!),
    );
  }

  addTag(): void {
    const path = this.addTagsForm.get('path')!.value;
    const tag = this.addTagsForm.get('tag')!.value;
    const tags = { [tag!]: this.tagValue };
    this.genericAction('Could not add tags: ', () =>
      this.nexus.userSetTags(this.username, path!, tags),
    );
  }

  tryPassword(): void {
    this.macros.directActionWithConfirmation(
      'Login successful!',
      'Could not log in: ',
      () => this.nexus.oneshotLogin(this.username, this.tryPasswordForm.value['password']!),
      () => {},
    );
  }

  private genericAction(text: string, action: () => Promise<any>): void {
    this.macros.directAction(text, action, () => this.reloadUser());
  }

  private matchingPasswords(group: any): any {
    const password = group.controls['password'];
    const confirmPassword = group.controls['confirmPassword'];
    if (password.value !== confirmPassword.value) {
      return { mismatchedPasswords: true };
    }
  }

  format(value: any): string {
    return JSON.stringify(value);
  }
}
