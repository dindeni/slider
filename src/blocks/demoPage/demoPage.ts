import Presenter from '../presenter/presenter';
import ViewDnD from '../views/viewDnD/viewDnD';

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

      Array.from(document.querySelectorAll('.js-main__form-wrapper'))
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

      const formElement = element.querySelector('.js-form') as HTMLElement;

      const changeSlider = (evt: MouseEvent): void => {
        !vertical ? widthHeightTrack = (element
          .querySelector('.js-slider__track') as HTMLElement).clientWidth
          : widthHeightTrack = (element
            .querySelector('.js-slider__track') as HTMLElement).clientHeight;

        if (range) {
          thumbMin = element.querySelector('.js-slider__thumb_min') as HTMLElement;
          thumbMax = element.querySelector('.js-slider__thumb_max') as HTMLElement;
        } else thumb = element.querySelector('.js-slider__thumb');

        if ((evt.target as HTMLElement).classList.contains('js-form__input-value')) {
          const distance = Presenter.calculateFromValueToCoordinates(
            parseInt((evt.target as HTMLInputElement).value, 10),
            min, max, widthHeightTrack,
          );

          const inputValue: number | undefined = this.validateValue(evt.target as HTMLInputElement,
            (evt.target as HTMLInputElement).value, min, max);
          const inputValueCondition  = inputValue || inputValue === 0;
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
                .contains('js-form__input-value_min') ? thumbMinMax = thumbMin
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
        const isSettingValueValid = (evt.target as HTMLElement).classList.contains('js-form__input-settings') && settingValue !== null;
        if (isSettingValueValid) {
          const inputSettings = element.querySelectorAll('.js-form__input-settings');
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
      const isValueValid = valueToNumber >= min && valueToNumber <= max;
      if (isValueValid) {
        DemoPage.deleteErrorElement(element);
        return valueToNumber;
      } this.createErrorElement(element, 'invalid value');
      return undefined;
    }

    validateSettings(value: string, element: HTMLElement):
     boolean | number | undefined | null {
      const convertedValue: boolean | number | undefined | null = DemoPage.convertInputValue(value);
      const isValidStepSetting = (typeof convertedValue === 'undefined' || typeof convertedValue === 'number');

      const isBooleanSetting = element.classList.contains('form__input-settings_progress')
        || element.classList.contains('js-form__input-settings_vertical')
        || element.classList.contains('js-form__input-settings_range');
      const isMinMax = element.classList.contains('js-form__input-settings_min')
          || element.classList.contains('js-form__input-settings_max');
      switch (true) {
        case isBooleanSetting:
          DemoPage.deleteErrorElement(element);
          return typeof convertedValue === 'boolean' ? convertedValue
            : this.createErrorElement(element, 'value should to be boolean');
        case isMinMax:
          DemoPage.deleteErrorElement(element);
          return typeof convertedValue === 'number' ? convertedValue
            : this.createErrorElement(element, 'value should to be number');
        case element.classList.contains('form__input-settings_step'):
          DemoPage.deleteErrorElement(element);
          return isValidStepSetting ? convertedValue
            : this.createErrorElement(element, 'value should to be number or undefined');
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
        const input: HTMLInputElement = element.querySelector('.js-form__input-value') as HTMLInputElement;
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
        const inputMin: HTMLInputElement = element.querySelector('.js-form__input-value_min') as HTMLInputElement;
        const mutationsMin = (mutationRecord): void => {
          (inputMin as HTMLInputElement).value = mutationRecord[mutationRecord.length - 1]
            .target.textContent;
        };

        const labelMax: HTMLElement = element.querySelector('.js-slider__label_max') as HTMLElement;
        const inputMax: HTMLInputElement = element.querySelector('.js-form__input-value_max') as HTMLInputElement;
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
      !setting.range ? $inputValue = $('<div class="form__input-wrapper">' +
       '<label class="form__label-input">value<input class="form__input-value js-form__input-value"></label></div>')
      : $inputValue = $('<div class="form__input-wrapper">'
      + '<label class="form__label-input">value min<input class="form__input-value js-form__input-value  form__input-value_min js-form__input-value_min"></label></div>'
      + '<div class="form__input-wrapper"><label class="form__label-input">value max<input class="form__input-value js-form__input-value form__input-value_max js-form__input-value_max"></label></div>');

      const $settingsInputs = $('<div class="form__input-wrapper"><label class="form__label-input">progress(true or false)' +
       '<input class="form__input-settings js-form__input-settings form__input-settings_progress js-form__input-settings_progress"></label></div>'
      + '<div class="form__input-wrapper"><label class="form__label-input">min(number)<input class="form__input-settings js-form__input-settings form__input-settings_min js-form__input-settings_min">' +
       '</label></div><div class="form__input-wrapper">'
      + '<label class="form__label-input">max(number)<input class="form__input-settings js-form__input-settings form__input-settings_max js-form__input-settings_max"></label></div>'
      + '<div class="form__input-wrapper"><label class="form__label-input">vertical(true or false)<input class="form__input-settings js-form__input-settings form__input-settings_vertical js-form__input-settings_vertical"></label></div>' +
       '<div class="form__input-wrapper"><label class="form__label-input">range(true or false)<input class="form__input-settings js-form__input-settings form__input-settings_range js-form__input-settings_range"></label></div>' +
        '<div class="form__input-wrapper"><label class="form__label-input">step(number)<input class="form__input-settings js-form__input-settings form__input-settings_step js-form__input-settings_step"></label></div>');
      $inputValue.appendTo($(form));
      return $settingsInputs.appendTo($(form));
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

    static setInputValue(element: HTMLElement, min: number, max: number, range: boolean,
      settings: Slider): void {
      if (range) {
        const minInput = (element.querySelector('.js-form__input-value_min') as HTMLInputElement);
        minInput.value = min.toString();
        const maxInput = (element.querySelector('.js-form__input-value_max') as HTMLInputElement);
        maxInput.value = max.toString();
      } else {
        const input = (element.querySelector('.js-form__input-value') as HTMLInputElement);
        input.value = min.toString();
      }

      Array.from(element.querySelectorAll('.js-form__input-settings')).map((input, index) => {
        const inputElement = (input as HTMLInputElement);
        inputElement.value = Object.values(settings)[index];
        return inputElement;
      });
    }
}

export default DemoPage;
