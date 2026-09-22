/** Unit an ingredient amount is measured in. */
export type Unit = 'g' | 'ml' | 'piece';

/** Time frame the user has for cooking. */
export type CookingTime = 'quick' | 'medium' | 'complex';

/** Cooking style the recipes should follow. */
export type Cuisine = 'german' | 'italian' | 'japanese' | 'indian' | 'gourmet' | 'fusion';

/** Diet the recipes have to respect. */
export type Diet = 'vegetarian' | 'vegan' | 'keto' | 'none';

/** One ingredient the user has at home. */
export interface IngredientInput {
  name: string;
  amount: number;
  unit: Unit;
}

/** Everything the workflow needs to generate three recipes. */
export interface RecipeRequest {
  ingredients: IngredientInput[];
  portions: number;
  cookingTime: CookingTime;
  cuisine: Cuisine;
  diet: Diet;
  helpers: number;
}

/** One step of the instructions, assigned to a cook. */
export interface RecipeStep {
  position: number;
  title: string;
  text: string;
  helper: number;
  parallel: boolean;
  durationMinutes: number;
  waitMinutes: number;
}

/** Energy and macros, either per portion or for the whole recipe. */
export interface Nutrition {
  energyKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

/** A generated recipe as it is stored and shown. */
export interface Recipe {
  id: string;
  createdAt: string;
  title: string;
  cuisine: Cuisine;
  diet: Diet;
  cookingTime: CookingTime;
  cookingMinutes: number;
  portions: number;
  helpers: number;
  /** Ingredients the user entered, scaled to the portions. */
  yourIngredients: IngredientInput[];
  /** Basic ingredients the user still needs, never more than three. */
  extraIngredients: IngredientInput[];
  steps: RecipeStep[];
  nutritionPerPortion: Nutrition;
  nutritionTotal: Nutrition;
  likes: number;
}

/** How many generations are left for this visitor today. */
export interface Quota {
  remaining: number;
  limit: number;
}

/** Answer of the workflow: always three recipes plus the quota. */
export interface RecipeResponse {
  recipes: Recipe[];
  quota: Quota;
}
