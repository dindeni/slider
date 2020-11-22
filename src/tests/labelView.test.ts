import LabelView from '../slider/views/LabelView/LabelView';
import Controller from '../slider/Controller/Controller';
import Model from '../slider/Model/Model';

describe('ProgressView', () => {
  let options;
  let labelView: LabelView;

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
    const controller = new Controller(model);
    model.setSettings(options);
    controller.init();
    labelView = controller.view.labelView;
  });

  it('should create label', () => {
    expect($('.js-slider__label').length).toBe(2);
  });

  it('should update label value min', () => {
    const $thumbMin = $('.js-slider__thumb_type_min');
    const $label = $('.js-slider__label_type_min');
    labelView.updateValue({ thumbElement: $thumbMin[0], value: 100 });
    expect($label.text()).toBe('100');
  });

  it('should update label value max', () => {
    const $thumbMax = $('.js-slider__thumb_type_max');
    const $label = $('.js-slider__label_type_max');
    labelView.updateValue({ thumbElement: $thumbMax[0], value: 200 });
    expect($label.text()).toBe('200');
  });
});
