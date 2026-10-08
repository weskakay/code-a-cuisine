import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Recipe } from '../../interfaces/recipe.interface';
import { LanguageService } from '../../services/language.service';
import { Icon } from '../icon/icon';

/** Shows a page of the library as a numbered list, newest first. */
@Component({
  selector: 'app-recipe-list',
  imports: [Icon, RouterLink],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.scss',
})
export class RecipeList {
  readonly text = inject(LanguageService).t;

  /** The page of recipes the cookbook handed over. */
  readonly recipes = input.required<Recipe[]>();

  /** How many recipes come before this page, so the numbers keep counting. */
  readonly offset = input(0);

  /** The cuisine page that shows the list, so the recipe can lead back to it. */
  readonly from = input<string>();
  readonly page = input(1);

  /** Query of the recipe links, empty when the list does not belong to a cuisine. */
  readonly origin = computed(() => {
    const from = this.from();
    return from ? { from, page: this.page() } : {};
  });
}
