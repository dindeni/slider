import Presenter from '../presenter/presenter';

class ViewOptional {
    private presenter: Presenter = new Presenter();

    createScale(vertical: boolean,
      min: number, max: number, step: number, trackWidth: number,
      trackHeight: number, wrapper: JQuery): void {
      const scaleData: {coords: number[]; value: number[]} = this.presenter
        .calculateLeftScaleCoords(min, max, step, vertical, trackWidth, trackHeight);

      const scaleTopPositionCorrection = 5;
      const $ul = $('<ul class="slider-scale"></ul>').appendTo(wrapper);
      scaleData.value.map((item, i) => {
        const itemElement = $(`<li class="slider__scale-item">${item}</li>`).appendTo($ul);

        return !vertical ? itemElement.css({ left: scaleData.coords[i] })
          : itemElement.css({
            top: scaleData.coords[i]
                        - scaleTopPositionCorrection,
          });
      });
    }

    static createProgress(range: boolean, wrapper: JQuery): void {
      const $track = wrapper.find('.js-slider-track');
      if (!range) {
        $('<div class="slider-progress"></div>').appendTo($track);
      } else {
        $('<div class="slider-progress" id="progress-min"></div>').appendTo($track);
        $('<div class="slider-progress" id="progress-max"></div>').appendTo($track);
      }
    }

    static stylingProgress(divProgressWidth: number, vertical: boolean,
      divThumb: HTMLElement): void {
      const $thumb = $(divThumb);

      const stylingProgress = {
        default: (): void => {
          const divProgress = (divThumb.previousElementSibling as HTMLElement)
            .children[0] as HTMLElement;

          if (vertical) {
            divProgress.style.height = `${divProgressWidth}px`;
            divProgress.style.width = '5px';
          } else {
            divProgress.style.width = `${divProgressWidth}px`;
          }
        },
        range: (): void => {
          if (vertical) {
            if ($thumb.is('#thumb-min')) {
              const divProgressMin = (divThumb.previousElementSibling as HTMLElement)
                .children[0] as HTMLElement;
              divProgressMin.style.height = `${divProgressWidth}px`;
              divProgressMin.style.width = '5px';
            } else {
              const divProgressMax = $thumb.siblings('.slider-track').children(
                '#progress-max',
              );
              const divTrack = $thumb.siblings('.slider-track');
              divProgressMax.css({
                height: `${(divTrack.height() || 0) - divProgressWidth}px`,
                width: '5px',
                position: 'absolute',
                right: '0px',
                bottom: '0px',
              });
            }
          } else if ($thumb.is('#thumb-min')) {
            const divProgressMin = (divThumb.previousElementSibling as HTMLElement)
              .children[0] as HTMLElement;
            divProgressMin.style.width = `${divProgressWidth}px`;
          } else {
            const divProgressMax = $thumb.siblings('.slider-track').children(
              '#progress-max',
            );
            const divTrack = $thumb.siblings('.slider-track');
            divProgressMax.css({
              width: `${(divTrack.width() || 0) - divProgressWidth}px`,
              position: 'absolute',
              right: '0px',
              top: '0px',
            });
          }
        },
      };

      ($thumb.is('#thumb-min')
            || $thumb.is('#thumb-max')) ? stylingProgress.range()
        : stylingProgress.default();
    }

    static makeVertical(range: boolean, wrapper: JQuery): void {
      const divTrack = wrapper.find('.slider-track');

      const trackWidth: number | undefined = divTrack.width();
      let trackHeight: number | undefined = divTrack.height();

      divTrack.css({
        width: `${trackHeight}px`,
        height: `${trackWidth}px`,
      });

      if (!range) {
        const $divThumb = wrapper.find($('.slider-thumb'));

        $divThumb.css({
          left: '-8px',
          top: '0px',
        });
      } else {
        const divThumbMin = wrapper.find('#thumb-min');
        const divThumbMax = wrapper.find('#thumb-max');
        trackHeight = divTrack.height();

        divThumbMin.css({
          left: '-8px',
          top: '0px',
        });
        divThumbMax.css({
          left: '-8px',
          top: `${trackHeight}px`,
        });
      }
    }
}

export default ViewOptional;
