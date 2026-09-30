import { Component, inject } from '@angular/core';
import { IMPRINT } from '../../data/imprint';
import { LanguageService } from '../../services/language.service';
import { MenuBar } from '../menu-bar/menu-bar';
import { SiteFooter } from '../site-footer/site-footer';

/** The legal notice, reachable from the footer of every page. */
@Component({
  selector: 'app-imprint',
  imports: [MenuBar, SiteFooter],
  templateUrl: './imprint.html',
  styleUrl: './imprint.scss',
})
export class Imprint {
  readonly text = inject(LanguageService).t;
  readonly imprint = IMPRINT;
}
