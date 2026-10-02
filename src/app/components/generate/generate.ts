import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LanguageService } from '../../services/language.service';
import { RecipeDraftService } from '../../services/recipe-draft.service';
import { IngredientForm } from '../ingredient-form/ingredient-form';
import { IngredientList } from '../ingredient-list/ingredient-list';
import { MenuBar } from '../menu-bar/menu-bar';
import { SiteFooter } from '../site-footer/site-footer';

/** Step one: the visitor lists what is at home. */
@Component({
  selector: 'app-generate',
  imports: [MenuBar, IngredientForm, IngredientList, RouterLink, SiteFooter],
  templateUrl: './generate.html',
  styleUrl: './generate.scss',
})
export class Generate {
  private readonly draft = inject(RecipeDraftService);

  readonly text = inject(LanguageService).t;

  /** False on the hosted page, where the workflow cannot be reached. */
  readonly generationOn = environment.generation;

  /** True once at least one ingredient is on the list. */
  readonly ready = this.draft.ready;
}
