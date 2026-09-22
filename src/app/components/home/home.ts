import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuBar } from '../menu-bar/menu-bar';

/** Start page with the two calls to action. */
@Component({
  selector: 'app-home',
  imports: [MenuBar, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
