import type { CookingTime, Cuisine, Diet, Unit } from '../interfaces/recipe.interface';

/** Portions the user can ask for. */
export const PORTIONS = { min: 1, max: 12, default: 2 };

/** Cooks that can share the work. */
export const HELPERS = { min: 1, max: 3, default: 1 };

/** Ingredients the list holds at most, the workflow checks the same. */
export const MAX_INGREDIENTS = 20;

/** Characters an ingredient name may have, the workflow checks the same. */
export const MAX_NAME_LENGTH = 40;

/** Basic ingredients a recipe may add on top of what the user has. */
export const MAX_EXTRA_INGREDIENTS = 3;

/** Recipes shown per page in the library. */
export const RECIPES_PER_PAGE = 20;

/** Recipes in the row of the most liked ones. */
export const MOST_LIKED_COUNT = 5;

/** Units an amount can be given in, in the order of the form. */
export const UNITS: Unit[] = ['g', 'ml', 'piece'];

/** Time frames the visitor can pick. */
export const COOKING_TIMES: CookingTime[] = ['quick', 'medium', 'complex'];

/** Cooking styles, in the order of the design. */
export const CUISINES: Cuisine[] = ['german', 'italian', 'indian', 'japanese', 'gourmet', 'fusion'];

/** Diets the recipes have to respect. */
export const DIETS: Diet[] = ['vegetarian', 'vegan', 'keto', 'none'];
