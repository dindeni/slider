/* eslint-disable  @typescript-eslint/explicit-function-return-type */
import View from '../slider/views/View/View';
import ViewOptional from '../slider/views/ViewOptional/ViewOptional';
import { dispatchMove } from './_serviceFunctions';
import ViewUpdating from '../slider/views/ViewUpdating/ViewUpdating';


describe('Vertical option', () => {
  let divTrack;
  let divThumb;
  let divThumbLeft;
  let divThumbTop;
  let divLabel;
  const moveDistanceX = 0;
  const moveDistanceY = 50;

  const createElements = () => {
    const view = new View();
    const optionsForElements = {
      $element: $('body'),
      range: false,
      vertical: true,
      min: 100,
      max: 500,
      step: undefined,
      progress: true,
    };
    view.createElements(optionsForElements);
    document.documentElement.style.fontSize = '13px';
  };

  const addDnd = () => {
    const $wrapper = $('.slider__wrapper');
    const viewDnd = new ViewUpdating();
    const optionsForDnD = {
      step: undefined,
      vertical: true,
      range: false,
      progress: true,
      min: 100,
      max: 500,
      $wrapper,
    };
    viewDnd.addDragAndDrop(optionsForDnD);
  };

  const findElements = () => {
    divTrack = document.querySelector('.js-slider__track');
    divThumb = document.querySelector('.js-slider__thumb');
    divThumbLeft = divThumb.getBoundingClientRect().left;
    divThumbTop = divThumb.getBoundingClientRect().top;
    divLabel = document.querySelector('.js-slider__label');

    divTrack.style.width = '20.02rem';
    divTrack.style.height = '0.385rem';
  };

  const makeVertical = () => {
    const viewOptional = new ViewOptional();
    viewOptional.makeVertical({ range: false, wrapper: $('.js-slider') });
  };

  beforeAll(async () => {
    document.body.innerHTML = '';
    await createElements();
    await findElements();
    await makeVertical();
    await addDnd();
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
