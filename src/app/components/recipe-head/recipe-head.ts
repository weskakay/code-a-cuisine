import { Component, inject, input } from '@angular/core';
import type { Recipe } from '../../interfaces/recipe.interface';
import { AmountPipe } from '../../pipes/amount.pipe';
import { LanguageService } from '../../services/language.service';
import { CookLabel } from '../cook-label/cook-label';
import { Icon } from '../icon/icon';

/** Top of a recipe: name, cooks, tags, hearts and the four values per portion. */
@Component({
  selector: 'app-recipe-head',
  imports: [AmountPipe, CookLabel, Icon],
  templateUrl: './recipe-head.html',
  styleUrl: './recipe-head.scss',
})
export class RecipeHead {
  readonly text = inject(LanguageService).t;

  readonly dish = input.required<Recipe>();

  /** The cooks that have at least one step. */
  readonly cooks = input.required<number[]>();

  readonly likeCount = input(0);
  readonly liked = input(false);
}
