import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CUISINES, RECIPES_PER_PAGE } from '../../data/options';
import type { Language } from '../../data/texts';
import type { Cuisine, Recipe } from '../../interfaces/recipe.interface';
import { LanguageService } from '../../services/language.service';
import { RecipeService, type RecipePage } from '../../services/recipe.service';
import { MenuBar } from '../menu-bar/menu-bar';
import { RecipeList } from '../recipe-list/recipe-list';
import { SiteFooter } from '../site-footer/site-footer';

/** All recipes of one cooking style, numbered and split into pages. */
@Component({
  selector: 'app-cuisine-page',
  imports: [MenuBar, RecipeList, RouterLink, SiteFooter],
  templateUrl: './cuisine-page.html',
  styleUrl: './cuisine-page.scss',
})
export class CuisinePage {
  private readonly recipeService = inject(RecipeService);
  private readonly router = inject(Router);
  private readonly languages = inject(LanguageService);

  readonly text = this.languages.t;
  readonly perPage = RECIPES_PER_PAGE;

  /** Comes from the route, for example /cookbook/italian. */
  readonly cuisine = input('');

  /** Comes from ?page=2, so a reload or the way back keeps the page. */
  readonly page = input(1, { transform: toPage });

  readonly recipes = signal<Recipe[]>([]);
  readonly total = signal(0);
  readonly loading = signal(true);
  readonly failed = signal(false);

  /** Counts the requests, so an answer that arrives late is ignored. */
  private request = 0;

  /** The style, if the address names one the app knows. */
  readonly style = computed(() => CUISINES.find((style) => style === this.cuisine()));

  /** The page numbers the style fills. */
  readonly pages = computed(() => {
    const count = Math.ceil(this.total() / this.perPage);
    return Array.from({ length: count }, (_, index) => index + 1);
  });

  constructor() {
    effect(() => {
      const style = this.style();
      const page = this.page();
      const language = this.languages.current();
      untracked(() => void this.show(style, page, language));
    });
  }

  /** An unknown style goes back to the cookbook, a known one loads its page. */
  private async show(style: Cuisine | undefined, page: number, language: Language): Promise<void> {
    if (!style) {
      await this.router.navigate(['/cookbook']);
      return;
    }
    await this.load(style, page, language);
  }

  /** Reads one page of that style in the language of the interface. */
  private async load(style: Cuisine, page: number, language: Language): Promise<void> {
    const ticket = ++this.request;
    this.loading.set(true);
    this.failed.set(false);
    try {
      this.take(ticket, await this.recipeService.listRecipes(page, style, language));
    } catch (error) {
      await this.recover(error, page);
    }
    this.loading.set(ticket !== this.request);
  }

  /** Shows the answer, unless a newer request has been sent since. */
  private take(ticket: number, result: RecipePage): void {
    if (ticket === this.request) {
      this.recipes.set(result.items);
      this.total.set(result.total);
    }
  }

  /** The database answers 416 for a page past the end, that one goes back to the first. */
  private async recover(error: unknown, page: number): Promise<void> {
    const pastTheEnd = error instanceof HttpErrorResponse && error.status === 416;
    if (pastTheEnd && page > 1) {
      await this.router.navigate([], { queryParams: { page: null } });
      return;
    }
    this.failed.set(true);
  }
}

/** Turns the page from the address into a number, 1 if it is missing or odd. */
function toPage(value: string | number | undefined): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}
