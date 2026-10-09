import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { RecipeDraftService } from '../../services/recipe-draft.service';
import { HeroPlates } from '../hero-plates/hero-plates';
import { Icon } from '../icon/icon';
import { MenuBar } from '../menu-bar/menu-bar';
import { SiteFooter } from '../site-footer/site-footer';

/** Start page with the two calls to action. */
@Component({
  selector: 'app-home',
  imports: [HeroPlates, Icon, MenuBar, RouterLink, SiteFooter],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly draft = inject(RecipeDraftService);

  readonly text = inject(LanguageService).t;

  /** A new recipe starts from an empty list, not from the last one. */
  startNew(): void {
    this.draft.reset();
  }
}
