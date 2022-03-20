import { Injectable, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(@Inject(String) private serverUrl: string) { }
}
