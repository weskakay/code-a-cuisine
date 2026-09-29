import { Component, inject, type OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CUISINES, RECIPES_PER_PAGE } from '../../data/options';
import type { Cuisine, Recipe } from '../../interfaces/recipe.interface';
import { RecipeService } from '../../services/recipe.service';
import { Icon } from '../icon/icon';
import { MenuBar } from '../menu-bar/menu-bar';
import { RecipeList } from '../recipe-list/recipe-list';
import { SiteFooter } from '../site-footer/site-footer';

/** The public library: every recipe the app has ever generated. */
@Component({
  selector: 'app-cookbook',
  imports: [Icon, MenuBar, RecipeList, RouterLink, SiteFooter],
  templateUrl: './cookbook.html',
  styleUrl: './cookbook.scss',
})
export class Cookbook implements OnInit {
  private readonly recipeService = inject(RecipeService);

  readonly cuisines = CUISINES;
  readonly perPage = RECIPES_PER_PAGE;

  readonly recipes = signal<Recipe[]>([]);
  readonly mostLiked = signal<Recipe[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly cuisine = signal<Cuisine | undefined>(undefined);
  readonly loading = signal(false);
  readonly failed = signal(false);

  ngOnInit(): void {
    void this.load();
    void this.loadMostLiked();
  }

  /** Shows one cooking style, or all of them again. */
  filterBy(cuisine: Cuisine | undefined): void {
    this.cuisine.set(this.cuisine() === cuisine ? undefined : cuisine);
    this.page.set(1);
    void this.load();
  }

  /** Jumps to that page of the library. */
  goTo(page: number): void {
    this.page.set(page);
    void this.load();
  }

  /** How many pages the current filter fills. */
  pages(): number[] {
    const count = Math.ceil(this.total() / this.perPage);
    return Array.from({ length: count }, (_, index) => index + 1);
  }

  /** Reads the recipes with the most hearts. Stays empty until someone likes one. */
  private async loadMostLiked(): Promise<void> {
    const liked = await this.recipeService.listMostLiked().catch(() => []);
    this.mostLiked.set(liked.filter((dish) => dish.likes > 0));
  }

  /** Reads the current page from the database. */
  private async load(): Promise<void> {
    this.loading.set(true);
    this.failed.set(false);
    try {
      const page = await this.recipeService.listRecipes(this.page(), this.cuisine());
      this.recipes.set(page.items);
      this.total.set(page.total);
    } catch {
      this.failed.set(true);
    } finally {
      this.loading.set(false);
    }
  }
}
