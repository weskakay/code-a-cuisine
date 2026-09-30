import { computed, Injectable, signal } from '@angular/core';
import { HELPERS, PORTIONS } from '../data/options';
import type {
  CookingTime,
  Cuisine,
  Diet,
  IngredientInput,
  RecipeRequest,
} from '../interfaces/recipe.interface';

/** Holds what the visitor picked while walking through the steps. */
@Injectable({ providedIn: 'root' })
export class RecipeDraftService {
  readonly ingredients = signal<IngredientInput[]>([]);
  readonly portions = signal(PORTIONS.default);
  readonly helpers = signal(HELPERS.default);
  readonly cookingTime = signal<CookingTime>('quick');
  readonly cuisine = signal<Cuisine>('italian');
  readonly diet = signal<Diet>('none');

  /** The place of the ingredient the visitor is changing, or null. */
  readonly editing = signal<number | null>(null);

  /** True as soon as one ingredient is on the list, which the next step needs. */
  readonly ready = computed(() => this.ingredients().length > 0);

  /** Puts a new ingredient on top of the list. */
  addIngredient(ingredient: IngredientInput): void {
    this.ingredients.update((list) => [ingredient, ...list]);
  }

  /** Removes the ingredient at that place. */
  removeIngredient(index: number): void {
    this.ingredients.update((list) => list.filter((_, place) => place !== index));
    this.editing.set(null);
  }

  /** Puts the ingredient at that place into the form, ready to be changed. */
  startEdit(index: number): void {
    this.editing.set(index);
  }

  /** Writes the changed ingredient back and closes the editing. */
  updateIngredient(index: number, ingredient: IngredientInput): void {
    this.ingredients.update((list) =>
      list.map((item, place) => (place === index ? ingredient : item)),
    );
    this.editing.set(null);
  }

  /** Leaves the editing without changing anything. */
  cancelEdit(): void {
    this.editing.set(null);
  }

  /** Everything the workflow needs, ready to send. */
  toRequest(): RecipeRequest {
    return {
      ingredients: this.ingredients(),
      portions: this.portions(),
      cookingTime: this.cookingTime(),
      cuisine: this.cuisine(),
      diet: this.diet(),
      helpers: this.helpers(),
    };
  }
}
