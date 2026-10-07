import { Injectable, signal } from '@angular/core';
import type { Quota, Recipe, RecipeResponse } from '../interfaces/recipe.interface';

/** Keeps the last three recipes and the quota, so the result pages can read them. */
@Injectable({ providedIn: 'root' })
export class RecipeStoreService {
  readonly recipes = signal<Recipe[]>([]);
  readonly quota = signal<Quota | null>(null);

  /** Stores what the workflow answered. */
  setResult(response: RecipeResponse): void {
    this.recipes.set(response.recipes);
    this.quota.set(response.quota);
  }

  /** Finds one of the generated recipes by its id. */
  find(id: string): Recipe | undefined {
    return this.recipes().find((recipe) => recipe.id === id);
  }

  /** Keeps the count of hearts in step, so a recipe opened again shows the new number. */
  updateLikes(id: string, likes: number): void {
    this.recipes.update((list) =>
      list.map((recipe) => (recipe.id === id ? { ...recipe, likes } : recipe)),
    );
  }
}
