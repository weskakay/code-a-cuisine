import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Language } from '../../data/texts';
import { LanguageService } from '../../services/language.service';

/** Top bar with the logo and the language switch, shown on every page. */
@Component({
  selector: 'app-menu-bar',
  imports: [RouterLink],
  templateUrl: './menu-bar.html',
  styleUrl: './menu-bar.scss',
})
export class MenuBar {
  private readonly languages = inject(LanguageService);

  /** True on the olive pages, where the logo turns cream. */
  readonly onDark = input(false);

  readonly text = this.languages.t;
  readonly language = this.languages.current;

  /** Switches the interface to that language. */
  use(language: Language): void {
    this.languages.use(language);
  }
}
