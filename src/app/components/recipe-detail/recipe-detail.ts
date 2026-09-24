import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Recipe } from '../../interfaces/recipe.interface';
import { RecipeService } from '../../services/recipe.service';
import { RecipeStoreService } from '../../services/recipe-store.service';
import { MenuBar } from '../menu-bar/menu-bar';
import { NutritionChart } from '../nutrition-chart/nutrition-chart';

/** One recipe in full, with the steps split by cook. */
@Component({
  selector: 'app-recipe-detail',
  imports: [MenuBar, NutritionChart, RouterLink],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss',
})
export class RecipeDetail {
  private readonly store = inject(RecipeStoreService);
  private readonly recipeService = inject(RecipeService);

  /** Comes from the route, for example /recipe/8f2c… */
  readonly id = input.required<string>();

  readonly recipe = signal<Recipe | null>(null);
  readonly loading = signal(true);

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

  /** Takes the recipe from this session, or reads it from the library. */
  private async load(id: string): Promise<void> {
    const known = this.store.find(id);
    if (known) {
      this.recipe.set(known);
      this.loading.set(false);
      return;
    }
    this.loading.set(true);
    this.recipe.set(await this.recipeService.getRecipe(id).catch(() => null));
    this.loading.set(false);
  }
}
