import { TestBed } from '@angular/core/testing';

import { RoleRedirect } from './role-redirect';

describe('RoleRedirect', () => {
  let service: RoleRedirect;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleRedirect);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
