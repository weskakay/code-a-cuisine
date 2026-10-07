import { Component, computed, inject, input } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { Icon, type IconName } from '../icon/icon';

/** The coloured label of one cook, as the design shows it. */
@Component({
  selector: 'app-cook-label',
  imports: [Icon],
  templateUrl: './cook-label.html',
  styleUrl: './cook-label.scss',
  host: { '[class]': "'cook cook--' + cook()" },
})
export class CookLabel {
  readonly text = inject(LanguageService).t;

  /** Number of the cook, 1 to 3. */
  readonly cook = input.required<number>();

  /** Cooks take turns between the hat and the spoon, like in the design. */
  readonly icon = computed<IconName>(() => (this.cook() % 2 === 1 ? 'hat' : 'spoon'));
}
