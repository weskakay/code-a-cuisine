import { HttpClient, type HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { RecipeRequest, RecipeResponse } from '../interfaces/recipe.interface';

/** What went wrong, in the wording the workflow sent back. */
export class GeneratorError extends Error {
  constructor(
    message: string,
    /** True when the daily limit is used up, so the app can show the pop-up. */
    readonly quotaReached: boolean,
  ) {
    super(message);
  }
}

const FALLBACK = 'The recipes could not be generated. Please try again.';

/** Asks the workflow for three recipes. */
@Injectable({ providedIn: 'root' })
export class GeneratorService {
  private readonly http = inject(HttpClient);

  /** Sends the form data and returns three saved recipes plus the quota. */
  async generate(request: RecipeRequest): Promise<RecipeResponse> {
    try {
      return await firstValueFrom(this.http.post<RecipeResponse>(environment.webhookUrl, request));
    } catch (error) {
      throw toGeneratorError(error as HttpErrorResponse);
    }
  }
}

/** Turns a failed request into a message the user can act on. */
function toGeneratorError(response: HttpErrorResponse): GeneratorError {
  const message = typeof response.error?.error === 'string' ? response.error.error : FALLBACK;
  return new GeneratorError(message, response.status === 429);
}
