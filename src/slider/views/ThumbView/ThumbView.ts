import {
  DistanceOptions, ThumbPositionsOptions, ChangeZIndexOptions, SliderElementOptions,
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
  public $thumbElement: JQuery<HTMLElement>;

  public $thumbElementMin: JQuery<HTMLElement>;

  public $thumbElementMax: JQuery<HTMLElement>;

  public thumbCoordinateMin: number;

  public thumbCoordinateMax: number;

  private thumbCoordinate: number;

  public size: number;

  public distance: number;

  private fraction: number;

  private readonly settings: SliderElementOptions;

  private isValidValue: boolean;

  constructor(settings: SliderElementOptions) {
    super();
    this.settings = settings;
    this.getThumbSize();
  }

  public createThumb(trackSize: number): void {
    const {
      isRange, isVertical, min, max, value, valueMin, valueMax, $element,
    } = this.settings;

    if (isRange) {
      this.thumbCoordinateMin = this.getThumbCoordinate(
        { value: valueMin || min, trackSize },
      );

      this.thumbCoordinateMax = this.getThumbCoordinate(
        { value: valueMax || max, trackSize },
      );

      this.$thumbElementMin = isVertical
        ? $element.find('.js-slider__thumb').addClass('slider__thumb_type_min js-slider__thumb_type_min slider__thumb_type_vertical js-slider__thumb_type_vertical')
        : $element.find('.js-slider__thumb').addClass('slider__thumb_type_min js-slider__thumb_type_min');
      this.$thumbElementMax = $('<div class="slider__thumb js-slider__thumb slider__thumb_type_max js-slider__thumb_type_max"></div>')
        .appendTo($element);
    } else {
      this.thumbCoordinate = this.getThumbCoordinate(
        { value: value || min, trackSize },
      );
      this.$thumbElement = $element.find('.js-slider__thumb');
    }

    if (isVertical) {
      this.makeVertical();
    } else if (isRange) {
      this.$thumbElementMin.css({
        left: `${this.thumbCoordinateMin}px`,
        zIndex: this.thumbCoordinateMin > (trackSize / 2) ? 100 : 50,
      });

      this.$thumbElementMax.css({
        left: `${this.thumbCoordinateMax}px`,
        zIndex: this.thumbCoordinateMax > (trackSize / 2) ? 50 : 100,
      });
    } else {
      this.$thumbElement.css({
        left: `${this.thumbCoordinate}px`,
      });
    }

    if (!isVertical) {
      $element.css({ width: '100%' });
    }
  }

  public setThumbPosition(options: ThumbPositionsOptions): void {
    const {
      thumbElement, shift, trackSize, coordinateStart, coordinateMove,
    } = options;
    const {
      isVertical, step, isRange, min, max,
    } = this.settings;
    if ((coordinateStart || coordinateStart === 0) && coordinateMove) {
      this.calculateDistance({ coordinateStart, coordinateMove });
    }
    const distance = (coordinateStart || coordinateStart === 0) ? this.distance + shift : shift;

    const currentValue: number = min + (max - min) * (distance / trackSize);
    if (isRange) {
      const thumbType = $(thumbElement).hasClass('js-slider__thumb_type_min') ? 'min' : 'max';
      this.notifyAll({ value: { value: currentValue, type: thumbType }, type: 'validateValue' });
    } else {
      this.notifyAll({ value: { value: currentValue }, type: 'validateValue' });
    }

    const key = isVertical ? 'top' : 'left';
    if (this.isValidValue) {
      if (step) {
        this.notifyAll({
          value: {
            trackSize, element: thumbElement, value: currentValue,
          },
          type: 'setStepThumb',
        });
      } else {
        thumbElement.style[key] = `${distance}px`;
      }
    }

    this.correctThumbPosition({
      element: thumbElement, trackSize, distance, key,
    });
  }

  public setValueState(isValidValue: boolean): void {
    this.isValidValue = isValidValue;
  }

  public changeZIndex(options: ChangeZIndexOptions): void {
    const { isVertical, $element } = this.settings;
    const { thumbElement, trackSize } = options;

    const coordinateOfMiddle = this.getCoordinatesOfMiddle(trackSize);
    const isLessMiddle = (isVertical && thumbElement.getBoundingClientRect().top
      + window.scrollY < coordinateOfMiddle)
      || (!isVertical && thumbElement.getBoundingClientRect().left < coordinateOfMiddle);
    const labelElementMin = $element.find('.js-slider__label_type_min');
    const labelElementMax = $element.find('.js-slider__label_type_max');

    const $minElement = $element.find('.js-slider__thumb_type_min');
    const $maxElement = $element.find('.js-slider__thumb_type_max');
    if (isLessMiddle) {
      $maxElement.css({ zIndex: '200' });
      $minElement.css({ zIndex: '100' });
      if (labelElementMin && labelElementMax) {
        labelElementMax.css({ zIndex: '200' });
        labelElementMin.css({ zIndex: '100' });
      }
    } else {
      $maxElement.css({ zIndex: '100' });
      $minElement.css({ zIndex: '200' });
      if (labelElementMin && labelElementMax) {
        labelElementMax.css({ zIndex: '100' });
        labelElementMin.css({ zIndex: '200' });
      }
    }
  }

  public getFractionOfValue(fraction: number): void {
    this.fraction = fraction;
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
      return distance < parseInt(this.$thumbElementMax.css(key), 10);
    }
    return distance > parseInt(this.$thumbElementMin.css(key), 10);
  }

  private correctThumbPosition(options: CorrectPositionOptions): null {
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

  private getThumbCoordinate(options: ThumbCoordinateOptions): number {
    const { value, trackSize } = options;

    this.notifyAll({ value, type: 'getFractionOfValue' });
    return this.fraction * trackSize;
  }

  private getThumbSize(): void {
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
      this.$thumbElementMin.css({
        top: `${this.thumbCoordinateMin}px`,
        zIndex: (this.thumbCoordinateMin) < (trackWidth / 2) ? 50 : 200,
      });
      this.$thumbElementMax.css({
        top: `${this.thumbCoordinateMax}px`,
        zIndex: this.thumbCoordinateMax < (trackWidth / 2) ? 200 : 50,
      });
    } else {
      this.$thumbElement.css({
        top: `${this.thumbCoordinate || 0}px`,
      });
    }
  }
}

export default ThumbView;
