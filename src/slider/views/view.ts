import ViewOptional from './viewOptional';
import ViewDnD from './viewDnD';

class View {
    private $divTrack: JQuery;

    private $divThumb: JQuery;

    private $divThumbMin: JQuery;

    private $divThumbMax: JQuery;

    private labelOffsetLeft = 0.62;

    private labelOffsetTop = -2.31;

    private rem = 0.077;

    viewOptional: ViewOptional;

    viewDnD: ViewDnD;

    createElements(element: JQuery, range: boolean,
      vertical: boolean, min: number, max: number,
      step: number | undefined, progress: boolean): void {
      let $divWrapper: JQuery;
      step ? $divWrapper = $('<div class="slider js-slider slider_step js-slider_step"></div>')
        .appendTo(element) : $divWrapper = $('<div class="slider js-slider"></div>')
        .appendTo(element);
      this.$divTrack = $('<div class="slider__track js-slider__track"></div>')
        .appendTo($divWrapper);

      this.viewOptional = new ViewOptional();

      this.createThumb(range, vertical, $divWrapper);
      this.stylingElements(range, vertical, $divWrapper);
      this.createLabel(min, vertical, range, max, $divWrapper);
      if (progress) {
        ViewOptional.createProgress(range, $divWrapper);
      }
      if (step) {
        this.viewOptional.createScale(vertical, min, max, step,
          this.$divTrack.width() || 0, this.$divTrack.height() || 0,
          $divWrapper);
      }
      this.viewDnD = new ViewDnD();
      this.viewDnD.addDnD(step, vertical, range, progress, min, max,
        $divWrapper);
    }

    createThumb(range: boolean, vertical, wrapper): void {
      if (!range) {
        vertical ? this.$divThumb = $('<div class="slider__thumb js-slider__thumb slider__thumb_vertical js-slider__thumb_vertical"'
                + ' draggable="true"></div>')
          .appendTo(wrapper) : this.$divThumb = $('<div class="slider__thumb js-slider__thumb"'
                + ' draggable="true"></div>')
          .appendTo(wrapper);
      } else {
        vertical ? this.$divThumbMin = $('<div class="slider__thumb js-slider__thumb slider__thumb_vertical js-slider__thumb_vertical slider__thumb_min js-slider__thumb_min" draggable="true">'
                + '</div>').appendTo(wrapper)
          : this.$divThumbMin = $('<div class="slider__thumb js-slider__thumb slider__thumb_min js-slider__thumb_min" draggable="true">'
                + '</div>').appendTo(wrapper);
        vertical ? this.$divThumbMax = $('<div class="slider__thumb js-slider__thumb slider__thumb_vertical js-slider__thumb_vertical slider__thumb_max js-slider__thumb_max" draggable="true">'
                + '</div>').appendTo(wrapper)
          : this.$divThumbMax = $('<div class="slider__thumb js-slider__thumb slider__thumb_max js-slider__thumb_max" draggable="true">'
                    + '</div>').appendTo(wrapper);
      }
    }

    stylingElements(range: boolean, vertical: boolean, wrapper: JQuery): void {
      const isRangeVertical = range && !vertical;
      if (!isRangeVertical) {
        this.$divThumb = wrapper.find('.js-slider__thumb');
        this.$divThumb.css({
          left: 0,
        });
      } else if (isRangeVertical) {
        this.$divThumbMin = wrapper.find('.js-slider__thumb_min');
        this.$divThumbMax = wrapper.find('.js-slider__thumb_max');
        this.$divThumbMin.css({
          left: 0,
        });

        this.$divThumbMax.css({
          left: `${(this.$divTrack.width() as number) * this.rem}rem`,
        });
      }
      if (vertical) {
        this.viewOptional.makeVertical(range, wrapper);
      }
    }

    createLabel(initValue: number, vertical: boolean, range: boolean,
      max: number, wrapper): void {
      if (!range) {
        const $divLabel = $('<div class="slider__label js-slider__label"></div>')
          .appendTo(wrapper);
        $divLabel.text(initValue);
        if (vertical) {
          $divLabel.css({
            top: `${this.labelOffsetTop}rem`,
            left: `${this.labelOffsetTop / 2}rem`,
          });
        }
      } else {
        const $divLabelMin = $('<div class="slider__label js-slider__label slider__label_min js-slider__label_min"></div>')
          .appendTo(wrapper);
        if (vertical) {
          $divLabelMin.css({
            left: `${this.labelOffsetTop / 2}rem`,
            top: `${this.labelOffsetTop}rem`,
          });
        }
        $divLabelMin.text(initValue);

        const $divLabelMax = $('<div class="slider__label js-slider__label slider__label_max js-slider__label_max"></div>')
          .appendTo(wrapper);
        !vertical ? $divLabelMax.css({
          left: `${(this.$divTrack.width() || 0) * this.rem - this.labelOffsetLeft}rem`,
        }) : $divLabelMax.css({
          top: `${(this.$divTrack.height() || 0) * this.rem + this.labelOffsetTop}rem`,
          left: `${this.labelOffsetTop / 2}rem`,
        });
        $divLabelMax.text(max);
      }
    }

    updateLabelValue(value: number, coord: number, vertical: boolean,
      divThumb: HTMLElement | JQuery): void {
      const $thumb = $(divThumb);
      const isThumbMinOrMax = $thumb.is('.slider__thumb_min')
        || $thumb.is('.slider__thumb_max');
      if (isThumbMinOrMax) {
        if ($thumb.is('.slider__thumb_min')) {
          const labelMin: JQuery = $(divThumb).siblings('.js-slider__label_min');
          labelMin.text(value);
          !vertical ? labelMin.css({ left: `${coord - this.labelOffsetLeft}rem` })
            : labelMin.css({ top: `${coord + this.labelOffsetTop}rem` });
        } else {
          const $labelMax: JQuery = $(divThumb).siblings('.js-slider__label_max');
          $labelMax.text(value);
          !vertical ? $labelMax.css({ left: `${coord - this.labelOffsetLeft}rem` })
            : $labelMax.css({ top: `${coord + this.labelOffsetTop}rem` });
        }
      } else {
        const $label = $(divThumb).next();
        $label.text(value);

        !vertical ? $label.css({ left: `${coord - this.labelOffsetLeft}rem` })
          : $label.css({ top: `${coord + this.labelOffsetTop}rem` });
      }
    }
}

export default View;
