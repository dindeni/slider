import Model from '../Model/Model';
import { ExtremumOptions } from '../../types/types';

interface SliderValueOptions extends ExtremumOptions{
  trackSize: number;
  distance: number;
}

interface ScaleCoordinatesOptions extends ExtremumOptions{
  step: number | undefined;
  vertical: boolean;
  trackWidth: number;
  trackHeight: number;
}

interface ScaleValue {
  value: number[];
  coordinates: number[];
  shortValue: number[];
  shortCoordinates: number[];
}

interface FromValueToCoordinate extends ExtremumOptions{
  value: number;
  trackSize: number;
}

interface ValidationOptions extends ExtremumOptions{
  value: number | undefined;
}

interface MovingPercentOptions {
  trackSize: number;
  distance: number;
}

interface DistanceOptions {
  coordinateStart: number;
  coordinateMove: number;
}

interface CoordinateOfMiddleOptions {
  start: number;
  itemSize: number;
}

class Presenter {
    private dataForScale: number[] = [];

    model: Model = new Model();

    calculateSliderMovePercent(options: MovingPercentOptions): number {
      const { trackSize, distance } = options;
      this.model.sliderValuePercent = (distance / trackSize) * 100;
      switch (true) {
        case this.model.sliderValuePercent < 0:
          this.model.sliderValuePercent = 0;
          break;
        case this.model.sliderValuePercent > 100:
          this.model.sliderValuePercent = 100;
          break;
        default: return this.model.sliderValuePercent;
      }
      return this.model.sliderValuePercent;
    }

    calculateSliderValue(options: SliderValueOptions): number {
      const {
        min, max, trackSize, distance,
      } = options;
      this.calculateSliderMovePercent({ trackSize, distance });

      const isBelow0 = this.model.sliderValuePercent <= 0
        || !this.model.sliderValuePercent;
      if (isBelow0) {
        this.model.sliderValue = min;
      } else {
        this.model.sliderValue = min + ((max - min)
                  * (this.model.sliderValuePercent)) / 100;
      }
      return this.model.sliderValue;
    }

    calculateLeftScaleCoordinates(options: ScaleCoordinatesOptions): ScaleValue {
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
          let coordinatesItems;
          !vertical ? coordinatesItems = (stepCount / (max - min)) * trackWidth
            : coordinatesItems = (stepCount / (max - min))
                        * height;
          coordinatesItems = Number(coordinatesItems.toFixed(2));
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
          scaleValue.shortValue = scaleValue.shortValue.filter((value, index) => {
            const isIndex0OrEven = index === 0 || index % 2 === 0;
            if (isIndex0OrEven) {
              return true;
            } return false;
          });
        }

        while (scaleValue.shortCoordinates.length > 10) {
          scaleValue.shortCoordinates = scaleValue.shortCoordinates.filter((value, index) => {
            const isIndex0OrEven = index === 0 || index % 2 === 0;
            if (isIndex0OrEven) {
              return true;
            } return false;
          });
        }
        return scaleValue;
      } return {
        coordinates: [],
        value: [],
        shortCoordinates: [],
        shortValue: [],
      };
    }

    static calculateThumbDistance(options: DistanceOptions): number {
      const { coordinateStart, coordinateMove } = options;
      return coordinateMove - coordinateStart;
    }

    static calculateFromValueToCoordinates(options: FromValueToCoordinate): number {
      const {
        value, min, max, trackSize,
      } = options;
      const unit = trackSize / (max - min);
      const rem = 0.077;
      return Number((((value - min) * unit) * rem).toFixed(2));
    }

    static calculateCoordinatesOfMiddle(options: CoordinateOfMiddleOptions): number {
      const { start, itemSize } = options;
      return start + itemSize / 2;
    }

    static validateValue(options: ValidationOptions):
     number | undefined {
      const {
        value, min, max,
      } = options;

      if (value) {
        if (value > max) {
          return max;
        }
        if (value < min) {
          return min;
        }
      }
      return value;
    }
}

export default Presenter;
