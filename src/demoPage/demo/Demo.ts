import autoBind from 'auto-bind';

import {
  SliderOptions, SliderReturnOption, MethodOption, IsValueMinAndValueMaxReturnValue,
} from '../../types/types';
import '../../slider';
import {
  ObservingInputOptions, SettingsKeyOptions, DemoElementChangeOptions,
  OptionsForUpdatingSlider, SetInputValueOptions, ElementsCreationOptions, ErrorCreationOptions,
  CheckRangeValue, ValidateOptions,
} from './types';

class Demo {
  private slider: SliderReturnOption;

  readonly wrapper: HTMLElement;

  private $sliderElement: JQuery<HTMLElement>;

  private settings: SliderOptions;

  private settingsKeys: SettingsKeyOptions[] = ['value', 'valueMin', 'valueMax', 'min', 'max',
    'withProgress', 'isVertical', 'isRange', 'withLabel', 'withScale', 'step'];

  constructor(option: { wrapper: HTMLElement; settings?: SliderOptions }) {
    const { wrapper, settings } = option;
    this.wrapper = wrapper;
    if (settings) {
      this.settings = settings;
    }
    autoBind(this);
  }

  public loadSliders(): void {
    const formElement: HTMLElement | null = this.wrapper.querySelector('.js-demo__form-panel');
    if (formElement) {
      Demo.createElements({ settings: this.settings, form: formElement });
    }

    this.$sliderElement = $(this.wrapper).find('.js-slider');
    this.slider = this.$sliderElement.slider({
      ...this.settings,
      method: (options: SliderOptions) => this.updateInputValue({
        settings: options,
        wrapper: this.wrapper,
      }),
    });

    this.setInputValues(this.settings);

    const optionsForInput = {
      element: this.wrapper,
      isRange: this.settings.isRange,
      min: this.settings.min,
      max: this.settings.max,
      isVertical: this.settings.isVertical,
      step: this.settings.step,
      withProgress: this.settings.withProgress,
    };
    this.observeInput(optionsForInput);
  }

  private observeInput(options: ObservingInputOptions): void {
    const { element, step } = options;

    const formElement: HTMLElement | null = element.querySelector('.js-demo__form-panel');
    if (formElement) {
      formElement.addEventListener('change', (event) => this.handleFormElementChange(
        {
          step, event, element, formElement,
        },
      ));
    }
  }

  private handleFormElementChange(options: DemoElementChangeOptions): void {
    const { event, element, formElement } = options;
    const targetElement = event.target as HTMLInputElement;
    const targetValue = Number(targetElement.value);

    const isValidValueOrSetting = targetElement.classList.contains('js-demo__field-value')
      ? this.validateValue({ element: targetElement, value: targetValue })
      : this.validateSettings(targetElement);
    const stepInput = this.wrapper.querySelector('.js-demo__field-step') as HTMLInputElement;
    const isTargetParentAndValidValueOrSetting = (targetParent: ParentNode | null):
      targetParent is HTMLElement => targetParent !== undefined && isValidValueOrSetting === true
      && this.validateSettings(stepInput) === true;
    const target = event.currentTarget as HTMLElement;

    if (isTargetParentAndValidValueOrSetting(target.parentNode)) {
      this.getInputValues(event);
      const form = target.cloneNode(true);
      target.parentNode.replaceChild(form, target);
      this.correctValues();
      this.updateSlider({
        event, element, formElement, settings: this.settings,
      });
    }
  }

  private updateSlider(options: OptionsForUpdatingSlider): void {
    const { element, settings } = options;

    const form: HTMLElement | null = element.querySelector('.js-demo__form-panel');
    if (form) {
      Demo.createElements({ settings, form });
      this.setInputValues(settings);

      this.$sliderElement = $(this.wrapper).find('.js-slider');
      (this.slider as { reload: MethodOption }).reload(
        { ...settings, $element: this.$sliderElement },
      );

      const optionsForInput = {
        element,
        isRange: settings.isRange,
        min: settings.min,
        max: settings.max,
        isVertical: settings.isVertical,
        step: settings.step,
        withProgress: settings.withProgress,
      };
      this.observeInput(optionsForInput);
    }
  }

  private getInputValues(event: Event): void {
    const inputs = [...(event.currentTarget as HTMLFormElement).elements];
    inputs.forEach((input: HTMLInputElement, index: number) => {
      const key = this.settingsKeys[index];

      if (input.type === 'checkbox') {
        const value = input.checked;
        this.settings = { ...this.settings, ...{ [key]: value } };
      } else {
        const value = Number(input.value);
        this.settings = { ...this.settings, ...{ [key]: value } };
      }
    });
  }

  private updateInputValue(options:
    { settings: SliderOptions; wrapper: HTMLElement }): void {
    const { isRange, value } = options.settings;
    const { wrapper } = options;
    this.settings = options.settings;

    const isRangeAndValueMinAndValueMax = (data: SliderOptions): data is
      IsValueMinAndValueMaxReturnValue => (
      data.valueMin !== undefined && data.valueMax !== undefined && isRange
    );
    if (isRangeAndValueMinAndValueMax(options.settings)) {
      const { valueMin, valueMax } = options.settings;
      const inputElementMin = wrapper.querySelector('.js-demo__field-value_type_min');
      const inputElementMax = wrapper.querySelector('.js-demo__field-value_type_max');
      (inputElementMin as HTMLInputElement).value = valueMin.toString();
      (inputElementMax as HTMLInputElement).value = valueMax.toString();
      this.validateValue({ element: inputElementMin as HTMLInputElement, value: valueMin });
      this.validateValue({ element: inputElementMax as HTMLInputElement, value: valueMax });
    } else if (value) {
      const inputElement = wrapper.querySelector('.js-demo__field-value');
      (inputElement as HTMLInputElement).value = value.toString();
    }
  }

  private setInputValues(settings: SliderOptions): void {
    this.setNumericInputs(settings);
    const formElement: HTMLFormElement | null = this.wrapper.querySelector('.js-demo__form-panel');

    const setValue = (options: SetInputValueOptions): void => {
      const { type, input, key } = options;

      if (type === 'checkbox') {
        input.checked = Boolean(settings[key]);
      } else if (settings[key] !== undefined) {
        input.value = (settings[key] || 0).toString();
      }
      if (input.classList.contains('js-demo__field-step')) {
        input.value = (settings[key] || 1).toString();
      }
    };
    if (formElement) {
      [...formElement.elements].forEach((input: HTMLInputElement, index: number) => {
        const key: SettingsKeyOptions = this.settingsKeys[index];
        setValue({ type: input.type, input, key });
      });
    }
  }

  private setNumericInputs(settings: SliderOptions): SliderOptions {
    const { isRange, min, max } = settings;

    const setValue = (element: HTMLInputElement, value: string): void => {
      const inputElement = element;
      if (inputElement) {
        inputElement.value = value;
      }
    };
    if (isRange) {
      const minInput = this.wrapper.querySelector('.js-demo__field-value_type_min') as HTMLInputElement;
      setValue(minInput, settings.valueMin ? settings.valueMin.toString() : min.toString());
      const maxInput = this.wrapper.querySelector('.js-demo__field-value_type_max') as HTMLInputElement;
      setValue(maxInput, settings.valueMax ? settings.valueMax.toString() : max.toString());
    } else {
      const input = this.wrapper.querySelector('.js-demo__field-value') as HTMLInputElement;
      input.value = settings.value ? settings.value.toString() : min.toString();
      setValue(input, settings.value ? settings.value.toString() : min.toString());
    }
    return settings;
  }

  private validateValue(options: ValidateOptions): boolean {
    const { element, value } = options;
    const { min, max, step } = this.settings;

    Demo.deleteErrorElement(element);
    const checkRangeLimits = (number: number): boolean => {
      if (!number) {
        return true;
      }
      const isValidValue = number >= min && number <= max;
      if (isValidValue) {
        return true;
      }
      return Demo.createErrorElement({ element, text: 'invalid value' });
    };

    const isValidValues = checkRangeLimits(value) && this.checkRangeValue();

    const checkStepValue = (number: number): boolean => {
      const isValidValuesAndStep = (stepValue?: number): stepValue is
        number => isValidValues && typeof stepValue === 'number';
      if (isValidValuesAndStep(step)) {
        Demo.deleteErrorElement(element);
        return ((number - min) % step === 0) || Demo.createErrorElement(
          { element, text: 'value must be a multiple of step and above zero' },
        );
      }
      return false;
    };

    if (step) {
      return checkStepValue(value);
    }
    return isValidValues;
  }

  private checkRangeValue(): boolean {
    const { isRange, valueMin, valueMax } = this.settings;

    const minElement = this.wrapper.querySelector('.js-demo__field-value_type_min') as HTMLInputElement;
    const maxElement = this.wrapper.querySelector('.js-demo__field-value_type_max') as HTMLInputElement;
    const inputValueMin = parseFloat(minElement.value);
    const inputValueMax = parseFloat(maxElement.value);

    Demo.deleteErrorElement(minElement);
    Demo.deleteErrorElement(maxElement);
    if (isRange) {
      const checkValue = ({ inputValue, inputElement }: CheckRangeValue): boolean => {
        switch (true) {
          case inputElement === minElement && typeof valueMax === 'number' && inputValue > valueMax:
            return Demo.createErrorElement({
              element: inputElement,
              text: 'invalid value min',
            });
          case inputElement !== minElement && typeof valueMin === 'number' && inputValue < valueMin:
            return Demo.createErrorElement({
              element: inputElement,
              text: 'invalid value max',
            });
          default:
            return true;
        }
      };
      return checkValue({ inputValue: inputValueMin, inputElement: minElement })
        && checkValue({ inputValue: inputValueMax, inputElement: maxElement });
    } return true;
  }

  private validateSettings(element: HTMLInputElement):
    boolean | number | undefined | null {
    const { min, max } = this.settings;

    Demo.deleteErrorElement(element);
    const stepInput = this.wrapper.querySelector('.js-demo__field-step') as HTMLInputElement;
    const stepValue = parseFloat(stepInput.value);
    switch (true) {
      case min > max: return Demo.createErrorElement({ element, text: 'must be less than max' });
      case max < min: return Demo.createErrorElement({ element, text: 'must be greater than min' });
      case element === stepInput && stepValue <= 0: return Demo.createErrorElement(
        { element, text: 'step must be above zero' },
      );
      default: return true;
    }
  }

  private correctValues(): void {
    const {
      min, max, valueMin, valueMax, value,
    } = this.settings;

    const checkValue = (number: number): number => {
      if (number < min) {
        return min;
      }
      if (number > max) {
        return max;
      }
      return number;
    };

    if (valueMin) {
      this.settings.valueMin = checkValue(valueMin);
    }
    if (valueMax) {
      this.settings.valueMax = checkValue(valueMax);
    }
    if (value) {
      this.settings.value = checkValue(value);
    }
  }

  private static createElements(options: ElementsCreationOptions): void {
    const { settings, form } = options;

    const $form = $(form);
    const $valueWrapperList = $form.find('.js-demo__wrapper_type_value');
    if (settings.isRange) {
      $valueWrapperList[0].classList.add('demo__wrapper_hidden');
      $valueWrapperList[1].classList.remove('demo__wrapper_hidden');
      $valueWrapperList[2].classList.remove('demo__wrapper_hidden');
    } else {
      $valueWrapperList[0].classList.remove('demo__wrapper_hidden');
      $valueWrapperList[1].classList.add('demo__wrapper_hidden');
      $valueWrapperList[2].classList.add('demo__wrapper_hidden');
    }
  }

  private static createErrorElement(options: ErrorCreationOptions): boolean {
    const { element, text } = options;

    const errorElement = element.nextElementSibling;
    if (element.type !== 'checkbox' && errorElement) {
      errorElement.classList.remove('error_hidden');
      errorElement.textContent = text;
      return false;
    }
    return true;
  }

  private static deleteErrorElement(element: HTMLInputElement): void {
    const siblingElement = element.nextElementSibling;
    const hasErrorElement = siblingElement && element.type !== 'checkbox';
    if (hasErrorElement && element.nextElementSibling) {
      element.nextElementSibling.classList.add('error_hidden');
    }
  }
}

export default Demo;
