import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
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
  protected countryCode!: string;
  protected holidays: Holiday[] = [];
  protected years: number[] = Array.from({ length: 11 }, (_, index: number) => 2020 + index);
  private currentYear: number = new Date().getFullYear();
  private readonly countryService: CountryService = inject(CountryService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.countryCode = params.get('code') || '';
      this.getHolidays(this.currentYear);
    });
  }

  protected changeYear(year: number): void {
    this.currentYear = year;
    this.getHolidays(year);
  }

  private getHolidays(year: number): void {
    this.countryService
      .getHolidays(year, this.countryCode)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((holidays: Holiday[]) => {
        this.holidays = holidays;
      });
  }
}
