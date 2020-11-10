import ScaleView from '../slider/views/ScaleView/ScaleView';
import Controller from '../slider/Controller/Controller';
import Model from '../slider/Model/Model';

describe('ScaleView', () => {
  let scaleView: ScaleView;
  let controller: Controller;

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
      step: 25,
      $element,
    };
    const model = new Model();
    controller = new Controller(model);
    model.getSliderOptions(options);
    controller.init();
    scaleView = controller.view.scaleView;
  });

  it('should create scale', () => {
    expect($('.js-slider__scale-item').length).toBe(9);
  });

  it('should set position min', () => {
    const element = $('.js-slider__thumb_type_min')[0];
    scaleView.value = 150;
    scaleView.setPosition({ element, trackSize: 200 });
    expect(element.style.left).toEqual('25px');
  });

  it('should set position max', () => {
    const element = $('.js-slider__thumb_type_max')[0];
    scaleView.value = 200;
    scaleView.setPosition({ element, trackSize: 200 });
    expect(element.style.left).toEqual('50px');
  });
});
