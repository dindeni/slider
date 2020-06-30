import { ExtremumOptions, Slider } from '../../types/types';

interface ElementsCreationOptions {
  settings: Slider;
  form: HTMLElement;
}

interface InputValueOptions {
  element: HTMLElement;
  settings: Slider;
  value?: {notRange?: number; min?: number; max?: number};
}

interface ErrorCreationOptions {
  element: HTMLElement;
  text: string;
}

interface SettingsValidatingOptions extends ExtremumOptions{
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
    number | null {
    const {
      element, value, min, max, step, range, wrapper,
    } = options;
    const valueToNumber = Number(value);

    const checkRangeValue = (): number | null => {
      if (range) {
        const minElement = wrapper.querySelector('.js-panel__field-value_type_min');
        const maxElement = wrapper.querySelector('.js-panel__field-value_type_max');
        const valueMin = Number((minElement as HTMLInputElement).value);
        const valueMax = Number((maxElement as HTMLInputElement).value);

        const isSablingValueValid = element === minElement
          ? valueToNumber < valueMax
          : valueToNumber > valueMin;
        const isValidValue = isSablingValueValid && valueToNumber >= min && valueToNumber <= max;
        if (isValidValue) {
          Panel.deleteErrorElement(element);
          return valueToNumber;
        }
      } Panel.deleteErrorElement(element);
      Panel.createErrorElement({ element, text: 'invalid value' });
      return null;
    };

    const isValidStepValue = step && (valueToNumber - min) % step === 0;
    const checkStepValue = (): number | null => {
      if (isValidStepValue) {
        Panel.deleteErrorElement(element);
        return checkRangeValue();
      } Panel.deleteErrorElement(element);
      Panel.createErrorElement({ element, text: 'value must be a multiple of step' });
      return null;
    };

    if (step) {
      return checkStepValue();
    } return checkRangeValue();
  }

  public validateSettings(options: SettingsValidatingOptions):
    boolean | number | undefined | null {
    const {
      element, min, max,
    } = options;

    const { value } = element as HTMLInputElement;
    const isMin = element.classList.contains('js-panel-settings__field_type_min');
    const isMax = element.classList.contains('js-panel-settings__field_type_max');
    const isCheckbox = (element as HTMLInputElement).type === 'checkbox';
    const isStep = element.classList.contains('js-panel__field-step');

    switch (true) {
      case isMin:
        Panel.deleteErrorElement(element);
        return Number((element as HTMLInputElement).value) < max ? Panel.convertInputValue(value)
          : Panel.createErrorElement({ element, text: 'must be less than max' });
      case isMax:
        Panel.deleteErrorElement(element);
        return Number((element as HTMLInputElement).value) > min ? Panel.convertInputValue(value)
          : Panel.createErrorElement({ element, text: 'must be greater than min' });
      case isStep: return Panel.convertInputValue(value);
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
    const { settings, form } = options;

    const $form = $(form);
    const $valueWrapperList = $form.find('.js-panel__wrapper_type_value');
    if (settings.range) {
      $valueWrapperList[0].classList.add('panel__wrapper_hidden');
      $valueWrapperList[1].classList.remove('panel__wrapper_hidden');
      $valueWrapperList[2].classList.remove('panel__wrapper_hidden');
    } else {
      $valueWrapperList[0].classList.remove('panel__wrapper_hidden');
      $valueWrapperList[1].classList.add('panel__wrapper_hidden');
      $valueWrapperList[2].classList.add('panel__wrapper_hidden');
    }
  }

  public static setInputValue(options: InputValueOptions): void {
    const {
      element, settings,
    } = options;

    const {
      range, min, max, step,
    } = settings;

    if (range) {
      const minInput = (element.querySelector('.js-panel__field-value_type_min') as HTMLInputElement);
      minInput.value = settings.valueMin ? settings.valueMin.toString() : min.toString();
      const maxInput = (element.querySelector('.js-panel__field-value_type_max') as HTMLInputElement);
      maxInput.value = settings.valueMax ? settings.valueMax.toString() : max.toString();
    } else {
      const input = (element.querySelector('.js-panel__field-value') as HTMLInputElement);
      input.value = settings.value ? settings.value.toString() : min.toString();
    }

    [...element.querySelectorAll('.js-panel-settings__field')].forEach((input, index) => {
      const inputElement = (input as HTMLInputElement);

      if (inputElement.type === 'checkbox') {
        inputElement.checked = Object.values(settings)[index];
      } else {
        inputElement.value = Object.values(settings)[index];
      }
    });

    if (step) {
      (element.querySelector('.js-panel__field-step') as HTMLInputElement).value = step.toString();
    }
  }

  private static createErrorElement(options: ErrorCreationOptions): null {
    const {
      element, text,
    } = options;

    const errorElement = element.nextElementSibling as HTMLElement;
    errorElement.classList.remove('error_hidden');
    errorElement.textContent = text;
    return null;
  }

  private static deleteErrorElement(element: HTMLElement): void {
    (element.nextElementSibling as HTMLElement).classList.add('error_hidden');
  }
}

export default Panel;
