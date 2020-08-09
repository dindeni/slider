/* eslint-disable  @typescript-eslint/explicit-function-return-type */
import Controller from '../slider/Controller/Controller';
import style from '../blocks/slider/slider.scss';
import { dispatchMove } from './_serviceFunctions';

describe('Range', () => {
  let divThumbMin;
  let divThumbMax;
  let divThumbLeftMin;
  let divThumbTopMin;
  let divThumbLeftMax;
  let divThumbTopMax;
  let divLabelMin;
  let divLabelMax;
  let divProgress;
  const moveDistanceX = 50;
  const moveDistanceY = 0;

  const createElements = () => {
    const $wrapper = $('<div class="slider js-slider"></div>');
    const body = $('body');
    body.css({ width: '300px' });
    $wrapper.appendTo(body);
    const optionsForElements = {
      $element: $wrapper,
      isRange: true,
      isVertical: false,
      min: 100,
      max: 500,
      withProgress: true,
      withLabel: true,
      step: undefined,
    };
    const controller = new Controller();
    controller.getSliderOptions(optionsForElements);
    controller.init();
    document.documentElement.style.fontSize = '13px';
  };

  const addStyle = () => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = style;
    document.head.appendChild(styleElement);
    document.documentElement.style.fontSize = '13px';
  };

  const findElements = () => {
    divThumbMin = document.querySelector('.js-slider__thumb_type_min');
    divThumbMax = document.querySelector('.js-slider__thumb_type_max');
    divThumbLeftMin = divThumbMin.getBoundingClientRect().left;
    divThumbTopMin = divThumbMin.getBoundingClientRect().top;
    divThumbLeftMax = divThumbMax.getBoundingClientRect().left;
    divThumbTopMax = divThumbMax.getBoundingClientRect().top;
    divLabelMin = document.querySelector('.js-slider__label_type_min');
    divLabelMax = document.querySelector('.js-slider__label_type_max');
    divProgress = document.querySelector('.js-slider__progress');
  };

  beforeAll(async () => {
    document.body.innerHTML = '';
    await addStyle();
    await createElements();
    await findElements();
  });

  it('should thumb min and max exist', () => {
    expect(divThumbMin && divThumbMax).not.toBeNull();
  });
  it('should label min and max exists', () => {
    expect(divLabelMin && divLabelMax).not.toBeNull();
  });
  it('should progress bar', () => {
    expect(divProgress).not.toBeNull();
  });

  describe('After dispatch max', () => {
    beforeAll(() => {
      dispatchMove(divThumbMax, divThumbLeftMax, divThumbTopMax, -moveDistanceX,
        moveDistanceY);
    });

    it('should div thumb max move a distance', () => {
      expect(parseInt(divThumbMax.style.left, 10)).toEqual(228);
    });
    it('should label max value to be 428', () => {
      expect(divLabelMax.textContent).toBe('428');
    });
    it('should progress width to be equal 228', () => {
      expect(parseInt(divProgress.style.width, 10)).toBe(228);
    });
  });

  describe('After dispatch min', () => {
    beforeAll(() => {
      dispatchMove(divThumbMin, divThumbLeftMin, divThumbTopMin, moveDistanceX,
        moveDistanceY);
    });

    it('should div thumb min move a distance', () => {
      expect(parseInt(divThumbMin.style.left, 10)).toEqual(50);
    });
    it('should label min value to be 172', () => {
      expect(divLabelMin.textContent).toBe('172');
    });
    it('should progress min width to be 178', () => {
      expect(parseInt(divProgress.style.width, 10)).toBe(178);
    });
  });
});
