import { inject, Injectable, signal } from '@angular/core';
import { RecipeService } from './recipe.service';

const STORAGE_KEY = 'cc-liked';

/**
 * Remembers which recipes this browser gave a heart and moves the count in the
 * database. Without accounts that is the best we can do: the browser knows its
 * own hearts, the database only counts them.
 */
@Injectable({ providedIn: 'root' })
export class LikesService {
  private readonly recipes = inject(RecipeService);
  private readonly liked = signal<ReadonlySet<string>>(new Set(read()));

  /** True when this browser already gave that recipe a heart. Reactive. */
  has(id: string): boolean {
    return this.liked().has(id);
  }

  /**
   * Adds a heart or takes it back and answers with the new count. The browser
   * remembers it at once; if the database says no, the heart goes back.
   */
  async toggle(id: string): Promise<number> {
    const step = this.liked().has(id) ? -1 : 1;
    this.remember(flip(this.liked(), id));
    try {
      return await this.recipes.like(id, step);
    } catch (error) {
      this.remember(flip(this.liked(), id));
      throw error;
    }
  }

  /** Keeps the hearts in the signal and in the browser storage. */
  private remember(ids: ReadonlySet<string>): void {
    this.liked.set(ids);
    save(ids);
  }
}

/** A copy of the ids with that one added or removed. */
function flip(ids: ReadonlySet<string>, id: string): Set<string> {
  const next = new Set(ids);
  if (!next.delete(id)) {
    next.add(id);
  }
  return next;
}

/** Reads the ids out of the browser storage, which may be switched off. */
function read(): string[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(stored) ? stored.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

/** Writes the ids back. A private window may forbid it, then nothing happens. */
function save(ids: ReadonlySet<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    return;
  }
}
