import { HttpClient, HttpHeaders, type HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { RECIPES_PER_PAGE } from '../data/options';
import type { Cuisine, Recipe } from '../interfaces/recipe.interface';

/** A row as the database returns it, with snake_case columns. */
interface RecipeRow {
  id: string;
  created_at: string;
  title: string;
  cuisine: Recipe['cuisine'];
  diet: Recipe['diet'];
  cooking_time: Recipe['cookingTime'];
  cooking_minutes: number;
  portions: number;
  helpers: number;
  your_ingredients: Recipe['yourIngredients'];
  extra_ingredients: Recipe['extraIngredients'];
  steps: Recipe['steps'];
  nutrition_per_portion: Recipe['nutritionPerPortion'];
  nutrition_total: Recipe['nutritionTotal'];
  likes: number;
}

/** One page of the library plus how many recipes match the filter. */
export interface RecipePage {
  items: Recipe[];
  total: number;
}

/** Reads the public recipe library. Writing happens in the workflow only. */
@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.supabaseUrl}/rest/v1/recipes`;

  /** Reads one page of the library, newest first, optionally filtered by cuisine. */
  async listRecipes(page = 1, cuisine?: Cuisine): Promise<RecipePage> {
    const first = (page - 1) * RECIPES_PER_PAGE;
    const filter = cuisine ? `&cuisine=eq.${cuisine}` : '';
    const url = `${this.endpoint}?select=*&order=created_at.desc${filter}`;
    const response = await firstValueFrom(
      this.http.get<RecipeRow[]>(url, {
        headers: this.headers(first, first + RECIPES_PER_PAGE - 1),
        observe: 'response',
      }),
    );
    return { items: (response.body ?? []).map(toRecipe), total: readTotal(response) };
  }

  /** Reads a single recipe, or null when the id is unknown. */
  async getRecipe(id: string): Promise<Recipe | null> {
    const url = `${this.endpoint}?select=*&id=eq.${id}&limit=1`;
    const rows = await firstValueFrom(
      this.http.get<RecipeRow[]>(url, { headers: this.headers(0, 0) }),
    );
    return rows.length ? toRecipe(rows[0]) : null;
  }

  /** Key, token and the range the database should answer with. */
  private headers(first: number, last: number): HttpHeaders {
    return new HttpHeaders({
      apikey: environment.supabaseKey,
      Authorization: `Bearer ${environment.supabaseKey}`,
      Range: `${first}-${last}`,
      Prefer: 'count=exact',
    });
  }
}

/** Facts of a recipe: what it is called, its style and its numbers. */
type RecipeFacts = Omit<
  Recipe,
  'yourIngredients' | 'extraIngredients' | 'steps' | 'nutritionPerPortion' | 'nutritionTotal'
>;

/** What the user cooks with: ingredients, steps and nutrition. */
type RecipeContent = Omit<Recipe, keyof RecipeFacts>;

/** Turns a database row into the type the app works with. */
function toRecipe(row: RecipeRow): Recipe {
  return { ...toFacts(row), ...toContent(row) };
}

/** Copies the plain columns. */
function toFacts(row: RecipeRow): RecipeFacts {
  return {
    id: row.id,
    createdAt: row.created_at,
    title: row.title,
    cuisine: row.cuisine,
    diet: row.diet,
    cookingTime: row.cooking_time,
    cookingMinutes: row.cooking_minutes,
    portions: row.portions,
    helpers: row.helpers,
    likes: row.likes,
  };
}

/** Copies the columns that hold lists and objects. */
function toContent(row: RecipeRow): RecipeContent {
  return {
    yourIngredients: row.your_ingredients,
    extraIngredients: row.extra_ingredients,
    steps: row.steps,
    nutritionPerPortion: row.nutrition_per_portion,
    nutritionTotal: row.nutrition_total,
  };
}

/** Reads the total out of a content range like "0-19/42". */
function readTotal(response: HttpResponse<unknown>): number {
  const range = response.headers.get('content-range') ?? '';
  const total = Number(range.split('/')[1]);
  return Number.isFinite(total) ? total : 0;
}
