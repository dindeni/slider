import { ScaleData, SetStepThumbOptions, SliderElementOptions } from '../../../types/types';
import Observable from '../../Observable/Observable';

class ScaleView extends Observable {
  settings: SliderElementOptions;

  value: number;

  public data: ScaleData = {
    value: [], coordinates: [], shortValue: [], shortCoordinates: [],
  };

  constructor(settings: SliderElementOptions) {
    super();
    this.settings = settings;
  }

  public create(trackSize: number): void {
    const { $element, isVertical } = this.settings;

    this.generateCoordinates(trackSize);

    const $ul = $('<ul class="slider__scale"></ul>').appendTo($element);
    this.data.shortValue.map((item, index) => {
      const $itemElement = $(`<li class="slider__scale-item js-slider__scale-item">${item}</li>`).appendTo($ul);

      const verticalCorrection = 7;
      return isVertical
        ? $itemElement.css({ top: `${(this.data.shortCoordinates[index]) - verticalCorrection}px` })
        : $itemElement.css({ left: `${this.data.shortCoordinates[index]}px` });
    });
  }

  public setPosition(options: SetStepThumbOptions): void {
    const { trackSize, element, value } = options;

    if (this.data.coordinates.length === 0) {
      this.generateCoordinates(trackSize);
    }
    this.notifyAll({ value, type: 'validateStepValue' });
    const getIndex = (): number => this.data.value.findIndex(
      (scaleValue) => scaleValue === this.value,
    );

    const key = this.settings.isVertical ? 'top' : 'left';
    element.style[key] = `${this.data.coordinates[getIndex()].toString()}px`;
  }

  private generateCoordinates(trackSize: number): void {
    const { max, min, step } = this.settings;

    this.data.coordinates = [];
    this.data.value = [];

    if (step) {
      let count = 0;
      const arrayLength = Math.round((max - min) / step) + 1;
      [...Array(arrayLength)].map(() => {
        const fractionOfValue = count / (max - min);
        const coordinatesItems = Number((fractionOfValue * trackSize).toFixed(2));
        this.data.value.push(count + min);
        this.data.coordinates.push(coordinatesItems);
        count += step;
        return count;
      });

      const isLastCoordinate = this.data.coordinates[
        this.data.coordinates.length - 1] !== trackSize;
      if (isLastCoordinate) {
        this.data.coordinates.pop();
        this.data.coordinates.push(trackSize);
        this.data.value.pop();
        this.data.value.push(max);
      }
    }
    this.checkData();
  }

  private checkData(): void {
    const { coordinates, value } = this.data;
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
    this.data.shortValue = shortValue;
    this.data.shortCoordinates = shortCoordinates;
  }
}

export default ScaleView;
