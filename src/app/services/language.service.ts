import { computed, effect, Injectable, signal } from '@angular/core';
import { DE, EN, type Language, type Texts } from '../data/texts';

const STORAGE_KEY = 'cc-language';

/**
 * Holds the language of the interface. Components read their texts from `t`,
 * so a switch redraws every page at once.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly current = signal<Language>(read());

  /** The texts of the chosen language. */
  readonly t = computed<Texts>(() => (this.current() === 'de' ? DE : EN));

  constructor() {
    effect(() => this.announce(this.current()));
  }

  /** Switches the interface over. */
  use(language: Language): void {
    this.current.set(language);
  }

  /** Tells the document and the browser storage which language is on. */
  private announce(language: Language): void {
    document.documentElement.lang = language;
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      return;
    }
  }
}

/** Reads the language from the storage, falling back to the browser setting. */
function read(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'de' || stored === 'en') {
      return stored;
    }
  } catch {
    return 'en';
  }
  return navigator.language.startsWith('de') ? 'de' : 'en';
}
