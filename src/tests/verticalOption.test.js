/* eslint-disable  @typescript-eslint/explicit-function-return-type */
import Controller from '../slider/Controller/Controller';
import style from '../blocks/slider/slider.scss';
import { dispatchMove } from './_serviceFunctions';


describe('Vertical option', () => {
  let divTrack;
  let divThumb;
  let divThumbLeft;
  let divThumbTop;
  let divLabel;
  const moveDistanceX = 0;
  const moveDistanceY = 50;

  const createElements = () => {
    const $wrapper = $('<div class="slider js-slider"></div>');
    const body = $('body');
    body.css({ width: '300px' });
    $wrapper.appendTo(body);

    const optionsForElements = {
      $element: $wrapper,
      range: false,
      vertical: true,
      min: 100,
      max: 500,
      progress: true,
      label: true,
      step: undefined,
    };
    const controller = new Controller();
    controller.getSliderOptions(optionsForElements);
    controller.init();
  };

  const addStyle = () => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = style;
    document.head.appendChild(styleElement);
    document.documentElement.style.fontSize = '13px';
  };

  const findElements = () => {
    divTrack = document.querySelector('.js-slider__track');
    divThumb = document.querySelector('.js-slider__thumb');
    divThumbLeft = divThumb.getBoundingClientRect().left;
    divThumbTop = divThumb.getBoundingClientRect().top;
    divLabel = document.querySelector('.js-slider__label');
  };

  beforeAll(async () => {
    document.body.innerHTML = '';
    await addStyle();
    await createElements();
    await findElements();
    await dispatchMove(divThumb, divThumbLeft, divThumbTop, moveDistanceX,
      moveDistanceY);
  });

  it('should track height to be 300', () => {
    expect(parseInt(divTrack.style.height, 10)).toBe(300);
  });

  it('should div thumb move a distance', () => {
    expect(parseFloat(divThumb.style.top)).toBe(50);
  });
  it('should label value to be 172', () => {
    expect(divLabel.textContent).toBe('172');
  });
});
