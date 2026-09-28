import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroPlates } from '../hero-plates/hero-plates';
import { MenuBar } from '../menu-bar/menu-bar';
import { SiteFooter } from '../site-footer/site-footer';

/** Start page with the two calls to action. */
@Component({
  selector: 'app-home',
  imports: [HeroPlates, MenuBar, RouterLink, SiteFooter],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
