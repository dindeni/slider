import {
  DistanceOptions, ThumbPositionsOptions, ChangeZIndexOptions, SliderElementOptions,
  SetStepThumbOptions,
} from '../../../types/types';
import Observable from '../../Observable/Observable';

interface ThumbCoordinateOptions {
  value: number;
  trackSize: number;
}

interface CorrectPositionOptions {
  element: HTMLElement;
  distance: number;
  key: 'top' | 'left';
  trackSize: number;
}

type CheckRangePositionOptions = Omit<CorrectPositionOptions, 'trackSize'>;

class ThumbView extends Observable {
  public size: number;

  private $element: JQuery<HTMLElement>;

  private $elementMin: JQuery<HTMLElement>;

  private $elementMax: JQuery<HTMLElement>;

  private coordinateMin: number;

  private coordinateMax: number;

  private coordinate: number;

  private distance: number;

  private fraction: number;

  private readonly settings: SliderElementOptions;

  private isValidValue: boolean;

  constructor(settings: SliderElementOptions) {
    super();
    this.settings = settings;
    this.getSize();
  }

  public create(trackSize: number): void {
    const {
      isRange, isVertical, min, max, value, valueMin, valueMax, $element,
    } = this.settings;

    if (isRange) {
      this.coordinateMin = this.getCoordinate(
        { value: valueMin || min, trackSize },
      );
      this.coordinateMax = this.getCoordinate(
        { value: valueMax || max, trackSize },
      );

      this.$elementMin = isVertical
        ? $element.find('.js-slider__thumb').addClass('slider__thumb_type_min js-slider__thumb_type_min slider__thumb_type_vertical js-slider__thumb_type_vertical')
        : $element.find('.js-slider__thumb').addClass('slider__thumb_type_min js-slider__thumb_type_min');
      this.$elementMax = $('<div class="slider__thumb js-slider__thumb slider__thumb_type_max js-slider__thumb_type_max"></div>')
        .appendTo($element);
    } else {
      this.coordinate = this.getCoordinate(
        { value: value || min, trackSize },
      );
      this.$element = $element.find('.js-slider__thumb');
    }

    if (isVertical) {
      this.makeVertical();
    } else {
      this.setPosition(trackSize);
    }
  }

  public updatePosition(options: ThumbPositionsOptions): void {
    const {
      thumbElement, shift, trackSize, coordinateStart, coordinateMove,
    } = options;
    const {
      isVertical, step, min, max,
    } = this.settings;

    if ((coordinateStart || coordinateStart === 0) && coordinateMove) {
      this.calculateDistance({ coordinateStart, coordinateMove });
    }
    const distance = (coordinateStart || coordinateStart === 0) ? this.distance + shift : shift;

    const currentValue: number = min + (max - min) * (distance / trackSize);
    this.callNotifiers({ element: thumbElement, value: currentValue, trackSize });

    const key = isVertical ? 'top' : 'left';
    const isValidValueAndNotStep = this.isValidValue && !step;
    if (isValidValueAndNotStep) {
      thumbElement.style[key] = `${distance}px`;
    }

    this.correctPosition({
      element: thumbElement, trackSize, distance, key,
    });
    this.changeZIndex({ thumbElement, trackSize });
  }

  public setIsValidValue(isValidValue: boolean): void {
    this.isValidValue = isValidValue;
  }

  public changeZIndex(options: ChangeZIndexOptions): void {
    const { isVertical } = this.settings;
    const { thumbElement, trackSize } = options;

    const coordinateOfMiddle = this.getCoordinatesOfMiddle(trackSize);
    const isLessMiddle = (isVertical && thumbElement.getBoundingClientRect().top
      + window.scrollY < coordinateOfMiddle)
      || (!isVertical && thumbElement.getBoundingClientRect().left < coordinateOfMiddle);

    if (isLessMiddle) {
      this.$elementMax.css({ zIndex: '200' });
      this.$elementMin.css({ zIndex: '100' });
    } else {
      this.$elementMax.css({ zIndex: '100' });
      this.$elementMin.css({ zIndex: '200' });
    }
  }

  public getFractionOfValue(fraction: number): void {
    this.fraction = fraction;
  }

  private callNotifiers(options: SetStepThumbOptions): void {
    const { isRange, step } = this.settings;
    const { element, value, trackSize } = options;

    if (isRange) {
      const thumbType = $(element).hasClass('js-slider__thumb_type_min') ? 'min' : 'max';
      this.notifyAll({ value: { value, type: thumbType }, type: 'validateValue' });
    } else {
      this.notifyAll({ value: { value }, type: 'validateValue' });
    }

    const isStepAndValidValue = this.isValidValue && step;
    if (isStepAndValidValue) {
      this.notifyAll({
        value: {
          trackSize, element, value,
        },
        type: 'setStepThumb',
      });
    }
  }

  private setPosition(trackSize: number): void {
    const { isRange } = this.settings;

    if (isRange) {
      this.$elementMin.css({
        left: `${this.coordinateMin}px`,
        zIndex: this.coordinateMin > (trackSize / 2) ? 200 : 100,
      });

      this.$elementMax.css({
        left: `${this.coordinateMax}px`,
        zIndex: this.coordinateMax > (trackSize / 2) ? 100 : 200,
      });
    } else {
      this.$element.css({
        left: `${this.coordinate}px`,
      });
    }
  }

  private getCoordinatesOfMiddle(itemSize: number): number {
    const { isVertical, $element } = this.settings;
    const key = isVertical ? 'top' : 'left';
    const startPosition = $element.find('.js-slider__track')[0].getBoundingClientRect()[key];
    return startPosition + (itemSize / 2);
  }

  private checkRangePosition(options: CheckRangePositionOptions): boolean {
    const { element, distance, key } = options;

    if (!this.settings.isRange) {
      return true;
    }
    if (element.classList.contains('js-slider__thumb_type_min')) {
      return distance < parseInt(this.$elementMax.css(key), 10);
    }
    return distance > parseInt(this.$elementMin.css(key), 10);
  }

  private correctPosition(options: CorrectPositionOptions): null {
    const {
      element, distance, key, trackSize,
    } = options;

    const isValidDistance = this.checkRangePosition({ element, distance, key });
    if (!isValidDistance) {
      return null;
    }
    if (distance > trackSize) {
      element.style[key] = `${trackSize}px`;
    } else if (distance < 0) {
      element.style[key] = '0px';
    }
    return null;
  }

  private getCoordinate(options: ThumbCoordinateOptions): number {
    const { value, trackSize } = options;

    this.notifyAll({ value, type: 'getFractionOfValue' });
    return this.fraction * trackSize;
  }

  private getSize(): void {
    const $thumb = this.settings.$element.find('.slider__thumb');
    this.size = $thumb.width() || 0;
  }

  private calculateDistance(options: DistanceOptions): void {
    const { coordinateStart, coordinateMove } = options;
    this.distance = coordinateMove - coordinateStart;
  }

  private makeVertical(): void {
    const { $element, isRange } = this.settings;

    const $trackElement = $element.find('.js-slider__track');
    const trackWidth: number | undefined = $trackElement.width() || 0;
    if (isRange) {
      this.$elementMin.css({
        top: `${this.coordinateMin}px`,
        zIndex: (this.coordinateMin) < (trackWidth / 2) ? 100 : 200,
      });
      this.$elementMax.css({
        top: `${this.coordinateMax}px`,
        zIndex: this.coordinateMax < (trackWidth / 2) ? 200 : 100,
      });
    } else {
      this.$element.css({
        top: `${this.coordinate || 0}px`,
      });
    }
  }
}

export default ThumbView;
