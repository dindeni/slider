import {
  CurrentCoordinate, ScaleData, SliderValueOptions, DistanceOptions, ExtremumOptions,
} from '../../types/types';

interface SliderValues{
  value: number | undefined;
  valueMin: number | undefined;
  valueMax: number | undefined;
}

interface OptionsForValidation extends ExtremumOptions, SliderValues{
}

class Model {
  public sliderValue: number;

  public value: number | undefined;

  public valueMin: number | undefined;

  public valueMax: number | undefined;

  public static calculateCurrentCoordinate(options: CurrentCoordinate): number {
    const { value, min, max } = options;

    return (value - min) / (max - min);
  }

  public validateValue(options: OptionsForValidation): void {
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

  public calculateSliderValue(options: SliderValueOptions): number {
    const {
      min, max, fraction,
    } = options;

    const isBelow0 = fraction <= 0;
    if (isBelow0) {
      this.sliderValue = min;
    } else {
      this.sliderValue = min + ((max - min) * fraction);
    }

    return Math.round(this.sliderValue);
  }

  public static validateStepValues(data: ScaleData): ScaleData {
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
    return result;
  }

  public static calculateDistance(options: DistanceOptions): number {
    const { coordinateStart, coordinateMove } = options;
    return coordinateMove - coordinateStart;
  }
}

export default Model;
