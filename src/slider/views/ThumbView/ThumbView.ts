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
    const { isRange, $element, isVertical } = this.settings;

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
    if (isVertical) {
      $element.addClass('slider_type_vertical');
    } else $element.removeClass('slider_type_vertical');
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

    const isCurrentElementAndCoordinateChanged = (element: HTMLElement | null): element is
      HTMLElement => element !== undefined && this.previousCoordinate !== coordinate;
    const isCurrentElementAndCoordinateChangedAndIsRange = (element: HTMLElement | null): element is
      HTMLElement => isCurrentElementAndCoordinateChanged(element) && isRange;

    if (isCurrentElementAndCoordinateChangedAndIsRange(this.currentElement)) {
      this.changeZIndex(this.currentElement);
    }
    if (isCurrentElementAndCoordinateChanged(this.currentElement)) {
      const key = isVertical ? 'top' : 'left';
      this.currentElement.style[key] = `${coordinate}px`;
      this.previousCoordinate = coordinate;
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

    const key = isVertical ? 'top' : 'left';
    const isLessMiddle = parseFloat(element.style[key]) < (this.trackSize / 2);
    if (isLessMiddle) {
      this.$elementMax.css({ zIndex: '200' });
      this.$elementMin.css({ zIndex: '100' });
    } else {
      this.$elementMax.css({ zIndex: '100' });
      this.$elementMin.css({ zIndex: '200' });
    }
  }

  private validateCurrentValue(options: ThumbPositionsOptions): void {
    const { thumbElement, shift } = options;
    const { isRange, min, max } = this.settings;

    const isCoordinateStartAndMove = (data: ThumbPositionsOptions): data is ThumbPositionsOptions
      & { coordinateStart: number; coordinateMove: number } => (
      data.coordinateStart !== undefined && data.coordinateMove !== undefined
    );
    if (isCoordinateStartAndMove(options)) {
      const { coordinateStart, coordinateMove } = options;
      this.setDistance({ coordinateStart, coordinateMove });
    }
    const distance = typeof options.coordinateStart === 'number' ? this.distance + shift : shift;
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
      this.setCoordinateStart({ event, element: this.currentElement });

      const handleDocumentMouseup = (): void => {
        document.removeEventListener('mousemove', this.handleDocumentMousemove);
        document.removeEventListener('mouseup', handleDocumentMouseup);
      };

      document.addEventListener('mousemove', this.handleDocumentMousemove);
      document.addEventListener('mouseup', handleDocumentMouseup);
    }
  }

  private setCoordinateStart(options: { event: MouseEvent; element: HTMLElement | null }): void {
    const { isVertical } = this.settings;
    const { event, element } = options;

    const isCurrentElementAndVertical = (currentElement: HTMLElement | null): currentElement is
      HTMLElement => currentElement !== undefined && isVertical;
    const isCurrentElementAndNotVertical = (currentElement: HTMLElement | null): currentElement is
      HTMLElement => currentElement !== undefined && !isVertical;

    if (isCurrentElementAndVertical(element)) {
      this.coordinateYStart = event.clientY;
      this.shift = parseFloat(element.style.top);
    }
    if (isCurrentElementAndNotVertical(element)) {
      this.coordinateXStart = event.clientX;
      this.shift = parseFloat(element.style.left);
    }
  }
}

export default ThumbView;
