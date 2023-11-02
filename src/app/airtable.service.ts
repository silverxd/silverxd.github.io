import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AirtableService {
  private apiKey = 'patnb5mM0kP09kYSD.fabdae998c25750780c23cbc877f04e4dcc0c575ed26f4dd30c412f956d4dd7f';
  private baseUrl = 'https://api.airtable.com/v0/appFgMpOOZuuwKFDp/Account';

  constructor(private http: HttpClient) {}

  getUserByUsername(username: string): Observable<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    };

    return this.http.get(`${this.baseUrl}?filterByFormula=({Username}='${username}')`, options);
  }
}
