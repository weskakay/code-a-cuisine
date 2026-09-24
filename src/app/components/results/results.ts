import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecipeStoreService } from '../../services/recipe-store.service';
import { MenuBar } from '../menu-bar/menu-bar';
import { SiteFooter } from '../site-footer/site-footer';

/** Step three: the three suggestions the workflow sent back. */
@Component({
  selector: 'app-results',
  imports: [MenuBar, RouterLink, SiteFooter],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results {
  private readonly store = inject(RecipeStoreService);

  readonly recipes = this.store.recipes;
  readonly quota = this.store.quota;
}
