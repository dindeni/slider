import View from '../slider/views/View/View';
import { SliderElementOptions } from '../types/types';
import Model from '../slider/Model/Model';
import Controller from '../slider/Controller/Controller';

describe('View', () => {
  let options: SliderElementOptions;
  let view: View;
  let $element: JQuery<HTMLElement>;
  let $trackElement: JQuery<HTMLElement>;

  beforeAll(() => {
    $element = $('<div class="slider js-slider"></div>');
    $element.appendTo(document.body);
    options = {
      $element,
      isRange: false,
      isVertical: false,
      min: 100,
      max: 500,
      withProgress: true,
      withLabel: true,
      step: undefined,
    };

    const model = new Model();
    const controller = new Controller(model);
    model.getSliderOptions(options);
    controller.init();
    view = controller.view;
    $trackElement = $('.js-slider__track');
  });

  it('should create elements', () => {
    expect($element.find('.js-slider__thumb').length).toBe(1);
    expect($trackElement.length).toBe(1);
    expect($element.find('.js-slider__progress').length).toBe(1);
    expect($element.find('.js-slider__label').length).toBe(1);
  });

  it('should get track size', () => {
    expect(view.getTrackSize()).toBe(200);
  });

  it('should get thumb size', () => {
    expect(view.getThumbSize()).toBe(0);
  });

  it('should get scale data', () => {
    view.reloadSlider({ ...options, step: 100 });
    expect(view.getScaleData()).toEqual({
      coordinates: [0, 50, 100, 150, 200],
      shortCoordinates: [0, 50, 100, 150, 200],
      value: [100, 200, 300, 400, 500],
      shortValue: [100, 200, 300, 400, 500],
    });
  });

  it('should reload slider', () => {
    $element = $('<div class="slider js-slider"></div>');
    $element.appendTo(document.body);
    view.reloadSlider({ ...options, $element, isRange: false });
    expect($('.js-slider__thumb_type_min').length).toBe(0);
  });

  it('should get thumb size', () => {
    view.thumbView.size = 20;
    expect(view.getThumbSize()).toEqual(20);
  });
});
