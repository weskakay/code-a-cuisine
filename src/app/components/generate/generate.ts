import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecipeDraftService } from '../../services/recipe-draft.service';
import { IngredientForm } from '../ingredient-form/ingredient-form';
import { IngredientList } from '../ingredient-list/ingredient-list';
import { MenuBar } from '../menu-bar/menu-bar';

/** Step one: the visitor lists what is at home. */
@Component({
  selector: 'app-generate',
  imports: [MenuBar, IngredientForm, IngredientList, RouterLink],
  templateUrl: './generate.html',
  styleUrl: './generate.scss',
})
export class Generate {
  private readonly draft = inject(RecipeDraftService);

  /** True once at least one ingredient is on the list. */
  readonly ready = this.draft.ready;
}
