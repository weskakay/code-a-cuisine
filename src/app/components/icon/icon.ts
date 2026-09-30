import { Component, input } from '@angular/core';

/** The small drawings the app uses next to a label. */
export type IconName = 'clock' | 'hat' | 'heart' | 'spoon';

/** One line drawing, taking the colour and the size of the text around it. */
@Component({
  selector: 'app-icon',
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class Icon {
  readonly name = input.required<IconName>();

  /** Only the heart uses it: filled once the visitor gave it. */
  readonly filled = input(false);
}
