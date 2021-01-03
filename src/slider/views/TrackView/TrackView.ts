import autoBind from 'auto-bind';

import { SliderElementOptions } from '../../../types/types';
import Observable from '../../Observable/Observable';
import EventTypes from '../../constants';

class TrackView extends Observable {
  public size: number;

  private $trackElement: JQuery<HTMLElement>;

  private thumbElement: HTMLElement;

  private fraction: number;

  private readonly settings: SliderElementOptions;

  constructor(settings: SliderElementOptions) {
    super();
    autoBind(this);
    this.settings = settings;
    this.create();
    this.checkSize();
    this.addEvent();
  }

  public create(): void {
    const { $element } = this.settings;
    this.$trackElement = $('<div></div>').addClass('slider__track js-slider__track');
    this.$trackElement.appendTo($element);

    $element.css({ width: '100%' });
  }

  public makeVertical(): void {
    const { $element } = this.settings;
    this.$trackElement.css({
      height: `${this.$trackElement.width()}px`,
      width: `${this.$trackElement.height()}px`,
    });
    $element.css({
      width: '10%',
    });
  }

  public getSize(): void {
    const { isVertical, $element } = this.settings;
    const $thumbElement = $element.find('.js-slider__thumb');
    [this.thumbElement] = $thumbElement;
    const trackSize = isVertical ? this.$trackElement.height() : this.$trackElement.width();

    this.size = Math.round((trackSize || 0) - ($thumbElement.width() || 0));
  }

  public setFractionOfValue(fraction: number): void {
    this.fraction = fraction;
  }

  public removeEvent(): void {
    const sliderElement = this.settings.$element[0];
    sliderElement.removeEventListener('click', this.handleSliderElementClick);
  }

  private checkSize(): void {
    const { $element } = this.settings;
    this.$trackElement = $element.find('.js-slider__track');
    if (!this.$trackElement.width()) {
      this.$trackElement.css({ width: '200px' });
    }
  }

  private addEvent(): void {
    const sliderElement = this.settings.$element[0];
    sliderElement.addEventListener('click', this.handleSliderElementClick);
  }

  private handleSliderElementClick(event: MouseEvent): void {
    const { min, max } = this.settings;

    const target = event.target as HTMLElement;

    const isScaleItemElement = target.classList.contains('js-slider__scale-item');
    const isTrackElement = target === this.$trackElement[0] || target.classList.contains('js-slider__progress');
    const isClickedElement = isScaleItemElement || isTrackElement;
    if (isClickedElement) {
      const value = Number(target.textContent);
      const shift = value ? this.getDistanceOnScaleItem(value) : this.getDistanceOnTrack(event);
      const currentValue: number = isScaleItemElement
        ? value
        : min + (max - min) * (shift / this.size);
      this.notifyAll({ value: { value: currentValue }, type: EventTypes.VALIDATE_VALUE });
    }
  }

  private getDistanceOnScaleItem(value: number): number {
    this.notifyAll({ value, type: EventTypes.VALUE_CHANGE });
    return this.size * this.fraction;
  }

  private getDistanceOnTrack(event: MouseEvent): number {
    const { isVertical } = this.settings;

    const trackElement = this.$trackElement[0];
    const distance = isVertical
      ? event.clientY - trackElement.getBoundingClientRect().top - this.thumbElement
        .getBoundingClientRect().height / 2
      : event.clientX - trackElement.getBoundingClientRect().left
      - this.thumbElement.getBoundingClientRect().width / 2;
    if (distance < 0) {
      return 0;
    }
    return distance;
  }
}

export default TrackView;
