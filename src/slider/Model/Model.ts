import {
  CurrentCoordinate, ScaleData, SliderValueOptions, DistanceOptions, Slider, SliderElementOptions,
} from '../../types/types';
import Observable from '../Observable/Observable';

type OptionsForValidation = Pick<Slider, 'min' | 'max' | 'value' | 'valueMin' | 'valueMax'>;

class Model extends Observable {
  public sliderOptions: SliderElementOptions;

  public sliderValue: number;

  public value: number | undefined;

  public valueMin: number | undefined;

  public valueMax: number | undefined;

  public getSliderOptions(options: SliderElementOptions): void {
    const {
      min, max, value, valueMin, valueMax,
    } = options;
    this.validateValue({
      min, max, value, valueMin, valueMax,
    });
    this.sliderOptions = {
      ...options, valueMin: this.valueMin, valueMax: this.valueMax, value: this.value,
    };
  }

  public static calculateCurrentCoordinate(options: CurrentCoordinate): number {
    const { value, min, max } = options;

    return (value - min) / (max - min);
  }

  public calculateSliderValue(options: SliderValueOptions): void {
    const {
      min, max, fraction,
    } = options;

    const isBelow0 = fraction <= 0;
    if (isBelow0) {
      this.sliderValue = min;
    } else {
      this.sliderValue = min + ((max - min) * fraction);
    }

    this.notifyAll({ value: Math.round(this.sliderValue), type: 'setValue' });
  }

  public validateStepValues(data: ScaleData): void {
    const { coordinates, value } = data;
    const result: ScaleData = { ...data, shortCoordinates: coordinates, shortValue: value };

    while (result.shortValue.length > 10) {
      result.shortValue = result.shortValue.filter(
        (currentValue, index) => index === 0 || index % 2 === 0,
      );
    }

    while (result.shortCoordinates.length > 10) {
      result.shortCoordinates = result.shortCoordinates.filter(
        (currentValue, index) => index === 0 || index % 2 === 0,
      );
    }
    this.notifyAll({ value: result, type: 'validateStepValues' });
  }

  public calculateDistance(options: DistanceOptions): void {
    const { coordinateStart, coordinateMove } = options;
    const value = coordinateMove - coordinateStart;
    this.notifyAll({ value, type: 'setDistance' });
  }

  private validateValue(options: OptionsForValidation): void {
    const {
      min, max, value, valueMin, valueMax,
    } = options;
    const validate = (checkedValue): number | undefined => {
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
    this.value = validate(value);
    this.valueMin = validate(valueMin);
    this.valueMax = validate(valueMax);
  }
}

export default Model;
