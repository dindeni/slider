/* eslint-disable  @typescript-eslint/explicit-function-return-type */
import View from '../slider/views/view.ts';
import ViewOptional from '../slider/views/viewOptional.ts';
import {dispatchMove} from './_serviceFunctions';
import ViewDnD from '../slider/views/viewDnD.ts';


describe('Vertical option', () => {
  let divTrack; let divThumb; let divThumbLeft; let divThumbTop; let
    divLabel;
  const moveDistanceX = 0;
  const moveDistanceY = 50;

  const createElements = () => {
    const view = new View();
    view.createElements($('body'), false, true,
      100, 500, undefined, true);
  };

  const addDnd = () => {
    const wrapper = $('.slider__wrapper');
    const viewDnd = new ViewDnD();
    viewDnd.addDnD(undefined, true, false, true,
      100, 500, wrapper);
  };

  const findElements = () => {
    divTrack = document.querySelector('.js-slider__track');
    divThumb = document.querySelector('.js-slider__thumb');
    divThumbLeft = divThumb.getBoundingClientRect().left;
    divThumbTop = divThumb.getBoundingClientRect().top;
    divLabel = document.querySelector('.js-slider__label');

    divTrack.style.width = '260px';
    divTrack.style.height = '5px';
  };

  const makeVertical = () => {
    ViewOptional.makeVertical(false, $('.js-slider'));
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

  it('should track height to be 260px', () => {
    expect(divTrack.style.height).toBe('260px');
  });

  it('should div thumb move a distance', () => {
    expect(parseInt(divThumb.style.top, 10)).toBe(moveDistanceY);
  });
  it('should label value to be 176', () => {
    expect(divLabel.textContent).toBe('176');
  });
});
