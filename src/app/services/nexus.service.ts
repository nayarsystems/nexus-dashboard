import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

declare var nexus: any;

@Injectable()
export class NexusService {
    client: any;

    constructor() {
        console.log(environment.nexus.url);
    }

    login(user: string, password: string) {
        this.client = new Promise((res, rej) => {
            nexus.dial(environment.nexus.url, function (client, err) {
                if (!err) {
                    client.login(user, password, (response, error) => {
                        console.log(response, error);
                        if (!error) {
                            console.log('Login successful.');
                            res(client);
                        } else {
                            console.log('Could not login using OTP: ', error);
                            client.close();
                            rej(false);
                        }
                    });
                } else {
                    console.log('Dial failed: ', err);
                    rej(false);
                }
            });
        });
        return this.client;
    }

    getResponse() {
        return new Promise(function (resolve) {
            resolve('response');
        });
    }

    taskPush(path: string, params: any, timeout: number) {
        return new Promise((res, rej) => {
            this.client.then(c => {
                if (c) {
                    c.taskPush(path, params, timeout, (response, err) => {
                        if (err) {
                            console.log('Error in taskpush:', JSON.stringify(err));
                            rej(err);
                        } else {
                            res(response);
                        }
                    });
                } else {
                    return rej('No Nexus Client');
                }
            });
        });
    }

    pushWithPipe(path: string, params: any, timeout: number): any {
        if (this.client) {
            let pipepromise = this.createPipe();
            return [
                this.pushPipePromise(path, params, timeout, pipepromise),
                this.pipeObservable(pipepromise)
            ];

        } else {
            return [
                new Promise((rj) => rj('No Nexus Client')),
                new Promise((rj) => rj('No Nexus Client'))
            ];
        }
    }

    pushPipePromise(path: string, params: any, timeout: number, pipepromise: Promise<any>): Promise<any> {
        let that = this;
        params = params || {};
        return new Promise((rs) => {
            pipepromise.then(pipe => {
                params['pipeid'] = pipe.id;
                that.taskPush(path, params, timeout)
                    .then(response => {
                        rs(response);
                        pipe.close();
                    });
            });
        });
    }

    pipeObservable(pipepromise: Promise<any>): Observable<any> {
        return new Observable(observer => {
            let that = this;
            pipepromise.then(pipe => {
                let read = function () {
                    that.readPipe(pipe)
                        .then(response => {
                            if (response.msgs[0]) {
                                observer.next(response.msgs[0].msg);
                                read();
                            } else {
                                observer.complete();
                            }
                        });
                };
                read();
            });
        });
    }

    createPipe(): Promise<any> {
        let that = this;
        return new Promise((resolve, reject) => {
            that.client.pipeCreate({}, (response, err) => {
                if (err) {
                    reject('No pipe');
                } else {
                    resolve(response);
                }
            });
        });
    }

    readPipe(pipe): Promise<any> {
        return new Promise((resolve, reject) => {
            pipe.read(1, 60, (response, err) => {
                if (err) {
                    reject('Couldn\'t read');
                } else {
                    resolve(response);
                }
            });
        });
    }
}
