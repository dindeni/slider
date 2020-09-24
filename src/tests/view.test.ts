import View from '../slider/views/View/View';
import { SliderElementOptions } from '../types/types';

describe('View', () => {
  let options;
  let elementOptions: SliderElementOptions;
  let view: View;
  let $element: JQuery;

  beforeAll(() => {
    $element = $('<div class="slider js-slider"></div>');
    $element.appendTo(document.body);
    options = {
      isRange: false,
      isVertical: false,
      min: 100,
      max: 500,
      withProgress: true,
      withLabel: true,
      step: undefined,
    };
    elementOptions = { ...options, $element };

    view = new View();
    view.getSliderOptions(elementOptions);
  });

  it('should create elements', () => {
    view.createElements(elementOptions);
    expect($element.find('.js-slider__thumb').length).toBe(1);
    expect($element.find('.js-slider__track').length).toBe(1);
    expect($element.find('.js-slider__progress').length).toBe(1);
    expect($element.find('.js-slider__label').length).toBe(1);
  });

  it('should get slider options', () => {
    view.getSliderOptions(elementOptions);
    expect(view.sliderSettings).toEqual({ ...elementOptions, valueMin: 100, valueMax: 500 });
  });

  it('should get fraction of value', () => {
    view.getFractionOfValue(150);
    expect(view.fraction).toBe(150);
  });

  it('should set value state', () => {
    view.setValueState(false);
    expect(view.isValidValue).toBe(false);
  });

  it('should get step value', () => {
    view.getValidStepValue(120);
    expect(view.stepValue).toBe(120);
  });
});
