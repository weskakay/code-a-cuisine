import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Recipe } from '../../interfaces/recipe.interface';
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

  /** Comes from the route, for example /recipe/8f2c… */
  readonly id = input.required<string>();

  readonly recipe = signal<Recipe | null>(null);
  readonly loading = signal(true);
  readonly likeCount = signal(0);
  readonly liked = signal(false);
  readonly likeFailed = signal(false);

  /** Recipes of this session came from the results, the others from the library. */
  readonly backLink = computed(() => (this.store.find(this.id()) ? '/results' : '/cookbook'));

  readonly backLabel = computed(() =>
    this.backLink() === '/results' ? 'Back to the results' : 'Back to the cookbook',
  );

  /** The cooks that have at least one step, so the page can list them. */
  readonly cooks = computed(() => {
    const steps = this.recipe()?.steps ?? [];
    return [...new Set(steps.map((step) => step.helper))].sort();
  });

  constructor() {
    effect(() => void this.load(this.id()));
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
    const id = this.id();
    this.likeFailed.set(false);
    try {
      this.likeCount.set(await this.likes.toggle(id));
      this.liked.set(this.likes.has(id));
    } catch {
      this.likeFailed.set(true);
    }
  }

  /** Takes the recipe from this session, or reads it from the library. */
  private async load(id: string): Promise<void> {
    const known = this.store.find(id);
    if (known) {
      this.show(known, id);
      return;
    }
    this.loading.set(true);
    this.show(await this.recipeService.getRecipe(id).catch(() => null), id);
  }

  /** Puts the recipe on the page and shows the hearts it has so far. */
  private show(dish: Recipe | null, id: string): void {
    this.recipe.set(dish);
    this.likeCount.set(dish?.likes ?? 0);
    this.liked.set(this.likes.has(id));
    this.loading.set(false);
  }
}
