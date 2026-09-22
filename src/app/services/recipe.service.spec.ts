import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RecipeService } from './recipe.service';

const row = {
  id: 'abc',
  created_at: '2026-09-22T18:00:00Z',
  title: 'Pasta with spinach',
  cuisine: 'italian',
  diet: 'vegetarian',
  cooking_time: 'quick',
  cooking_minutes: 20,
  portions: 2,
  helpers: 1,
  your_ingredients: [{ name: 'Pasta', amount: 100, unit: 'g' }],
  extra_ingredients: [],
  steps: [],
  nutrition_per_portion: { energyKcal: 630, proteinG: 18, carbsG: 58, fatG: 24 },
  nutrition_total: { energyKcal: 1260, proteinG: 36, carbsG: 116, fatG: 48 },
  likes: 66,
};

describe('RecipeService', () => {
  let service: RecipeService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(RecipeService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('maps a row to a recipe and reads the total', async () => {
    const page = service.listRecipes(1);
    const request = http.expectOne((r) => r.url.includes('/rest/v1/recipes'));
    request.flush([row], { headers: { 'content-range': '0-19/42' } });
    const result = await page;
    expect(result.total).toBe(42);
    expect(result.items[0].cookingMinutes).toBe(20);
    expect(result.items[0].createdAt).toBe('2026-09-22T18:00:00Z');
  });

  it('filters by cuisine and asks for the second page', () => {
    service.listRecipes(2, 'italian');
    const request = http.expectOne((r) => r.url.includes('cuisine=eq.italian'));
    expect(request.request.headers.get('Range')).toBe('20-39');
  });

  it('returns null when the recipe does not exist', async () => {
    const recipe = service.getRecipe('missing');
    http.expectOne((r) => r.url.includes('id=eq.missing')).flush([]);
    expect(await recipe).toBeNull();
  });
});
