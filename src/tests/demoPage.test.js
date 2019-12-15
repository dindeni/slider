/* eslint-disable  @typescript-eslint/explicit-function-return-type */
import DemoPage from '../DemoPage/DemoPage.js';
import '../slider/sliderInit/sliderInit.ts';

import style from '../blocks/slider/slider.scss';

import { dispatchMove } from './_serviceFunctions';

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
    const htmlElements = '<div class="index__wrapper js-index__wrapper">'
            + '<form class="demo js-demo"></form>'
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
    await demoPage.loadSliders();

    formsList = document.querySelectorAll('.js-demo');
  });

  describe('Before dispatch', () => {
    it('should form elements exist', () => {
      const formElements = document.querySelectorAll('.js-demo');
      Array.from(formElements).map((value) => expect(value).not.toBeNull());
    });

    it('should sliders exist', () => {
      const sliders = document.querySelectorAll('.slider');
      Array.from(sliders).map((value) => expect(value).not.toBeNull());
    });

    it('should set input value', () => {
      const inputValueElement = document.querySelectorAll(
        '.js-demo',
      );
      Array.from(inputValueElement).map((form, index) => {
        if (sliderSettings[index].range) {
          return expect(form.querySelector('.js-demo__field-value_min').value
                        && form.querySelector('.js-demo__field-value_max').value)
            .toBe(sliderSettings[index].min.toString()
                        && sliderSettings[index].max.toString());
        }
        return expect(form.querySelector('.js-demo__field-value').value)
          .toBe(sliderSettings[index].min.toString());
      });
    });
  });

  it('should inputs settings exist', () => {
    Array.from(formsList).map((wrapper) => {
      expect(wrapper.querySelector('.js-demo__field-settings_progress')).not.toBeNull();
      expect(wrapper.querySelector('.js-demo__field-settings_min')).not.toBeNull();
      expect(wrapper.querySelector('.js-demo__field-settings_max')).not.toBeNull();
      expect(wrapper.querySelector('.js-demo__field-settings_vertical')).not.toBeNull();
      return expect(wrapper.querySelector('.js-demo__field-settings_range')).not.toBeNull();
    });
  });

  describe('After dispatch', () => {
    let label;
    beforeAll(() => {
      label = document.querySelectorAll('.js-slider__label');
      let thumbX;
      let thumbY;
      let thumbMin;
      let thumbMinX;
      let thumbMinY;
      let thumbMax;
      let thumbMaxX;
      let thumbMaxY;
      Array.from(document.querySelectorAll('.js-index__wrapper'))
        .map((wrapper, index) => {
          const thumb = wrapper.querySelectorAll('.js-slider__thumb');
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
        const input = formsList[0].querySelector('.js-demo__field-value');
        expect(input.value).toBe(label[0].textContent);
      });

    it('should second slider input min value to be equal label value',
      () => {
        const input = formsList[1].querySelector('.js-demo__field-value_min');
        expect(input.value).toBe(label[1].textContent);
      });

    it('should second slider input max value to be equal label value',
      () => {
        const input = formsList[1].querySelector('.js-demo__field-value_max');
        expect(input.value).toBe(label[2].textContent);
      });

    it('third slider input min value to be equal label value',
      () => {
        const input = formsList[2].querySelector('.js-demo__field-value_min');
        expect(input.value).toBe(label[3].textContent);
      });

    it('third slider input max value to be equal label value',
      () => {
        const input = formsList[2].querySelector('.js-demo__field-value_max');
        expect(input.value).toBe(label[4].textContent);
      });

    it('should fourth slider input value to be equal label value',
      () => {
        const input = formsList[3].querySelector('.js-demo__field-value');
        expect(input.value).toBe(label[5].textContent);
      });
  });
});
