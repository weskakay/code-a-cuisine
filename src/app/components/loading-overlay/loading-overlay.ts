import { Component, input } from '@angular/core';

/** Bridges the wait while the workflow writes the recipes. */
@Component({
  selector: 'app-loading-overlay',
  templateUrl: './loading-overlay.html',
  styleUrl: './loading-overlay.scss',
})
export class LoadingOverlay {
  /** The line above the dots, so every step can say what it is waiting for. */
  readonly label = input('Generating');

  /** Optional second line that says how long the wait usually takes. */
  readonly hint = input('');
}
