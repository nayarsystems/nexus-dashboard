import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

@Injectable()
export class EventBusService {
  bus: Subject<any> = new Subject<any>();

  constructor() { }
  
  dispatch(data: any) {
    this.bus.next(data);
  }
  
  listen(type: string): Observable<any> {
    return this.bus.filter(event => event.name === type);
  }

}
