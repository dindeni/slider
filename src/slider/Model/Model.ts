import {
  ValidationOptions,
  SliderElementOptions,
  ValueAndType,
  IsMinAndMaxReturnValue,
  PluginOptions,
} from '../../types/types';
import Observable from '../Observable/Observable';
import EventTypes from '../constants';

interface CheckTypeOptions {
  value: number;
  valueMin: number;
  valueMax: number;
}

class Model extends Observable {
  public settings: SliderElementOptions;

  public setSettings(options: PluginOptions): void {
    this.settings = { ...this.settings, ...options };

    const { valueMin, valueMax, value } = this.settings;
    this.settings.valueMin = this.validateStepValue(this.getSettingsValue({ type: 'min', value: valueMin }));
    this.settings.valueMax = this.validateStepValue(this.getSettingsValue({ type: 'max', value: valueMax }));
    this.settings.value = this.validateStepValue(this.getSettingsValue({ value }));
    this.checkSettingsValue();
  }

  public calculateFractionOfValue(value: number): number {
    const { min, max } = this.settings;

    const fraction = (value - min) / (max - min);
    this.notifyAll({ value: fraction, type: EventTypes.SET_FRACTION });
    return fraction;
  }

  public validateValue(options: ValidationOptions): ValueAndType {
    const { type, value } = options;
    const { step, isRange } = this.settings;

    let validValue = this.validateExtremumValue(value);
    validValue = step ? this.validateStepValue(validValue) : Math.round(validValue);

    const isValueMinAndValueMax = (data: SliderElementOptions): data is
      IsMinAndMaxReturnValue => (
      data.valueMin !== undefined && data.valueMax !== undefined
    );
    if (isValueMinAndValueMax(this.settings)) {
      const { valueMin, valueMax } = this.settings;

      const checkedType = !type && isRange
        ? Model.checkValueType({ value, valueMin, valueMax })
        : type;
      validValue = Model.checkValueBetweenMinAndMax({
        value: validValue, valueMin, valueMax, type: checkedType,
      });
      this.notifyAll(
        { value: { value: validValue, type: checkedType }, type: EventTypes.UPDATE_VALUE },
      );
    }
    return { value: validValue, type };
  }

  private validateStepValue(value: number): number {
    const { max, min } = this.settings;
    const step = this.settings.step || 1;

    if (value === max) {
      return max;
    }
    const checkValue = (): number => {
      const checkedValue = Number((Math.round((value - min) / step) * step).toFixed(2)) + min;
      switch (true) {
        case checkedValue > max: return max;
        case checkedValue < min: return min;
        default: return checkedValue;
      }
    };

    this.notifyAll({ value: checkValue(), type: EventTypes.SET_STEP_VALID_VALUE });
    return checkValue();
  }

  private static checkValueBetweenMinAndMax(options: CheckTypeOptions
    & { type?: string }): number {
    const {
      value, valueMin, valueMax, type,
    } = options;

    switch (true) {
      case type === 'min' && value > valueMax:
        return valueMin;
      case type === 'max' && value < valueMin:
        return valueMax;
      default:
        return value;
    }
  }

  private static checkValueType(options: CheckTypeOptions): 'min' | 'max' {
    const { value, valueMin, valueMax } = options;

    const valuesRange = (valueMax - valueMin);
    return value + (valuesRange / 2) < valueMax ? 'min' : 'max';
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

    if (typeof valueMin === 'number') {
      this.settings.valueMin = this.validateExtremumValue(valueMin);
    }
    if (typeof valueMax === 'number') {
      this.settings.valueMax = this.validateExtremumValue(valueMax);
    }
    if (typeof value === 'number') {
      this.settings.value = this.validateExtremumValue(value);
    }
  }

  private getSettingsValue(options: { type?: 'min' | 'max'; value?: number }): number {
    const { type, value } = options;

    const isType = (settingsType?: 'min' | 'max'): settingsType is
      'min' | 'max' => settingsType === 'min' || settingsType === 'max';
    if (isType(type)) {
      return value || value === 0 ? value : this.settings[type];
    }
    return value || value === 0 ? value : this.settings.min;
  }
}

export default Model;
