/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GraphsService } from './graphs.service';

describe('Service: Graphs', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GraphsService]
    });
  });

  it('should ...', inject([GraphsService], (service: GraphsService) => {
    expect(service).toBeTruthy();
  }));
});
