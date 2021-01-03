import autoBind from 'auto-bind';

import {
  DistanceOptions, ThumbPositionsOptions, SliderElementOptions, ValueAndType,
} from '../../../types/types';
import Observable from '../../Observable/Observable';
import EventTypes from '../../constants';

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

  public createElements(): void {
    const { isRange, $element } = this.settings;

    const classes = ['slider__thumb', 'js-slider__thumb'];
    if (isRange) {
      this.$elementMin = $('<div></div>')
        .addClass(`${classes.join(' ')} ${classes.join('_type_min ')}_type_min`);
      this.$elementMax = $('<div></div>')
        .addClass(`${classes.join(' ')} ${classes.join('_type_max ')}_type_max`);
      this.$elementMin.appendTo($element);
      this.$elementMax.appendTo($element);
    } else {
      this.$element = $('<div></div>').addClass(classes.join(' '));
      this.$element.appendTo($element);
    }
    this.addEvents();
  }

  public update(options: ValueAndType): void {
    const { step } = this.settings;
    const { value, type } = options;

    const isValueNotStep = (data?: number | null): data is number => data !== undefined && !step;
    if (isValueNotStep(value)) {
      this.setCurrentElement(type);
      this.setPosition(this.getThumbCoordinate(value));
    }
  }

  public setFractionOfValue(fraction: number): void {
    this.fraction = fraction;
  }

  public setStartPosition(trackSize: number): void {
    const {
      isRange, isVertical, valueMin, valueMax, value,
    } = this.settings;
    this.trackSize = trackSize;

    const key = isVertical ? 'top' : 'left';
    if (isRange) {
      this.coordinateMin = this.getThumbCoordinate(valueMin);
      this.$elementMin.css({ [key]: `${this.coordinateMin}px` });
      this.changeZIndex(this.$elementMin[0]);
      this.coordinateMax = this.getThumbCoordinate(valueMax);
      this.$elementMax.css({ [key]: `${this.coordinateMax}px` });
      this.changeZIndex(this.$elementMax[0]);
    } else {
      this.coordinate = this.getThumbCoordinate(value);
      this.$element.css({ [key]: `${this.coordinate}px` });
    }
  }

  private setPosition(coordinate: number): void {
    const { isRange, isVertical } = this.settings;
    if (this.previousCoordinate !== coordinate && this.currentElement) {
      const key = isVertical ? 'top' : 'left';
      this.currentElement.style[key] = `${coordinate}px`;
      this.previousCoordinate = coordinate;

      if (isRange) {
        this.changeZIndex(this.currentElement);
      }
    }
  }

  private setCurrentElement(type?: 'min' | 'max'): void {
    if (this.settings.isRange) {
      [this.currentElement] = type === 'min' ? this.$elementMin : this.$elementMax;
    } else {
      [this.currentElement] = this.$element;
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

  private validateCurrentValue(options: ThumbPositionsOptions): void {
    const {
      thumbElement, shift, coordinateStart, coordinateMove,
    } = options;
    const { isRange, min, max } = this.settings;

    if ((coordinateStart || coordinateStart === 0) && coordinateMove) {
      this.setDistance({ coordinateStart, coordinateMove });
    }
    const distance = (coordinateStart || coordinateStart === 0) ? this.distance + shift : shift;

    const currentValue: number = (min + (max - min) * (distance / this.trackSize));

    if (isRange) {
      const thumbType = $(thumbElement).hasClass('js-slider__thumb_type_min') ? 'min' : 'max';
      this.notifyAll({
        value:
          { value: currentValue, type: thumbType },
        type: EventTypes.VALIDATE_VALUE,
      });
    } else {
      this.notifyAll({ value: { value: currentValue }, type: EventTypes.VALIDATE_VALUE });
    }
  }

  private getCoordinatesOfMiddle(): number {
    const { isVertical, $element } = this.settings;
    const key = isVertical ? 'top' : 'left';
    const startPosition = $element.find('.js-slider__track')[0].getBoundingClientRect()[key];
    return startPosition + (this.trackSize / 2);
  }

  private getThumbCoordinate(value?: number): number {
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

    const thumbElements = Array.from($element[0].querySelectorAll('.js-slider__thumb'));
    thumbElements.map((thumbElement: HTMLElement): void => thumbElement
      .addEventListener('mousedown', this.handleThumbElementMousedown));
  }

  private handleDocumentMousemove(event: MouseEvent): void {
    event.preventDefault();
    const { isVertical } = this.settings;
    const coordinateStart = isVertical ? this.coordinateYStart : this.coordinateXStart;
    const coordinateMove = isVertical ? event.clientY : event.clientX;
    this.distance = coordinateMove - coordinateStart;

    if (this.currentElement) {
      this.validateCurrentValue({
        thumbElement: this.currentElement,
        shift: this.shift,
        trackSize: this.trackSize,
        coordinateStart,
        coordinateMove,
      });
    }
  }

  private handleThumbElementMousedown(event: MouseEvent): void {
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
