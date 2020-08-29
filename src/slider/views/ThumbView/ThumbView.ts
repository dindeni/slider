import View from '../View/View';
import ScaleView from '../ScaleView/ScaleView';
import { CoordinateOfMiddleOptions, DistanceOptions } from '../../../types/types';

interface ThumbPositionsOptions {
  thumbElement: HTMLElement;
  distance: number;
}

class ThumbView {
  public thumbCoordinateMin: number;

  public thumbCoordinateMax: number;

  private thumbCoordinate: number;

  private $wrapper: JQuery;

  view: View;

  scaleView: ScaleView;

  constructor(view) {
    this.view = view;
    this.$wrapper = this.view.sliderSettings.$element;
    this.scaleView = new ScaleView(view);
  }

  public createThumb(): void {
    const {
      isRange, isVertical, min, max, value, valueMin, valueMax,
    } = this.view.sliderSettings;

    this.view.$wrapper.css({ width: '100%' });
    const { trackSize } = this.view;

    if (isRange) {
      this.thumbCoordinateMin = this.getThumbCoordinate(
        valueMin || min,
      );

      this.thumbCoordinateMax = this.getThumbCoordinate(
        valueMax || max,
      );

      this.view.$thumbElementMin = isVertical
        ? this.view.$wrapper.find('.js-slider__thumb').addClass('slider__thumb_type_min js-slider__thumb_type_min slider__thumb_type_vertical js-slider__thumb_type_vertical')
        : this.view.$wrapper.find('.js-slider__thumb').addClass('slider__thumb_type_min js-slider__thumb_type_min');
      this.view.$thumbElementMax = $('<div class="slider__thumb js-slider__thumb slider__thumb_type_max js-slider__thumb_type_max"></div>')
        .appendTo(this.view.$wrapper);
    } else {
      this.thumbCoordinate = this.getThumbCoordinate(
        value || min,
      );
      this.view.$thumbElement = this.view.$wrapper.find('.js-slider__thumb');
    }

    if (isVertical) {
      this.makeVertical();
    } else if (isRange) {
      this.view.$thumbElementMin.css({
        left: `${this.thumbCoordinateMin}px`,
        zIndex: this.thumbCoordinateMin > (trackSize / 2) ? 100 : 50,
      });

      this.view.$thumbElementMax.css({
        left: `${this.thumbCoordinateMax}px`,
        zIndex: this.thumbCoordinateMax > (trackSize / 2) ? 50 : 100,
      });
    } else {
      this.view.$thumbElement.css({
        left: `${this.thumbCoordinate}px`,
      });
    }
  }

  public setThumbPosition(options: ThumbPositionsOptions): void {
    const { thumbElement, distance } = options;
    const {
      isVertical, step, isRange, min, max,
    } = this.view.sliderSettings;
    const { $thumbElementMin } = this.view;
    const thumb = thumbElement;

    const currentValue: number = min + (max - min) * (distance / this.view.trackSize);
    if (isRange) {
      const thumbType = thumbElement === $thumbElementMin.get(0) ? 'min' : 'max';
      this.view.notifyAll({ value: { value: currentValue, type: thumbType }, type: 'validateValue' });
    } else {
      this.view.notifyAll({ value: { value: currentValue }, type: 'validateValue' });
    }

    if (this.view.isValidValue) {
      const keyCoordinate = isVertical ? 'top' : 'left';
      thumb.style[keyCoordinate] = step ? `${this.scaleView.setStepPosition(distance).toString()}px` : `${distance}px`;
    }
  }

  private makeVertical(): void {
    const { $thumbElementMin, $thumbElementMax, $thumbElement } = this.view;
    const $trackElement = this.view.$wrapper.find('.js-slider__track');
    const trackWidth: number | undefined = $trackElement.width() || 0;
    const trackHeight: number | undefined = $trackElement.height() || 0;

    $trackElement.css({
      width: `${trackHeight}px`,
      height: `${trackWidth}px`,
    });

    if (this.view.sliderSettings.isRange) {
      $thumbElementMin.css({
        top: `${this.thumbCoordinateMin}px`,
        zIndex: (this.view.thumbCoordinateMin) < (trackWidth / 2) ? 50 : 200,
      });
      $thumbElementMax.css({
        top: `${this.thumbCoordinateMax}px`,
        zIndex: this.thumbCoordinateMax < (trackWidth / 2) ? 200 : 50,
      });
    } else {
      $thumbElement.css({
        top: `${this.thumbCoordinate || 0}px`,
      });
    }

    this.view.$wrapper.css({
      width: '10%',
    });
  }

  public getThumbSize(): number {
    const $thumb = this.view.$wrapper.find('.slider__thumb');
    this.view.thumbSize = $thumb.width() || 0;
    return this.view.thumbSize;
  }

  public calculateDistance(options: DistanceOptions): void {
    const { coordinateStart, coordinateMove } = options;
    this.view.distance = coordinateMove - coordinateStart;
  }

  public changeZIndex(thumbElement: HTMLElement): void {
    const { isVertical } = this.view.sliderSettings;
    const { $thumbElementMin, $thumbElementMax } = this.view;

    const trackElement = this.$wrapper.find('.js-slider__track').get(0);
    const start = isVertical ? trackElement.getBoundingClientRect().top + window.scrollY
      : trackElement.getBoundingClientRect().left;
    const coordinateOfMiddle = ThumbView.getCoordinatesOfMiddle({
      start, itemSize: this.view.trackSize,
    });

    const isLessMiddle = (isVertical && thumbElement.getBoundingClientRect().top
      + window.scrollY < coordinateOfMiddle)
      || (!isVertical && thumbElement.getBoundingClientRect().left < coordinateOfMiddle);
    const labelElementMin = (thumbElement.parentElement as HTMLElement).querySelector('.js-slider__label_type_min') as HTMLElement;
    const labelElementMax = (thumbElement.parentElement as HTMLElement).querySelector('.js-slider__label_type_max') as HTMLElement;
    const isLabelsExist = labelElementMin && labelElementMax;

    if (isLessMiddle) {
      $thumbElementMax.css({ zIndex: '200' });
      $thumbElementMin.css({ zIndex: '100' });
      if (isLabelsExist) {
        labelElementMax.style.zIndex = '200';
        labelElementMin.style.zIndex = '100';
      }
    } else {
      $thumbElementMax.css({ zIndex: '100' });
      $thumbElementMin.css({ zIndex: '200' });
      if (isLabelsExist) {
        labelElementMax.style.zIndex = '100';
        labelElementMin.style.zIndex = '200';
      }
    }
  }

  public static getCoordinatesOfMiddle(options: CoordinateOfMiddleOptions): number {
    const { start, itemSize } = options;
    return start + itemSize / 2;
  }

  private getThumbCoordinate(value): number {
    this.view.notifyAll({ value, type: 'getFractionOfValue' });
    return this.view.fraction * this.view.trackSize;
  }
}

export default ThumbView;
