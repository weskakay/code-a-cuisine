import { Component, signal } from '@angular/core';
import { COOKING_TIMES, CUISINES, DIETS, HELPERS, PORTIONS } from '../../data/options';
import type { CookingTime, Cuisine, Diet } from '../../interfaces/recipe.interface';
import { MenuBar } from '../menu-bar/menu-bar';

/** Step two: how many people eat, how long it may take and what the kitchen should taste like. */
@Component({
  selector: 'app-preferences',
  imports: [MenuBar],
  templateUrl: './preferences.html',
  styleUrl: './preferences.scss',
})
export class Preferences {
  readonly times = COOKING_TIMES;
  readonly cuisines = CUISINES;
  readonly diets = DIETS;

  readonly portions = signal(PORTIONS.default);
  readonly helpers = signal(HELPERS.default);
  readonly cookingTime = signal<CookingTime>('quick');
  readonly cuisine = signal<Cuisine>('italian');
  readonly diet = signal<Diet>('none');

  /** Adds the step to the portions, staying inside the allowed range. */
  changePortions(step: number): void {
    this.portions.update((value) => clamp(value + step, PORTIONS.min, PORTIONS.max));
  }

  /** Adds the step to the cooks, staying inside the allowed range. */
  changeHelpers(step: number): void {
    this.helpers.update((value) => clamp(value + step, HELPERS.min, HELPERS.max));
  }
}

/** Keeps a value between a lower and an upper end. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
