import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecipeDraftService } from '../../services/recipe-draft.service';
import { LanguageService } from '../../services/language.service';
import { RecipeStoreService } from '../../services/recipe-store.service';
import { Icon } from '../icon/icon';
import { MenuBar } from '../menu-bar/menu-bar';
import { SiteFooter } from '../site-footer/site-footer';

/** Step three: the three suggestions the workflow sent back. */
@Component({
  selector: 'app-results',
  imports: [Icon, MenuBar, RouterLink, SiteFooter],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results {
  private readonly store = inject(RecipeStoreService);
  private readonly draft = inject(RecipeDraftService);
  private readonly languages = inject(LanguageService);

  readonly text = this.languages.t;

  readonly recipes = this.store.recipes;

  /** False before the first generation, so the page skips the promise and the tags. */
  readonly hasRecipes = computed(() => this.recipes().length > 0);
  readonly quota = this.store.quota;

  /** The cooking style and the time frame the visitor asked for. */
  readonly chosen = computed(() => [
    this.text().cuisines[this.draft.cuisine()],
    this.text().times[this.draft.cookingTime()],
  ]);

  /** A new recipe starts from an empty list, not from the last one. */
  startNew(): void {
    this.draft.reset();
  }
}
