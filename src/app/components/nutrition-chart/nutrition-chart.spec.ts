import { TestBed } from '@angular/core/testing';
import type { Nutrition } from '../../interfaces/recipe.interface';
import { NutritionChart } from './nutrition-chart';

const PER_PORTION: Nutrition = { energyKcal: 500, proteinG: 25, carbsG: 50, fatG: 25 };
const TOTAL: Nutrition = { energyKcal: 1000, proteinG: 50, carbsG: 100, fatG: 50 };

/** Builds the component with both sets of values already bound. */
function makeChart(perPortion: Nutrition = PER_PORTION) {
  const fixture = TestBed.createComponent(NutritionChart);
  fixture.componentRef.setInput('perPortion', perPortion);
  fixture.componentRef.setInput('total', TOTAL);
  fixture.detectChanges();
  return fixture.componentInstance;
}

describe('NutritionChart', () => {
  it('splits the macros by their share of the summed grams', () => {
    const shares = makeChart()
      .slices()
      .map((slice) => slice.percent);

    expect(shares).toEqual([25, 50, 25]);
  });

  it('starts on the portion values and switches to the whole dish', () => {
    const chart = makeChart();
    expect(chart.current().energyKcal).toBe(500);

    chart.show('total');
    expect(chart.current().energyKcal).toBe(1000);
  });

  it('places every slice right after the one before it', () => {
    const [protein, carbs] = makeChart().slices();

    expect(protein.offset).toBe(-0);
    expect(carbs.offset).toBeCloseTo(-0.25 * 2 * Math.PI * 70);
  });

  it('survives a recipe without macros instead of dividing by zero', () => {
    const empty: Nutrition = { energyKcal: 0, proteinG: 0, carbsG: 0, fatG: 0 };

    const shares = makeChart(empty)
      .slices()
      .map((slice) => slice.percent);

    expect(shares).toEqual([0, 0, 0]);
  });
});
