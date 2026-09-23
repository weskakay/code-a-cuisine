import { Routes } from '@angular/router';
import { Generate } from './components/generate/generate';
import { Home } from './components/home/home';

export const routes: Routes = [
  { path: '', component: Home, title: 'Code à Cuisine' },
  { path: 'generate', component: Generate, title: 'Generate recipe' },
  { path: '**', redirectTo: '' },
];
