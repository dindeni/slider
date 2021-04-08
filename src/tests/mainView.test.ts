import Main from '../slider/views/Main/Main';
import { SliderElementOptions } from '../types/types';
import Model from '../slider/Model/Model';
import Controller from '../slider/Controller/Controller';

describe('Main', () => {
  let options: SliderElementOptions;
  let view: Main;
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
    model.setSettings(options);
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

  it('should reload slider', () => {
    view.reloadSlider({
      ...options, isRange: false, withProgress: false,
    });
    expect($('.js-slider__thumb_type_min').length).toBe(0);
    expect($('.js-slider__progress').length).toBe(0);
  });

  it('should call reload after resize', () => {
    const spy = jest.spyOn(view, 'reloadSlider');
    $(window).trigger('resize');
    expect(spy).toBeCalled();
  });

  it('should update slider(withProgress = false)', () => {
    view.updateSlider({ value: 50 });
    expect(view.settings.value).toBe(50);
  });
});
