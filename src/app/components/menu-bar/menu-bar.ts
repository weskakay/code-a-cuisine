import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Top bar with the wordmark, shown on every page. */
@Component({
  selector: 'app-menu-bar',
  imports: [RouterLink],
  templateUrl: './menu-bar.html',
  styleUrl: './menu-bar.scss',
})
export class MenuBar {
  /** True on the olive pages, where the logo turns cream. */
  readonly onDark = input(false);
}
