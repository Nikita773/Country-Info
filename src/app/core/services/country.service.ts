import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Country } from '../models/country.model';
import { Holiday } from '../models/holiday.model';

const API_URL = 'https://date.nager.at/api/v3';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private readonly http: HttpClient = inject(HttpClient);

  public getAvailableCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${API_URL}/AvailableCountries`);
  }

  public getHolidays(year: number, countryCode: string): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(`${API_URL}/PublicHolidays/${year}/${countryCode}`);
  }

  public getNextPublicHoliday(countryCode: string): Observable<any> {
    return this.http
      .get<any[]>(`${API_URL}/NextPublicHolidays/${countryCode}`)
      .pipe(map((holidays) => holidays[0] || null));
  }
}
