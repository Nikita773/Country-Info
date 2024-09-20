import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CountryPageComponent } from './pages/country-page/country-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'country/:code', component: CountryPageComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
