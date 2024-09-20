import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { CountryService } from '../../core/services/country.service';
import { forkJoin, map, mergeMap, Observable } from 'rxjs';
import { Country } from '../../core/models/country.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Widget } from '../../core/models/widget.model';

@Component({
  selector: 'app-random-country-widget',
  standalone: true,
  imports: [MatCardModule, MatListModule],
  templateUrl: './random-country-widget.component.html',
  styleUrl: './random-country-widget.component.scss',
})
export class RandomCountryWidgetComponent implements OnInit {
  protected randomCountries: Widget[] = [];
  private readonly countryService: CountryService = inject(CountryService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.loadRandomCountries();
  }

  private loadRandomCountries(): void {
    this.getRandomCountriesWithNextHolidays()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((countriesWithHolidays) => {
        this.randomCountries = countriesWithHolidays;
      });
  }

  private getRandomCountriesWithNextHolidays(): Observable<Widget[]> {
    return this.getRandomCountries(3).pipe(
      mergeMap((randomCountries: Country[]) => this.getHolidayWidgets(randomCountries)),
    );
  }

  private getRandomCountries(count: number): Observable<Country[]> {
    return this.countryService
      .getAvailableCountries()
      .pipe(map((countries: Country[]) => this.getRandomElements(countries, count)));
  }

  private getHolidayWidgets(randomCountries: Country[]): Observable<Widget[]> {
    const holidayRequests: Observable<Widget>[] = randomCountries.map((country: Country) =>
      this.getNextHoliday(country.countryCode).pipe(
        map((holiday) => ({
          countryName: country.name,
          holidayName: holiday?.name || 'No holidays found',
          date: holiday?.date || 'No date available',
        })),
      ),
    );
    return forkJoin(holidayRequests);
  }

  private getNextHoliday(countryCode: string): Observable<any> {
    return this.countryService.getNextPublicHoliday(countryCode).pipe(takeUntilDestroyed(this.destroyRef));
  }

  private getRandomElements(array: Country[], count: number): Country[] {
    return array.sort(() => Math.random() - 0.5).slice(0, count);
  }
}
