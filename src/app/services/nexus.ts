import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { host } from '../../environments/environment.local';
import { NewTask, Session } from '../shared/models';

// The nxjs.min.js client is an untyped global loaded from index.html.
declare var nexus: any;

@Injectable({ providedIn: 'root' })
export class NexusService {
  private client: Promise<any> | null = null;
  private logged = false;
  private clientversion = '';
  private nexusversion = '';

  constructor(private router: Router) {}

  isLogged(): boolean {
    return this.logged;
  }

  clientVersion(): string {
    return this.clientversion;
  }

  version(): string {
    return this.nexusversion;
  }

  sessionKick(connID: string): Promise<any> {
    return this.genericNexusFunction('sessionKick', [connID]);
  }

  sessionReload(connID: string): Promise<any> {
    return this.genericNexusFunction('sessionReload', [connID]);
  }

  lock(name: string): Promise<any> {
    return this.genericNexusFunction('lock', [name]);
  }

  unlock(name: string): Promise<any> {
    return this.genericNexusFunction('unlock', [name]);
  }

  nodesObservable(): Observable<any[]> {
    return new Observable(observer => {
      this.nodeList(0, 0)
        .then(res => observer.next(res))
        .catch(e => console.log(e));
    });
  }

  nodeList(limit: number, skip: number): Promise<any[]> {
    return this.genericNexusFunction('nodeList', [limit, skip]);
  }

  userAddTemplate(user: string, template: string): Promise<any> {
    return this.genericNexusFunction('userAddTemplate', [user, template]);
  }

  userDelTemplate(user: string, template: string): Promise<any> {
    return this.genericNexusFunction('userDelTemplate', [user, template]);
  }

  userAddWhitelist(user: string, ip: string): Promise<any> {
    return this.genericNexusFunction('userAddWhitelist', [user, ip]);
  }

  userDelWhitelist(user: string, ip: string): Promise<any> {
    return this.genericNexusFunction('userDelWhitelist', [user, ip]);
  }

  userAddBlacklist(user: string, ip: string): Promise<any> {
    return this.genericNexusFunction('userAddBlacklist', [user, ip]);
  }

  userDelBlacklist(user: string, ip: string): Promise<any> {
    return this.genericNexusFunction('userDelBlacklist', [user, ip]);
  }

  userGetTags(user: string): Promise<any> {
    return this.genericNexusFunction('userGetTags', [user]);
  }

  userDelTags(user: string, path: string, tags: string[]): Promise<any> {
    return this.genericNexusFunction('userDelTags', [user, path, tags]);
  }

  userSetPass(user: string, password: string): Promise<any> {
    return this.genericNexusFunction('userSetPass', [user, password]);
  }

  userSetMaxSessions(user: string, maxSessions: number): Promise<any> {
    return this.genericNexusFunction('userSetMaxSessions', [user, maxSessions]);
  }

  userSetTags(user: string, path: string, tags: any): Promise<any> {
    return this.genericNexusFunction('userSetTags', [user, path, tags]);
  }

  userListObservable(params: Observable<any>): Observable<any[]> {
    return new Observable(observer => {
      params.subscribe(p => {
        this.userList(p.prefix, p.limit, p.skip)
          .then(res => observer.next(res))
          .catch(e => console.log(e));
      });
    });
  }

  sessionsObservable(changes: Observable<any>): Observable<Session[]> {
    return new Observable(observer => {
      changes.subscribe(p => {
        this.sessionList(p.prefix, 0, 0)
          .then(res => observer.next(this.expandSessions(res)))
          .catch(e => console.log(e));
      });
    });
  }

  expandSessions(userSessions: any[]): Session[] {
    const sessions: Session[] = [];
    for (const userSession of userSessions) {
      for (const session of userSession.Sessions) {
        sessions.push(
          new Session(
            userSession.User,
            session.Id,
            session.RemoteAddress,
            session.Protocol,
            session.CreationTime,
          ),
        );
      }
    }
    return sessions;
  }

  userTotalObservable(prefix: Observable<string>): Observable<number> {
    return new Observable(observer => {
      prefix.subscribe(p => {
        this.userTotal(p)
          .then(res => observer.next(res))
          .catch(e => console.log(e));
      });
    });
  }

  userTotal(prefix: string): Promise<number> {
    const ps = this.splitPathPrefixAndSuffix(prefix);
    return this.genericNexusFunction('userCountWithOpts', [
      ps[0],
      this.filter(ps[1]),
    ]).then((res: any) => res.count);
  }

  userCreate(username: string, password: string): Promise<any> {
    return this.genericNexusFunction('userCreate', [username, password]);
  }

  userDelete(username: string): Promise<any> {
    return this.genericNexusFunction('userDelete', [username]);
  }

  userSetDisabled(username: string, disabled: boolean): Promise<any> {
    return this.genericNexusFunction('userSetDisabled', [username, disabled]);
  }

  userList(prefix: string, limit: number, skip: number): Promise<any[]> {
    const ps = this.splitPathPrefixAndSuffix(prefix);
    return this.genericNexusFunction('userListWithOpts', [
      ps[0],
      limit,
      skip,
      this.filter(ps[1]),
    ]);
  }

  taskListObservable(params: Observable<any>): Observable<any[]> {
    return new Observable(observer => {
      params.subscribe(p => {
        this.taskList(p.prefix, p.limit, p.skip)
          .then(res => observer.next(res))
          .catch(e => console.log(e));
      });
    });
  }

  taskTotal(prefix: string): Promise<number> {
    const ps = this.splitPathPrefixAndSuffix(prefix);
    return this.genericNexusFunction('taskCountWithOpts', [
      ps[0],
      this.filter(ps[1]),
    ]).then((res: any) => res.count);
  }

  taskList(prefix: string, limit: number, skip: number): Promise<any[]> {
    const ps = this.splitPathPrefixAndSuffix(prefix);
    return this.genericNexusFunction('taskListWithOpts', [
      ps[0],
      limit,
      skip,
      this.filter(ps[1]),
    ]).then((res: any[]) => res.map(t => NewTask(t)));
  }

  sessionTotal(prefix: string): Promise<number> {
    const ps = this.splitPathPrefixAndSuffix(prefix);
    return this.genericNexusFunction('sessionCountWithOpts', [
      ps[0],
      this.filter(ps[1]),
    ]).then((res: any) => res.count);
  }

  sessionList(prefix: string, limit: number, skip: number): Promise<any[]> {
    const ps = this.splitPathPrefixAndSuffix(prefix);
    return this.genericNexusFunction('sessionListWithOpts', [
      ps[0],
      limit,
      skip,
      this.filter(ps[1]),
    ]);
  }

  taskPush(path: string, params: any, timeout: number): Promise<any> {
    return this.genericNexusFunction('taskPush', [path, params, timeout]);
  }

  taskPull(path: string, timeout: number): Promise<any> {
    return this.genericNexusFunction('taskPull', [path, timeout]);
  }

  topicPublish(topic: string, params: any): Promise<any> {
    return this.genericNexusFunction('topicPublish', [topic, params]);
  }

  topicSubscribe(pipe: any, topic: string): Promise<any> {
    return this.genericNexusFunction('topicSubscribe', [pipe, topic]);
  }

  pipeCreate(): Promise<any> {
    return this.genericNexusFunction('pipeCreate', [{}]);
  }

  logout(): void {
    this.client!.then(client => client.close());
    this.client = null;
    location.reload();
  }

  login(user: string, password: string): Promise<any> {
    const that = this;
    this.client = new Promise((res, rej) => {
      nexus.dial(host, (client: any, err: any) => {
        if (!err) {
          client.exec('sys.login', { user: user, pass: password }, function (
            this: any,
            response: any,
            error: any,
          ) {
            if (!error) {
              that.logged = true;
              that.clientversion = client.version();
              that.nexusversion = client.nexusVersion();
              res(client);
              that.router.navigate(['/dashboard']);
            } else {
              client.close();
              rej(false);
            }
          });
        } else {
          console.error({ label: 'NexusService', humanLog: 'Dial failed: ', log: err });
          rej(false);
        }
      });
    });
    return this.client;
  }

  oneshotLogin(user: string, password: string): Promise<any> {
    return new Promise((res, rej) => {
      nexus.dial(host, (client: any, err: any) => {
        if (!err) {
          client.exec('sys.login', { user: user, pass: password }, (
            response: any,
            error: any,
          ) => {
            client.close();
            if (!error) {
              res(null);
            } else {
              rej(error);
            }
          });
        } else {
          rej(err);
        }
      });
    });
  }

  pipeObservable(pipe: any): Observable<any> {
    return new Observable(observer => {
      const read = () => {
        pipe.read(1, 60, (response: any, err: any) => {
          if (!err && response.msgs[0]) {
            observer.next(response.msgs[0].msg.msg);
          }
          read();
        });
      };
      read();
    });
  }

  // TODO handle errors correctly (2016 note, kept from the legacy service)
  private genericNexusFunction(func: string, params: any[]): Promise<any> {
    return new Promise((res, rej) => {
      this.client!.then(c => {
        params.push((response: any, err: any) => {
          if (err) {
            if (err.code === -32007) {
              setTimeout(() => location.reload(), 2000);
            }
            rej(err);
          } else {
            res(response);
          }
        });
        c[func](...params);
      }).catch(e => rej(e));
    });
  }

  private splitPathPrefixAndSuffix(path: string): string[] {
    const parts = path.split('.');
    const prefix = parts.slice(0, -1).join('.');
    const suffix = parts[parts.length - 1];
    return [prefix, suffix];
  }

  private filter(value: string): any {
    return { Filter: value, LimitByDepth: false, Depth: -1 };
  }
}
