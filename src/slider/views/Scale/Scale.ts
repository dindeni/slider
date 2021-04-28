import { ScaleData, SliderElementOptions } from '../../../types/types';
import Observable from '../../Observable/Observable';

class Scale extends Observable {
  private data: Pick<ScaleData, 'values' | 'coordinates'> = {
    values: [], coordinates: [],
  };

  private trackSize: number;

  private readonly settings: SliderElementOptions;

  constructor(settings: SliderElementOptions) {
    super();
    this.settings = settings;
  }

  public createElements(trackSize: number): void {
    const { $element, isVertical, withScale } = this.settings;

    this.generateCoordinates(trackSize);
    const $ul = $('<ul class="slider__scale"></ul>').appendTo($element);
    if (withScale) {
      this.data.values.map((item, index) => {
        const $itemElement = $(`<li class="slider__scale-item js-slider__scale-item">${item}</li>`).appendTo($ul);

        const verticalCorrection = 7;
        return isVertical
          ? $itemElement.css({ top: `${(this.data.coordinates[index]) - verticalCorrection}px` })
          : $itemElement.css({ left: `${this.data.coordinates[index]}px` });
      });
    }

    this.trackSize = trackSize;
  }

  public setValues(values: number[]): void {
    this.data.values = values;
  }

  private generateCoordinates(trackSize: number): void {
    const { max, min } = this.settings;

    const step = this.settings.step || 1;
    this.data.coordinates = [];
    this.data.values = [];
    let currentValue = min;
    const arrayLength = Math.round((max - min) / step);
    const listLength = arrayLength < 7 ? arrayLength : 7;

    [...Array(listLength + 1)].forEach((_value, index, array) => {
      if (index === array.length - 1) {
        this.data.coordinates.push(trackSize);
        this.data.values.push(max);
        return;
      }
      const value = Math.round(((max - min) / listLength) / step) * step;
      const coordinatesItems = ((currentValue / (max - min)) * trackSize);
      this.data.coordinates.push(Number(coordinatesItems.toFixed(2)));
      this.data.values.push(Number(currentValue.toFixed(2)));
      currentValue += value;
    });
  }
}

export default Scale;
