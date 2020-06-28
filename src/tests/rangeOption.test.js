/* eslint-disable  @typescript-eslint/explicit-function-return-type */
import Controller from '../slider/Controller/Controller';
import { dispatchMove } from './_serviceFunctions';
import style from '../blocks/slider/slider.scss';

describe('Range', () => {
  let divThumbMin;
  let divThumbMax;
  let divTrack;
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
    const optionsForElements = {
      $element: $('body'),
      range: true,
      vertical: false,
      min: 100,
      max: 500,
      progress: true,
      label: true,
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
    divTrack = document.querySelector('.js-slider__track');
    divLabelMin = document.querySelector('.js-slider__label_type_min');
    divLabelMax = document.querySelector('.js-slider__label_type_max');
    divProgress = document.querySelector('.js-slider__progress');

    divTrack.style.width = '20.02rem';
    divTrack.style.height = '0.385rem';
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
      divThumbMax.style.left = '20.02rem';
      dispatchMove(divThumbMax, divThumbLeftMax, divThumbTopMax, -moveDistanceX,
        moveDistanceY);
    });

    it('should div thumb max move a distance', () => {
      expect(parseFloat(divThumbMax.style.left))
        .toBe((Number((parseFloat(divTrack.style.width) - moveDistanceX * 0.077).toFixed(2))));
    });
    it('should label max value to be 451', () => {
      expect(divLabelMax.textContent).toBe('451');
    });
    it('should progress width to be equal 16.19rem', () => {
      expect(parseFloat(divProgress.style.width).toFixed(2)).toBe('16.19');
    });
  });

  describe('After dispatch min', () => {
    beforeAll(() => {
      dispatchMove(divThumbMin, divThumbLeftMin, divThumbTopMin, moveDistanceX,
        moveDistanceY);
    });

    it('should div thumb min move a distance', () => {
      expect(parseFloat(divThumbMin.style.left)).toBe(moveDistanceX * 0.077);
    });
    it('should label min value to be 184', () => {
      expect(divLabelMin.textContent).toBe('184');
    });
    it('should progress min width to be 12.33', () => {
      expect(parseFloat(divProgress.style.width).toFixed(2)).toBe('12.33');
    });
  });
});
