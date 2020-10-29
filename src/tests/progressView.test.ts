import ProgressView from '../slider/views/ProgressView/ProgressView';
import Controller from '../slider/Controller/Controller';
import Model from '../slider/Model/Model';

describe('ProgressView', () => {
  let progressView: ProgressView;

  beforeAll(() => {
    const $element = $('<div class="slider js-slider"></div>');
    $element.appendTo(document.body);
    const options = {
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
    controller.init();
    progressView = controller.view.progressView;
  });

  it('should create progress', () => {
    expect($('.js-slider__progress').length).toBe(1);
  });

  it('should styling progress', () => {
    progressView.makeProgress();
    expect($('.js-slider__progress').css('width')).toBe('200px');
  });
});
