/* eslint-disable  @typescript-eslint/explicit-function-return-type */
/* eslint-disable  @typescript-eslint/no-var-requires  */
import Model from '../slider/Model/Model';
import Controller from '../slider/Controller/Controller';
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
    const optionsForElements = {
      $element: $('body'),
      range: false,
      vertical: false,
      min: 100,
      max: 500,
      progress: true,
      label: true,
      step: undefined,
    };

    const model = new Model();
    const controller = new Controller(model);
    model.getSliderOptions(optionsForElements);
    controller.init();
  };

  const turnOnProgress = () => {
    divProgress = document.querySelector('.js-slider__progress');
    divProgress.style.width = '0rem';
  };

  const addStyle = () => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = style;
    document.head.appendChild(styleElement);
    document.documentElement.style.fontSize = '13px';
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
    await addStyle();
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

  describe('After dispatch move', () => {
    beforeAll(() => {
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
