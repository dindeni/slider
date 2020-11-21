import autoBind from 'auto-bind';

import {
  DistanceOptions, ThumbPositionsOptions, SliderElementOptions, ThumbValueOptions,
} from '../../../types/types';
import Observable from '../../Observable/Observable';
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

  private isValidValue: boolean;

  private coordinateXStart: number;

  private coordinateYStart: number;

  private shift: number;

  private currentElement: HTMLElement | null;

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

  public updatePosition(options: ThumbPositionsOptions): void {
    const {
      thumbElement, shift, coordinateStart, coordinateMove,
    } = options;
    const {
      isVertical, step, min, max, isRange,
    } = this.settings;

    if ((coordinateStart || coordinateStart === 0) && coordinateMove) {
      this.setDistance({ coordinateStart, coordinateMove });
    }
    const distance = (coordinateStart || coordinateStart === 0) ? this.distance + shift : shift;

    const currentValue: number = min + (max - min) * (distance / this.trackSize);
    this.callNotifiers({ element: thumbElement, value: currentValue });

    const key = isVertical ? 'top' : 'left';
    const isValidValueAndNotStep = this.isValidValue && !step;
    if (isValidValueAndNotStep) {
      thumbElement.style[key] = `${distance}px`;
      this.notifyLabel({ value: Math.round(currentValue), element: thumbElement });
    }

    this.correctPosition({ element: thumbElement, distance, key });
    if (isRange) {
      this.changeZIndex(thumbElement);
    }
  }

  public setIsValidValue(isValidValue: boolean): void {
    this.isValidValue = isValidValue;
  }

  public changeZIndex(element: HTMLElement): void {
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
      isRange, min, max, valueMin, valueMax, value,
    } = this.settings;
    this.trackSize = trackSize;

    if (isRange) {
      this.coordinateMin = this.getCoordinate(valueMin || min);
      this.updatePosition(
        { thumbElement: this.$elementMin[0], trackSize, shift: this.coordinateMin },
      );
      this.coordinateMax = this.getCoordinate(valueMax || max);
      this.updatePosition(
        { thumbElement: this.$elementMax[0], trackSize, shift: this.coordinateMax },
      );
    } else {
      this.coordinate = this.getCoordinate(value || min);
      this.updatePosition({ thumbElement: this.$element[0], trackSize, shift: this.coordinate });
    }
  }

  private callNotifiers(options: Omit<ThumbValueOptions, 'trackSize'>): void {
    const { isRange, step } = this.settings;
    const { element, value } = options;

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
          trackSize: this.trackSize, element, value,
        },
        type: 'setStepThumb',
      });
    }
  }

  private notifyLabel(options: Omit<ThumbValueOptions, 'trackSize'>): void {
    const { value, element } = options;

    this.notifyAll({ value: { thumbElement: element, value }, type: 'updateLabelValue' });
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
    const { min, max } = this.settings;

    const isValidDistance = this.checkRangePosition({ element, distance, key });
    if (!isValidDistance) {
      return null;
    }
    if (distance > this.trackSize) {
      element.style[key] = `${this.trackSize}px`;
      this.notifyLabel({ value: max, element });
    } else if (distance < 0) {
      element.style[key] = '0px';
      this.notifyLabel({ value: min, element });
    }
    return null;
  }

  private getCoordinate(value: number): number {
    this.notifyAll({ value, type: 'notifyAboutValueChange' });
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
      this.updatePosition({
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
