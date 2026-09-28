import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COOKING_TIMES, CUISINES } from '../../data/options';
import { RecipeDraftService } from '../../services/recipe-draft.service';
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
  private readonly draft = inject(RecipeDraftService);

  readonly recipes = this.store.recipes;
  readonly quota = this.store.quota;

  /** The cooking style and the time frame the visitor asked for. */
  readonly chosen = computed(() =>
    [
      CUISINES.find((entry) => entry.value === this.draft.cuisine())?.label,
      COOKING_TIMES.find((entry) => entry.value === this.draft.cookingTime())?.label,
    ].filter((label) => !!label),
  );
}
