/* eslint-disable  @typescript-eslint/explicit-function-return-type */
import DemoPage from '../demo/DemoPage/DemoPage';
import '../slider/sliderInit/sliderInit.ts';
import style from '../blocks/slider/slider.scss';
import demoStyle from '../blocks/demo/demo.scss';

describe('DemoPage', async () => {
  const sliderSettings = [
    {
      progress: true, min: 100, max: 500, vertical: false, range: false, label: true,
    },
    {
      progress: true, min: 0, max: 100, vertical: true, range: true, label: false,
    },
    {
      progress: true, min: 0, max: 500, vertical: false, range: true, label: true, step: 100,
    },
    {
      progress: false, min: 0, max: 1000, vertical: true, range: false, label: true, step: 250,
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
    const styleDemoElement = document.createElement('style');
    styleDemoElement.innerHTML = demoStyle;
    document.head.appendChild(styleElement);
    document.head.appendChild(styleDemoElement);
    document.documentElement.style.fontSize = '13px';
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
      [...formElements].forEach((value) => expect(value).not.toBeNull());
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
          return expect(form.querySelector('.js-demo__field-value_type_min').value
                        && form.querySelector('.js-demo__field-value_type_max').value)
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
      expect(wrapper.querySelector('.js-demo__field-settings_type_progress')).not.toBeNull();
      expect(wrapper.querySelector('.js-demo__field-settings_type_min')).not.toBeNull();
      expect(wrapper.querySelector('.js-demo__field-settings_type_max')).not.toBeNull();
      expect(wrapper.querySelector('.js-demo__field-settings_type_vertical')).not.toBeNull();
      return expect(wrapper.querySelector('.js-demo__field-settings_type_range')).not.toBeNull();
    });
  });
});
