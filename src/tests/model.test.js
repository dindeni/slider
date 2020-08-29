/* eslint-disable  @typescript-eslint/explicit-function-return-type  */
/* eslint-disable  @typescript-eslint/no-var-requires  */
import Model from '../slider/Model/Model';
import Controller from '../slider/Controller/Controller';
import style from '../blocks/slider/slider.scss';

describe('Model', () => {
  let model;
  let controller;

  beforeAll(async () => {
    document.body.innerHTML = '';
    const styleElement = document.createElement('style');
    styleElement.innerHTML = style;
    document.head.appendChild(styleElement);
    document.documentElement.style.fontSize = '13px';
    const $wrapper = $('<div class="slider js-slider"></div>');
    const body = $('body');
    body.css({ width: '300px' });
    $wrapper.appendTo(body);
    const options = {
      $element: $wrapper,
      isRange: true,
      isVertical: false,
      min: 100,
      max: 500,
      withProgress: true,
      withLabel: true,
      step: undefined,
    };
    model = new Model();
    model.getSliderOptions(options);
    controller = new Controller(model);
    controller.init();
  });

  it('should get slider value', () => {
    model.getSliderOptions({
      min: 100,
      max: 500,
      isRange: true,
      valueMin: 0,
      valueMax: 501,
    });
    expect(model.sliderOptions.valueMin).toBe(100);
    expect(model.sliderOptions.valueMax).toBe(500);
  });

  it('should validate value', () => {
    model.validateValue({ value: 51, type: 'min' });
    expect(controller.view.isValidValue).toBe(false);
  });

  it('should validate step value', () => {
    controller.reloadSlider({
      min: 0,
      max: 100,
      isRange: true,
      step: 10,
    });
    expect(model.validateStepValue(55)).toBe(60);
  });
});
