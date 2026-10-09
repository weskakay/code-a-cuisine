import {
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CUISINES } from '../../data/options';
import type { Language } from '../../data/texts';
import type { Recipe } from '../../interfaces/recipe.interface';
import { LanguageService } from '../../services/language.service';
import { RecipeService } from '../../services/recipe.service';
import { Icon } from '../icon/icon';
import { MenuBar } from '../menu-bar/menu-bar';
import { SiteFooter } from '../site-footer/site-footer';

/** Start of the public library: the most liked recipes and the six cuisines. */
@Component({
  selector: 'app-cookbook',
  imports: [Icon, MenuBar, RouterLink, SiteFooter],
  templateUrl: './cookbook.html',
  styleUrl: './cookbook.scss',
})
export class Cookbook {
  private readonly recipeService = inject(RecipeService);
  private readonly languages = inject(LanguageService);

  readonly text = this.languages.t;

  readonly cuisines = CUISINES;
  readonly mostLiked = signal<Recipe[]>([]);

  /** True while the row of the most liked recipes is wider than its box. */
  readonly rowScrolls = signal(false);

  private readonly likedRow = viewChild<ElementRef<HTMLElement>>('likedRow');

  constructor() {
    effect(() => this.watchRow(this.mostLiked()));
    effect(() => {
      const language = this.languages.current();
      untracked(() => void this.loadMostLiked(language));
    });
    const onResize = () => this.measureRow();
    window.addEventListener('resize', onResize);
    inject(DestroyRef).onDestroy(() => window.removeEventListener('resize', onResize));
  }

  /** Moves the row of the most liked recipes by about one card. */
  scrollLiked(direction: -1 | 1): void {
    const row = this.likedRow()?.nativeElement;
    row?.scrollBy({ left: direction * 280, behavior: 'smooth' });
  }

  /** Waits for the row to be drawn, then looks whether it can scroll. */
  private watchRow(liked: Recipe[]): void {
    if (liked.length === 0) {
      this.rowScrolls.set(false);
      return;
    }
    setTimeout(() => this.measureRow());
  }

  /** Arrows only make sense when there is something left to see. */
  private measureRow(): void {
    const row = this.likedRow()?.nativeElement;
    this.rowScrolls.set(!!row && row.scrollWidth > row.clientWidth + 8);
  }

  /**
   * Reads the recipes with the most hearts in the language of the interface, again on
   * every switch. Stays empty until someone likes one. A late answer for a language
   * that is no longer on is dropped.
   */
  private async loadMostLiked(language: Language): Promise<void> {
    const liked = await this.recipeService.listMostLiked(language).catch(() => []);
    if (language === this.languages.current()) {
      this.mostLiked.set(liked.filter((dish) => dish.likes > 0));
    }
  }
}
