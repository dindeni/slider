/* eslint-disable  @typescript-eslint/explicit-function-return-type */
import View from '../slider/views/view.ts';
import { dispatchMove } from './_serviceFunctions';
import ViewUpdating from '../slider/views/viewUpdating';

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
  let divProgressMin;
  let divProgressMax;
  const moveDistanceX = 50;
  const moveDistanceY = 0;

  const createElements = () => {
    const view = new View();
    const optionsForElements = {
      $element: $('body'),
      range: true,
      vertical: false,
      min: 100,
      max: 500,
      step: 100,
      progress: true,
    };
    view.createElements(optionsForElements);
    document.documentElement.style.fontSize = '13px';
  };

  const addDnd = () => {
    const $wrapper = $('.slider');
    const viewDnd = new ViewUpdating();
    const optionsForDnD = {
      step: undefined,
      vertical: false,
      range: true,
      progress: true,
      min: 100,
      max: 500,
      $wrapper,
    };
    viewDnd.addDragAndDrop(optionsForDnD);
  };


  const findElements = () => {
    divThumbMin = document.querySelector('.js-slider__thumb_min');
    divThumbMax = document.querySelector('.js-slider__thumb_max');
    divThumbLeftMin = divThumbMin.getBoundingClientRect().left;
    divThumbTopMin = divThumbMin.getBoundingClientRect().top;
    divThumbLeftMax = divThumbMax.getBoundingClientRect().left;
    divThumbTopMax = divThumbMax.getBoundingClientRect().top;
    divTrack = document.querySelector('.js-slider__track');
    divLabelMin = document.querySelector('.js-slider__label_min');
    divLabelMax = document.querySelector('.js-slider__label_max');
    divProgressMin = document.querySelector('.js-slider__progress_min');
    divProgressMax = document.querySelector('.js-slider__progress_max');

    divTrack.style.width = '20.02rem';
    divTrack.style.height = '0.385rem';
  };

  beforeAll(async () => {
    document.body.innerHTML = '';
    await createElements();
    await findElements();
    await addDnd();
  });

  it('should thumb min and max exist', () => {
    expect(divThumbMin && divThumbMax).not.toBeNull();
  });
  it('should label min and max exists', () => {
    expect(divLabelMin && divLabelMax).not.toBeNull();
  });
  it('should progress bar min and max exist', () => {
    expect(divProgressMin && divProgressMax).not.toBeNull();
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
    it('should label max value to be 423', () => {
      expect(divLabelMax.textContent).toBe('423');
    });
    it('should progress max width to be equal thumb max coordinates left', () => {
      expect(parseFloat(divProgressMax.style.width).toFixed(2)).toBe('3.87');
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
    it('should label min value to be 177', () => {
      expect(divLabelMin.textContent).toBe('177');
    });
    it('should progress min width to be equal thumb min coordinates left', () => {
      expect(divProgressMin.style.width).toBe(divThumbMin.style.left);
    });
  });
});
