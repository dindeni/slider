import { ExtremumOptions } from '../../../types/types';
import View from '../View/View';

interface ScaleCreationOptions extends ExtremumOptions{
  vertical: boolean;
  step: number;
  trackWidth: number;
  wrapper: JQuery;
}

interface CoordinateCorrectionOptions {
  coordinateMin?: number;
  coordinateMax?: number;
  coordinate?: number;
}

interface ResultOfCoordinateCorrection extends CoordinateCorrectionOptions{
  valueMin?: number;
  valueMax?: number;
  value?: number;
}

interface VerticalOptions extends ExtremumOptions{
  range: boolean;
  wrapper: JQuery;
  coordinates: {notRange: number; min: number; max: number};
}

interface ChangingZIndexOptions {
  coordinatesOfMiddle: number;
  vertical: boolean;
  thumbMax: HTMLElement;
  thumbMin: HTMLElement;
  thumbElement: HTMLElement;
}

interface MakingProgressOptions {
  $wrapper: JQuery;
  vertical: boolean;
  trackSize: number;
  range: boolean;
}

interface CheckingStepDataOptions {
  checkedCoordinate: number;
  data: { coordinates: number[]; value: number[] };
}

class ViewOptional {
    private rem = 0.077;

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
      const scaleTopPositionCorrection = 5;
      const $ul = $('<ul class="slider__scale"></ul>').appendTo(wrapper);
      this.view.scaleData.shortValue.map((item, index) => {
        const $itemElement = $(`<li class="slider__scale-item">${item}</li>`).appendTo($ul);

        return vertical
          ? $itemElement.css({ top: `${(this.view.scaleData.shortCoordinates[index] - scaleTopPositionCorrection) * this.rem}rem` })
          : $itemElement.css({ left: `${this.view.scaleData.shortCoordinates[index] * this.rem}rem` });
      });
    }

    public correctStepCoordinate(options:
     CoordinateCorrectionOptions): ResultOfCoordinateCorrection {
      const { coordinateMin, coordinateMax, coordinate } = options;
      const result: {coordinateMin: number; coordinateMax: number; coordinate: number;
       valueMin: number; valueMax: number; value: number; } = {
         coordinateMin: this.view.scaleData.coordinates[0],
         coordinateMax: this.view.scaleData.coordinates[this.view.scaleData.coordinates.length - 1],
         coordinate: this.view.scaleData.coordinates[0],
         valueMin: this.view.scaleData.value[0],
         valueMax: this.view.scaleData.value[this.view.scaleData.value.length - 1],
         value: this.view.scaleData.value[0],
       };

      if (coordinateMin) {
        const data = this.checkStepData({
          checkedCoordinate: coordinateMin,
          data: this.view.scaleData,
        });
        result.coordinateMin = data.coordinate;
        result.valueMin = data.value;
      }

      if (coordinateMax) {
        const data = this.checkStepData({
          checkedCoordinate: coordinateMax,
          data: this.view.scaleData,
        });
        result.coordinateMax = data.coordinate;
        result.valueMax = data.value;
      }

      if (coordinate) {
        const data = this.checkStepData({
          checkedCoordinate: coordinate,
          data: this.view.scaleData,
        });
        result.coordinate = data.coordinate;
        result.value = data.value;
      }
      return result;
    }

    public checkStepData(options: CheckingStepDataOptions): { coordinate: number; value: number } {
      const { checkedCoordinate, data } = options;

      const coordinate = data.coordinates.reduce((reducer, current) => {
        const reducerValue = Number((reducer * this.rem).toFixed(2));
        const currentValue = Number((current * this.rem).toFixed(2));
        return (Math.abs(currentValue - checkedCoordinate)
          < Math.abs(reducerValue - checkedCoordinate)) ? current : reducer;
      });
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
      const labelElementMax = (thumbElement.parentElement as HTMLElement).querySelector('.js-slider__label_type_type_max') as HTMLElement;
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

    public createProgress(): void {
      $('<div class="slider__progress js-slider__progress"></div>').appendTo(this.view.$trackElement);
    }

    public makeVertical(options: VerticalOptions): void {
      const {
        range, wrapper, coordinates,
      } = options;

      const $trackElement = wrapper.find('.js-slider__track');

      const trackWidth: number | undefined = $trackElement.width() || 0;
      const trackHeight: number | undefined = $trackElement.height() || 0;

      $trackElement.css({
        width: `${(trackHeight as number) * this.rem}rem`,
        height: `${(trackWidth as number) * this.rem}rem`,
      });

      if (range) {
        const $thumbElementMin = wrapper.find('.js-slider__thumb_type_min');
        const $thumbElementMax = wrapper.find('.js-slider__thumb_type_max');

        $thumbElementMin.css({
          left: '-0.62rem',
          top: `${coordinates.min}rem`,
          zIndex: (coordinates.min) < (trackWidth / 2) * this.rem ? 50 : 200,
        });
        $thumbElementMax.css({
          left: '-0.62rem',
          top: `${coordinates.max}rem`,
          zIndex: (coordinates.max) < (trackWidth / 2) * this.rem ? 200 : 50,
        });
      } else {
        const $thumbElement = wrapper.find($('.js-slider__thumb'));
        $thumbElement.css({
          left: '-0.62rem',
          top: `${coordinates.notRange || 0}rem`,
        });
      }

      wrapper.css({
        width: '10%',
      });
    }

    public makeProgress(options: MakingProgressOptions): void {
      const { $wrapper, vertical, range } = options;

      const $progressElement = $wrapper.find('.js-slider__progress');
      if (range) {
        const $thumbElementMin = $wrapper.find('.js-slider__thumb_type_min');
        const $thumbElementMax = $wrapper.find('.js-slider__thumb_type_max');
        const thumbMin = vertical
          ? parseFloat($thumbElementMin.css('top'))
          : parseFloat($thumbElementMin.css('left'));
        const thumbMax = vertical
          ? parseFloat($thumbElementMax.css('top'))
          : parseFloat($thumbElementMax.css('left'));
        const progressSize = thumbMax - thumbMin;

        vertical
          ? $progressElement.css({
            width: '0.38rem',
            height: `${progressSize * this.rem}rem`,
            top: thumbMin,
          })
          : $progressElement.css({
            width: `${progressSize * this.rem}rem`,
            left: thumbMin,
          });
      } else {
        const $thumbElement = $wrapper.find('.js-slider__thumb');
        const progressSize = vertical
          ? parseFloat($thumbElement.css('top'))
          : parseFloat($thumbElement.css('left'));
        vertical
          ? $progressElement.css({
            width: '0.38rem',
            height: `${progressSize * this.rem}rem`,
          })
          : $progressElement.css({
            width: `${progressSize * this.rem}rem`,
          });
      }
    }
}

export default ViewOptional;
