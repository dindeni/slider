import HandleView from '../slider/views/HandleView/HandleView';
import Controller from '../slider/Controller/Controller';
import Model from '../slider/Model/Model';
import { SliderElementOptions } from '../types/types';

describe('HandleView', () => {
  let options: SliderElementOptions;
  let handleView: HandleView;

  beforeAll(() => {
    const $element = $('<div class="slider js-slider"></div>');
    $element.appendTo(document.body);
    options = {
      $element,
      isRange: true,
      isVertical: false,
      min: 100,
      max: 500,
      withProgress: true,
      withLabel: true,
    };
    const model = new Model();
    const controller = new Controller(model);
    model.setSettings(options);
    controller.init();
    handleView = controller.view.handleView;
  });

  it('should call reload after resize', () => {
    const spy = jest.spyOn(handleView, 'reloadSlider');
    $(window).trigger('resize');
    expect(spy).toBeCalled();
  });

  it('should reload slider', () => {
    handleView.reloadSlider({ ...options, isRange: false });
    expect($('.js-slider__thumb').length).toBe(1);
  });
});
