/* eslint-disable  @typescript-eslint/explicit-function-return-type  */
/* eslint-disable  @typescript-eslint/no-var-requires  */
import View from '../slider/views/View/View';
import Presenter from '../slider/Presenter/Presenter';

const $ = require('jquery');

describe('Presenter', () => {
  let presenter;

  const createElements = () => {
    const view = new View();
    const optionsForElements = {
      $element: $('body'),
      range: false,
      vertical: false,
      min: 100,
      max: 500,
      step: undefined,
    };
    view.createElements(optionsForElements);
  };

  beforeAll(async () => {
    document.body.innerHTML = '';

    await createElements();
    presenter = new Presenter();
  });

  it('should calculate sliderInit value percent', () => {
    expect(presenter.calculateSliderMovePercent({ trackSize: 100, distance: 50 }))
      .toBe(50);
  });

  it('should calculate sliderInit value', () => {
    expect(presenter.calculateSliderValue({
      min: 100,
      max: 500,
      trackSize: 260,
      distance: 130,
    }))
      .toBe(300);
  });

  it('should calculate value to coordinates', () => {
    const coordinates = Presenter.calculateFromValueToCoordinates({
      value: 400,
      min: 100,
      max: 500,
      trackSize: 260,
    });
    expect(coordinates).toBe(15.015);
  });
});
