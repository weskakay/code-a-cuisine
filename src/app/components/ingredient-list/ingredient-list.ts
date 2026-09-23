import { Component, inject } from '@angular/core';
import { RecipeDraftService } from '../../services/recipe-draft.service';

/** Shows what is on the list so far and lets the visitor take items off again. */
@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.html',
  styleUrl: './ingredient-list.scss',
})
export class IngredientList {
  private readonly draft = inject(RecipeDraftService);

  readonly ingredients = this.draft.ingredients;

  /** Takes the ingredient at that place off the list. */
  remove(index: number): void {
    this.draft.removeIngredient(index);
  }
}
