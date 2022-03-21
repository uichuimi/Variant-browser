import { Injectable, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private url: string;

  constructor(@Inject(String) serverUrl: string) {
    this.url = serverUrl;
  }
}
