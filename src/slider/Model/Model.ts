import {
  ValidationOptions, SliderElementOptions, ValueAndType,
} from '../../types/types';
import Observable from '../Observable/Observable';
import EventTypes from '../constants';

interface CheckTypeOptions extends Pick<ValidationOptions, 'value'> {
  type: 'min' | 'max';
}

class Model extends Observable {
  public settings: SliderElementOptions;

  public setSettings(options: SliderElementOptions): void {
    const { min, max } = options;
    this.settings = { ...this.settings, ...options };

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
    const {
      valueMin, valueMax, step,
    } = this.settings;

    let validValue = this.validateExtremumValue(value);
    if (step) {
      validValue = this.validateStepValue(validValue);
    }
    const checkedType = type ? this.checkValueType({ type, value }) : type;
    const validateValue = (): boolean => {
      switch (true) {
        case !type:
          return true;
        case checkedType === 'min':
          return valueMax ? validValue <= valueMax : false;
        case checkedType === 'max':
          return valueMin || valueMin === 0 ? validValue >= valueMin : false;
        default: return false;
      }
    };

    const isValid = validateValue();
    if (isValid) {
      this.notifyAll({ value: { value: validValue, type: checkedType }, type: EventTypes.UPDATE });
      return { value: validValue, type: checkedType };
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

  private checkValueType(options: CheckTypeOptions): 'min' | 'max' {
    const {
      valueMin, valueMax, min, max,
    } = this.settings;
    const { value, type } = options;

    if (valueMax && (valueMin || valueMin === 0)) {
      const valuesRange = (valueMax - valueMin);
      let checkedType: 'min' | 'max' = value + (valuesRange / 2) < valueMax ? 'min' : 'max';
      if (valueMin === valueMax && value > (max - min) / 2) {
        checkedType = 'min';
      } else if (valueMin === valueMax && value < (max - min) / 2) {
        checkedType = 'max';
      }
      return checkedType;
    }
    return type;
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
