import { Component, computed, input, signal } from '@angular/core';
import type { Nutrition } from '../../interfaces/recipe.interface';

/** Radius of the ring, shared by the maths here and the viewBox in the template. */
const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Which numbers the chart shows. */
export type NutritionMode = 'portion' | 'total';

/** A macro before it knows its place in the ring. */
interface Macro {
  label: string;
  grams: number;
  token: string;
}

/** One slice of the ring, ready to draw. */
export interface MacroSlice extends Macro {
  percent: number;
  dash: string;
  offset: number;
}

/**
 * Energy and macros as a donut, switchable between one portion and the whole dish.
 * Drawn as plain SVG so it stays sharp and needs no chart library.
 */
@Component({
  selector: 'app-nutrition-chart',
  templateUrl: './nutrition-chart.html',
  styleUrl: './nutrition-chart.scss',
})
export class NutritionChart {
  readonly perPortion = input.required<Nutrition>();
  readonly total = input.required<Nutrition>();

  readonly radius = RADIUS;
  readonly mode = signal<NutritionMode>('portion');

  readonly current = computed(() =>
    this.mode() === 'portion' ? this.perPortion() : this.total(),
  );

  readonly slices = computed(() => buildSlices(this.current()));

  /** Switches between one portion and the whole dish. */
  show(mode: NutritionMode): void {
    this.mode.set(mode);
  }
}

/** The three macros in the order they appear in the ring. */
function macrosOf(values: Nutrition): Macro[] {
  return [
    { label: 'Protein', grams: values.proteinG, token: 'protein' },
    { label: 'Carbs', grams: values.carbsG, token: 'carbs' },
    { label: 'Fat', grams: values.fatG, token: 'fat' },
  ];
}

/**
 * Turns the macros into ring slices. The share is measured against the summed
 * grams, not against the calories, so the legend and the ring tell the same story.
 */
function buildSlices(values: Nutrition): MacroSlice[] {
  const macros = macrosOf(values);
  const sum = macros.reduce((all, macro) => all + macro.grams, 0);
  let used = 0;
  return macros.map((macro) => {
    const percent = sum > 0 ? (macro.grams / sum) * 100 : 0;
    const slice = toSlice(macro, percent, used);
    used += percent;
    return slice;
  });
}

/** Builds one slice, placed right after the ones before it. */
function toSlice(macro: Macro, percent: number, used: number): MacroSlice {
  return {
    ...macro,
    percent: Math.round(percent),
    dash: `${(percent / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`,
    offset: -(used / 100) * CIRCUMFERENCE,
  };
}
