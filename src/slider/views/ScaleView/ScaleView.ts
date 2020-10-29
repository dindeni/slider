import { ScaleData, SetStepThumbOptions, SliderElementOptions } from '../../../types/types';
import Observable from '../../Observable/Observable';

class ScaleView extends Observable {
  settings: SliderElementOptions;

  value: number;

  public scaleData: ScaleData = {
    value: [], coordinates: [], shortValue: [], shortCoordinates: [],
  };

  constructor(settings: SliderElementOptions) {
    super();
    this.settings = settings;
  }

  public createScale(trackSize: number): void {
    const { $element, isVertical } = this.settings;

    this.generateStepCoordinate(trackSize);

    const $ul = $('<ul class="slider__scale"></ul>').appendTo($element);
    this.scaleData.shortValue.map((item, index) => {
      const $itemElement = $(`<li class="slider__scale-item js-slider__scale-item">${item}</li>`).appendTo($ul);

      const verticalCorrection = 7;
      return isVertical
        ? $itemElement.css({ top: `${(this.scaleData.shortCoordinates[index]) - verticalCorrection}px` })
        : $itemElement.css({ left: `${this.scaleData.shortCoordinates[index]}px` });
    });
  }

  public setPosition(options: SetStepThumbOptions): void {
    const { trackSize, element, value } = options;

    if (this.scaleData.coordinates.length === 0) {
      this.generateStepCoordinate(trackSize);
    }
    this.notifyAll({ value, type: 'validateStepValue' });
    const getIndex = (): number => this.scaleData.value.findIndex(
      (scaleValue) => scaleValue === this.value,
    );

    const key = this.settings.isVertical ? 'top' : 'left';
    element.style[key] = `${this.scaleData.coordinates[getIndex()].toString()}px`;
  }

  private generateStepCoordinate(trackSize: number): void {
    const { max, min, step } = this.settings;

    this.scaleData.coordinates = [];
    this.scaleData.value = [];

    if (step) {
      let stepCount = 0;
      const arrayLength = Math.round((max - min) / step) + 1;
      [...Array(arrayLength)].map(() => {
        const fractionOfValue = stepCount / (max - min);
        const coordinatesItems = Number((fractionOfValue * trackSize).toFixed(2));
        this.scaleData.value.push(stepCount + min);
        this.scaleData.coordinates.push(coordinatesItems);
        stepCount += step;
        return stepCount;
      });

      const isLastCoordinate = this.scaleData.coordinates[
        this.scaleData.coordinates.length - 1] !== trackSize;
      if (isLastCoordinate) {
        this.scaleData.coordinates.pop();
        this.scaleData.coordinates.push(trackSize);
        this.scaleData.value.pop();
        this.scaleData.value.push(max);
      }
    }
    this.checkStepData();
  }

  private checkStepData(): void {
    const { coordinates, value } = this.scaleData;
    let shortValue = value;
    let shortCoordinates = coordinates;

    while (shortValue.length > 10) {
      shortValue = shortValue.filter(
        (currentValue, index) => index === 0 || index % 2 === 0,
      );
    }

    while (shortCoordinates.length > 10) {
      shortCoordinates = shortCoordinates.filter(
        (currentValue, index) => index === 0 || index % 2 === 0,
      );
    }
    this.scaleData.shortValue = shortValue;
    this.scaleData.shortCoordinates = shortCoordinates;
  }
}

export default ScaleView;
