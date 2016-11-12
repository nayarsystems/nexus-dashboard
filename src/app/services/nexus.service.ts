import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

declare var nexus: any;

@Injectable()
export class NexusService {
    client: any;

    constructor() { }

    login(user: string, password: string) {
        this.client = new Promise((res, rej) => {
            nexus.dial(environment.nexus.url, function (client, err) {
                if (!err) {
                    client.login(user, password, (response, error) => {
                        if (!error) {
                            console.log('Login successful.');
                            res(client);
                        } else {
                            console.log('Could not login: ', error);
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

    taskPush(path: string, params: any, timeout: number): Promise<any> {
        return new Promise((res, rej) => {
            this.client.then(c => {
                if (c) {
                    c.taskPush(path, params, timeout, (response, err) => {
                        if (err) {
                            console.log('Error in taskpush:', err);
                            rej(err);
                        } else {
                            res(response);
                        }
                    });
                } else {
                    rej('No Nexus Client');
                }
            });
        });
    }
    
    userList(): Promise<any[]> {
        return new Promise((res, rej) => {
            this.client.then(c => {
                if (c) {
                    c.userList("", 0, 0, (response, err) => {
                        if (err) {
                            console.log('Error in userList:', err);
                            rej(err);
                        } else {
                            res(response);
                        }
                    })
                } else {
                    rej('No Nexus Client');
                }
            })
        })
    }
    
    taskList(): Promise<any[]> {
        return new Promise((res, rej) => {
            this.client.then(c => {
                if (c) {
                    c.taskList("", 0, 0, (response, err) => {
                        if (err) {
                            console.log('Error in taskList:', err);
                            rej(err);
                        } else {
                            res(response);
                        }
                    })
                } else {
                    rej('No Nexus Client');
                }
            })
        })
    }
}
