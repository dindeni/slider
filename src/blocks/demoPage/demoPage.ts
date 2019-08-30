import Presenter from '../presenter/presenter';
import ViewDnD from '../view/viewDnD';

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

      Array.from(document.querySelectorAll('.main__form-wrapper'))
        .map((formWrapper, index) => {
          DemoPage.createElements(this.sliderSettings[index], ((formWrapper as HTMLElement)
            .children[0])as HTMLElement);
          $(formWrapper).slider(this.sliderSettings[index]);
          DemoPage.setInputValue(formWrapper as HTMLElement, this.sliderSettings[index].min,
            this.sliderSettings[index].max, this.sliderSettings[index].range,
            this.sliderSettings[index]);

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

      const formElement = element.querySelector('.form') as HTMLElement;

      const changeSlider = (evt: MouseEvent): void => {
        !vertical ? widthHeightTrack = (element
          .querySelector('.slider-track') as HTMLElement).clientWidth
          : widthHeightTrack = (element
            .querySelector('.slider-track') as HTMLElement).clientHeight;

        if (range) {
          thumbMin = element.querySelector('#thumb-min') as HTMLElement;
          thumbMax = element.querySelector('#thumb-max') as HTMLElement;
        } else thumb = element.querySelector('.slider-thumb');

        if ((evt.target as HTMLElement).classList.contains('form__input-value')) {
          const distance = Presenter.calculateFromValueToCoordinates(
            parseInt((evt.target as HTMLInputElement).value, 10),
            min, max, widthHeightTrack,
          );

          const inputValue: number | undefined = this.validateValue(evt.target as HTMLInputElement,
            (evt.target as HTMLInputElement).value, min, max);
          if (inputValue) {
            if (!range) {
              !vertical ? (thumb as HTMLElement).style.left = `${Presenter.calculateFromValueToCoordinates(inputValue,
                min, max, widthHeightTrack)}px` : (thumb as HTMLElement).style.top = `${Presenter.calculateFromValueToCoordinates(parseInt((evt.target as HTMLInputElement).value, 10),
                min, max, widthHeightTrack)}px`;
              viewDnd.updateData(min, max, widthHeightTrack, distance, vertical,
                thumb, progress, distance);
            } else {
              let thumbMinMax: HTMLElement;
              (evt.target as HTMLInputElement).classList
                .contains('form__input-value--min') ? thumbMinMax = thumbMin
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
          (evt.target as HTMLInputElement).value, (evt.target as HTMLElement),
        );
        const isSettingValueValid = (evt.target as HTMLElement).classList.contains('form__input-settings') && settingValue !== null;
        if (isSettingValueValid) {
          const inputSettings = element.querySelectorAll('.form__input-settings');
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

          Array.from(inputSettings).map((input, index) => {
            const key = this.settingsKeys[index];
            const value = DemoPage.convertInputValue((input as HTMLInputElement).value);
            return Object.assign(settings, { [key]: value });
          });
          $(element).slider(settings);
          this.observeInput(element, settings.range, settings.min, settings.max,
            settings.vertical, settings.step, settings.progress);
          DemoPage.observeLabel(element, settings.range);
        }
      };

      formElement.addEventListener('change', changeSlider);
    }

    validateValue(element: HTMLElement, value: string, min: number, max: number):
    number | undefined {
      const valueToNumber = Number(value);
      const isValueValid = valueToNumber && (valueToNumber >= min && valueToNumber <= max);
      if (isValueValid) {
        DemoPage.deleteErrorElement(element);
        return valueToNumber;
      } this.createErrorElement(element, 'invalid value');
      return undefined;
    }

    validateSettings(value: string, element: HTMLElement):
     boolean | number | undefined | null {
      const convertedValue: boolean | number | undefined = DemoPage.convertInputValue(value);
      const isConvertedValueNumber = convertedValue && typeof convertedValue === 'number';
      const isValidStepSetting = (typeof convertedValue === 'undefined' || typeof convertedValue === 'number');
      if (isConvertedValueNumber) {
        return convertedValue;
      }
      const isBooleanSetting = element.classList.contains('form__input-settings--progress')
        || element.classList.contains('form__input-settings--vertical')
        || element.classList.contains('form__input-settings--range');
      const isMinMax = element.classList.contains('form__input-settings--min')
          || element.classList.contains('form__input-settings--max');
      switch (true) {
        case isBooleanSetting:
          DemoPage.deleteErrorElement(element);
          return typeof convertedValue === 'boolean' ? convertedValue
            : this.createErrorElement(element, 'value should to be boolean');
        case isMinMax:
          DemoPage.deleteErrorElement(element);
          return typeof convertedValue === 'number' ? convertedValue
            : this.createErrorElement(element, 'value should to be number');
        case element.classList.contains('form__input-settings--step'):
          DemoPage.deleteErrorElement(element);
          return isValidStepSetting ? convertedValue
            : this.createErrorElement(element, 'value should to be number or undefined');
        default: return this.createErrorElement(element, 'error');
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
        const label: HTMLElement = element.querySelector('.slider-label') as HTMLElement;
        const input: HTMLInputElement = element.querySelector('.form__input-value') as HTMLInputElement;
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
        const labelMin: HTMLElement = element.querySelector('#label-min') as HTMLElement;
        const inputMin: HTMLInputElement = element.querySelector('.form__input-value--min') as HTMLInputElement;
        const mutationsMin = (mutationRecord): void => {
          (inputMin as HTMLInputElement).value = mutationRecord[mutationRecord.length - 1]
            .target.textContent;
        };

        const labelMax: HTMLElement = element.querySelector('#label-max') as HTMLElement;
        const inputMax: HTMLInputElement = element.querySelector('.form__input-value--max') as HTMLInputElement;
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

    static createElements(setting: Slider, form: HTMLElement): JQuery {
      let $inputValue: JQuery;
      !setting.range ? $inputValue = $('<div class="form__input-wrapper"><label class="form__label-input"'
      + ' for="input-value">value</label><input class="form__input-value"'
      + ' id="input-value"></div>') : $inputValue = $('<div class="form__input-wrapper">'
      + '<label class="form__label-input" for="input-value-min">value min</label>'
      + '<input class="form__input-value form__input-value--min" id="input-value-min"></div>'
      + '<div class="form__input-wrapper"><label class="form__label-input"'
      + ' for="input-value-max">value max</label><input class="form__input-value'
      + ' form__input-value--max" id="input-value-min"></div>');

      const $settingsInputs = $('<div class="form__input-wrapper"><label class="form__label-input"'
      + ' for="input-progress">progress(true or false)</label><input class="form__input-settings'
      + ' form__input-settings--progress" id="input-progress"></div>'
      + '<div class="form__input-wrapper"><label class="form__label-input"'
      + ' for="input-min">min(number)</label><input class="form__input-settings'
      + ' form__input-settings--min" id="input-min"></div><div class="form__input-wrapper">'
      + '<label class="form__label-input" for="input-max">max(number)</label>'
      + '<input class="form__input-settings form__input-settings--max" id="input-max"></div>'
      + '<div class="form__input-wrapper"><label class="form__label-input"'
      + ' for="input-vertical">vertical(true or false)</label><input class="form__input-settings'
      + ' form__input-settings--vertical" id="input-vertical"></div><div class="form__input-wrapper"><label class="form__label-input"'
      + ' for="input-range">range(true or false)</label><input class="form__input-settings'
      + ' form__input-settings--range" id="input-range"></div><div class="form__input-wrapper"><label class="form__label-input"'
      + ' for="input-step">step(number)</label><input class="form__input-settings'
      + ' form__input-settings--step" id="input-step"></div>');
      $inputValue.appendTo($(form));
      return $settingsInputs.appendTo($(form));
    }

    static convertInputValue(value: boolean | number | string | undefined):
    boolean | undefined | number {
      if (typeof value !== 'number') {
        switch (value) {
          case 'true': return true;
          case 'false': return false;
          case 'undefined': return undefined;
          default: return Number(value);
        }
      } return value;
    }

    static setInputValue(element: HTMLElement, min: number, max: number, range: boolean,
      settings: Slider): void {
      if (range) {
        const minInput = (element.querySelector('.form__input-value--min') as HTMLInputElement);
        minInput.value = min.toString();
        const maxInput = (element.querySelector('.form__input-value--max') as HTMLInputElement);
        maxInput.value = max.toString();
      } else {
        const input = (element.querySelector('.form__input-value') as HTMLInputElement);
        input.value = min.toString();
      }

      Array.from(element.querySelectorAll('.form__input-settings')).map((input, index) => {
        const inputElement = (input as HTMLInputElement);
        inputElement.value = Object.values(settings)[index];
        return inputElement;
      });
    }
}

export default DemoPage;
