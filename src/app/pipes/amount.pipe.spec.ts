import { TestBed } from '@angular/core/testing';
import { LanguageService } from '../services/language.service';
import { AmountPipe } from './amount.pipe';

describe('AmountPipe', () => {
  let pipe: AmountPipe;
  let language: LanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AmountPipe] });
    pipe = TestBed.inject(AmountPipe);
    language = TestBed.inject(LanguageService);
  });

  it('writes a decimal comma in German', () => {
    language.use('de');
    expect(pipe.transform(582.5)).toBe('582,5');
  });

  it('writes a decimal point in English', () => {
    language.use('en');
    expect(pipe.transform(582.5)).toBe('582.5');
  });

  it('follows a language switch for the same number', () => {
    language.use('de');
    expect(pipe.transform(1234.5)).toBe('1.234,5');
    language.use('en');
    expect(pipe.transform(1234.5)).toBe('1,234.5');
  });

  it('keeps two decimals at most', () => {
    language.use('de');
    expect(pipe.transform(0.125)).toBe('0,13');
  });
});
