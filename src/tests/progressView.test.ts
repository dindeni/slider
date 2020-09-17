import ProgressView from '../slider/views/ProgressView/ProgressView';
import Controller from '../slider/Controller/Controller';
import Model from '../slider/Model/Model';

describe('ProgressView', () => {
  let options;
  let progressView: ProgressView;
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
    progressView = new ProgressView(view);
  });

  it('should create progress', () => {
    expect($('.js-slider__progress').length).toBe(1);
  });

  it('should styling progress', () => {
    $('.js-slider__thumb_type_max').css({ left: '300px' });
    progressView.makeProgress();
    expect($('.js-slider__progress').css('width')).toBe('300px');
  });
});
