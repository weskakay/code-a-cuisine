import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { LikesService } from './likes.service';
import { RecipeService } from './recipe.service';

describe('LikesService', () => {
  const like = vi.fn<(id: string, step: 1 | -1) => Promise<number>>();
  let service: LikesService;

  beforeEach(() => {
    localStorage.clear();
    like.mockReset();
    TestBed.configureTestingModule({
      providers: [{ provide: RecipeService, useValue: { like } }],
    });
    service = TestBed.inject(LikesService);
  });

  it('remembers the heart at once and keeps it in the browser', async () => {
    like.mockResolvedValue(1);
    const answer = service.toggle('a');
    expect(service.has('a')).toBe(true);
    expect(await answer).toBe(1);
    expect(localStorage.getItem('cc-liked')).toBe('["a"]');
    expect(like).toHaveBeenCalledWith('a', 1);
  });

  it('takes the heart back on a second click', async () => {
    like.mockResolvedValue(1);
    await service.toggle('a');
    like.mockResolvedValue(0);
    await service.toggle('a');
    expect(service.has('a')).toBe(false);
    expect(like).toHaveBeenLastCalledWith('a', -1);
  });

  it('gives the heart back when the database says no', async () => {
    like.mockRejectedValue(new Error('offline'));
    await expect(service.toggle('a')).rejects.toThrow('offline');
    expect(service.has('a')).toBe(false);
    expect(localStorage.getItem('cc-liked')).toBe('[]');
  });

  it('reads the hearts of an earlier visit', () => {
    localStorage.setItem('cc-liked', '["b"]');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: RecipeService, useValue: { like } }],
    });
    expect(TestBed.inject(LikesService).has('b')).toBe(true);
  });
});
