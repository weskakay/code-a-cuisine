import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Recipe } from '../../interfaces/recipe.interface';

/** Shows the recipes of the library, newest first. */
@Component({
  selector: 'app-recipe-list',
  imports: [RouterLink],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.scss',
})
export class RecipeList {
  /** The page of recipes the cookbook handed over. */
  readonly recipes = input.required<Recipe[]>();
}
