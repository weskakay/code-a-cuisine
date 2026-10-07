import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Recipe } from '../../interfaces/recipe.interface';
import { LanguageService } from '../../services/language.service';
import { LikesService } from '../../services/likes.service';
import { RecipeService } from '../../services/recipe.service';
import { RecipeStoreService } from '../../services/recipe-store.service';
import { Icon, type IconName } from '../icon/icon';
import { MenuBar } from '../menu-bar/menu-bar';
import { SiteFooter } from '../site-footer/site-footer';
import { NutritionChart } from '../nutrition-chart/nutrition-chart';

/** One recipe in full, with the steps split by cook. */
@Component({
  selector: 'app-recipe-detail',
  imports: [Icon, MenuBar, NutritionChart, RouterLink, SiteFooter],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss',
})
export class RecipeDetail {
  private readonly store = inject(RecipeStoreService);
  private readonly recipeService = inject(RecipeService);
  private readonly likes = inject(LikesService);
  private readonly languages = inject(LanguageService);

  readonly text = this.languages.t;

  /** Comes from the route, for example /recipe/8f2c… */
  readonly id = input.required<string>();

  readonly recipe = signal<Recipe | null>(null);
  readonly loading = signal(true);
  readonly likeCount = signal(0);

  /** Read from the browser, so it is right at once and after a reload. */
  readonly liked = computed(() => this.likes.has(this.id()));
  readonly likeFailed = signal(false);
  readonly likeBusy = signal(false);

  /** Where the reader came from, set by the link that opened the recipe. */
  readonly from = input<string>();

  /** Back to the results when the generator opened the recipe, else to the cookbook. */
  readonly backLink = computed(() => (this.from() === 'results' ? '/results' : '/cookbook'));

  readonly backLabel = computed(() =>
    this.from() === 'results' ? this.text().recipe.backResults : this.text().titles.cookbook,
  );

  /** The cooks that have at least one step, so the page can list them. */
  readonly cooks = computed(() => {
    const steps = this.recipe()?.steps ?? [];
    return [...new Set(steps.map((step) => step.helper))].sort();
  });

  constructor() {
    effect(() => {
      const id = this.id();
      untracked(() => void this.load(id));
    });
  }

  /** The steps of one cook, in the order they happen. */
  stepsOf(cook: number) {
    return (this.recipe()?.steps ?? []).filter((step) => step.helper === cook);
  }

  /** Cooks take turns between the hat and the spoon, like in the design. */
  iconFor(cook: number): IconName {
    return cook % 2 === 1 ? 'hat' : 'spoon';
  }

  /** Gives this recipe a heart, or takes the heart back. */
  async toggleLike(): Promise<void> {
    if (this.likeBusy()) {
      return;
    }
    this.likeBusy.set(true);
    this.likeFailed.set(false);
    await this.sendLike(this.id());
    this.likeBusy.set(false);
  }

  /** Shows the new count at once, then takes the one the database answers. */
  private async sendLike(id: string): Promise<void> {
    const before = this.likeCount();
    this.likeCount.set(before + (this.liked() ? -1 : 1));
    try {
      const count = await this.likes.toggle(id);
      this.likeCount.set(count);
      this.store.updateLikes(id, count);
    } catch {
      this.likeCount.set(before);
      this.likeFailed.set(true);
    }
  }

  /** Takes the recipe from this session, or reads it from the library. */
  private async load(id: string): Promise<void> {
    const known = this.store.find(id);
    if (known) {
      this.show(known);
      return;
    }
    this.loading.set(true);
    this.show(await this.recipeService.getRecipe(id).catch(() => null));
  }

  /** Puts the recipe on the page and shows the hearts it has so far. */
  private show(dish: Recipe | null): void {
    this.recipe.set(dish);
    this.likeCount.set(dish?.likes ?? 0);
    this.loading.set(false);
  }
}
