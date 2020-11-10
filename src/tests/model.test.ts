import Model from '../slider/Model/Model';

describe('Model', () => {
  let model: Model;
  const $element = $('<div class="slider js-slider"></div>');
  $element.appendTo(document.body);
  const options = {
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

  it('should get valid options', () => {
    model.getSliderOptions(options);
    const { valueMin, valueMax } = model.sliderOptions;
    expect(valueMin).toBe(100);
    expect(valueMax).toBe(500);
  });

  it('should get valid step options', () => {
    model.getSliderOptions({
      ...options, step: 100, valueMin: 155, valueMax: 321,
    });
    const { valueMin, valueMax } = model.sliderOptions;
    expect(valueMin).toBe(200);
    expect(valueMax).toBe(300);
  });

  it('should calculate fraction of value', () => {
    const fraction = model.calculateFractionOfValue(300);
    expect(fraction).toBe(0.5);
  });

  it('should validate value min', () => {
    const state = model.validateValue({ value: 400, type: 'min' });
    expect(state).toBeFalsy();
  });

  it('should validate value max', () => {
    const state = model.validateValue({ value: 400, type: 'max' });
    expect(state).toBeTruthy();
  });
});
