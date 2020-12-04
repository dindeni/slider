import {
  ValidationOptions, SliderElementOptions, ValueAndType,
} from '../../types/types';
import Observable from '../Observable/Observable';
import EventTypes from '../constants';

class Model extends Observable {
  public settings: SliderElementOptions;

  public setSettings(options: SliderElementOptions): void {
    const { min, max } = options;
    this.settings = options;

    this.checkSettingsValue();
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

  public validateValue(options: ValidationOptions): ValueAndType {
    const { type, value } = options;
    const { valueMin, valueMax, step } = this.settings;
    const validateValue = (): boolean => {
      switch (true) {
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
    let validValue = this.validateExtremumValue(value);
    if (step) {
      validValue = this.validateStepValue(validValue);
    }
    if (isValid) {
      this.notifyAll({ value: { value: validValue, type }, type: EventTypes.UPDATE });
      return { value: validValue, type };
    }
    return { value: null };
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

  private validateExtremumValue(checkedValue: number): number {
    const { min, max } = this.settings;

    switch (true) {
      case checkedValue > max: return max;
      case checkedValue < min: return min;
      default: return checkedValue;
    }
  }

  private checkSettingsValue(): void {
    const { value, valueMin, valueMax } = this.settings;

    if (valueMin) {
      this.settings.valueMin = this.validateExtremumValue(valueMin);
    }
    if (valueMax) {
      this.settings.valueMax = this.validateExtremumValue(valueMax);
    }
    if (value) {
      this.settings.value = this.validateExtremumValue(value);
    }
  }
}

export default Model;
