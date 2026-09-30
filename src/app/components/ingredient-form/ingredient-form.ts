import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { COMMON_INGREDIENTS } from '../../data/ingredients';
import { UNITS } from '../../data/options';
import type { IngredientInput, Unit } from '../../interfaces/recipe.interface';
import { RecipeDraftService } from '../../services/recipe-draft.service';

/** How many suggestions the field offers at most. */
const MAX_SUGGESTIONS = 5;

/** Lets the visitor put one ingredient with amount and unit on the list. */
@Component({
  selector: 'app-ingredient-form',
  imports: [ReactiveFormsModule],
  templateUrl: './ingredient-form.html',
  styleUrl: './ingredient-form.scss',
})
export class IngredientForm {
  private readonly draft = inject(RecipeDraftService);
  private readonly builder = inject(FormBuilder);

  readonly units = UNITS;
  readonly error = signal('');
  readonly editing = this.draft.editing;

  readonly form = this.builder.nonNullable.group({
    name: ['', Validators.required],
    amount: [100, [Validators.required, Validators.min(1)]],
    unit: ['g' as Unit, Validators.required],
  });

  private readonly typed = toSignal(this.form.controls.name.valueChanges, { initialValue: '' });

  /** Known ingredients that start with what the visitor typed. */
  readonly suggestions = computed(() => {
    const term = this.typed().trim().toLowerCase();
    if (term.length < 2) {
      return [];
    }
    const hits = COMMON_INGREDIENTS.filter((name) => name.toLowerCase().startsWith(term));
    return hits.length === 1 && hits[0].toLowerCase() === term ? [] : hits.slice(0, MAX_SUGGESTIONS);
  });

  constructor() {
    effect(() => this.fillFromList(this.editing()));
  }

  /** Puts the ingredient on the list, or writes back the one being changed. */
  add(): void {
    if (this.form.invalid) {
      this.error.set('Enter a name and an amount above zero.');
      return;
    }
    const place = this.editing();
    const entered = this.form.getRawValue();
    if (place === null) {
      this.draft.addIngredient(entered);
    } else {
      this.draft.updateIngredient(place, entered);
    }
    this.clear();
  }

  /** Takes a suggestion over into the field. */
  pick(name: string): void {
    this.form.patchValue({ name });
  }

  /** Leaves the editing and empties the field. */
  cancel(): void {
    this.draft.cancelEdit();
    this.clear();
  }

  /** Shows the ingredient that is being changed, if there is one. */
  private fillFromList(place: number | null): void {
    const item: IngredientInput | undefined =
      place === null ? undefined : this.draft.ingredients()[place];
    if (item) {
      this.form.setValue({ name: item.name, amount: item.amount, unit: item.unit });
    }
  }

  /** Back to an empty field, ready for the next ingredient. */
  private clear(): void {
    this.error.set('');
    this.form.patchValue({ name: '', amount: 100 });
  }
}
