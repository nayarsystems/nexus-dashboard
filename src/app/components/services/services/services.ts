import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

import { NewServiceDialogComponent } from '../new-service-dialog/new-service-dialog';
import { NexusFacade } from '../../../services/nexus-facade';
import { NexusService } from '../../../services/nexus';
import { isPrefix, Max, Min } from '../../../shared/functions';

declare var JSONEditor: any;

@Component({
  selector: 'app-services',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule, TranslatePipe, TranslateDirective,],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class ServicesComponent implements OnInit, OnDestroy {
  private readonly nexus = inject(NexusService);
  private readonly nxf = inject(NexusFacade);
  private readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);

  services: any = {};
  serviceshow: string[] = [];
  servicepaths: string[] = [];
  prefix = new FormControl('');
  subscriptions: Subscription[] = [];
  errors: any = null;

  private editor: any = null;

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  async ngOnInit(): Promise<void> {
    this.servicepaths = [];
    this.serviceshow = [];
    this.prefix = new FormControl('');
    this.subscriptions = [];
    await this.listPulls();

    const services = await this.nxf.getServices();
    for (const servicepath of services) {
      this.services[servicepath] = { pulls: 0 };
      this.servicepaths.push(servicepath);
      this.updateInfo(servicepath);
      this.updateSchema(servicepath);
    }
    this.serviceshow = this.servicepaths;
    this.cdr.markForCheck();
    this.subscriptions.push(
      (this.prefix.valueChanges as any).pipe(debounceTime(300)).subscribe((p: string) => {
        this.serviceshow = [];
        for (const path of this.servicepaths) {
          if (isPrefix(p, path)) {
            this.serviceshow.push(path);
          }
        }
      }),
    );
  }

  private async listPulls(): Promise<void> {
    for (const path in this.services) {
      this.services[path].pulls = 0;
    }
    await this.nexus
      .taskList('', 0, 0)
      .then(tasks => {
        for (const task of tasks) {
          if (task.Method === '') {
            const path = task.Path.slice(0, -1);
            if (this.services[path]) {
              this.services[path]['pulls']++;
            }
          }
        }
      })
      .catch(e => console.log(e));
  }

  private async updateInfo(servicepath: string): Promise<void> {
    await this.nexus
      .taskPush(servicepath + '.@info', null, 5)
      .then(res => {
        this.services[servicepath]['info'] = res;
        this.cdr.markForCheck();
      })
      .catch(err => console.log('Service @info error:', err));
  }

  private async updateSchema(servicepath: string): Promise<void> {
    await this.nexus
      .taskPush(servicepath + '.@schema', null, 5)
      .then(res => {
        const methods = res.methods;
        this.services[servicepath]['schema'] = methods;
        this.services[servicepath]['methodSelected'] = new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        });
        this.services[servicepath]['schemastring'] = JSON.stringify(methods, null, 2);
        this.services[servicepath]['methods'] = [];
        for (const method in methods) {
          if (['@ping', '@info', '@schema'].indexOf(method) < 0) {
            this.services[servicepath]['methods'].push(method);
          }
        }
        this.cdr.markForCheck();
        this.subscriptions.push(
          this.services[servicepath]['methodSelected'].valueChanges.subscribe(
            (v: string) => {
              this.services[servicepath]['pushSchema'] = undefined;
              this.services[servicepath]['noSchema'] = false;
              this.services[servicepath]['methodschemastring'] = '';
              if (methods[v] && methods[v]['input']) {
                this.services[servicepath]['pushSchema'] = methods[v]['input'];
                this.services[servicepath]['methodschemastring'] = JSON.stringify(
                  methods[v]['input'],
                  null,
                  2,
                );
              } else {
                this.services[servicepath]['noSchema'] = true;
              }
              this.initEditor(methods[v] ? methods[v].input : null, v);
              this.cdr.markForCheck();
            },
          ),
        );
      })
      .catch(err => console.log('Service @schema error:', err));
  }

  pingService(path: string): void {
    this.services[path]['ping'] = undefined;
    let max = 0;
    let min = 15000;
    let avg = 0;
    let i = 0;
    let start = new Date();
    const ping = () => {
      if (i === 10) {
        this.services[path]['ping'] = {
          max: max,
          min: min,
          avg: avg / 10,
        };
        this.cdr.markForCheck();
        this.updateInfo(path);
        return;
      }
      i++;
      this.nexus
        .taskPush(path + '.@ping', null, 5)
        .then(() => {
          const end = new Date();
          const timediff = end.getTime() - start.getTime();
          max = Max(max, timediff);
          min = Min(min, timediff);
          avg += timediff;
          start = new Date();
          ping();
        })
        .catch(() => {
          this.services[path]['info'] = undefined;
        });
    };
    ping();
  }

  pushService(path: string, event: any): void {
    this.services[path]['pushResult'] = undefined;
    this.services[path]['pushError'] = undefined;
    this.nexus
      .taskPush(path + '.' + this.services[path]['methodSelected'].value, event, 10)
      .then((res: any) => {
        this.services[path]['pushResult'] = JSON.stringify(res, null, 2);
        this.cdr.markForCheck();
      })
      .catch((err: any) => {
        this.services[path]['pushError'] = JSON.stringify(err, null, 2);
        this.cdr.markForCheck();
      });
  }

  initEditor(schema: any, method: string): void {
    const e = document.getElementById('editor_holder_' + method);
    if (this.editor) {
      this.editor.destroy();
    }
    if (schema && e) {
      this.editor = new JSONEditor(e, {
        schema: schema,
      });
    }
  }

  push(path: string): void {
    this.errors = null;
    this.errors = this.editor.validate();
    if (this.errors.length === 0) {
      const value = this.editor.getValue();
      this.pushService(path, value);
    }
  }

  newService(): void {
    const dialogRef = this.dialog.open(NewServiceDialogComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ngOnInit();
      }
    });
  }
}
