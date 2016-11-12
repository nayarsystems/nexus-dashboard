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
}
