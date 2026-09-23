import { Routes } from '@angular/router';
import { Generate } from './components/generate/generate';
import { Home } from './components/home/home';
import { Preferences } from './components/preferences/preferences';
import { RecipeDetail } from './components/recipe-detail/recipe-detail';
import { Results } from './components/results/results';

export const routes: Routes = [
  { path: '', component: Home, title: 'Code à Cuisine' },
  { path: 'generate', component: Generate, title: 'Generate recipe' },
  { path: 'preferences', component: Preferences, title: 'Choose your preferences' },
  { path: 'results', component: Results, title: 'The recipe results' },
  { path: 'recipe/:id', component: RecipeDetail, title: 'Recipe' },
  { path: '**', redirectTo: '' },
];
