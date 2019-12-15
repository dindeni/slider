/* eslint-disable  @typescript-eslint/explicit-function-return-type */
/* eslint-disable  @typescript-eslint/no-var-requires  */
import View from '../slider/views/View/view.js';
import ViewUpdating from '../slider/views/ViewUpdating.js';

import { dispatchMove, dispatchClick } from './_serviceFunctions';
import style from '../blocks/slider/slider.scss';

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
    const optionsForElements = {
      $element: $('body'),
      range: false,
      vertical: false,
      min: 100,
      max: 500,
      step: undefined,
      progress: true,
    };
    view.createElements(optionsForElements);
  };

  const turnOnProgress = () => {
    divProgress = document.querySelector('.js-slider__progress');
    divProgress.style.width = '0rem';
  };

  const findElements = () => {
    divThumb = document.querySelector('.js-slider__thumb');
    divThumbLeft = divThumb.getBoundingClientRect().left;
    divThumbTop = divThumb.getBoundingClientRect().top;
    divTrack = document.querySelector('.js-slider__track');
    divLabel = document.querySelector('.js-slider__label');

    divTrack.style.width = '20.02rem';
    divThumb.style.left = '0rem';
  };

  beforeAll(async () => {
    document.body.innerHTML = '';
    await createElements();
    await turnOnProgress();
    await findElements();
    const styleElement = document.createElement('style');
    styleElement.innerHTML = style;
    document.head.appendChild(styleElement);
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

  describe('After dispatch move', () => {
    beforeAll(() => {
      const $wrapper = $('.sliderInit');
      const viewDnd = new ViewUpdating();
      const optionsForDnD = {
        step: undefined,
        vertical: false,
        range: false,
        progress: true,
        min: 100,
        max: 500,
        $wrapper,
      };
      viewDnd.addDragAndDrop(optionsForDnD);
      dispatchMove(divThumb, divThumbLeft, divThumbTop, moveDistanceX,
        moveDistanceY);
    });

    it('should div thumb move a distance', () => {
      expect(parseFloat(divThumb.style.left)).toBe(moveDistanceX * 0.077);
    });

    it('should label value to be 177', () => {
      expect(divLabel.textContent).toBe('177');
    });

    it('after track click should thumb move a distance', () => {
      divThumbLeft = parseInt(divThumb.style.left, 10);
      const coordX = divTrack.getBoundingClientRect().left + 100;
      const coordY = divTrack.getBoundingClientRect().top;
      dispatchClick(divTrack, coordX, coordY);
      const divThumbLeftAfterClick = parseInt(divThumb.style.left, 10);

      expect(divThumbLeft).not.toEqual(divThumbLeftAfterClick);
    });
  });
});
