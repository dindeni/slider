import {
  ValidationOptions, Slider, SliderElementOptions,
} from '../../types/types';
import Observable from '../Observable/Observable';
import EventTypes from '../constants';

type OptionsForValidation = Pick<Slider, 'min' | 'max' | 'value' | 'valueMin' | 'valueMax'>;

class Model extends Observable {
  public settings: SliderElementOptions;

  public setSettings(options: SliderElementOptions): void {
    const {
      min, max, value, valueMin, valueMax,
    } = options;
    this.settings = options;
    this.validateExtremumValue({
      min, max, value, valueMin, valueMax,
    });

    this.settings.valueMin = this.validateStepValue(this.settings.valueMin || min);
    this.settings.valueMax = this.validateStepValue(this.settings.valueMax || max);
    this.settings.value = this.validateStepValue(this.settings.value || min);
  }

  public calculateFractionOfValue(value: number): number {
    const { min, max } = this.settings;

    const fraction = (value - min) / (max - min);
    this.notifyAll({ value: fraction, type: EventTypes.SET_FRACTION });
    return fraction;
  }

  public validateValue(options: ValidationOptions): boolean {
    const { type, value } = options;
    const { VALIDATE } = EventTypes;
    const {
      min, max, valueMin, valueMax, step,
    } = this.settings;

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
    this.notifyAll({ value: isValid, type: VALIDATE });
    return isValid;
  }

  private validateStepValue(value: number): number {
    const { step, min, max } = this.settings;

    if (step) {
      let validValue = min + Math.round((value - min) / step) * step;
      if (validValue > max) {
        validValue = max;
      }
      this.notifyAll({ value: validValue, type: EventTypes.SET_STEP_VALUE });
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
      this.settings.value = validate(value);
    }
    if (valueMin) {
      this.settings.valueMin = validate(valueMin);
    }
    if (valueMax) {
      this.settings.valueMax = validate(valueMax);
    }
  }
}

export default Model;
