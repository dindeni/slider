import autoBind from 'auto-bind';
import { Slider, SliderBasicOptions, ExtremumOptions } from '../../types/types';
import '../../slider/sliderInit/sliderInit';

interface ObservingInputOptions extends SliderBasicOptions{
  element: HTMLElement;
}

interface DemoElementsAndEventOptions{
  event: Event;
  element: HTMLElement;
  formElement: HTMLElement;
}

interface DemoElementChangeOptions extends ExtremumOptions, DemoElementsAndEventOptions{
  step: number | undefined;
  range: boolean;
}

interface OptionsForUpdatingSlider extends DemoElementsAndEventOptions{
  settings: Slider;
}

interface ElementsCreationOptions {
  settings: Slider;
  form: HTMLElement;
}

interface ErrorCreationOptions {
  element: HTMLElement;
  text: string;
}

interface OptionsForGettingInputValues {
  event: Event;
  min: number;
}

class Demo {
  private slider;

  readonly wrapper;

  private settings;

  private settingsKeys = ['value', 'valueMin', 'valueMax', 'min', 'max', 'progress', 'vertical', 'range', 'label', 'step'];

  constructor({ wrapper, settings }) {
    this.wrapper = wrapper;
    this.settings = settings;
    autoBind(this);
  }

  public loadSliders(): void {
    const optionsForElements = {
      settings: this.settings,
      form: (this.wrapper.children[0]) as HTMLElement,
      scale: this.settings.scale,
    };
    Demo.createElements(optionsForElements);
    const sliderElement = $(this.wrapper).find('.js-slider');
    this.slider = sliderElement.slider({
      ...this.settings,
      method: (options) => Demo.updateInputValue({
        options,
        wrapper: this.wrapper,
      }),
    });

    this.setInputValue(this.settings);

    const optionsForInput = {
      element: this.wrapper,
      range: this.settings.range,
      min: this.settings.min,
      max: this.settings.max,
      vertical: this.settings.vertical,
      step: this.settings.step,
      progress: this.settings.progress,
    };
    this.observeInput(optionsForInput);
  }

  private observeInput(options: ObservingInputOptions): void {
    const {
      element, range, min, max, step,
    } = options;

    const formElement = element.querySelector('.js-demo__form-panel') as HTMLElement;

    formElement.addEventListener('change', (event) => this.handleFormElementChange(
      {
        min, max, step, range, event, element, formElement,
      },
    ));
  }

  private handleFormElementChange(options: DemoElementChangeOptions): void {
    const {
      min, event, element, formElement,
    } = options;
    const targetElement = event.target as HTMLInputElement;
    const targetValue = Number(targetElement.value);

    this.settings = this.getInputValues({ event, min });

    const isValidValueOrSetting = targetElement.classList.contains('js-demo__field-value')
      ? this.validateValue(event.target as HTMLInputElement, targetValue)
      : this.validateSettings(event.target as HTMLInputElement);

    if (isValidValueOrSetting) {
      const target = event.currentTarget as HTMLElement;
      const form = target.cloneNode(true) as HTMLElement;
      (target.parentNode as HTMLElement).replaceChild(form, target);

      this.correctValues();
      this.updateSlider({
        event, element, formElement, settings: this.settings,
      });
    }
  }

  private updateSlider(options: OptionsForUpdatingSlider): void {
    const { element, settings } = options;

    const form = element.querySelector('.js-demo__form-panel') as HTMLElement;
    Demo.createElements({ settings, form });
    this.setInputValue(settings);
    this.slider.reload(settings);

    const optionsForInput = {
      element,
      range: settings.range,
      min: settings.min,
      max: settings.max,
      vertical: settings.vertical,
      step: settings.step,
      progress: settings.progress,
    };
    this.observeInput(optionsForInput);
  }

  private getInputValues(options: OptionsForGettingInputValues): Slider {
    const { event, min } = options;

    let settings: Slider = {
      min: 0,
      max: 100,
      progress: true,
      vertical: false,
      range: false,
      label: false,
      step: undefined,
      value: min,
    };

    const inputs = [...(event.currentTarget as HTMLFormElement).elements];

    inputs.forEach((input: HTMLInputElement, index: number) => {
      const key = this.settingsKeys[index];

      if (input.type === 'checkbox') {
        const value = input.checked;
        settings = { ...settings, ...{ [key]: value } };
      } else {
        const value = Number(input.value);
        settings = { ...settings, ...{ [key]: value } };
      }

      if (index === inputs.length - 1 && settings.step) {
        const value = Number(input.value || (settings.max - settings.min) / 5);
        settings = { ...settings, ...{ step: value } };
      }
    });
    return settings;
  }

  private static updateInputValue({ options, wrapper }): void {
    const {
      range, min, max, valueMin, valueMax, value,
    } = options;

    if (range) {
      const inputElementMin: HTMLInputElement = wrapper.querySelector('.js-demo__field-value_type_min') as HTMLInputElement;
      const inputElementMax: HTMLInputElement = wrapper.querySelector('.js-demo__field-value_type_max') as HTMLInputElement;
      inputElementMin.value = valueMin || min;
      inputElementMax.value = valueMax || max;
    } else {
      const inputElement: HTMLInputElement = wrapper.querySelector('.js-demo__field-value') as HTMLInputElement;
      inputElement.value = value || min;
    }
  }

  public setInputValue(settings): void {
    const {
      range, min, max, step,
    } = settings;

    if (range) {
      const minInput = (this.wrapper.querySelector('.js-demo__field-value_type_min') as HTMLInputElement);
      minInput.value = settings.valueMin ? settings.valueMin.toString() : min.toString();
      const maxInput = (this.wrapper.querySelector('.js-demo__field-value_type_max') as HTMLInputElement);
      maxInput.value = settings.valueMax ? settings.valueMax.toString() : max.toString();
    } else {
      const input = (this.wrapper.querySelector('.js-demo__field-value') as HTMLInputElement);
      input.value = settings.value ? settings.value.toString() : min.toString();
    }
    const formElement = this.wrapper.querySelector('.js-demo__form-panel') as HTMLFormElement;

    [...formElement.elements].forEach((input: HTMLInputElement, index: number) => {
      const key = this.settingsKeys[index];
      const inputElement = input;
      const isSettingKey = settings[key] || settings[key] === 0;
      if (input.type === 'checkbox') {
        inputElement.checked = settings[key];
      } else if (isSettingKey) {
        inputElement.value = settings[key];
      }
    });

    if (step) {
      (this.wrapper.querySelector('.js-demo__field-step') as HTMLInputElement).value = step.toString();
    }
  }

  public validateValue(element, value): boolean {
    const {
      min, max, step,
    } = this.settings;

    const checkRangeLimits = (number: number): boolean => {
      Demo.deleteErrorElement(element);
      if (!number) {
        return true;
      }
      if (number >= min && number <= max) {
        return true;
      }
      return Demo.createErrorElement({ element, text: 'invalid value(min or max)' });
    };

    const isValidValues = checkRangeLimits(value);

    const checkStepValue = (number: number): boolean => {
      if (isValidValues) {
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

  public validateSettings(element: HTMLInputElement):
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

  correctValues(): void {
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

    this.settings.valueMin = checkValue(valueMin);
    this.settings.valueMax = checkValue(valueMax);
    this.settings.value = checkValue(value);
  }

  private static createElements(options: ElementsCreationOptions): void {
    const { settings, form } = options;

    const $form = $(form);
    const $valueWrapperList = $form.find('.js-demo__wrapper_type_value');
    if (settings.range) {
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

    if (((element as HTMLInputElement).type !== 'checkbox')) {
      const errorElement = element.nextElementSibling as HTMLElement;
      errorElement.classList.remove('error_hidden');
      errorElement.textContent = text;
      return false;
    }
    return true;
  }

  private static deleteErrorElement(element: HTMLElement): void {
    const siblingElement = element.nextElementSibling as HTMLElement;
    const hasErrorElement = siblingElement && (element as HTMLInputElement).type !== 'checkbox';
    if (hasErrorElement) {
      (element.nextElementSibling as HTMLElement).classList.add('error_hidden');
    }
  }
}

export default Demo;
