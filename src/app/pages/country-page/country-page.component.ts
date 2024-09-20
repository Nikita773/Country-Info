import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CountryService } from '../../core/services/country.service';
import { Holiday } from '../../core/models/holiday.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-country-page',
  standalone: true,
  imports: [MatCardModule, MatListModule, MatButton],
  templateUrl: './country-page.component.html',
  styleUrl: './country-page.component.scss',
})
export class CountryPageComponent implements OnInit {
  protected countryCode: WritableSignal<string> = signal('');
  protected holidays: WritableSignal<Holiday[]> = signal([]);
  protected readonly years: number[] = Array.from({ length: 11 }, (_, index: number) => 2020 + index);
  private currentYear: WritableSignal<number> = signal(new Date().getFullYear());
  private readonly countryService: CountryService = inject(CountryService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: ParamMap) => {
      this.countryCode.set(params.get('code') || '');
      this.fetchHolidays(this.currentYear(), this.countryCode());
    });
  }

  protected changeYear(year: number): void {
    this.currentYear.set(year);
    this.fetchHolidays(this.currentYear(), this.countryCode());
  }

  private fetchHolidays(year: number, countryCode: string): void {
    this.countryService
      .getHolidays(year, countryCode)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((holidays: Holiday[]) => {
        this.holidays.set(holidays);
      });
  }
}
