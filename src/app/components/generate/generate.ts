import { Component } from '@angular/core';
import { MenuBar } from '../menu-bar/menu-bar';

/** Step one: the visitor lists what is at home. */
@Component({
  selector: 'app-generate',
  imports: [MenuBar],
  templateUrl: './generate.html',
  styleUrl: './generate.scss',
})
export class Generate {}
