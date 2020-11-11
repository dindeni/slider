import {
  ValidationOptions, Slider, SliderElementOptions,
} from '../../types/types';
import Observable from '../Observable/Observable';

type OptionsForValidation = Pick<Slider, 'min' | 'max' | 'value' | 'valueMin' | 'valueMax'>;

class Model extends Observable {
  public sliderOptions: SliderElementOptions;

  public setSliderOptions(options: SliderElementOptions): void {
    const {
      min, max, value, valueMin, valueMax,
    } = options;
    this.sliderOptions = options;
    this.validateExtremumValue({
      min, max, value, valueMin, valueMax,
    });

    this.sliderOptions.valueMin = this.validateStepValue(this.sliderOptions.valueMin || min);
    this.sliderOptions.valueMax = this.validateStepValue(this.sliderOptions.valueMax || max);
    this.sliderOptions.value = this.validateStepValue(this.sliderOptions.value || min);
  }

  public calculateFractionOfValue(value: number): number {
    const { min, max } = this.sliderOptions;

    const fraction = (value - min) / (max - min);
    this.notifyAll({ value: fraction, type: 'setFractionOfValue' });
    return fraction;
  }

  public validateValue(options: ValidationOptions): boolean {
    const { type, value } = options;
    const {
      min, max, valueMin, valueMax, step,
    } = this.sliderOptions;

    const validateValue = (): boolean => {
      switch (true) {
        case value > max || value < min:
          return false;
        case !type:
          return true;
        case type === 'min':
          return valueMax ? value <= valueMax : false;
        case type === 'max':
          return valueMin || valueMin === 0 ? value >= valueMin : false;
        default: return false;
      }
    };

    const isValid = validateValue();
    if (step) {
      this.validateStepValue(value);
    }
    this.notifyAll({ value: isValid, type: 'validateValue' });
    return isValid;
  }

  private validateStepValue(value: number): number {
    const { step, min, max } = this.sliderOptions;

    if (step) {
      let validValue = min + Math.round((value - min) / step) * step;
      if (validValue > max) {
        validValue = max;
      }
      this.notifyAll({ value: validValue, type: 'setStepValue' });
      return validValue;
    }
    return value;
  }

  private validateExtremumValue(options: OptionsForValidation): void {
    const {
      min, max, value, valueMin, valueMax,
    } = options;
    const validate = (checkedValue: number): number | undefined => {
      if (checkedValue) {
        if (checkedValue > max) {
          return max;
        }
        if (checkedValue < min) {
          return min;
        }
        return checkedValue;
      } return undefined;
    };
    if (value) {
      this.sliderOptions.value = validate(value);
    }
    if (valueMin) {
      this.sliderOptions.valueMin = validate(valueMin);
    }
    if (valueMax) {
      this.sliderOptions.valueMax = validate(valueMax);
    }
  }
}

export default Model;
