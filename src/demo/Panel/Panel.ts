import { ExtremumOptions, Slider } from '../../types/types';

interface ElementsCreationOptions {
  settings: Slider;
  form: HTMLElement;
  scale: boolean;
}

interface InputValueOptions {
  element: HTMLElement;
  settings: Slider;
  value?: {notRange?: number; min?: number; max?: number};
}

interface StepSettingsOptions extends ExtremumOptions{
  form: HTMLElement;
}

interface ErrorCreationOptions {
  element: HTMLElement;
  text: string;
}

interface SettingsValidatingOptions extends ExtremumOptions{
  value: string;
  element: HTMLElement;
}

interface ValueValidatingOptions extends ExtremumOptions{
  element: HTMLElement;
  value: string;
  step: number | undefined;
  range: boolean;
  wrapper: HTMLElement;
}

class Panel {
  private errorElement: HTMLElement;

  public validateValue(options: ValueValidatingOptions):
    number | undefined {
    const {
      element, value, min, max, step, range, wrapper,
    } = options;
    const valueToNumber = Number(value);

    const checkRangeValue = (): boolean | undefined => {
      if (range) {
        const minElement = wrapper.querySelector('.js-demo__field-value_type_min');
        const maxElement = wrapper.querySelector('.js-demo__field-value_type_max');
        const valueMin = Number((minElement as HTMLInputElement).value);
        const valueMax = Number((maxElement as HTMLInputElement).value);

        return element === minElement ? valueToNumber < valueMax
          : valueToNumber > valueMin;
      }
      return undefined;
    };
    const isValueMinMaxValid = checkRangeValue();

    const isValidStepValue = step && (valueToNumber - min) % step === 0;

    const isValueValid = range ? valueToNumber >= min && valueToNumber <= max
      && isValueMinMaxValid : valueToNumber >= min && valueToNumber < max;

    const validateRangeValue = (): number | undefined => {
      if (isValueValid) {
        Panel.deleteErrorElement(element);
        return valueToNumber;
      }
      Panel.deleteErrorElement(element);
      this.createErrorElement({ element, text: 'invalid value' });
      return undefined;
    };

    const validateStepValue = (): number | undefined => {
      if (isValidStepValue) {
        Panel.deleteErrorElement(element);
        return valueToNumber;
      }
      Panel.deleteErrorElement(element);
      this.createErrorElement({ element, text: 'value must be a multiple of step' });
      return undefined;
    };

    if (step) {
      const resultMinMax = validateRangeValue();
      return resultMinMax || resultMinMax === 0 ? validateStepValue() : undefined;
    } return validateRangeValue();
  }

  private createErrorElement(options: ErrorCreationOptions): null {
    const {
      element, text,
    } = options;

    this.errorElement = document.createElement('span');
    this.errorElement.textContent = text;
    this.errorElement.classList.add('error');
    ((element as HTMLElement).parentElement as HTMLElement)
      .insertBefore(this.errorElement, null);
    return null;
  }

  private static deleteErrorElement(element: HTMLElement): void {
    if (element.nextElementSibling) {
      element.nextElementSibling.remove();
    }
  }

  public validateSettings(options: SettingsValidatingOptions):
    boolean | number | undefined | null {
    const {
      value, element, min, max,
    } = options;

    const convertedValue: boolean | number | undefined | null = Panel.convertInputValue(value);
    const isMin = element.classList.contains('js-demo__field-settings_type_min');
    const isMax = element.classList.contains('js-demo__field-settings_type_max');
    const isCheckbox = (element as HTMLInputElement).type === 'checkbox';
    const isStep = element.classList.contains('js-demo__field-settings_type_step');
    switch (true) {
      case isMin:
        Panel.deleteErrorElement(element);
        return Number(value) < max ? convertedValue
          : this.createErrorElement({ element, text: 'must be less than max' });
      case isMax:
        Panel.deleteErrorElement(element);
        return Number(value) > min ? convertedValue
          : this.createErrorElement({ element, text: 'must be greater than min' });
      case isStep: return convertedValue;
      case isCheckbox: return (element as HTMLInputElement).checked;
      default: return null;
    }
  }

  public static convertInputValue(value: string):
    boolean | undefined | number | null {
    const valueToNumber = parseInt(value, 10);
    const isNotValueToNumber = !valueToNumber && valueToNumber !== 0;
    if (isNotValueToNumber) {
      switch (value) {
        case 'true': return true;
        case 'false': return false;
        case 'undefined': return undefined;
        default: return null;
      }
    } return valueToNumber;
  }

  public static createElements(options: ElementsCreationOptions): void {
    const {
      settings, form, scale,
    } = options;

    const formIndex = Array.from(document.querySelectorAll('.js-demo')).findIndex(
      (value) => form === value,
    );

    const $inputValue = settings.range ? $('<div class="demo__field-wrapper">'
      + '<label class="demo__mark">value min<input type="number" class="demo__field-value js-demo__field-value demo__field-value_type_min js-demo__field-value_type_min"></label></div>'
      + '<div class="demo__field-wrapper"><label class="demo__mark">value max<input type="number" class="demo__field-value js-demo__field-value demo__field-value_type_max js-demo__field-value_type_max"></label></div>')
      : $('<div class="demo__field-wrapper">'
        + '<label class="demo__mark">value<input type="number" class="demo__field-value js-demo__field-value"></label></div>');

    const $settingsInputs = $(`<div class="demo__field-wrapper demo__field-wrapper_for-checkbox"> progress
       <input type="checkbox" id="progress-${formIndex}" class="demo__field-settings js-demo__field-settings demo__field-settings_type_progress js-demo__field-settings_type_progress"><label for="progress-${formIndex}" class="demo__mark"></label></div>`
      + '<div class="demo__field-wrapper"><label class="demo__mark">min<input type="number" class="demo__field-settings js-demo__field-settings demo__field-settings_type_min js-demo__field-settings_type_min">'
      + '</label></div><div class="demo__field-wrapper">'
      + '<label class="demo__mark">max<input type="number" class="demo__field-settings js-demo__field-settings demo__field-settings_type_max js-demo__field-settings_type_max"></label></div>'
      + `<div class="demo__field-wrapper demo__field-wrapper_for-checkbox">vertical<input type="checkbox" id="vertical-${formIndex}" class="demo__field-settings js-demo__field-settings demo__field-settings_type_vertical js-demo__field-settings_type_vertical"><label for="vertical-${formIndex}" class="demo__mark"></label></div>`
      + `<div class="demo__field-wrapper demo__field-wrapper_for-checkbox">range<input type="checkbox" id="range-${formIndex}" class="demo__field-settings js-demo__field-settings demo__field-settings_type_range js-demo__field-settings_type_range"><label for="range-${formIndex}" class="demo__mark"></label></div>`
      + `<div class="demo__field-wrapper demo__field-wrapper_for-checkbox">scale<input type="checkbox" id="scale-${formIndex}" ${scale ? 'checked=true' : ''} class="demo__field-scale js-demo__field-scale"><label for="scale-${formIndex}" class="demo__mark"></label></div>`
      + `<div class="demo__field-wrapper demo__field-wrapper_for-checkbox">label<input type="checkbox" id="label-${formIndex}" class="demo__field-settings js-demo__field-settings demo__field-settings_for-label js-demo__field-settings_for-label" ${settings.label ? 'checked=true' : ''}><label for="label-${formIndex}" class="demo__mark"></label></div>`);

    const $scaleElement = $('<div class="demo__field-wrapper"><label class="demo__mark">step<input type="number" class="demo__field-settings js-demo__field-settings demo__field-settings_type_step js-demo__field-settings_type_step"></label></div>');

    $inputValue.appendTo($(form));
    $settingsInputs.appendTo($(form));

    if (scale) {
      $scaleElement.appendTo($(form));
    }
  }

  public static createStepSetting(options: StepSettingsOptions): void {
    const {
      form, min, max,
    } = options;

    const step = (max - min) / 5;
    const $stepElement = $('<div class="demo__field-wrapper"><label class="demo__mark">step<input type="number" class="demo__field-settings js-demo__field-settings demo__field-settings_type_step js-demo__field-settings_type_step"></label></div>');
    $stepElement.find('.js-demo__field-settings_type_step').val(step);
    $stepElement.appendTo($(form));
  }

  public static setInputValue(options: InputValueOptions): void {
    const {
      element, settings,
    } = options;

    const { range, min, max } = settings;

    if (range) {
      const minInput = (element.querySelector('.js-demo__field-value_type_min') as HTMLInputElement);
      settings.valueMin ? minInput.value = settings.valueMin.toString()
        : minInput.value = min.toString();
      const maxInput = (element.querySelector('.js-demo__field-value_type_max') as HTMLInputElement);
      settings.valueMax ? maxInput.value = settings.valueMax.toString()
        : maxInput.value = max.toString();
    } else {
      const input = (element.querySelector('.js-demo__field-value') as HTMLInputElement);
      settings.value ? input.value = settings.value.toString() : input.value = min.toString();
    }

    Array.from(element.querySelectorAll('.js-demo__field-settings')).map((input, index) => {
      const inputElement = (input as HTMLInputElement);
      const isSettingValue = Object.values(settings)[index]
        || Object.values(settings)[index] === 0;
      if (inputElement.type === 'checkbox') {
        inputElement.checked = Object.values(settings)[index];
      } else if (isSettingValue) {
        inputElement.value = Object.values(settings)[index];
      }
      return inputElement;
    });
  }
}

export default Panel;
