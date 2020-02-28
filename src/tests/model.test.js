/* eslint-disable  @typescript-eslint/explicit-function-return-type  */
/* eslint-disable  @typescript-eslint/no-var-requires  */
import Model from '../slider/Model/Model';

describe('Presenter', () => {
  let model;

  beforeAll(async () => {
    document.body.innerHTML = '';
    model = new Model();
  });

  it('should calculate sliderInit value percent', () => {
    expect(model.calculateSliderMovePercent({ trackSize: 100, distance: 50 }))
      .toBe(50);
  });

  it('should calculate sliderInit value', () => {
    expect(model.calculateSliderValue({
      min: 100,
      max: 500,
      trackSize: 260,
      distance: 130,
    }))
      .toBe(300);
  });

  it('should calculate value to coordinates', () => {
    const coordinates = Model.calculateFromValueToCoordinates({
      value: 400,
      min: 100,
      max: 500,
      trackSize: 260,
    });
    expect(coordinates).toBe(15.02);
  });

  it('should calculate scale value', () => {
    const values = model.calculateLeftScaleCoordinates({
      min: 0,
      max: 100,
      step: 25,
      vertical: false,
      trackWidth: 260,
      trackHeight: 5,
    });
    expect(values).toEqual({
      coordinates: [0, 65, 130, 195, 260],
      value: [0, 25, 50, 75, 100],
      shortValue: [0, 25, 50, 75, 100],
      shortCoordinates: [0, 65, 130, 195, 260],
    });
  });
});
