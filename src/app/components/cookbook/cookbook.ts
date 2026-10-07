import {
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  type OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CUISINES } from '../../data/options';
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
export class Cookbook implements OnInit {
  private readonly recipeService = inject(RecipeService);

  readonly text = inject(LanguageService).t;

  readonly cuisines = CUISINES;
  readonly mostLiked = signal<Recipe[]>([]);

  /** True while the row of the most liked recipes is wider than its box. */
  readonly rowScrolls = signal(false);

  private readonly likedRow = viewChild<ElementRef<HTMLElement>>('likedRow');

  constructor() {
    effect(() => this.watchRow(this.mostLiked()));
    const onResize = () => this.measureRow();
    window.addEventListener('resize', onResize);
    inject(DestroyRef).onDestroy(() => window.removeEventListener('resize', onResize));
  }

  ngOnInit(): void {
    void this.loadMostLiked();
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

  /** Reads the recipes with the most hearts. Stays empty until someone likes one. */
  private async loadMostLiked(): Promise<void> {
    const liked = await this.recipeService.listMostLiked().catch(() => []);
    this.mostLiked.set(liked.filter((dish) => dish.likes > 0));
  }
}
