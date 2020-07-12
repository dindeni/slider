import { ExtremumOptions } from '../../../types/types';
import View from '../View/View';

interface ScaleCreationOptions extends ExtremumOptions{
  vertical: boolean;
  step: number;
  trackWidth: number;
  wrapper: JQuery;
}

interface ChangingZIndexOptions {
  coordinatesOfMiddle: number;
  vertical: boolean;
  thumbMax: HTMLElement;
  thumbMin: HTMLElement;
  thumbElement: HTMLElement;
}

interface CheckingStepDataOptions {
  checkedCoordinate: number;
  data: { coordinates: number[]; value: number[] };
}

class ViewOptional {
  private view: View;

  constructor(view) {
    this.view = view;
  }

  public createScale(options: ScaleCreationOptions): void {
    const {
      vertical, min, max, step, trackWidth, wrapper,
    } = options;

    this.view.notifyAll({
      value: {
        min, max, step, vertical, trackSize: trackWidth,
      },
      type: 'getScaleData',
    });

    const $ul = $('<ul class="slider__scale"></ul>').appendTo(wrapper);
    this.view.scaleData.shortValue.map((item, index) => {
      const $itemElement = $(`<li class="slider__scale-item js-slider__scale-item">${item}</li>`).appendTo($ul);

      const verticalCorrection = 7;
      return vertical
        ? $itemElement.css({ top: `${(this.view.scaleData.shortCoordinates[index]) - verticalCorrection}px` })
        : $itemElement.css({ left: `${this.view.scaleData.shortCoordinates[index]}px` });
    });
  }

  public static checkStepData(options: CheckingStepDataOptions):
      { coordinate: number; value: number } {
    const { checkedCoordinate, data } = options;

    const coordinate = data.coordinates.reduce((reducer, current) => (
      (Math.abs(current - checkedCoordinate)
          < Math.abs(reducer - checkedCoordinate)) ? current : reducer));
    const index = data.coordinates.findIndex((value) => value === coordinate);
    const value = data.value[index];
    return { coordinate, value };
  }

  public static changeZIndex(options: ChangingZIndexOptions): void {
    const {
      coordinatesOfMiddle, vertical, thumbMin, thumbMax, thumbElement,
    } = options;

    const isLessMiddle = (vertical && thumbElement.getBoundingClientRect().top
      + window.scrollY < coordinatesOfMiddle)
      || (!vertical && thumbElement.getBoundingClientRect().left < coordinatesOfMiddle);
    const labelElementMin = (thumbElement.parentElement as HTMLElement).querySelector('.js-slider__label_type_min') as HTMLElement;
    const labelElementMax = (thumbElement.parentElement as HTMLElement).querySelector('.js-slider__label_type_max') as HTMLElement;
    const isLabelsExist = labelElementMin && labelElementMax;

    if (isLessMiddle) {
      thumbMax.style.zIndex = '200';
      thumbMin.style.zIndex = '100';
      if (isLabelsExist) {
        labelElementMax.style.zIndex = '200';
        labelElementMin.style.zIndex = '100';
      }
    } else {
      thumbMax.style.zIndex = '100';
      thumbMin.style.zIndex = '200';
      if (isLabelsExist) {
        labelElementMax.style.zIndex = '100';
        labelElementMin.style.zIndex = '200';
      }
    }
  }

  public createProgressNode(): void {
    $('<div class="slider__progress js-slider__progress"></div>').appendTo(this.view.$trackElement);
  }

  public makeProgress(): void {
    const { vertical, range } = this.view.sliderSettings;

    const $progressElement = this.view.$wrapper.find('.js-slider__progress');
    if (range) {
      const thumbMin = vertical
        ? parseFloat(this.view.$thumbElementMin.css('top'))
        : parseFloat(this.view.$thumbElementMin.css('left'));
      const thumbMax = vertical
        ? parseFloat(this.view.$thumbElementMax.css('top'))
        : parseFloat(this.view.$thumbElementMax.css('left'));
      const progressSize = thumbMax - thumbMin;
      vertical
        ? $progressElement.css({
          height: `${progressSize}px`,
          top: thumbMin,
        })
        : $progressElement.css({
          width: `${progressSize}px`,
          left: thumbMin,
        });
    } else {
      const progressSize = vertical
        ? parseFloat(this.view.$thumbElement.css('top'))
        : parseFloat(this.view.$thumbElement.css('left'));
      vertical
        ? $progressElement.css({
          height: `${progressSize}px`,
        })
        : $progressElement.css({
          width: `${progressSize}px`,
        });
    }
  }

  public makeVertical(): void {
    const $trackElement = this.view.$wrapper.find('.js-slider__track');

    const trackWidth: number | undefined = $trackElement.width() || 0;
    const trackHeight: number | undefined = $trackElement.height() || 0;

    $trackElement.css({
      width: `${trackHeight}px`,
      height: `${trackWidth}px`,
    });

    if (this.view.sliderSettings.range) {
      this.view.$thumbElementMin.css({
        top: `${this.view.thumbCoordinateMin}px`,
        zIndex: (this.view.thumbCoordinateMin) < (trackWidth / 2) ? 50 : 200,
      });
      this.view.$thumbElementMax.css({
        top: `${this.view.thumbCoordinateMax}px`,
        zIndex: this.view.thumbCoordinateMax < (trackWidth / 2) ? 200 : 50,
      });
    } else {
      this.view.$thumbElement.css({
        top: `${this.view.thumbCoordinate || 0}px`,
      });
    }

    this.view.$wrapper.css({
      width: '10%',
    });
  }

  public setStepCoordinates(): void {
    const { range } = this.view.sliderSettings;
    if (range) {
      const valuesMin = ViewOptional.checkStepData({
        checkedCoordinate: this.view.thumbCoordinateMin,
        data: this.view.scaleData,
      });
      this.view.thumbCoordinateMin = valuesMin.coordinate;
      this.view.sliderSettings.valueMin = valuesMin.value;

      const valuesMax = ViewOptional.checkStepData({
        checkedCoordinate: this.view.thumbCoordinateMax,
        data: this.view.scaleData,
      });
      this.view.thumbCoordinateMax = valuesMax.coordinate;
      this.view.sliderSettings.valueMax = valuesMax.value;
    } else {
      const values = ViewOptional.checkStepData({
        checkedCoordinate: this.view.thumbCoordinate,
        data: this.view.scaleData,
      });
      this.view.thumbCoordinate = values.coordinate;
      this.view.sliderSettings.value = values.value;
    }
  }
}

export default ViewOptional;
