import {
  FromValueToCoordinate, ScaleData, ScaleCoordinatesOptions,
  SliderValueOptions, DistanceOptions, CoordinateOfMiddleOptions, ExtremumOptions,
} from '../../types/types';
import Observable from '../Observable/Observable';

interface MovingPercentOptions {
  trackSize: number;
  distance: number;
}

interface SliderValues{
  value: number | undefined;
  valueMin: number | undefined;
  valueMax: number | undefined;
}

interface OptionsForValidation extends ExtremumOptions, SliderValues{
}

class Model extends Observable {
    public sliderValuePercent: number;

    public sliderValue: number;

    public value: number | undefined;

    public valueMin: number | undefined;

    public valueMax: number | undefined;

    private dataForScale: number[] = [];

    public updateState(options): SliderValues {
      const {
        min, max, value, valueMin, valueMax,
      } = options;
      this.notifyAll({
        value: {
          min, max, value, valueMin, valueMax,
        },
        type: 'validateValue',
      });
      return { value: this.value, valueMin: this.valueMin, valueMax: this.valueMax };
    }

    public static calculateFromValueToCoordinates(options: FromValueToCoordinate): number {
      const {
        value, min, max, trackSize,
      } = options;
      const unit = trackSize / (max - min);
      const rem = 0.077;
      return Number((((value - min) * unit) * rem).toFixed(2));
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
        min, max, trackSize, distance,
      } = options;

      this.calculateSliderMovePercent({ trackSize, distance });

      const isBelow0 = this.sliderValuePercent <= 0 || !this.sliderValuePercent;
      if (isBelow0) {
        this.sliderValue = min;
      } else {
        this.sliderValue = min + ((max - min)
        * (this.sliderValuePercent)) / 100;
      }
      return Math.round(this.sliderValue);
    }

    public calculateLeftScaleCoordinates(options: ScaleCoordinatesOptions): ScaleData {
      const {
        min, max, step, vertical, trackWidth, trackHeight,
      } = options;

      const scaleValue: {value: number[]; coordinates: number[]; shortValue: number[];
      shortCoordinates: number[];} = {
        coordinates: [],
        value: [],
        shortValue: [],
        shortCoordinates: [],
      };
      const height = Math.round(trackHeight);
      const width = Math.round(trackWidth);

      if (step) {
        let stepCount = 0;
        for (let i = min; i <= max; i += step) {
          const fractionOfValue = stepCount / (max - min);
          const coordinatesItems = vertical
            ? Number((fractionOfValue * height).toFixed(2))
            : Number((fractionOfValue * trackWidth).toFixed(2));
          scaleValue.value.push(i);
          scaleValue.coordinates.push(coordinatesItems);
          this.dataForScale.push(coordinatesItems);
          stepCount += step;
        }

        const isLastCoordinate = scaleValue.coordinates[
          scaleValue.coordinates.length - 1] !== width;

        if (isLastCoordinate) {
          scaleValue.coordinates.pop();
          vertical ? scaleValue.coordinates.push(height) : scaleValue.coordinates.push(width);
          scaleValue.value.pop();
          scaleValue.value.push(max);
        }

        scaleValue.shortValue = scaleValue.value;
        scaleValue.shortCoordinates = scaleValue.coordinates;

        while (scaleValue.shortValue.length > 10) {
          scaleValue.shortValue = scaleValue.shortValue.filter(
            (value, index) => index === 0 || index % 2 === 0,
          );
        }

        while (scaleValue.shortCoordinates.length > 10) {
          scaleValue.shortCoordinates = scaleValue.shortCoordinates.filter(
            (value, index) => index === 0 || index % 2 === 0,
          );
        }
        return scaleValue;
      } return {
        coordinates: [],
        value: [],
        shortCoordinates: [],
        shortValue: [],
      };
    }

    private calculateSliderMovePercent(options: MovingPercentOptions): number {
      const { trackSize, distance } = options;
      this.sliderValuePercent = (distance / trackSize) * 100;
      switch (true) {
        case this.sliderValuePercent < 0:
          this.sliderValuePercent = 0;
          break;
        case this.sliderValuePercent > 100:
          this.sliderValuePercent = 100;
          break;
        default: return this.sliderValuePercent;
      }
      return this.sliderValuePercent;
    }

    public static calculateThumbDistance(options: DistanceOptions): number {
      const { coordinateStart, coordinateMove } = options;
      return coordinateMove - coordinateStart;
    }

    public static calculateCoordinatesOfMiddle(options: CoordinateOfMiddleOptions): number {
      const { start, itemSize } = options;
      return start + itemSize / 2;
    }
}

export default Model;
