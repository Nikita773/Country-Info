import { Component, computed, DestroyRef, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
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
  protected searchQuery: WritableSignal<string> = signal('');
  protected filteredCountries: Signal<Country[]> = computed(() => this.filterCountries());
  private countries: WritableSignal<Country[]> = signal([]);

  private readonly countryService: CountryService = inject(CountryService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.fetchCountries();
  }

  protected filterCountries(): Country[] {
    return this.countries().filter((country: Country) =>
      country.name.toLowerCase().includes(this.searchQuery().toLowerCase()),
    );
  }

  private fetchCountries(): void {
    this.countryService
      .getAvailableCountries()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((countries: Country[]) => {
        this.countries.set(countries);
      });
  }
}
