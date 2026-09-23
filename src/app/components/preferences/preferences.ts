import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { COOKING_TIMES, CUISINES, DIETS, HELPERS, PORTIONS } from '../../data/options';
import { GeneratorError, GeneratorService } from '../../services/generator.service';
import { RecipeDraftService } from '../../services/recipe-draft.service';
import { RecipeStoreService } from '../../services/recipe-store.service';
import { MenuBar } from '../menu-bar/menu-bar';

/** Step two: how many people eat, how long it may take and what it should taste like. */
@Component({
  selector: 'app-preferences',
  imports: [MenuBar],
  templateUrl: './preferences.html',
  styleUrl: './preferences.scss',
})
export class Preferences {
  private readonly draft = inject(RecipeDraftService);
  private readonly generator = inject(GeneratorService);
  private readonly store = inject(RecipeStoreService);
  private readonly router = inject(Router);

  readonly times = COOKING_TIMES;
  readonly cuisines = CUISINES;
  readonly diets = DIETS;

  readonly portions = this.draft.portions;
  readonly helpers = this.draft.helpers;
  readonly cookingTime = this.draft.cookingTime;
  readonly cuisine = this.draft.cuisine;
  readonly diet = this.draft.diet;

  readonly busy = signal(false);
  readonly error = signal('');

  /** Adds the step to the portions, staying inside the allowed range. */
  changePortions(step: number): void {
    this.portions.update((value) => clamp(value + step, PORTIONS.min, PORTIONS.max));
  }

  /** Adds the step to the cooks, staying inside the allowed range. */
  changeHelpers(step: number): void {
    this.helpers.update((value) => clamp(value + step, HELPERS.min, HELPERS.max));
  }

  /** Sends everything to the workflow and moves on to the results. */
  async generate(): Promise<void> {
    this.busy.set(true);
    this.error.set('');
    try {
      this.store.setResult(await this.generator.generate(this.draft.toRequest()));
      await this.router.navigate(['/results']);
    } catch (failure) {
      this.error.set((failure as GeneratorError).message);
    } finally {
      this.busy.set(false);
    }
  }
}

/** Keeps a value between a lower and an upper end. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
