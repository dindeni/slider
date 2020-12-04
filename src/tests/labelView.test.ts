import LabelView from '../slider/views/LabelView/LabelView';
import Controller from '../slider/Controller/Controller';
import Model from '../slider/Model/Model';
import { SliderElementOptions } from '../types/types';

describe('ProgressView', () => {
  let labelView: LabelView;
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
      $element,
    };
    const model = new Model();
    controller = new Controller(model);
    model.setSettings(options);
    controller.init();
    labelView = controller.view.labelView;
  });

  it('should create label', () => {
    expect($('.js-slider__label').length).toBe(2);
  });

  it('should update label value min', () => {
    const $label = $('.js-slider__label_type_min');
    labelView.updateValue({ value: 150, type: 'min' });
    expect($label.text()).toBe('150');
  });

  it('should update label value max', () => {
    const $label = $('.js-slider__label_type_max');
    labelView.updateValue({ value: 200, type: 'max' });
    expect($label.text()).toBe('200');
  });

  describe('Without label mark', () => {
    beforeAll(() => {
      controller.reloadSlider({ ...options, withLabel: false });
      labelView = controller.view.labelView;
    });

    it('should update label value min', () => {
      labelView.updateValue({ value: 150, type: 'min' });
      expect(controller.view.settings.valueMin).toBe(150);
    });

    it('should update label value min', () => {
      labelView.updateValue({ value: 400, type: 'max' });
      expect(controller.view.settings.valueMax).toBe(400);
    });
  });
});
