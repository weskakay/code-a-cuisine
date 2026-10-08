import { inject, Pipe, type PipeTransform } from '@angular/core';
import { LanguageService } from '../services/language.service';

/**
 * Writes a number the way the chosen language does, so 582.5 reads 582,5 in German.
 * Not pure, because the language can switch while the number stays the same.
 */
@Pipe({ name: 'amount', pure: false })
export class AmountPipe implements PipeTransform {
  private readonly language = inject(LanguageService).current;

  /** Formats the number with at most two decimals. */
  transform(value: number): string {
    const locale = this.language() === 'de' ? 'de-DE' : 'en-GB';
    return value.toLocaleString(locale, { maximumFractionDigits: 2 });
  }
}
