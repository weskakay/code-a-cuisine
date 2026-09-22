import type { CookingTime, Cuisine, Diet, Unit } from '../interfaces/recipe.interface';

/** An option as it is offered in the form. */
export interface Option<T> {
  value: T;
  label: string;
  hint?: string;
}

/** Portions the user can ask for. */
export const PORTIONS = { min: 1, max: 12, default: 2 };

/** Cooks that can share the work. */
export const HELPERS = { min: 1, max: 3, default: 1 };

/** Basic ingredients a recipe may add on top of what the user has. */
export const MAX_EXTRA_INGREDIENTS = 3;

/** Recipes shown per page in the library. */
export const RECIPES_PER_PAGE = 20;

/** Units an amount can be given in. */
export const UNITS: Option<Unit>[] = [
  { value: 'g', label: 'gram' },
  { value: 'ml', label: 'ml' },
  { value: 'piece', label: 'piece' },
];

/** Time frames, the hint is what the user reads under the label. */
export const COOKING_TIMES: Option<CookingTime>[] = [
  { value: 'quick', label: 'Quick', hint: 'up to 20 min' },
  { value: 'medium', label: 'Medium', hint: '20 to 45 min' },
  { value: 'complex', label: 'Complex', hint: 'over 45 min' },
];

/** Cooking styles, in the order of the design. */
export const CUISINES: Option<Cuisine>[] = [
  { value: 'german', label: 'German' },
  { value: 'italian', label: 'Italian' },
  { value: 'indian', label: 'Indian' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'gourmet', label: 'Gourmet' },
  { value: 'fusion', label: 'Fusion' },
];

/** Diets the recipes have to respect. */
export const DIETS: Option<Diet>[] = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'keto', label: 'Keto' },
  { value: 'none', label: 'No preferences' },
];
