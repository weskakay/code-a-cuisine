import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import type { RecipeRequest } from '../interfaces/recipe.interface';
import { GeneratorError, GeneratorService } from './generator.service';

const request: RecipeRequest = {
  ingredients: [{ name: 'Pasta', amount: 100, unit: 'g' }],
  portions: 2,
  cookingTime: 'quick',
  cuisine: 'italian',
  diet: 'vegetarian',
  helpers: 2,
  language: 'en',
};

describe('GeneratorService', () => {
  let service: GeneratorService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(GeneratorService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('posts the request and returns the recipes', async () => {
    const answer = service.generate(request);
    const call = http.expectOne((r) => r.url.includes('generate-recipes'));
    expect(call.request.body.portions).toBe(2);
    call.flush({ recipes: [], quota: { remaining: 2, limit: 3 } });
    expect((await answer).quota.remaining).toBe(2);
  });

  it('keeps the message of a rejected request', async () => {
    const answer = service.generate(request);
    http
      .expectOne((r) => r.url.includes('generate-recipes'))
      .flush({ error: 'Add at least one ingredient.' }, { status: 400, statusText: 'Bad Request' });
    await expect(answer).rejects.toThrow('Add at least one ingredient.');
  });

  it('marks a used up quota', async () => {
    const answer = service.generate(request).catch((error: unknown) => error as GeneratorError);
    http
      .expectOne((r) => r.url.includes('generate-recipes'))
      .flush(
        { error: 'You have used all three recipes for today.' },
        { status: 429, statusText: 'Too Many Requests' },
      );
    const error = (await answer) as GeneratorError;
    expect(error.quotaReached).toBe(true);
  });

  it('keeps a broken generation apart from an unreachable workflow', async () => {
    const answer = service.generate(request).catch((error: unknown) => error as GeneratorError);
    http
      .expectOne((r) => r.url.includes('generate-recipes'))
      .flush({ error: 'The model broke the rules.' }, { status: 502, statusText: 'Bad Gateway' });
    const error = (await answer) as GeneratorError;
    expect(error.offline).toBe(false);
    expect(error.message).toBe('The model broke the rules.');
  });

  it('reports a silent workflow as offline', async () => {
    const answer = service.generate(request).catch((error: unknown) => error as GeneratorError);
    http
      .expectOne((r) => r.url.includes('generate-recipes'))
      .error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
    const error = (await answer) as GeneratorError;
    expect(error.offline).toBe(true);
  });

  it('does not call anything when no address is configured', async () => {
    const before = environment.webhookUrl;
    environment.webhookUrl = '';
    const error = (await service
      .generate(request)
      .catch((failure: unknown) => failure)) as GeneratorError;
    environment.webhookUrl = before;
    expect(error.offline).toBe(true);
  });
});
