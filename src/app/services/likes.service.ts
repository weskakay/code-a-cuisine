import { inject, Injectable } from '@angular/core';
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
  private readonly liked = new Set<string>(read());

  /** True when this browser already gave that recipe a heart. */
  has(id: string): boolean {
    return this.liked.has(id);
  }

  /** Adds a heart or takes it back, and answers with the new count. */
  async toggle(id: string): Promise<number> {
    const step = this.liked.has(id) ? -1 : 1;
    const count = await this.recipes.like(id, step);
    if (step === 1) {
      this.liked.add(id);
    } else {
      this.liked.delete(id);
    }
    save(this.liked);
    return count;
  }
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
function save(ids: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    return;
  }
}
