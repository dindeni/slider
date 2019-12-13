import Presenter from '../presenter/presenter';

class ViewOptional {
    private presenter: Presenter = new Presenter();

    private rem = 0.077;

    createScale(options: {vertical: boolean; min: number; max: number; step: number;
     trackWidth: number; trackHeight: number; wrapper: JQuery;}): void {
      const {
        vertical, min, max, step, trackWidth, trackHeight, wrapper,
      } = options;

      const scaleData: {coords: number[]; value: number[];
       shortCoords: number[]; shortValue: number[];} = this.presenter
         .calculateLeftScaleCoords({
           min, max, step, vertical, trackWidth, trackHeight,
         });

      const scaleTopPositionCorrection = 5;
      const $ul = $('<ul class="slider__scale"></ul>').appendTo(wrapper);
      scaleData.shortValue.map((item, i) => {
        const $itemElement = $(`<li class="slider__scale-item">${item}</li>`).appendTo($ul);

        return !vertical ? $itemElement.css({ left: `${scaleData.shortCoords[i] * this.rem}rem` })
          : $itemElement.css({
            top: `${(scaleData.shortCoords[i]
                        - scaleTopPositionCorrection) * this.rem}rem`,
          });
      });
    }

    stylingProgress(options: {divProgressWidth: number; vertical: boolean;
      divThumb: HTMLElement;}): void {
      const {
        divProgressWidth, vertical, divThumb,
      } = options;

      const $thumb = $(divThumb);

      const stylingProgress = {
        default: (): void => {
          const divProgress = (divThumb.previousElementSibling as HTMLElement)
            .children[0] as HTMLElement;

          if (vertical) {
            divProgress.style.height = `${divProgressWidth}rem`;
            divProgress.style.width = '0.38rem';
          } else {
            divProgress.style.width = `${divProgressWidth}rem`;
          }
        },
        range: (): void => {
          if (vertical) {
            if ($thumb.is('.js-slider__thumb_min')) {
              const divProgressMin = (divThumb.previousElementSibling as HTMLElement)
                .children[0] as HTMLElement;
              divProgressMin.style.height = `${divProgressWidth}rem`;
              divProgressMin.style.width = '0.38rem';
            } else {
              const divProgressMax = $thumb.siblings('.js-slider__track').children(
                '.js-slider__progress_max',
              );
              const divTrack = $thumb.siblings('.js-slider__track');
              divProgressMax.css({
                height: `${(divTrack.height() || 0) * this.rem - divProgressWidth}rem`,
                width: '0.38rem',
                position: 'absolute',
                right: '0rem',
                bottom: '0rem',
              });
            }
          } else if ($thumb.is('.js-slider__thumb_min')) {
            const divProgressMin = (divThumb.previousElementSibling as HTMLElement)
              .children[0] as HTMLElement;
            divProgressMin.style.width = `${divProgressWidth}rem`;
          } else {
            const divProgressMax = $thumb.siblings('.js-slider__track').children(
              '.js-slider__progress_max',
            );
            const divTrack = $thumb.siblings('.js-slider__track');
            divProgressMax.css({
              width: `${(divTrack.width() || 0) * this.rem - divProgressWidth}rem`,
              position: 'absolute',
              right: '0rem',
              top: '0rem',
            });
          }
        },
      };

      ($thumb.is('.js-slider__thumb_min')
      || $thumb.is('.js-slider__thumb_max')) ? stylingProgress.range()
        : stylingProgress.default();
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

      const divTrack = wrapper.find('.js-slider__track');

      const trackWidth: number | undefined = divTrack.width();
      let trackHeight: number | undefined = divTrack.height();

      divTrack.css({
        width: `${(trackHeight as number) * this.rem}rem`,
        height: `${(trackWidth as number) * this.rem}rem`,
      });
      if (!range) {
        const $divThumb = wrapper.find($('.js-slider__thumb'));
        $divThumb.css({
          left: '-0.62rem',
          top: '0rem',
        });
      } else {
        const divThumbMin = wrapper.find('.js-slider__thumb_min');
        const divThumbMax = wrapper.find('.js-slider__thumb_max');
        trackHeight = divTrack.height();

        divThumbMin.css({
          left: '-0.62rem',
          top: '0rem',
        });
        divThumbMax.css({
          left: '-0.62rem',
          top: `${Math.round((trackHeight as number)) * this.rem}rem`,
        });
      }
    }
}

export default ViewOptional;
