import Presenter from '../../Presenter/Presenter';
import { ExtremumOptions } from '../../../types/types';

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

class ViewOptional {
    private scaleData: {coordinates: number[]; value: number[];
     shortCoordinates: number[]; shortValue: number[];};

    private presenter: Presenter = new Presenter();

    private rem = 0.077;

    createScale(options: ScaleCreationOptions): void {
      const {
        vertical, min, max, step, trackWidth, trackHeight, wrapper,
      } = options;

      this.scaleData = this.presenter
        .calculateLeftScaleCoordinates({
          min, max, step, vertical, trackWidth, trackHeight,
        });

      const scaleTopPositionCorrection = 5;
      const $ul = $('<ul class="slider__scale"></ul>').appendTo(wrapper);
      this.scaleData.shortValue.map((item, index) => {
        const $itemElement = $(`<li class="slider__scale-item">${item}</li>`).appendTo($ul);

        return vertical ? $itemElement.css({ top: `${(this.scaleData.shortCoordinates[index] - scaleTopPositionCorrection) * this.rem}rem` })
          : $itemElement.css({ left: `${this.scaleData.shortCoordinates[index] * this.rem}rem` });
      });
    }

    correctStepCoordinate(options: CoordinateCorrectionOptions): ResultOfCoordinateCorrection {
      const { coordinateMin, coordinateMax, coordinate } = options;
      const result: {coordinateMin: number; coordinateMax: number; coordinate: number;
       valueMin: number; valueMax: number; value: number; } = {
         coordinateMin: this.scaleData.coordinates[0],
         coordinateMax: this.scaleData.coordinates[this.scaleData.coordinates.length - 1],
         coordinate: this.scaleData.coordinates[0],
         valueMin: this.scaleData.value[0],
         valueMax: this.scaleData.value[this.scaleData.value.length - 1],
         value: this.scaleData.value[0],
       };
      let indexMinFlag: boolean;
      let indexMaxFlag: boolean;
      let indexFlag;

      this.scaleData.coordinates.map((value, index) => {
        const checkedCoordinate = Number((value * this.rem).toFixed(2));
        const isCoordinateMinAndMax = (coordinateMin || coordinateMin === 0)
         && (coordinateMax || coordinateMax === 0);
        if (isCoordinateMinAndMax) {
          switch (true) {
            case !indexMinFlag && checkedCoordinate === coordinateMin
            && coordinateMax === coordinateMin
             && index === this.scaleData.coordinates.length - 1:
              indexMinFlag = true;
              result.coordinateMin = this.scaleData.coordinates[index - 1];
              result.valueMin = this.scaleData.value[index - 1];
              break;
            case !indexMinFlag && checkedCoordinate === coordinateMin:
              indexMinFlag = true;
              result.coordinateMin = this.scaleData.coordinates[index];
              result.valueMin = this.scaleData.value[index];
              break;
            case (coordinateMin || coordinateMin === 0) && !indexMinFlag
             && checkedCoordinate > coordinateMin:
              indexMinFlag = true;
              result.coordinateMin = this.scaleData.coordinates[index - 1];
              result.valueMin = this.scaleData.value[index - 1];
              break;
            default: return undefined;
          }
          switch (true) {
            case !indexMaxFlag && checkedCoordinate === coordinateMax
             && coordinateMax === coordinateMin && index === 0:
              indexMaxFlag = true;
              result.coordinateMax = this.scaleData.coordinates[index + 1];
              result.valueMax = this.scaleData.value[index + 1];
              break;
            case !indexMaxFlag && checkedCoordinate === coordinateMax:
              indexMaxFlag = true;
              result.coordinateMax = this.scaleData.coordinates[index];
              result.valueMax = this.scaleData.value[index];
              break;
            case (coordinateMin || coordinateMin === 0) && coordinateMax && !indexMaxFlag
             && checkedCoordinate > coordinateMin && checkedCoordinate > coordinateMax:
              indexMaxFlag = true;
              result.coordinateMax = this.scaleData.coordinates[index];
              result.valueMax = this.scaleData.value[index];
              break;
            default: return undefined;
          }
        }
        if (coordinate) {
          switch (true) {
            case !indexFlag && checkedCoordinate === coordinate:
              indexFlag = true;
              result.coordinate = this.scaleData.coordinates[index];
              result.value = this.scaleData.value[index];
              break;
            case !indexFlag && checkedCoordinate > coordinate:
              indexFlag = true;
              result.coordinate = this.scaleData.coordinates[index - 1];
              result.value = this.scaleData.value[index - 1];
              break;
            default: return undefined;
          }
        }
        return undefined;
      });
      return result;
    }


    stylingProgress(options: StylizationProgressOptions): void {
      const {
        progressSize, vertical, thumbElement,
      } = options;

      const $thumb = $(thumbElement);

      const progress = {
        makeDefault: (): void => {
          const progressElement = (thumbElement.previousElementSibling as HTMLElement)
            .children[0] as HTMLElement;

          if (vertical) {
            progressElement.style.height = `${progressSize}rem`;
            progressElement.style.width = '0.38rem';
          } else {
            progressElement.style.width = `${progressSize}rem`;
          }
        },
        makeRange: (): void => {
          if (vertical) {
            if ($thumb.is('.js-slider__thumb_min')) {
              const divProgressMin = (thumbElement.previousElementSibling as HTMLElement)
                .children[0] as HTMLElement;
              divProgressMin.style.height = `${progressSize}rem`;
              divProgressMin.style.width = '0.38rem';
            } else {
              const divProgressMax = $thumb.siblings('.js-slider__track').children(
                '.js-slider__progress_max',
              );
              const divTrack = $thumb.siblings('.js-slider__track');
              divProgressMax.css({
                height: `${(divTrack.height() || 0) * this.rem - progressSize}rem`,
                width: '0.38rem',
                position: 'absolute',
                right: '0rem',
                bottom: '0rem',
              });
            }
          } else if ($thumb.is('.js-slider__thumb_min')) {
            const divProgressMin = (thumbElement.previousElementSibling as HTMLElement)
              .children[0] as HTMLElement;
            divProgressMin.style.width = `${progressSize}rem`;
          } else {
            const divProgressMax = $thumb.siblings('.js-slider__track').children(
              '.js-slider__progress_max',
            );
            const divTrack = $thumb.siblings('.js-slider__track');
            divProgressMax.css({
              width: `${(divTrack.width() || 0) * this.rem - progressSize}rem`,
              position: 'absolute',
              right: '0rem',
              top: '0rem',
            });
          }
        },
      };

      ($thumb.is('.js-slider__thumb_min')
      || $thumb.is('.js-slider__thumb_max')) ? progress.makeRange()
        : progress.makeDefault();
    }

    static createProgress(options: CreationProgressOptions): void {
      const {
        range, wrapper,
      } = options;

      const $track = wrapper.find('.js-slider__track');
      if (range) {
        $('<div class="slider__progress js-slider__progress slider__progress_min js-slider__progress_min"></div>').appendTo($track);
        $('<div class="slider__progress js-slider__progress slider__progress_max js-slider__progress_max"></div>').appendTo($track);
      } else {
        $('<div class="slider__progress js-slider__progress"></div>').appendTo($track);
      }
    }

    makeVertical(options: VerticalOptions): void {
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
        const $thumbElementMin = wrapper.find('.js-slider__thumb_min');
        const $thumbElementMax = wrapper.find('.js-slider__thumb_max');

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

    static changeZIndex(options: ChangingZIndexOptions): undefined {
      const {
        coordinatesOfMiddle, vertical, thumbMin, thumbMax, thumbElement,
      } = options;

      const isVerticalAboveMiddle = vertical && thumbElement.getBoundingClientRect().top
       + window.scrollY < coordinatesOfMiddle;
      const isVerticalBelowMiddle = vertical && thumbElement.getBoundingClientRect().top
       + window.scrollY > coordinatesOfMiddle;
      const isNotVerticalAboveMiddle = !vertical && thumbElement.getBoundingClientRect().left
        > coordinatesOfMiddle;
      const isNotVerticalBellowMiddle = !vertical && thumbElement.getBoundingClientRect().left
        < coordinatesOfMiddle;
      const labelElementMin = (thumbElement.parentElement as HTMLElement).querySelector('.js-slider__label_min') as HTMLElement;
      const labelElementMax = (thumbElement.parentElement as HTMLElement).querySelector('.js-slider__label_max') as HTMLElement;
      const isLabelsExist = labelElementMin && labelElementMax;

      if (isVerticalAboveMiddle) {
        thumbMax.style.zIndex = '200';
        thumbMin.style.zIndex = '100';
        if (isLabelsExist) {
          labelElementMax.style.zIndex = '200';
          labelElementMin.style.zIndex = '100';
        }
        return;
      }
      if (isVerticalBelowMiddle) {
        thumbMax.style.zIndex = '100';
        thumbMin.style.zIndex = '200';
        if (isLabelsExist) {
          labelElementMax.style.zIndex = '100';
          labelElementMin.style.zIndex = '200';
        }
        return;
      }

      if (isNotVerticalAboveMiddle) {
        thumbMax.style.zIndex = '100';
        thumbMin.style.zIndex = '200';
        if (isLabelsExist) {
          labelElementMin.style.zIndex = '100';
          labelElementMax.style.zIndex = '200';
        }
      } else if (isNotVerticalBellowMiddle) {
        thumbMax.style.zIndex = '200';
        thumbMin.style.zIndex = '100';
        if (isLabelsExist) {
          labelElementMin.style.zIndex = '200';
          labelElementMax.style.zIndex = '100';
        }
      }
    }
}

export default ViewOptional;
