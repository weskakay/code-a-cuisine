import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HELPERS, PORTIONS } from '../data/options';
import type {
  CookingTime,
  Cuisine,
  Diet,
  IngredientInput,
  RecipeRequest,
} from '../interfaces/recipe.interface';
import { LanguageService } from './language.service';

/** The list survives a reload of the tab, nothing more. */
const STORAGE_KEY = 'cc-ingredients';

/** Holds what the visitor picked while walking through the steps. */
@Injectable({ providedIn: 'root' })
export class RecipeDraftService {
  private readonly languages = inject(LanguageService);

  readonly ingredients = signal<IngredientInput[]>(readIngredients());
  readonly portions = signal(PORTIONS.default);
  readonly helpers = signal(HELPERS.default);
  readonly cookingTime = signal<CookingTime>('quick');
  readonly cuisine = signal<Cuisine>('italian');
  readonly diet = signal<Diet>('none');

  /** The place of the ingredient the visitor is changing, or null. */
  readonly editing = signal<number | null>(null);

  /** True as soon as one ingredient is on the list, which the next step needs. */
  readonly ready = computed(() => this.ingredients().length > 0);

  constructor() {
    effect(() => writeIngredients(this.ingredients()));
  }

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
      language: this.languages.current(),
    };
  }
}

/** Reads the list the tab kept, empty when there is none or it looks broken. */
function readIngredients(): IngredientInput[] {
  try {
    const list: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(list) ? list.filter(isIngredient) : [];
  } catch {
    return [];
  }
}

/** True for an entry with a name, an amount and a unit. */
function isIngredient(item: unknown): item is IngredientInput {
  const entry = item as Partial<IngredientInput> | null;
  return (
    typeof entry?.name === 'string' &&
    typeof entry.amount === 'number' &&
    typeof entry.unit === 'string'
  );
}

/** Keeps the list for a reload of the same tab. */
function writeIngredients(list: IngredientInput[]): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    return;
  }
}
