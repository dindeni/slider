import Controller from '../slider/Controller/Controller';
import Model from '../slider/Model/Model';
import { SliderElementOptions } from '../types/types';

import SpyInstance = jest.SpyInstance;

describe('Controller', () => {
  let controller: Controller;
  let options: SliderElementOptions;

  beforeAll(() => {
    const $element = $('<div class="slider js-slider"></div>');
    $element.appendTo(document.body);

    const model = new Model();
    controller = new Controller(model);
    options = {
      $element,
      isRange: false,
      isVertical: false,
      min: 100,
      max: 500,
      withProgress: true,
      withLabel: true,
      step: undefined,
      value: 100,
      valueMax: 500,
      valueMin: 100,
    };
    model.setSettings(options);
  });

  describe('Initialization', () => {
    let spyGetOptions: SpyInstance;
    beforeAll(() => {
      spyGetOptions = jest.spyOn(controller.view, 'setSliderOptions');
      controller.init();
    });

    it('should subscribe', () => {
      expect(controller.view.observers.length).toBe(3);
    });

    it('should pass options', () => {
      expect(spyGetOptions).toHaveBeenCalledWith(options);
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
    const spy = jest.spyOn(controller.view, 'reloadSlider');
    controller.reloadSlider(newOptions);
    expect(spy).toHaveBeenCalledWith(newOptions);
  });
});
