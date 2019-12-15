import Presenter from '../presenter/presenter';

class ViewOptional {
    private presenter: Presenter = new Presenter();

    private rem = 0.077;

    createScale(options: {vertical: boolean; min: number; max: number; step: number;
     trackWidth: number; trackHeight: number; wrapper: JQuery;}): void {
      const {
        vertical, min, max, step, trackWidth, trackHeight, wrapper,
      } = options;

      const scaleData: {coordinates: number[]; value: number[];
       shortCoordinates: number[]; shortValue: number[];} = this.presenter
         .calculateLeftScaleCoords({
           min, max, step, vertical, trackWidth, trackHeight,
         });

      const scaleTopPositionCorrection = 5;
      const $ul = $('<ul class="slider__scale"></ul>').appendTo(wrapper);
      scaleData.shortValue.map((item, index) => {
        const $itemElement = $(`<li class="slider__scale-item">${item}</li>`).appendTo($ul);

        return !vertical ? $itemElement.css({ left: `${scaleData.shortCoordinates[index] * this.rem}rem` })
          : $itemElement.css({
            top: `${(scaleData.shortCoordinates[index]
                        - scaleTopPositionCorrection) * this.rem}rem`,
          });
      });
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

    makeVertical(options: {range: boolean; wrapper: JQuery}): void {
      const {
        range, wrapper,
      } = options;

      const $trackElement = wrapper.find('.js-slider__track');

      const trackWidth: number | undefined = $trackElement.width();
      let trackHeight: number | undefined = $trackElement.height();

      $trackElement.css({
        width: `${(trackHeight as number) * this.rem}rem`,
        height: `${(trackWidth as number) * this.rem}rem`,
      });
      if (!range) {
        const $thumbElement = wrapper.find($('.js-slider__thumb'));
        $thumbElement.css({
          left: '-0.62rem',
          top: '0rem',
        });
      } else {
        const $thumbElementMin = wrapper.find('.js-slider__thumb_min');
        const $thumbElementMax = wrapper.find('.js-slider__thumb_max');
        trackHeight = $trackElement.height();

        $thumbElementMin.css({
          left: '-0.62rem',
          top: '0rem',
        });
        $thumbElementMax.css({
          left: '-0.62rem',
          top: `${Math.round((trackHeight as number)) * this.rem}rem`,
        });
      }
    }
}

export default ViewOptional;
