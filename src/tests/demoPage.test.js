/* eslint-disable  @typescript-eslint/explicit-function-return-type */
import DemoPage from '../blocks/demoPage/demoPage';
import '../blocks/slider/slider';

import style from '../blocks/view/view.scss';

import dispatchMove from './_serviceFunctions';

describe('DemoPage', async () => {
  const sliderSettings = [
    {
      progress: true, min: 100, max: 500, vertical: false, range: false,
    },
    {
      progress: true, min: 0, max: 100, vertical: true, range: true,
    },
    {
      progress: true, min: 0, max: 500, vertical: false, range: true, step: 100,
    },
    {
      progress: false, min: 0, max: 1000, vertical: true, range: false, step: 250,
    },
  ];

  let formsList;

  const createHtml = () => {
    const htmlElements = '<div class="main__form-wrapper">'
            + '<form class="main__form form"></form>'
            + '</div>';
    const main = document.querySelector('body');

    for (let i = 0; i <= 3; i += 1) {
      main.insertAdjacentHTML('afterbegin', htmlElements);
    }

    const styleElement = document.createElement('style');
    styleElement.innerHTML = style;
    document.head.appendChild(styleElement);
  };

  beforeAll(async () => {
    document.body.innerHTML = '';

    const demoPage = new DemoPage();

    await createHtml();
    await demoPage.initSliders();

    formsList = document.querySelectorAll('.form');
  });

  describe('Before dispatch', () => {
    it('should form elements exist', () => {
      const formElements = document.querySelectorAll('.form');
      Array.from(formElements).map((value) => expect(value).not.toBeNull());
    });

    it('should sliders exist', () => {
      const sliders = document.querySelectorAll('.slider-wrapper');
      Array.from(sliders).map((value) => expect(value).not.toBeNull());
    });

    it('should set input value', () => {
      const inputValueElement = document.querySelectorAll(
        '.form',
      );
      Array.from(inputValueElement).map((form, index) => {
        if (sliderSettings[index].range) {
          return expect(form.querySelector('.form__input-value--min').value
                        && form.querySelector('.form__input-value--max').value)
            .toBe(sliderSettings[index].min.toString()
                        && sliderSettings[index].max.toString());
        }
        return expect(form.querySelector('.form__input-value').value)
          .toBe(sliderSettings[index].min.toString());
      });
    });
  });

  it('should inputs settings exist', () => {
    Array.from(formsList).map((wrapper) => {
      expect(wrapper.querySelector('.form__input-settings--progress')).not.toBeNull();
      expect(wrapper.querySelector('.form__input-settings--min')).not.toBeNull();
      expect(wrapper.querySelector('.form__input-settings--max')).not.toBeNull();
      expect(wrapper.querySelector('.form__input-settings--vertical')).not.toBeNull();
      expect(wrapper.querySelector('.form__input-settings--range')).not.toBeNull();
      return expect(wrapper.querySelector('.form__input-settings--step')).not.toBeNull();
    });
  });

  it('should set inputs value', () => {
    Array.from(formsList).map((wrapper, index) => Array.from(wrapper.querySelectorAll('.form__input-settings')).map((input, indexInput) => {
      const setting = Object.values(sliderSettings[index])[indexInput];
      return expect(input.value).toBe(String(setting));
    }));
  });

  describe('After dispatch', () => {
    let label;
    beforeAll(() => {
      label = document.querySelectorAll('.slider-label');
      let thumbX; let thumbY; let thumbMin; let thumbMinX; let thumbMinY;
      let thumbMax; let thumbMaxX; let thumbMaxY;
      Array.from(document.querySelectorAll('.main__form-wrapper'))
        .map((wrapper, index) => {
          const thumb = wrapper.querySelectorAll('.slider-thumb');
          switch (index) {
            case 0:
              thumbX = thumb[0].getBoundingClientRect().left;
              thumbY = thumb[0].getBoundingClientRect().top;
              dispatchMove(thumb[0], thumbX, thumbY, 50, 0);
              break;
            case 1:
              [thumbMin] = thumb;
              thumbMinX = thumbMin.getBoundingClientRect().left;
              thumbMinY = thumbMin.getBoundingClientRect().top;
              dispatchMove(thumbMin, thumbMinX, thumbMinY, 0, 50);
              [, thumbMax] = thumb;
              thumbMaxX = thumbMax.getBoundingClientRect().left;
              thumbMaxY = thumbMax.getBoundingClientRect().top;
              dispatchMove(thumbMax, thumbMaxX, thumbMaxY, 0, -50);
              break;
            case 2:
              [thumbMin] = thumb;
              thumbMinX = thumbMin.getBoundingClientRect().left;
              thumbMinY = thumbMin.getBoundingClientRect().top;
              dispatchMove(thumbMin, thumbMinX, thumbMinY, 50, 0);
              [, thumbMax] = thumb;
              thumbMaxX = thumbMax.getBoundingClientRect().left;
              thumbMaxY = thumbMax.getBoundingClientRect().top;
              dispatchMove(thumbMax, thumbMinX, thumbMinY, -50, 0);
              break;
            default:
              thumbX = thumb[0].getBoundingClientRect().left;
              thumbY = thumb[0].getBoundingClientRect().top;
              dispatchMove(thumb[0], thumbX, thumbY, 0, 50);
              break;
          }
          return undefined;
        });
    });

    it('should first slider input value to be equal label value',
      () => {
        const input = formsList[0].querySelector('.form__input-value');
        expect(input.value).toBe(label[0].textContent);
      });

    it('should second slider input min value to be equal label value',
      () => {
        const input = formsList[1].querySelector('.form__input-value--min');
        expect(input.value).toBe(label[1].textContent);
      });

    it('should second slider input max value to be equal label value',
      () => {
        const input = formsList[1].querySelector('.form__input-value--max');
        expect(input.value).toBe(label[2].textContent);
      });

    it('third slider input min value to be equal label value',
      () => {
        const input = formsList[2].querySelector('.form__input-value--min');
        expect(input.value).toBe(label[3].textContent);
      });

    it('third slider input max value to be equal label value',
      () => {
        const input = formsList[2].querySelector('.form__input-value--max');
        expect(input.value).toBe(label[4].textContent);
      });

    it('should fourth slider input value to be equal label value',
      () => {
        const input = formsList[3].querySelector('.form__input-value');
        expect(input.value).toBe(label[5].textContent);
      });
  });
});
