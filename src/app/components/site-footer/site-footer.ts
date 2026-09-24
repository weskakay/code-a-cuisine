import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Sits at the bottom of every page and holds the legal link. */
@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
})
export class SiteFooter {
  readonly year = new Date().getFullYear();
}
