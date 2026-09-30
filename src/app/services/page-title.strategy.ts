import { effect, inject, Injectable, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TitleStrategy, type RouterStateSnapshot } from '@angular/router';
import type { Texts } from '../data/texts';
import { LanguageService } from './language.service';

/** The keys the routes use for their title. */
type TitleKey = keyof Texts['titles'];

/**
 * Writes the title of the browser tab. The routes hold the key, the texts hold
 * the words, so the tab follows the language just like the page does.
 */
@Injectable({ providedIn: 'root' })
export class PageTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly languages = inject(LanguageService);
  private readonly key = signal<TitleKey>('home');

  constructor() {
    super();
    effect(() => this.title.setTitle(this.languages.t().titles[this.key()]));
  }

  /** Called by the router on every navigation. */
  override updateTitle(snapshot: RouterStateSnapshot): void {
    const key = this.buildTitle(snapshot);
    this.key.set(isTitleKey(key) ? key : 'home');
  }
}

/** True when the route named a key the texts know. */
function isTitleKey(key: string | undefined): key is TitleKey {
  return (
    key === 'home' ||
    key === 'generate' ||
    key === 'preferences' ||
    key === 'results' ||
    key === 'recipe' ||
    key === 'cookbook' ||
    key === 'imprint'
  );
}
