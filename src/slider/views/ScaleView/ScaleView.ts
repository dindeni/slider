import { ScaleData, SliderElementOptions, ValueAndType } from '../../../types/types';
import Observable from '../../Observable/Observable';

class ScaleView extends Observable {
  private data: ScaleData = {
    values: [], coordinates: [], shortValues: [], shortCoordinates: [],
  };

  private $element: JQuery<HTMLElement>;

  private $elementMin: JQuery<HTMLElement>;

  private $elementMax: JQuery<HTMLElement>;

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
      this.data.shortValues.map((item, index) => {
        const $itemElement = $(`<li class="slider__scale-item js-slider__scale-item">${item}</li>`).appendTo($ul);

        const verticalCorrection = 7;
        return isVertical
          ? $itemElement.css({ top: `${(this.data.shortCoordinates[index]) - verticalCorrection}px` })
          : $itemElement.css({ left: `${this.data.shortCoordinates[index]}px` });
      });
    }

    this.trackSize = trackSize;
    this.initializeElements();
  }

  public update(options: ValueAndType): void {
    const { value, type } = options;

    if (this.data.coordinates.length === 0) {
      this.generateCoordinates(this.trackSize);
    }
    const getIndex = (): number => this.data.values.findIndex(
      (scaleValue) => scaleValue === value,
    );

    const key = this.settings.isVertical ? 'top' : 'left';
    const element = this.getCurrentElement(type)[0];
    const index = getIndex();
    if (index !== -1) {
      element.style[key] = `${this.data.coordinates[index].toString()}px`;
    }
  }

  public setValues(values: number[]): void {
    this.data.values = values;
  }

  private getCurrentElement(type?: 'min' | 'max'): JQuery<HTMLElement> {
    if (type) {
      return type === 'min' ? this.$elementMin : this.$elementMax;
    }
    return this.$element;
  }

  private initializeElements(): void {
    const { $element, isRange } = this.settings;

    if (isRange) {
      this.$elementMin = $element.find('.js-slider__thumb_type_min');
      this.$elementMax = $element.find('.js-slider__thumb_type_max');
    }
    this.$element = $element.find('.js-slider__thumb');
  }

  private generateCoordinates(trackSize: number): void {
    const { max, min, step } = this.settings;

    this.data.coordinates = [];

    if (step) {
      let count = 0;
      const arrayLength = Math.round((max - min) / step) + 1;
      [...Array(arrayLength)].map(() => {
        const fractionOfValue = count / (max - min);
        const coordinatesItems = Number((fractionOfValue * trackSize).toFixed(2));
        this.data.coordinates.push(coordinatesItems);
        count = parseFloat((count + step).toFixed(10));
        return count;
      });

      const isLastCoordinate = this.data.coordinates[
        this.data.coordinates.length - 1] !== trackSize;
      if (isLastCoordinate) {
        this.data.coordinates.pop();
        this.data.coordinates.push(trackSize);
      }
    }
    this.checkData();
  }

  private checkData(): void {
    const { coordinates, values } = this.data;
    let shortValue = values;
    let shortCoordinates = coordinates;

    while (shortValue.length > 10) {
      shortValue = shortValue.filter(
        (_currentValue, index) => index === 0 || index % 2 === 0,
      );
    }

    while (shortCoordinates.length > 10) {
      shortCoordinates = shortCoordinates.filter(
        (_currentValue, index) => index === 0 || index % 2 === 0,
      );
    }
    this.data.shortValues = shortValue;
    this.data.shortCoordinates = shortCoordinates;
  }
}

export default ScaleView;
