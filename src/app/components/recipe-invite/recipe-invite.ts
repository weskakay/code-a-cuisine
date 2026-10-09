import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { RecipeDraftService } from '../../services/recipe-draft.service';
import { Icon } from '../icon/icon';

/** End of a recipe: the way on to the cookbook and to a new recipe. */
@Component({
  selector: 'app-recipe-invite',
  imports: [Icon, RouterLink],
  templateUrl: './recipe-invite.html',
  styleUrl: './recipe-invite.scss',
})
export class RecipeInvite {
  private readonly draft = inject(RecipeDraftService);

  readonly text = inject(LanguageService).t;

  /** A new recipe starts from an empty list, not from the last one. */
  startNew(): void {
    this.draft.reset();
  }
}
