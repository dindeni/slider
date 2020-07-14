/* eslint-disable  @typescript-eslint/explicit-function-return-type  */
/* eslint-disable  @typescript-eslint/no-var-requires  */
import Model from '../slider/Model/Model';

describe('Model', () => {
  let model;

  beforeAll(async () => {
    document.body.innerHTML = '';
    model = new Model();
  });

  it('should calculate sliderInit value', () => {
    expect(model.calculateSliderValue({
      min: 100,
      max: 500,
      fraction: 0.5,
    }))
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
    const values = Model.validateStepValues({
      data: {
        coordinates: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        value: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        shortCoordinates: [],
        shortValue: [],
      },
      max: 10,
    });
    expect(values).toEqual({
      coordinates: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      value: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      shortValue: [0, 2, 4, 6, 8, 10],
      shortCoordinates: [0, 2, 4, 6, 8, 10],
    });
  });
});
