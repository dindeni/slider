import autoBind from 'auto-bind';

import {
  Slider, SliderOptions, SliderReturnOption, MethodOption, IsValueMinAndValueMaxReturnValue,
} from '../../types/types';
import '../../slider/sliderInit/sliderInit';

interface ObservingInputOptions extends Pick<Slider, 'step'> {
  element: HTMLElement;
}

interface DemoElementsAndEventOptions {
  event: Event;
  element: HTMLElement;
  formElement: HTMLElement;
}

interface DemoElementChangeOptions extends DemoElementsAndEventOptions {
  step: number | undefined;
}

interface OptionsForUpdatingSlider extends DemoElementsAndEventOptions {
  settings: Slider;
}

interface ElementsCreationOptions {
  settings: Slider;
  form: HTMLElement;
}

interface ErrorCreationOptions {
  element: HTMLInputElement;
  text: string;
}

interface ValidateOptions {
  element: HTMLInputElement;
  value: number;
}

type SettingsKeyOptions = 'value' | 'valueMin' | 'valueMax' | 'min' | 'max' | 'withProgress'
  | 'isVertical' | 'isRange' | 'withLabel' | 'step' | 'withScale';

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
      method: (options: SliderOptions) => Demo.updateInputValue({
        settings: options,
        wrapper: this.wrapper,
      }),
    });

    this.setInputValue(this.settings);

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

    this.getInputValues(event);
    const isValidValueOrSetting = targetElement.classList.contains('js-demo__field-value')
      ? this.validateValue({ element: targetElement, value: targetValue })
      : this.validateSettings(targetElement);


    if (isValidValueOrSetting) {
      const target = event.currentTarget as HTMLElement;
      const form = target.cloneNode(true);
      if (target.parentNode) {
        target.parentNode.replaceChild(form, target);
      }
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
      this.setInputValue(settings);

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

  private static updateInputValue(options:
    { settings: SliderOptions; wrapper: HTMLElement }): void {
    const { isRange, value } = options.settings;
    const { wrapper } = options;

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
    } else if (value) {
      const inputElement = wrapper.querySelector('.js-demo__field-value');
      (inputElement as HTMLInputElement).value = value.toString();
    }
  }

  private setInputValue(settings: SliderOptions): void {
    this.getInputValue(settings);
    const formElement: HTMLFormElement | null = this.wrapper.querySelector('.js-demo__form-panel');

    if (formElement) {
      [...formElement.elements].forEach((input: HTMLInputElement, index: number) => {
        const key: SettingsKeyOptions = this.settingsKeys[index];
        const inputElement: HTMLInputElement = input;
        const isSettingKey = settings[key] || settings[key] === 0;

        if (input.type === 'checkbox') {
          inputElement.checked = !!settings[key];
        } else if (isSettingKey) {
          inputElement.value = (settings[key] || '').toString();
        }
      });
    }
  }

  private getInputValue(settings: SliderOptions): SliderOptions {
    const { isRange, min, max } = settings;

    if (isRange) {
      const minInput: HTMLInputElement | null = (this.wrapper.querySelector('.js-demo__field-value_type_min'));
      if (minInput) {
        minInput.value = settings.valueMin ? settings.valueMin.toString() : min.toString();
      }

      const maxInput: HTMLInputElement | null = this.wrapper.querySelector('.js-demo__field-value_type_max');
      if (maxInput) {
        maxInput.value = settings.valueMax ? settings.valueMax.toString() : max.toString();
      }
    } else {
      const input: HTMLInputElement | null = this.wrapper.querySelector('.js-demo__field-value');
      if (input) {
        input.value = settings.value ? settings.value.toString() : min.toString();
      }
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

    const isValidValues = checkRangeLimits(value) && this.checkRangeValue(options);

    const checkStepValue = (number: number): boolean => {
      if (isValidValues && step) {
        Demo.deleteErrorElement(element);
        return (number - min) % step === 0 || Demo.createErrorElement({ element, text: 'value must be a multiple of step' });
      }
      return false;
    };

    if (step) {
      return checkStepValue(value);
    }
    return isValidValues;
  }

  private checkRangeValue(options: ValidateOptions): boolean {
    const { isRange, valueMin, valueMax } = this.settings;
    const { value, element } = options;

    if (isRange) {
      const isMin = element.classList.contains('js-demo__field-value_type_min');
      switch (true) {
        case isMin && typeof valueMax === 'number' && value > valueMax:
          return Demo.createErrorElement({ element, text: 'invalid value min' });
        case !isMin && typeof valueMin === 'number' && value < valueMin:
          return Demo.createErrorElement({ element, text: 'invalid value max' });
        default: return true;
      }
    } return true;
  }

  private validateSettings(element: HTMLInputElement):
    boolean | number | undefined | null {
    const { min, max } = this.settings;

    Demo.deleteErrorElement(element);
    switch (true) {
      case min > max: Demo.createErrorElement({ element, text: 'must be less than max' });
        return false;
      case max < min: Demo.createErrorElement({ element, text: 'must be greater than min' });
        return false;
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
    const {
      element, text,
    } = options;

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
