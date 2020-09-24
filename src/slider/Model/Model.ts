import {
  ValidationOptions, Slider, SliderElementOptions,
} from '../../types/types';
import Observable from '../Observable/Observable';

type OptionsForValidation = Pick<Slider, 'min' | 'max' | 'value' | 'valueMin' | 'valueMax'>;

class Model extends Observable {
  public sliderOptions: SliderElementOptions;

  public getSliderOptions(options: SliderElementOptions): void {
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
    this.notifyAll({ value: { data: fraction, actionType: 'getFractionOfValue' }, type: 'updateState' });
    return fraction;
  }

  public validateValue(options: ValidationOptions): boolean {
    const { type, value } = options;

    const {
      min, max, valueMin, valueMax,
    } = this.sliderOptions;

    const getState = (): boolean => {
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

    const data = getState();
    this.notifyAll({ value: { data, actionType: 'validateValue' }, type: 'updateState' });
    return data;
  }

  public validateStepValue(value: number): number {
    const { step, min } = this.sliderOptions;

    if (step) {
      const state = min + Math.round((value - min) / step) * step;
      this.notifyAll({ value: { data: state, actionType: 'validateStepValue' }, type: 'updateState' });
      return state;
    }
    this.notifyAll({ value: { data: value, actionType: 'validateStepValue' }, type: 'updateState' });
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
    this.sliderOptions.value = validate(value as number);
    this.sliderOptions.valueMin = validate(valueMin as number);
    this.sliderOptions.valueMax = validate(valueMax as number);
  }
}

export default Model;
