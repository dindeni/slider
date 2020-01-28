/* eslint-disable  @typescript-eslint/explicit-function-return-type */
import View from '../slider/views/View/View';
import { dispatchMove } from './_serviceFunctions';
import style from '../blocks/slider/slider.scss';


describe('Vertical option', () => {
  let divTrack;
  let divThumb;
  let divThumbLeft;
  let divThumbTop;
  let divLabel;
  const moveDistanceX = 0;
  const moveDistanceY = 50;

  const createElements = () => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');
    document.body.appendChild(wrapper);
    const $element = $('.wrapper');
    $element.css({ width: '20.02rem' });

    const view = new View();
    const optionsForElements = {
      $element,
      range: false,
      vertical: true,
      min: 100,
      max: 500,
      progress: true,
      label: true,
      step: undefined,
    };
    view.createElements(optionsForElements);
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

  it('should track height to be 20rem', () => {
    expect(parseInt(divTrack.style.height, 10)).toBe(20);
  });

  it('should div thumb move a distance', () => {
    expect(parseFloat(divThumb.style.top)).toBe(moveDistanceY * 0.077);
  });
  it('should label value to be 177', () => {
    expect(divLabel.textContent).toBe('177');
  });
});
