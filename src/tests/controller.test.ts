import Controller from '../slider/Controller/Controller';
import Model from '../slider/Model/Model';
import { SliderElementOptions } from '../types/types';

describe('Controller', () => {
  let controller;
  let options;

  beforeAll(() => {
    const $element = $('<div class="slider js-slider"></div>');
    $element.appendTo(document.body);

    const model = new Model();
    controller = new Controller(model);
    options = {
      isRange: false,
      isVertical: false,
      min: 100,
      max: 500,
      withProgress: true,
      withLabel: true,
      step: undefined,
    };
    const elementOptions = { ...options, $element };
    model.getSliderOptions(elementOptions);
  });

  describe('Initialization', () => {
    beforeAll(() => {
      controller.init();
    });

    it('should subscribe', () => {
      expect(controller.view.observers.length).toBe(4);
    });

    it('should pass options', () => {
      const {
        min, max, isRange, isVertical, withProgress, withLabel, step,
      } = controller.view.sliderSettings;
      expect({
        min, max, isRange, isVertical, withProgress, withLabel, step,
      }).toEqual(options);
    });

    it('should create elements', () => {
      expect($('.js-slider').children().length).toBe(2);
    });
  });

  it('should process the passed method', () => {
    let currentValue = 10;
    const method = (values: SliderElementOptions): void => {
      currentValue = values.value || values.max;
    };
    controller.passMethod(method);
    expect(currentValue).toBe(100);
  });

  it('should reload slider', () => {
    const newOptions = { ...options, isRange: true };
    controller.reloadSlider({ ...newOptions });
    const {
      min, max, isRange, isVertical, withProgress, withLabel, step,
    } = controller.view.sliderSettings;
    expect({
      min, max, isRange, isVertical, withProgress, withLabel, step,
    }).toEqual(newOptions);
  });
});
