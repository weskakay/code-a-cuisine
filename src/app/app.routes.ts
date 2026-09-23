import { Routes } from '@angular/router';
import { Generate } from './components/generate/generate';
import { Home } from './components/home/home';
import { Preferences } from './components/preferences/preferences';

export const routes: Routes = [
  { path: '', component: Home, title: 'Code à Cuisine' },
  { path: 'generate', component: Generate, title: 'Generate recipe' },
  { path: 'preferences', component: Preferences, title: 'Choose your preferences' },
  { path: '**', redirectTo: '' },
];
