/* eslint-disable  @typescript-eslint/explicit-function-return-type */
/* eslint-disable  @typescript-eslint/no-var-requires  */
import Controller from '../slider/Controller/Controller';
import style from '../blocks/slider/slider.scss';

const $ = require('jquery');

describe('Controller init', () => {
  let divThumb;
  let divTrack;
  let divLabel;

  const createElements = () => {
    const $wrapper = $('<div class="slider js-slider"></div>');
    const body = $('body');
    body.css({ width: '300px' });
    $wrapper.appendTo(body);
    const optionsForElements = {
      $element: $wrapper,
      isRange: false,
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
  };

  const addStyle = () => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = style;
    document.head.appendChild(styleElement);
    document.documentElement.style.fontSize = '13px';
  };

  const findElements = () => {
    divThumb = document.querySelector('.js-slider__thumb');
    divTrack = document.querySelector('.js-slider__track');
    divLabel = document.querySelector('.js-slider__label');

    divTrack.style.width = '20.02rem';
    divThumb.style.left = '0rem';
  };

  beforeAll(async () => {
    document.body.innerHTML = '';
    await addStyle();
    await createElements();
    await findElements();
    const styleElement = document.createElement('style');
    styleElement.innerHTML = style;
    document.head.appendChild(styleElement);
  });

  it('should track element exists', () => {
    expect(divTrack).not.toBeNull();
  });

  it('should thumb element exists', () => {
    expect(divThumb).not.toBeNull();
  });

  it('should label element exists', () => {
    expect(divLabel).not.toBeNull();
  });
});
