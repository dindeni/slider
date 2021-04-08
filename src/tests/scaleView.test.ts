import Scale from '../slider/views/Scale/Scale';
import Controller from '../slider/Controller/Controller';
import Model from '../slider/Model/Model';
import { SliderElementOptions } from '../types/types';
import Main from '../slider/views/Main/Main';

describe('Scale', () => {
  let scaleView: Scale;
  let controller: Controller;
  let options: SliderElementOptions;
  let view: Main;

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
    view = controller.view;
    scaleView = view.scaleView;
  });

  it('should create scale', () => {
    expect($('.js-slider__scale-item').length).toBe(9);
  });

  it('should set position min', () => {
    const element = $('.js-slider__thumb_type_min')[0];
    scaleView.update({ value: 275, type: 'min' });
    expect(element.style.left).toEqual('87.5px');
  });

  it('should set position max', () => {
    const element = $('.js-slider__thumb_type_max')[0];
    scaleView.update({ value: 275, type: 'max' });
    expect(element.style.left).toEqual('87.5px');
  });

  describe('Without label mark', () => {
    beforeAll(() => {
      controller.reloadSlider({ ...options, withLabel: false });
      scaleView = controller.view.scaleView;
    });

    it('should set position min', () => {
      const element = $('.js-slider__thumb_type_min')[0];
      scaleView.update({ value: 200, type: 'min' });
      expect(element.style.left).toEqual('50px');
    });

    it('should set position max', () => {
      const element = $('.js-slider__thumb_type_max')[0];
      scaleView.update({ value: 400, type: 'max' });
      expect(element.style.left).toEqual('150px');
    });

    describe('Step = 9', () => {
      beforeAll(() => {
        controller.reloadSlider({ ...options, step: 9 });
      });

      it('should create scale', () => {
        expect($('.js-slider__scale-item').length).toBe(6);
      });
    });
  });

  it('should not update thumb position', () => {
    const $min = $('.js-slider__thumb_type_min');
    const coordinateLeft = $min.css('left');
    scaleView.update({ value: 43, type: 'min' });
    expect($min.css('left')).toBe(coordinateLeft);
  });

  it('should create elements(withScale = false)', () => {
    controller.reloadSlider({ ...options, withScale: false });
    expect($('.js-slider__scale-item').length).toBe(0);
  });
});
