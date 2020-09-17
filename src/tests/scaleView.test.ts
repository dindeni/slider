import ScaleView from '../slider/views/ScaleView/ScaleView';
import Controller from '../slider/Controller/Controller';
import Model from '../slider/Model/Model';

describe('ScaleView', () => {
  let options;
  let scaleView: ScaleView;
  let $element;
  let view;
  let controller: Controller;

  beforeAll(() => {
    $element = $('<div class="slider js-slider"></div>');
    $element.appendTo(document.body);
    options = {
      isRange: true,
      isVertical: false,
      min: 100,
      max: 500,
      withProgress: true,
      withLabel: true,
      step: 100,
      $element,
    };
    const model = new Model();
    controller = new Controller(model);
    model.getSliderOptions(options);
    view = controller.view;
    controller.init();
    scaleView = new ScaleView(view);
  });

  it('should create scale', () => {
    expect($('.js-slider__scale-item').length).toBe(5);
  });

  it('should set scale coordinate', () => {
    view.scaleData.coordinates = [0, 75, 150, 225, 300];
    view.trackSize = 300;
    const coordinate = scaleView.setStepPosition(210);
    expect(coordinate).toBe(225)
  });
});
