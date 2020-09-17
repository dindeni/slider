import LabelView from '../slider/views/LabelView/LabelView';
import Controller from '../slider/Controller/Controller';
import Model from '../slider/Model/Model';

describe('ProgressView', () => {
  let options;
  let labelView: LabelView;
  let view;

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
    model.getSliderOptions(options);
    view = controller.view;
    controller.init();
    labelView = new LabelView(view);
  });

  it('should create label', () => {
    expect($('.js-slider__label').length).toBe(2);
  });

  it('should update label value min', () => {
    const $thumbMin = $('.js-slider__thumb_type_min');
    labelView.updateLabelValue({ thumbElement: $thumbMin[0], value: 250 });
    expect($thumbMin.children().text()).toBe('250');
  });

  it('should update label value', () => {
    const $thumbMax = $('.js-slider__thumb_type_max');
    labelView.updateLabelValue({ thumbElement: $thumbMax[0], value: 400 });
    expect($thumbMax.children().text()).toBe('400');
  });
});
