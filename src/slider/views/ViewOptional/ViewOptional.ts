import Presenter from '../../Presenter/Presenter';

class ViewOptional {
    private scaleData: {coordinates: number[]; value: number[];
     shortCoordinates: number[]; shortValue: number[];};

    private presenter: Presenter = new Presenter();

    private rem = 0.077;

    createScale(options: {vertical: boolean; min: number; max: number; step: number;
     trackWidth: number; trackHeight: number; wrapper: JQuery;}): void {
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

        return !vertical ? $itemElement.css({ left: `${this.scaleData.shortCoordinates[index] * this.rem}rem` })
          : $itemElement.css({
            top: `${(this.scaleData.shortCoordinates[index]
                        - scaleTopPositionCorrection) * this.rem}rem`,
          });
      });
    }

    correctStepCoordinate(value): {coordinate: number; value: number} {
      const result: {coordinate: number; value: number} = {
        coordinate: this.scaleData.coordinates[0],
        value: this.scaleData.value[0],
      };

      for (let index = 0; index <= this.scaleData.value.length - 1; index += 1) {
        if (index === this.scaleData.value.length - 1) {
          result.coordinate = this.scaleData.coordinates[index];
          result.value = this.scaleData.value[index];
        }
        if (this.scaleData.value[index] === value) {
          result.coordinate = this.scaleData.coordinates[index];
          result.value = this.scaleData.value[index];
          break;
        }
        if (value > this.scaleData.value[index] && value < this.scaleData.value[index + 1]) {
          result.coordinate = this.scaleData.coordinates[index + 1];
          result.value = this.scaleData.value[index + 1];
          break;
        }
      }
      return result;
    }


    stylingProgress(options: {progressSize: number; vertical: boolean;
      thumbElement: HTMLElement;}): void {
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

    static createProgress(options: {range: boolean | undefined; wrapper: JQuery}): void {
      const {
        range, wrapper,
      } = options;

      const $track = wrapper.find('.js-slider__track');
      if (!range) {
        $('<div class="slider__progress js-slider__progress"></div>').appendTo($track);
      } else {
        $('<div class="slider__progress js-slider__progress slider__progress_min js-slider__progress_min"></div>').appendTo($track);
        $('<div class="slider__progress js-slider__progress slider__progress_max js-slider__progress_max"></div>').appendTo($track);
      }
    }

    makeVertical(options: {range: boolean; wrapper: JQuery; min: number; max: number;
     coordinates: {notRange: number; min: number; max: number};}): void {
      const {
        range, wrapper, coordinates, min,
      } = options;

      const $trackElement = wrapper.find('.js-slider__track');

      const trackWidth: number | undefined = $trackElement.width() || 0;
      const trackHeight: number | undefined = $trackElement.height() || 0;

      $trackElement.css({
        width: `${(trackHeight as number) * this.rem}rem`,
        height: `${(trackWidth as number) * this.rem}rem`,
      });

      if (!range) {
        const $thumbElement = wrapper.find($('.js-slider__thumb'));
        $thumbElement.css({
          left: '-0.62rem',
          top: `${coordinates.notRange || min}rem`,
        });
      } else {
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
      }
    }

    static changeZIndex(options: {coordinatesOfMiddle: number; vertical: boolean;
     thumbMax: HTMLElement; thumbMin: HTMLElement; thumbElement: HTMLElement; }): undefined {
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

      if (isVerticalAboveMiddle) {
        thumbMax.style.zIndex = '200';
        thumbMin.style.zIndex = '100';
        return;
      } if (isVerticalBelowMiddle) {
        thumbMax.style.zIndex = '100';
        thumbMin.style.zIndex = '200';
        return;
      }

      if (isNotVerticalAboveMiddle) {
        thumbMax.style.zIndex = '100';
        thumbMin.style.zIndex = '200';
      } else if (isNotVerticalBellowMiddle) {
        thumbMax.style.zIndex = '200';
        thumbMin.style.zIndex = '100';
      }
    }
}

export default ViewOptional;
