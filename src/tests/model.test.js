/* eslint-disable  @typescript-eslint/explicit-function-return-type  */
/* eslint-disable  @typescript-eslint/no-var-requires  */
import Model from '../slider/Model/Model';
import Controller from '../slider/Controller/Controller';

describe('Model', () => {
  let model;
  let controller;

  beforeAll(async () => {
    document.body.innerHTML = '';
    const $wrapper = $('<div class="slider js-slider"></div>');
    const body = $('body');
    body.css({ width: '300px' });
    $wrapper.appendTo(body);
    const options = {
      $element: $wrapper,
      isRange: false,
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

  it('should calculate sliderInit value', () => {
    model.calculateSliderValue({
      min: 100,
      max: 500,
      fraction: 0.5,
    });
    expect(controller.view.valueForLabel)
      .toBe(300);
  });

  it('should calculate value to coordinates', () => {
    const coordinates = Model.calculateCurrentCoordinate({
      value: 400,
      min: 100,
      max: 500,
    });
    expect(coordinates).toBe(0.75);
  });

  it('should validate scale values', () => {
    model.validateStepValues({
      coordinates: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      value: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      shortCoordinates: [],
      shortValue: [],
    });
    const {
      coordinates, value, shortValue, shortCoordinates,
    } = controller.view.scaleData;

    expect({
      coordinates, value, shortValue, shortCoordinates,
    }).toEqual({
      coordinates: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      value: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      shortValue: [0, 2, 4, 6, 8, 10, 12],
      shortCoordinates: [0, 2, 4, 6, 8, 10, 12],
    });
  });
});
