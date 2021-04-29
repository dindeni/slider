import Controller from '../slider/Controller/Controller';
import Model from '../slider/Model/Model';
import { SliderElementOptions } from '../types/types';

describe('Scale', () => {
  let controller: Controller;
  let options: SliderElementOptions;

  beforeAll(() => {
    const $element = $('<div class="slider js-slider"></div>');
    $element.appendTo(document.body);
    options = {
      isRange: true,
      isVertical: false,
      min: 100,
      max: 500,
      withProgress: true,
      withLabel: true,
      step: 25,
      $element,
      withScale: true,
    };
    const model = new Model();
    controller = new Controller(model);
    model.setSettings(options);
    controller.init();
  });

  it('should create scale', () => {
    expect($('.js-slider__scale-item').length).toBe(11);
  });

  describe('Without label mark', () => {
    beforeAll(() => {
      controller.reloadSlider({ ...options, withLabel: false });
    });

    describe('Step = 9', () => {
      beforeAll(() => {
        controller.reloadSlider({ ...options, step: 9 });
      });

      it('should create scale', () => {
        expect($('.js-slider__scale-item').length).toBe(11);
      });
    });
  });

  it('should create elements(withScale = false)', () => {
    controller.reloadSlider({ ...options, withScale: false });
    expect($('.js-slider__scale-item').length).toBe(0);
  });
});
