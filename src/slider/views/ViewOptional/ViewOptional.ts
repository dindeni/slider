import { ExtremumOptions } from '../../../types/types';
import View from '../View/View';

interface ScaleCreationOptions extends ExtremumOptions{
  vertical: boolean;
  step: number;
  trackWidth: number;
  trackHeight: number;
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

interface StylizationProgressOptions {
  progressSize: number;
  vertical: boolean;
  thumbElement: HTMLElement;
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

interface CreationProgressOptions {
  range: boolean | undefined;
  wrapper: JQuery;
}

interface MakingProgressOptions {
  thumbElement: HTMLElement;
  vertical: boolean;
  progressSize: number;
}

class ViewOptional {
    private rem = 0.077;

    private view: View;

    constructor(view) {
      this.view = view;
    }

    public createScale(options: ScaleCreationOptions): void {
      const {
        vertical, min, max, step, trackWidth, trackHeight, wrapper,
      } = options;

      this.view.notifyAll({
        value: {
          min, max, step, vertical, trackWidth, trackHeight,
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
        const data = this.checkStepData(coordinateMin);
        result.coordinateMin = data.coordinate;
        result.valueMin = data.value;
      }

      if (coordinateMax) {
        const data = this.checkStepData(coordinateMax);
        result.coordinateMax = data.coordinate;
        result.valueMax = data.value;
      }

      if (coordinate) {
        const data = this.checkStepData(coordinate);
        result.coordinate = data.coordinate;
        result.value = data.coordinate;
      }

      return result;
    }

    public stylingProgress(options: StylizationProgressOptions): void {
      const {
        progressSize, vertical, thumbElement,
      } = options;

      const $thumb = $(thumbElement);

      ($thumb.is('.js-slider__thumb_type_min')
      || $thumb.is('.js-slider__thumb_type_max'))
        ? this.makeRangeProgress({ vertical, thumbElement, progressSize })
        : ViewOptional.makeSingleProgress({ vertical, thumbElement, progressSize });
    }

    private checkStepData(checkedCoordinate: number): { coordinate: number; value: number } {
      const coordinate = this.view.scaleData.coordinates.reduce((reducer, current) => {
        const reducerValue = Number((reducer * this.rem).toFixed(2));
        const currentValue = Number((current * this.rem).toFixed(2));
        return (Math.abs(currentValue - checkedCoordinate)
          < Math.abs(reducerValue - checkedCoordinate)) ? current : reducer;
      });
      const index = this.view.scaleData.coordinates.findIndex((value) => value === coordinate);
      const value = this.view.scaleData.value[index];
      return { coordinate, value };
    }


    private static makeSingleProgress(options: MakingProgressOptions): void {
      const { thumbElement, vertical, progressSize } = options;

      const $progressElement = $(thumbElement).find('.js-slider__progress');
      if (vertical) {
        $progressElement.css({
          height: `${progressSize}rem`,
          width: '0.38rem',
        });
      } else {
        $progressElement.css({ width: `${progressSize}rem` });
      }
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

    public createProgress(range): void {
      if (range) {
        $('<div class="slider__progress js-slider__progress slider__progress_type_min js-slider__progress_type_min"></div>').appendTo(this.view.$trackElement);
        $('<div class="slider__progress js-slider__progress slider__progress_type_max js-slider__progress_type_max"></div>').appendTo(this.view.$trackElement);
      } else {
        $('<div class="slider__progress js-slider__progress"></div>').appendTo(this.view.$trackElement);
      }
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
    }

    private makeRangeProgress(options: MakingProgressOptions): void {
      const { thumbElement, vertical, progressSize } = options;

      const $thumb = $(thumbElement);
      const $track = $thumb.parent().find('.js-slider__track');
      const $progressMin = $thumb.parent().find('.js-slider__progress_type_min');
      const $progressMax = $thumb.parent().find('.js-slider__progress_type_max');
      if (vertical) {
        $thumb.is('.js-slider__thumb_type_min')
          ? $progressMin.css({
            width: '0.38rem',
            height: `${progressSize}rem`,
          })
          : $progressMax.css({
            height: `${($track.height() || 0) * this.rem - progressSize}rem`,
            width: '0.38rem',
            position: 'absolute',
            right: '0rem',
            bottom: '0rem',
          });
      } else {
        $thumb.is('.js-slider__thumb_type_min')
          ? $progressMin.css({ width: `${progressSize}rem` })
          : $progressMax.css({
            width: `${($track.width() || 0) * this.rem - progressSize}rem`,
            position: 'absolute',
            right: '0rem',
            top: '0rem',
          });
      }
    }
}

export default ViewOptional;
