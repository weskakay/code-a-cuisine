import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Recipe } from '../../interfaces/recipe.interface';
import { LanguageService } from '../../services/language.service';
import { Icon } from '../icon/icon';

/** Shows the recipes of the library, newest first. */
@Component({
  selector: 'app-recipe-list',
  imports: [Icon, RouterLink],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.scss',
})
export class RecipeList {
  private readonly languages = inject(LanguageService);

  readonly text = this.languages.t;
  readonly language = this.languages.current;

  /** The page of recipes the cookbook handed over. */
  readonly recipes = input.required<Recipe[]>();

  /** How many recipes come before this page, so the numbers keep counting. */
  readonly offset = input(0);
}
