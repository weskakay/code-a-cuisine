import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UNITS } from '../../data/options';
import type { Unit } from '../../interfaces/recipe.interface';
import { RecipeDraftService } from '../../services/recipe-draft.service';

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

  readonly form = this.builder.nonNullable.group({
    name: ['', Validators.required],
    amount: [100, [Validators.required, Validators.min(1)]],
    unit: ['g' as Unit, Validators.required],
  });

  /** Puts the entered ingredient on the list and clears the field. */
  add(): void {
    if (this.form.invalid) {
      this.error.set('Enter a name and an amount above zero.');
      return;
    }

    this.draft.addIngredient(this.form.getRawValue());
    this.error.set('');
    this.form.patchValue({ name: '', amount: 100 });
  }
}
