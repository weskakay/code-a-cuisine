import { Component, inject, input } from '@angular/core';
import type { UrlTree } from '@angular/router';
import { RouterLink } from '@angular/router';
import type { Language } from '../../data/texts';
import { LanguageService } from '../../services/language.service';
import { Icon } from '../icon/icon';

/** Top bar with the logo, the language switch and, where a page has one, the way back. */
@Component({
  selector: 'app-menu-bar',
  imports: [RouterLink, Icon],
  templateUrl: './menu-bar.html',
  styleUrl: './menu-bar.scss',
})
export class MenuBar {
  private readonly languages = inject(LanguageService);

  /** True on the olive pages, where the logo turns cream. */
  readonly onDark = input(false);

  /** Where the back link leads. Without it the bar shows no back link. */
  readonly back = input<string | UrlTree>();

  /** Name of the page the back link leads to. */
  readonly backLabel = input('');

  readonly text = this.languages.t;
  readonly language = this.languages.current;

  /** Switches the interface to that language. */
  use(language: Language): void {
    this.languages.use(language);
  }
}
