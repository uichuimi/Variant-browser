import { Injectable, NgModule } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
@NgModule({
  providers: [{provide: String, useValue: "dummy"}],
})
export class ApiService {

  constructor(private serverUrl: string) { }
}
