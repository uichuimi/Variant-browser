import { TestBed } from '@angular/core/testing';
import { LoginService } from './services/login.service';

import { VarCanService } from './var-can.service';

describe('VarCanService', () => {
  let service: VarCanService;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('LoginService', ['login']);

    TestBed.configureTestingModule({
      providers: [
        service,
        { provide: LoginService, useValue: spy }
      ]
    });
    service = TestBed.inject(VarCanService);
    loginServiceSpy = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /*it("#login should return token: <Token>", () => {
    const loginModel: Login = { username: "uichuimi", password: "uichuimi01" };
    const token: Token = { access_token: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1aWNodWltaSIsImV4cCI6MTY0NjUxNDMyMCwiaWF0IjoxNjQ2NDc4MzIwfQ.    gZY1DohG7NfrXCwrngN6EJtD9KaMzEGG7Ef8yh3Gv6mBsbkVy4hay6hFIdERdx1dz0LX0XODto7aFaPUo93_lA" };
    loginServiceSpy.login.and.returnValue(token);

    expect(service.login(loginModel))
      .withContext("service returned token")
      .toBe(token);
    expect(loginServiceSpy.login.calls.count())
      .withContext('spy method was called once')
      .toBe(1);
    expect(loginServiceSpy.login.calls.mostRecent().returnValue)
      .toBe(token);
  });

  it("#login should return status: failed", () => {
    const loginModel: Login = { username: "noExisto", password: "uichuimi" };
    const status: ResponseStatus = { status: "failed" };
    loginServiceSpy.login.and.returnValue(status);

    expect(service.login(loginModel))
      .withContext("service return status failed")
      .toBe(status);
    expect(loginServiceSpy.login.calls.count())
      .withContext('spy method was called once')
      .toBe(1);
    expect(loginServiceSpy.login.calls.mostRecent().returnValue)
      .toBe(status);
  });*/
});
