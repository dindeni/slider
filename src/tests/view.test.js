/* eslint-disable  @typescript-eslint/explicit-function-return-type */
/* eslint-disable  @typescript-eslint/no-var-requires  */
import View from '../blocks/views/view/view.ts';
import ViewDnD from '../blocks/views/viewDnD/viewDnD.ts';

import dispatchMove from './_serviceFunctions';

const $ = require('jquery');

describe('View', () => {
  let divThumb;
  let divTrack;
  let divProgress;
  let divThumbLeft;
  let divThumbTop;
  const moveDistanceX = 50;
  const moveDistanceY = 0;
  let divLabel;

  const createElements = () => {
    const view = new View();
    view.createElements($('body'), false, false,
      100, 500, undefined, true);
  };

  const turnOnProgress = () => {
    divProgress = document.querySelector('.js-slider__progress');
    divProgress.style.width = 0;
  };

  const findElements = () => {
    divThumb = document.querySelector('.js-slider__thumb');
    divThumbLeft = divThumb.getBoundingClientRect().left;
    divThumbTop = divThumb.getBoundingClientRect().top;
    divTrack = document.querySelector('.js-slider__track');
    divLabel = document.querySelector('.js-slider__label');

    divTrack.style.width = '260px';
    divThumb.style.left = '0px';
  };

  beforeAll(async () => {
    document.body.innerHTML = '';
    await createElements();
    await turnOnProgress();
    await findElements();
  });

  it('should div thumb exists', () => {
    expect(divThumb).not.toBeNull();
  });

  it('should div track exists', () => {
    expect(divTrack).not.toBeNull();
  });

  it('should track progress exists', () => {
    expect(divProgress).not.toBeNull();
  });

  it('should track progress width to be equal thumb coordinates left', () => {
    expect(divProgress.style.width).toBe(divThumb.style.left);
  });

  it('should label exists', () => {
    expect(divLabel).not.toBeNull();
  });

  it('should div thumb to be draggable', () => {
    expect(divThumb.hasAttribute('draggable')).toBeTruthy();
  });

  describe('After dispatch', () => {
    beforeAll(() => {
      const wrapper = $('.slider');
      const viewDnd = new ViewDnD();
      viewDnd.addDnD(undefined, false, false, true,
        100, 500, wrapper);
      dispatchMove(divThumb, divThumbLeft, divThumbTop, moveDistanceX,
        moveDistanceY);
    });

    it('should div thumb move a distance', () => {
      expect(parseInt(divThumb.style.left, 10)).toBe(moveDistanceX);
    });

    it('should label value to be 176', () => {
      expect(divLabel.textContent).toBe('176');
    });
  });
});
