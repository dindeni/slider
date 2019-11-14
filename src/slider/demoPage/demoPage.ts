import Presenter from '../presenter/presenter';
import ViewDnD from '../views/viewDnD';

interface Slider {
    progress: boolean;
    min: number;
    max: number;
    vertical: boolean;
    range: boolean;
    step?: number;
}


class DemoPage {
    sliderSettings: [Slider, Slider, Slider, Slider];

    settingsKeys = ['progress', 'min', 'max', 'vertical', 'range', 'step'];

    errorElement: HTMLElement;

    initSliders(): void {
      this.sliderSettings = [
        {
          progress: true, min: 100, max: 500, vertical: false, range: false,
        }, {
          progress: true, min: 0, max: 100, vertical: true, range: true,
        }, {
          progress: true, min: 0, max: 500, vertical: false, range: true, step: 100,
        }, {
          progress: false, min: 0, max: 1000, vertical: true, range: false, step: 250,
        },
      ];

      Array.from(document.querySelectorAll('.js-index__wrapper'))
        .map((formWrapper, index) => {
          const scale = this.sliderSettings[index].step !== undefined;

          DemoPage.createElements(this.sliderSettings[index], ((formWrapper as HTMLElement)
            .children[0]) as HTMLElement, scale);
          $(formWrapper).slider(this.sliderSettings[index]);
          DemoPage.setInputValue(formWrapper as HTMLElement, this.sliderSettings[index]);

          DemoPage.observeLabel(formWrapper as HTMLElement, this.sliderSettings[index].range);
          return this.observeInput(formWrapper as HTMLElement, this.sliderSettings[index].range,
            this.sliderSettings[index].min, this.sliderSettings[index].max,
            this.sliderSettings[index].vertical, this.sliderSettings[index].step,
            this.sliderSettings[index].progress);
        });
    }

    observeInput(element: HTMLElement, range: boolean, min: number, max: number,
      vertical: boolean, step: number | undefined, progress: boolean): void {
      const viewDnd = new ViewDnD();
      let widthHeightTrack: number; let thumbMin: HTMLElement; let thumbMax: HTMLElement;
      let thumb;

      const formElement = element.querySelector('.js-demo') as HTMLElement;

      const changeSlider = (evt: MouseEvent): void => {
        !vertical ? widthHeightTrack = (element
          .querySelector('.js-slider__track') as HTMLElement).clientWidth
          : widthHeightTrack = (element
            .querySelector('.js-slider__track') as HTMLElement).clientHeight;

        if (range) {
          thumbMin = element.querySelector('.js-slider__thumb_min') as HTMLElement;
          thumbMax = element.querySelector('.js-slider__thumb_max') as HTMLElement;
        } else thumb = element.querySelector('.js-slider__thumb');

        if ((evt.target as HTMLElement).classList.contains('js-demo__field-value')) {
          const distance = Presenter.calculateFromValueToCoordinates(
            parseInt((evt.target as HTMLInputElement).value, 10),
            min, max, widthHeightTrack,
          );

          const inputValue: number | undefined = this.validateValue(evt.target as HTMLInputElement,
            (evt.target as HTMLInputElement).value, min, max, step);
          const inputValueCondition = inputValue || inputValue === 0;

          if (inputValueCondition) {
            if (!range) {
              !vertical ? (thumb as HTMLElement).style.left = `${Presenter.calculateFromValueToCoordinates(inputValue || 0,
                min, max, widthHeightTrack)}px` : (thumb as HTMLElement).style.top = `${Presenter.calculateFromValueToCoordinates(parseInt((evt.target as HTMLInputElement).value, 10),
                min, max, widthHeightTrack)}px`;
              viewDnd.updateData(min, max, widthHeightTrack, distance, vertical,
                thumb, progress, distance);
            } else {
              let thumbMinMax: HTMLElement;
              (evt.target as HTMLInputElement).classList
                .contains('js-demo__field-value_min') ? thumbMinMax = thumbMin
                : thumbMinMax = thumbMax;
              !vertical ? thumbMinMax.style.left = `${Presenter.calculateFromValueToCoordinates(parseInt((evt.target as HTMLInputElement).value, 10),
                min, max, widthHeightTrack)}px` : thumbMinMax.style.top = `${Presenter.calculateFromValueToCoordinates(parseInt((evt.target as HTMLInputElement).value, 10),
                min, max, widthHeightTrack)}px`;
              viewDnd.updateData(min, max, widthHeightTrack, distance, vertical,
                thumbMinMax, progress, distance);
            }
          }
        }

        const settingValue: boolean | number | undefined | null = this.validateSettings(
          (evt.target as HTMLInputElement).value, (evt.target as HTMLElement), min, max,
        );
        if (settingValue !== null) {
          const scaleElement = element.querySelector('.js-demo__field-scale');

          if (evt.target === scaleElement && (evt.target as HTMLInputElement).checked) {
            DemoPage.createStepSetting(evt.currentTarget as HTMLElement, min, max);
          } else if (evt.target === scaleElement && !(evt.target as HTMLInputElement).checked) {
            ((evt.currentTarget as HTMLElement).querySelector('.js-demo__field-settings_step') as HTMLElement).remove();
          }

          const settings: Slider = {
            progress: true,
            min: 0,
            max: 100,
            vertical: false,
            range: false,
            step: undefined,
          };

          ((evt.currentTarget as HTMLElement).nextElementSibling as HTMLElement)
            .remove();

          formElement.removeEventListener('change', changeSlider);

          const inputSettings = element.querySelectorAll('.js-demo__field-settings');
          Array.from(inputSettings).map((input, index) => {
            const key = this.settingsKeys[index];
            let value;

            if ((input as HTMLInputElement).type === 'checkbox') {
              value = (input as HTMLInputElement).checked;
            } else {
              value = DemoPage.convertInputValue((input as HTMLInputElement).value);
            }
            return Object.assign(settings, { [key]: value });
          });

          while ((evt.currentTarget as HTMLElement).firstChild as HTMLElement) {
            ((evt.currentTarget as HTMLElement).firstChild as HTMLElement).remove();
          }

          const scale = settings.step !== undefined;
          DemoPage.createElements(settings, evt.currentTarget as HTMLElement, scale);
          DemoPage.setInputValue(evt.currentTarget as HTMLElement, settings);

          $(element).slider(settings);
          this.observeInput(element, settings.range, settings.min, settings.max,
            settings.vertical, settings.step, settings.progress);
          DemoPage.observeLabel(element, settings.range);
        }
      };

      formElement.addEventListener('change', changeSlider);
    }


    validateValue(element: HTMLElement, value: string, min: number, max: number,
      step: number | undefined):
    number | undefined {
      const valueToNumber = Number(value);
      const isValidStepValue = step && valueToNumber % step === 0;
      const isValueValid = valueToNumber > min && valueToNumber < max;

      const validate = {
        minMax: (): number | undefined => {
          if (isValueValid) {
            DemoPage.deleteErrorElement(element);
            return valueToNumber;
          }
          DemoPage.deleteErrorElement(element);
          this.createErrorElement(element, 'invalid value');
          return undefined;
        },

        step: (): number | undefined => {
          if (isValidStepValue) {
            DemoPage.deleteErrorElement(element);
            return valueToNumber;
          }
          DemoPage.deleteErrorElement(element);
          this.createErrorElement(element, 'value must be a multiple of step');
          return undefined;
        },
      };

      if (step) {
        const resultMinMax = validate.minMax();
        return resultMinMax ? validate.step() : undefined;
      } return validate.minMax();
    }

    validateSettings(value: string, element: HTMLElement, min: number, max: number):
     boolean | number | undefined | null {
      const convertedValue: boolean | number | undefined | null = DemoPage.convertInputValue(value);
      const isValidStepSetting = (convertedValue || 0) > (max - min) / 6;
      const isMin = element.classList.contains('js-demo__field-settings_min');
      const isMax = element.classList.contains('js-demo__field-settings_max');
      const isCheckbox = (element as HTMLInputElement).type === 'checkbox';
      const isStep = element.classList.contains('js-demo__field-settings_step');
      switch (true) {
        case isMin:
          DemoPage.deleteErrorElement(element);
          return convertedValue && convertedValue < max ? convertedValue
            : this.createErrorElement(element, 'must be less than max');
        case isMax:
          DemoPage.deleteErrorElement(element);
          return convertedValue && convertedValue > min ? convertedValue
            : this.createErrorElement(element, 'must be greater than min');
        case isStep:
          DemoPage.deleteErrorElement(element);
          return isValidStepSetting ? convertedValue
            : this.createErrorElement(element, 'value is too small');
        case isCheckbox: return (element as HTMLInputElement).checked;
        default: return null;
      }
    }

    createErrorElement(element: HTMLElement, text: string): null {
      this.errorElement = document.createElement('span');
      this.errorElement.textContent = text;
      this.errorElement.classList.add('error');
      ((element as HTMLElement).parentElement as HTMLElement)
        .insertBefore(this.errorElement, null);
      return null;
    }

    static deleteErrorElement(element: HTMLElement): void {
      if (element.nextElementSibling) {
        element.nextElementSibling.remove();
      }
    }

    static observeLabel(element: HTMLElement, range: boolean): void {
      if (!range) {
        const label: HTMLElement = element.querySelector('.js-slider__label') as HTMLElement;
        const input: HTMLInputElement = element.querySelector('.js-demo__field-value') as HTMLInputElement;
        const mutations = (mutationRecord): void => {
          (input as HTMLInputElement).value = mutationRecord[mutationRecord.length - 1]
            .target.textContent;
        };

        const observer = new MutationObserver(mutations);
        observer.observe(label as HTMLElement, {
          childList: true,
          attributes: true,
          characterData: true,
        });
      } else {
        const labelMin: HTMLElement = element.querySelector('.js-slider__label_min') as HTMLElement;
        const inputMin: HTMLInputElement = element.querySelector('.js-demo__field-value_min') as HTMLInputElement;
        const mutationsMin = (mutationRecord): void => {
          (inputMin as HTMLInputElement).value = mutationRecord[mutationRecord.length - 1]
            .target.textContent;
        };

        const labelMax: HTMLElement = element.querySelector('.js-slider__label_max') as HTMLElement;
        const inputMax: HTMLInputElement = element.querySelector('.js-demo__field-value_max') as HTMLInputElement;
        const mutationsMax = (mutationRecord): void => {
          (inputMax as HTMLInputElement).value = mutationRecord[mutationRecord.length - 1]
            .target.textContent;
        };

        const observerMin = new MutationObserver(mutationsMin);
        observerMin.observe(labelMin as HTMLElement, {
          childList: true,
          attributes: true,
          characterData: true,
        });

        const observerMax = new MutationObserver(mutationsMax);
        observerMax.observe(labelMax as HTMLElement, {
          childList: true,
          attributes: true,
          characterData: true,
        });
      }
    }

    static createElements(setting: Slider, form: HTMLElement, scale: boolean): void {
      let $inputValue: JQuery;
      let formIndex;
      Array.from(document.querySelectorAll('.js-demo')).map((value, index) => {
        if (form === value) {
          formIndex = index;
        } return undefined;
      });
      !setting.range ? $inputValue = $('<div class="demo__field-wrapper">'
       + '<label class="demo__mark">value<input type="number" class="demo__field-value js-demo__field-value"></label></div>')
        : $inputValue = $('<div class="demo__field-wrapper">'
      + '<label class="demo__mark">value min<input type="number" class="demo__field-value js-demo__field-value demo__field-value_min js-demo__field-value_min"></label></div>'
      + '<div class="demo__field-wrapper"><label class="demo__mark">value max<input type="number" class="demo__field-value js-demo__field-value demo__field-value_max js-demo__field-value_max"></label></div>');

      const $settingsInputs = $(`<div class="demo__field-wrapper demo__field-wrapper_for-checkbox">progress
       <input type="checkbox" id="progress-${formIndex}" class="demo__field-settings js-demo__field-settings demo__field-settings_progress js-demo__field-settings_progress"><label for="progress-${formIndex}" class="demo__mark"></label></div>`
      + '<div class="demo__field-wrapper"><label class="demo__mark">min<input type="number" class="demo__field-settings js-demo__field-settings demo__field-settings_min js-demo__field-settings_min">'
       + '</label></div><div class="demo__field-wrapper">'
      + '<label class="demo__mark">max<input type="number" class="demo__field-settings js-demo__field-settings demo__field-settings_max js-demo__field-settings_max"></label></div>'
      + `<div class="demo__field-wrapper demo__field-wrapper_for-checkbox">vertical<input type="checkbox" id="vertical-${formIndex}" class="demo__field-settings js-demo__field-settings demo__field-settings_vertical js-demo__field-settings_vertical"><label for="vertical-${formIndex}" class="demo__mark"></label></div>`
       + `<div class="demo__field-wrapper demo__field-wrapper_for-checkbox">range<input type="checkbox" id="range-${formIndex}" class="demo__field-settings js-demo__field-settings demo__field-settings_range js-demo__field-settings_range"><label for="range-${formIndex}" class="demo__mark"></label></div>`
        + `<div class="demo__field-wrapper demo__field-wrapper_for-checkbox">scale<input type="checkbox" id="scale-${formIndex}" ${scale ? 'checked=true' : ''} class="demo__field-scale js-demo__field-scale"><label for="scale-${formIndex}" class="demo__mark"></label></div>`);

      const $scaleElement = $('<div class="demo__field-wrapper"><label class="demo__mark">step<input type="number" class="demo__field-settings js-demo__field-settings demo__field-settings_step js-demo__field-settings_step"></label></div>');

      $inputValue.appendTo($(form));
      $settingsInputs.appendTo($(form));

      if (scale) {
        $scaleElement.appendTo($(form));
      }
    }

    static createStepSetting(form: HTMLElement, min: number, max: number): void {
      const step = (max - min) / 5;
      const $stepElement = $('<div class="demo__field-wrapper"><label class="demo__mark">step<input type="number" class="demo__field-settings js-demo__field-settings demo__field-settings_step js-demo__field-settings_step"></label></div>');
      $stepElement.find('.js-demo__field-settings_step').val(step);
      $stepElement.appendTo($(form));
    }

    static convertInputValue(value: string):
    boolean | undefined | number | null {
      const valueToNumber = parseInt(value, 10);
      if (!valueToNumber && valueToNumber !== 0) {
        switch (value) {
          case 'true': return true;
          case 'false': return false;
          case 'undefined': return undefined;
          default: return null;
        }
      } return valueToNumber;
    }

    static setInputValue(element: HTMLElement, settings: Slider): void {
      const { range, min, max } = settings;
      if (range) {
        const minInput = (element.querySelector('.js-demo__field-value_min') as HTMLInputElement);
        minInput.value = min.toString();
        const maxInput = (element.querySelector('.js-demo__field-value_max') as HTMLInputElement);
        maxInput.value = max.toString();
      } else {
        const input = (element.querySelector('.js-demo__field-value') as HTMLInputElement);
        input.value = min.toString();
      }

      Array.from(element.querySelectorAll('.js-demo__field-settings')).map((input, index) => {
        const inputElement = (input as HTMLInputElement);
        if (inputElement.type === 'checkbox') {
          inputElement.checked = Object.values(settings)[index];
          return inputElement;
        }
        inputElement.value = Object.values(settings)[index];
        return inputElement;
      });
    }
}

export default DemoPage;
