import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { RandomCountryWidgetComponent } from '../random-country-widget/random-country-widget.component';
import { Country } from '../../core/models/country.model';
import { CountryService } from '../../core/services/country.service';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCardModule,
    MatListModule,
    MatFormFieldModule,
    FormsModule,
    RouterLink,
    MatInput,
    RandomCountryWidgetComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  protected searchQuery: string = '';
  private countries: Country[] = [];

  private readonly countryService: CountryService = inject(CountryService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.getCountries();
  }

  protected filterCountries(): Country[] {
    return this.countries.filter((country: Country) =>
      country.name.toLowerCase().includes(this.searchQuery.toLowerCase()),
    );
  }

  private getCountries(): void {
    this.countryService
      .getAvailableCountries()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((countries: Country[]) => {
        this.countries = countries;
      });
  }
}
