import Model from '../slider/Model/Model';
import { SliderElementOptions } from '../types/types';

describe('Model', () => {
  let model: Model;
  let options: SliderElementOptions;
  const $element = $('<div class="slider js-slider"></div>');
  $element.appendTo(document.body);
  options = {
    isRange: true,
    isVertical: false,
    min: 100,
    max: 500,
    withProgress: true,
    withLabel: true,
    step: undefined,
    $element,
    valueMin: 0,
    valueMax: 510,
  };

  beforeAll(() => {
    model = new Model();
  });

  it('should get valid options(initial value)', () => {
    model.setSettings(options);
    const { valueMin, valueMax } = model.settings;
    expect(valueMin).toBe(100);
    expect(valueMax).toBe(500);
  });

  it('should get valid options(wrong value)', () => {
    model.setSettings({ ...options, valueMin: 10, valueMax: 600 });
    const { valueMin, valueMax } = model.settings;
    expect(valueMin).toBe(100);
    expect(valueMax).toBe(500);
  });

  it('should get valid step options', () => {
    model.setSettings({
      ...options, step: 100, valueMin: 155, valueMax: 321,
    });
    const { valueMin, valueMax } = model.settings;
    expect(valueMin).toBe(200);
    expect(valueMax).toBe(300);
  });

  it('should calculate fraction of value', () => {
    const fraction = model.calculateFractionOfValue(300);
    expect(fraction).toBe(0.5);
  });

  it('should validate value min', () => {
    const result = model.validateValue({ value: 300, type: 'min' });
    expect(result.value).toBe(300);
  });

  it('should validate value max', () => {
    const result = model.validateValue({ value: 400, type: 'max' });
    expect(result.value).toBe(400);
  });

  it('should validate value min with equal value', () => {
    model.setSettings({
      ...options, valueMax: 500, valueMin: 500,
    });
    const result = model.validateValue({ value: 400, type: 'min' });
    expect(result.type).toBe('min');
  });

  it('should validate value max with equal value', () => {
    model.setSettings({
      ...options, valueMax: 10, valueMin: 10,
    });
    const result = model.validateValue({ value: 100, type: 'min' });
    expect(result.type).toBe('max');
  });

  it('should validate step value(wrong value) ', () => {
    const result = model.validateValue({ value: 400, type: 'min' });
    expect(result.value).toBe(null);
  });
});
