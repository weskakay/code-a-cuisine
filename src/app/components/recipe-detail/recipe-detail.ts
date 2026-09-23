import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
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

  /** Comes from the route, for example /recipe/8f2c… */
  readonly id = input.required<string>();

  readonly recipe = computed(() => this.store.find(this.id()));

  /** The cooks that have at least one step, so the page can list them. */
  readonly cooks = computed(() => {
    const steps = this.recipe()?.steps ?? [];
    return [...new Set(steps.map((step) => step.helper))].sort();
  });

  /** The steps of one cook, in the order they happen. */
  stepsOf(cook: number) {
    return (this.recipe()?.steps ?? []).filter((step) => step.helper === cook);
  }
}
