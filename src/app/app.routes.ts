import { Routes } from '@angular/router';
import { Cookbook } from './components/cookbook/cookbook';
import { CuisinePage } from './components/cuisine-page/cuisine-page';
import { Generate } from './components/generate/generate';
import { Home } from './components/home/home';
import { Imprint } from './components/imprint/imprint';
import { Preferences } from './components/preferences/preferences';
import { RecipeDetail } from './components/recipe-detail/recipe-detail';
import { Results } from './components/results/results';

/** The title is the key of the text, the strategy turns it into words. */
export const routes: Routes = [
  { path: '', component: Home, title: 'home' },
  { path: 'generate', component: Generate, title: 'generate' },
  { path: 'preferences', component: Preferences, title: 'preferences' },
  { path: 'cookbook', component: Cookbook, title: 'cookbook' },
  { path: 'cookbook/:cuisine', component: CuisinePage, title: 'cookbook' },
  { path: 'results', component: Results, title: 'results' },
  { path: 'recipe/:id', component: RecipeDetail, title: 'recipe' },
  { path: 'imprint', component: Imprint, title: 'imprint' },
  { path: '**', redirectTo: '' },
];
