import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Country } from '../models/country.model';
import { Holiday } from '../models/holiday.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private readonly http: HttpClient = inject(HttpClient);

  public getAvailableCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${environment.baseUrl}/AvailableCountries`);
  }

  public getHolidays(year: number, countryCode: string): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(`${environment.baseUrl}/PublicHolidays/${year}/${countryCode}`);
  }

  public getNextPublicHoliday(countryCode: string): Observable<any> {
    return this.http
      .get<any[]>(`${environment.baseUrl}/NextPublicHolidays/${countryCode}`)
      .pipe(map((holidays) => holidays[0] || null));
  }
}
