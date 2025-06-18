import { TestBed } from '@angular/core/testing';

import { SlDevComponentsService } from './sl-dev-components.service';

describe('SlDevComponentsService', () => {
  let service: SlDevComponentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlDevComponentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
