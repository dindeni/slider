/* eslint-disable  @typescript-eslint/explicit-function-return-type  */
/* eslint-disable  @typescript-eslint/no-var-requires  */
import View from '../blocks/views/view/view.ts';
import Presenter from '../blocks/presenter/presenter.ts';

const $ = require('jquery');

describe('Presenter', () => {
  let presenter;

  const createElements = () => {
    const view = new View();
    view.createElements($('body'), false, false,
      100, 500, undefined);
  };

  beforeAll(async () => {
    document.body.innerHTML = '';

    await createElements();
    presenter = new Presenter();
  });

  it('should calculate slider value percent', () => {
    expect(presenter.calculateSliderMovePercent(100, 50))
      .toBe(50);
  });

  it('should calculate slider value', () => {
    expect(presenter.calculateSliderValue(100, 500, 260,
      131))
      .toBe(300);
  });

  it('should calculate value to coordinates', () => {
    const coordinates = Presenter.calculateFromValueToCoordinates(400,
      100, 500, 260);
    expect(coordinates).toBe(195);
  });
});
