import { HttpClient, type HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, timeout, TimeoutError } from 'rxjs';
import { environment } from '../../environments/environment';
import type { RecipeRequest, RecipeResponse } from '../interfaces/recipe.interface';

/** What went wrong, in the wording the workflow sent back. */
export class GeneratorError extends Error {
  constructor(
    message: string,
    /** True when the daily limit is used up, so the app can show the pop-up. */
    readonly quotaReached: boolean,
    /** True when the workflow never answered, so the app can point to the library. */
    readonly offline = false,
  ) {
    super(message);
  }
}

const FALLBACK = 'The recipes could not be generated. Please try again.';

/* A hosted workflow is slower than a local one, but it must not hang forever */
const LIMIT_MS = 90_000;

/* Codes the workflow never sends itself: no answer, or a proxy gave up waiting */
const SILENT = [0, 404, 502, 503, 504, 522, 524];

/** Asks the workflow for three recipes. */
@Injectable({ providedIn: 'root' })
export class GeneratorService {
  private readonly http = inject(HttpClient);

  /** Sends the form data and returns three saved recipes plus the quota. */
  async generate(request: RecipeRequest): Promise<RecipeResponse> {
    if (!environment.webhookUrl) {
      throw new GeneratorError(FALLBACK, false, true);
    }
    try {
      const call = this.http.post<RecipeResponse>(environment.webhookUrl, request);
      return await firstValueFrom(call.pipe(timeout(LIMIT_MS)));
    } catch (error) {
      throw toGeneratorError(error);
    }
  }
}

/** Turns a failed request into a message the user can act on. */
function toGeneratorError(error: unknown): GeneratorError {
  if (error instanceof TimeoutError) {
    return new GeneratorError(FALLBACK, false, true);
  }
  const response = error as HttpErrorResponse;
  const sent = typeof response.error?.error === 'string' ? response.error.error : '';
  return new GeneratorError(sent || FALLBACK, response.status === 429, !sent && isSilent(response));
}

/** Nothing came back that the workflow could have written, so it was not reachable. */
function isSilent(response: HttpErrorResponse): boolean {
  return SILENT.includes(response.status);
}
