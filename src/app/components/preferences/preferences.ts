import { Component, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { COOKING_TIMES, CUISINES, DIETS, HELPERS, PORTIONS } from '../../data/options';
import { GeneratorError, GeneratorService } from '../../services/generator.service';
import { LanguageService } from '../../services/language.service';
import { RecipeDraftService } from '../../services/recipe-draft.service';
import { RecipeStoreService } from '../../services/recipe-store.service';
import { LoadingOverlay } from '../loading-overlay/loading-overlay';
import { MenuBar } from '../menu-bar/menu-bar';
import { SiteFooter } from '../site-footer/site-footer';

/** Step two: how many people eat, how long it may take and what it should taste like. */
@Component({
  selector: 'app-preferences',
  imports: [MenuBar, LoadingOverlay, SiteFooter],
  templateUrl: './preferences.html',
  styleUrl: './preferences.scss',
})
export class Preferences {
  private readonly draft = inject(RecipeDraftService);
  private readonly generator = inject(GeneratorService);
  private readonly store = inject(RecipeStoreService);
  private readonly router = inject(Router);
  private readonly languages = inject(LanguageService);

  readonly text = this.languages.t;
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

  /** True once the workflow refused because the daily limit is used up. */
  readonly blocked = signal(false);

  private readonly quotaDialog = viewChild<ElementRef<HTMLDialogElement>>('quotaDialog');

  constructor() {
    effect(() => this.toggleDialog(this.blocked()));
  }

  /** Opens the pop-up as a modal so it traps the focus, or closes it again. */
  private toggleDialog(open: boolean): void {
    const dialog = this.quotaDialog()?.nativeElement;
    if (!dialog) {
      return;
    }
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }

  /** Closes the quota pop-up. */
  dismiss(): void {
    this.blocked.set(false);
  }

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
      this.showFailure(failure as GeneratorError);
    } finally {
      this.busy.set(false);
    }
  }

  /** The used up quota gets a pop-up, everything else a line under the button. */
  private showFailure(failure: GeneratorError): void {
    if (failure.quotaReached) {
      this.blocked.set(true);
      return;
    }
    this.error.set(this.text().preferences.failed);
  }
}

/** Keeps a value between a lower and an upper end. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
