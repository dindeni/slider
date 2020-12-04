import autoBind from 'auto-bind';

import {
  DistanceOptions, ThumbPositionsOptions, SliderElementOptions,
} from '../../../types/types';
import Observable from '../../Observable/Observable';
import EventTypes from '../../constants';
import CLASSES_COMMON from './constants';

interface CorrectPositionOptions {
  element: HTMLElement;
  distance: number;
  key: 'top' | 'left';
}

type CheckRangePositionOptions = Omit<CorrectPositionOptions, 'trackSize' | 'value'>;

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

  private coordinateXStart: number;

  private coordinateYStart: number;

  private shift: number;

  private currentElement: HTMLElement | null;

  private previousCoordinate: number;

  private trackSize: number;

  constructor(settings: SliderElementOptions) {
    super();
    this.settings = settings;
    this.setSize();
    autoBind(this);
  }

  public create(): void {
    const { isRange, $element } = this.settings;

    if (isRange) {
      this.$elementMin = $('<div></div>')
        .addClass(`${CLASSES_COMMON.join(' ')} ${CLASSES_COMMON.join('_type_min ')}_type_min`);
      this.$elementMax = $('<div></div>')
        .addClass(`${CLASSES_COMMON.join(' ')} ${CLASSES_COMMON.join('_type_max ')}_type_max`);
      this.$elementMin.appendTo($element);
      this.$elementMax.appendTo($element);
    } else {
      this.$element = $('<div></div>').addClass(CLASSES_COMMON.join(' '));
      this.$element.appendTo($element);
    }
    this.addEvents();
  }

  public update(): void {
    const { step } = this.settings;

    if (!step) {
      const coordinate = this.distance + this.shift;
      this.setPosition(coordinate);
    }
  }

  private setPosition(coordinate: number): void {
    const { isRange, isVertical } = this.settings;

    if (this.previousCoordinate !== coordinate && this.currentElement) {
      const key = isVertical ? 'top' : 'left';
      this.currentElement.style[key] = `${coordinate}px`;
      this.correctPosition({ element: this.currentElement, distance: coordinate, key });
      this.previousCoordinate = coordinate;

      if (isRange) {
        this.changeZIndex(this.currentElement);
      }
    }
  }

  private changeZIndex(element: HTMLElement): void {
    const { isVertical } = this.settings;

    const coordinateOfMiddle = this.getCoordinatesOfMiddle();
    const isLessMiddle = (isVertical && element.getBoundingClientRect().top
      + window.scrollY < coordinateOfMiddle)
      || (!isVertical && element.getBoundingClientRect().left < coordinateOfMiddle);

    if (isLessMiddle) {
      this.$elementMax.css({ zIndex: '200' });
      this.$elementMin.css({ zIndex: '100' });
    } else {
      this.$elementMax.css({ zIndex: '100' });
      this.$elementMin.css({ zIndex: '200' });
    }
  }

  public setFractionOfValue(fraction: number): void {
    this.fraction = fraction;
  }

  public setStartPosition(trackSize: number): void {
    const {
      isRange, isVertical, min, max, valueMin, valueMax, value,
    } = this.settings;
    this.trackSize = trackSize;

    const key = isVertical ? 'top' : 'left';
    if (isRange) {
      this.coordinateMin = this.getCoordinate(valueMin || min);
      this.$elementMin.css({ [key]: `${this.coordinateMin}px` });
      this.coordinateMax = this.getCoordinate(valueMax || max);
      this.$elementMax.css({ [key]: `${this.coordinateMax}px` });
    } else {
      this.coordinate = this.getCoordinate(value || min);
      this.$element.css({ [key]: `${this.coordinate}px` });
    }
  }

  private validate(options: ThumbPositionsOptions): void {
    const {
      thumbElement, shift, coordinateStart, coordinateMove,
    } = options;
    const { isRange, min, max } = this.settings;
    const { VALIDATE } = EventTypes;

    if ((coordinateStart || coordinateStart === 0) && coordinateMove) {
      this.setDistance({ coordinateStart, coordinateMove });
    }
    const distance = (coordinateStart || coordinateStart === 0) ? this.distance + shift : shift;

    const currentValue: number = Math.round(min + (max - min) * (distance / this.trackSize));

    if (isRange) {
      const thumbType = $(thumbElement).hasClass('js-slider__thumb_type_min') ? 'min' : 'max';
      this.notifyAll({ value: { value: currentValue, type: thumbType }, type: VALIDATE });
    } else {
      this.notifyAll({ value: { value: currentValue }, type: VALIDATE });
    }
  }

  private getCoordinatesOfMiddle(): number {
    const { isVertical, $element } = this.settings;
    const key = isVertical ? 'top' : 'left';
    const startPosition = $element.find('.js-slider__track')[0].getBoundingClientRect()[key];
    return startPosition + (this.trackSize / 2);
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
    const { element, distance, key } = options;

    const isValidDistance = this.checkRangePosition({ element, distance, key });
    if (!isValidDistance) {
      return null;
    }

    if (distance > this.trackSize) {
      element.style[key] = `${this.trackSize}px`;
    } else if (distance < 0) {
      element.style[key] = '0px';
    }
    return null;
  }

  private getCoordinate(value: number): number {
    this.notifyAll({ value, type: EventTypes.VALUE_CHANGE });
    return this.fraction * this.trackSize;
  }

  private setSize(): void {
    const $thumb = this.settings.$element.find('.slider__thumb');
    this.size = $thumb.width() || 0;
  }

  private setDistance(options: DistanceOptions): void {
    const { coordinateStart, coordinateMove } = options;
    this.distance = coordinateMove - coordinateStart;
  }

  private addEvents(): void {
    const { $element } = this.settings;

    const elementsCollection = Array.from($element[0].querySelectorAll('.js-slider__thumb'));
    elementsCollection.map((element: HTMLElement): void => element
      .addEventListener('mousedown', this.handleElementMousedown));
  }

  private handleDocumentMousemove(event: MouseEvent): void {
    event.preventDefault();
    const { isVertical } = this.settings;
    const coordinateStart = isVertical ? this.coordinateYStart : this.coordinateXStart;
    const coordinateMove = isVertical ? event.clientY : event.clientX;
    this.distance = coordinateMove - coordinateStart;

    if (this.currentElement) {
      this.validate({
        thumbElement: this.currentElement,
        shift: Math.round(this.shift),
        trackSize: this.trackSize,
        coordinateStart,
        coordinateMove,
      });
    }
  }

  private handleElementMousedown(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    const isTargetLabel = targetElement.classList.contains('js-slider__label');
    const isTargetThumbOrLabel = (isTargetLabel || targetElement.classList.contains('js-slider__thumb'));
    if (isTargetThumbOrLabel) {
      this.currentElement = isTargetLabel ? targetElement.parentElement : targetElement;

      const { isVertical } = this.settings;
      if (isVertical && this.currentElement) {
        this.coordinateYStart = event.clientY;
        this.shift = parseFloat(this.currentElement.style.top);
      } else if (this.currentElement) {
        this.coordinateXStart = event.clientX;
        this.shift = parseFloat(this.currentElement.style.left);
      }

      const handleDocumentMouseup = (): void => {
        document.removeEventListener('mousemove', this.handleDocumentMousemove);
        document.removeEventListener('mouseup', handleDocumentMouseup);
      };

      document.addEventListener('mousemove', this.handleDocumentMousemove);
      document.addEventListener('mouseup', handleDocumentMouseup);
    }
  }
}

export default ThumbView;
