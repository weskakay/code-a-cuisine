import {
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  type OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CUISINES, RECIPES_PER_PAGE } from '../../data/options';
import type { Cuisine, Recipe } from '../../interfaces/recipe.interface';
import { LanguageService } from '../../services/language.service';
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

  readonly text = inject(LanguageService).t;

  readonly cuisines = CUISINES;
  readonly perPage = RECIPES_PER_PAGE;

  readonly recipes = signal<Recipe[]>([]);
  readonly mostLiked = signal<Recipe[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly cuisine = signal<Cuisine | undefined>(undefined);
  readonly loading = signal(false);
  readonly failed = signal(false);

  /** True while the row of the most liked recipes is wider than its box. */
  readonly rowScrolls = signal(false);

  private readonly likedRow = viewChild<ElementRef<HTMLElement>>('likedRow');

  constructor() {
    effect(() => this.watchRow(this.mostLiked()));
    const onResize = () => this.measureRow();
    window.addEventListener('resize', onResize);
    inject(DestroyRef).onDestroy(() => window.removeEventListener('resize', onResize));
  }

  ngOnInit(): void {
    void this.load();
    void this.loadMostLiked();
  }

  /** Moves the row of the most liked recipes by about one card. */
  scrollLiked(direction: -1 | 1): void {
    const row = this.likedRow()?.nativeElement;
    row?.scrollBy({ left: direction * 280, behavior: 'smooth' });
  }

  /** Waits for the row to be drawn, then looks whether it can scroll. */
  private watchRow(liked: Recipe[]): void {
    if (liked.length === 0) {
      this.rowScrolls.set(false);
      return;
    }
    setTimeout(() => this.measureRow());
  }

  /** Arrows only make sense when there is something left to see. */
  private measureRow(): void {
    const row = this.likedRow()?.nativeElement;
    this.rowScrolls.set(!!row && row.scrollWidth > row.clientWidth + 8);
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
