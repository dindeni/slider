import ViewOptional from './viewOptional';
import ViewUpdating from './viewUpdating';
import SliderOptionsForInit from '../sliderInit/sliderInit';

class View {
    private $trackElement: JQuery;

    private $thumbElement: JQuery;

    private $thumbElementMin: JQuery;

    private $thumbElementMax: JQuery;

    private labelOffsetLeft = 0.62;

    private labelOffsetTop = -2.31;

    private rem = 0.077;

    viewOptional: ViewOptional;

    viewUpdating: ViewUpdating;

    createElements(options: SliderOptionsForInit): void {
      const {
        $element, range, vertical, min, max, step, progress,
      } = options;

      let $wrapper: JQuery;
      step ? $wrapper = $('<div class="slider js-slider slider_step js-slider_step"></div>')
        .appendTo($element) : $wrapper = $('<div class="slider js-slider"></div>')
        .appendTo($element);
      this.$trackElement = $('<div class="slider__track js-slider__track"></div>')
        .appendTo($wrapper);

      this.viewOptional = new ViewOptional();

      this.createThumb({ range, vertical, wrapper: $wrapper });
      this.stylingElements({ range, vertical, wrapper: $wrapper });
      this.createLabel({
        initialValue: min, vertical, range, max, wrapper: $wrapper,
      });
      if (progress) {
        ViewOptional.createProgress({ range, wrapper: $wrapper });
      }
      if (step) {
        const optionsForScale = {
          vertical,
          min,
          max,
          step,
          trackWidth: this.$trackElement.width() || 0,
          trackHeight: this.$trackElement.height() || 0,
          wrapper: $wrapper,
        };
        this.viewOptional.createScale(optionsForScale);
      }
      this.viewUpdating = new ViewUpdating();
      this.viewUpdating.addDragAndDrop({
        step,
        vertical,
        range,
        progress,
        min,
        max,
        $wrapper,
      });
    }

    createThumb(options: {range: boolean; vertical; wrapper}): void {
      const { range, vertical, wrapper } = options;

      if (!range) {
        vertical ? this.$thumbElement = $('<div class="slider__thumb js-slider__thumb slider__thumb_vertical js-slider__thumb_vertical"'
                + ' draggable="true"></div>')
          .appendTo(wrapper) : this.$thumbElement = $('<div class="slider__thumb js-slider__thumb"'
                + ' draggable="true"></div>')
          .appendTo(wrapper);
      } else {
        vertical ? this.$thumbElementMin = $('<div class="slider__thumb js-slider__thumb slider__thumb_vertical js-slider__thumb_vertical slider__thumb_min js-slider__thumb_min" draggable="true">'
                + '</div>').appendTo(wrapper)
          : this.$thumbElementMin = $('<div class="slider__thumb js-slider__thumb slider__thumb_min js-slider__thumb_min" draggable="true">'
                + '</div>').appendTo(wrapper);
        vertical ? this.$thumbElementMax = $('<div class="slider__thumb js-slider__thumb slider__thumb_vertical js-slider__thumb_vertical slider__thumb_max js-slider__thumb_max" draggable="true">'
                + '</div>').appendTo(wrapper)
          : this.$thumbElementMax = $('<div class="slider__thumb js-slider__thumb slider__thumb_max js-slider__thumb_max" draggable="true">'
                    + '</div>').appendTo(wrapper);
      }
    }

    stylingElements(options: {range: boolean; vertical: boolean; wrapper: JQuery}): void {
      const { range, vertical, wrapper } = options;

      const isRangeVertical = range && !vertical;
      if (!isRangeVertical) {
        this.$thumbElement = wrapper.find('.js-slider__thumb');
        this.$thumbElement.css({
          left: 0,
        });
      } else if (isRangeVertical) {
        this.$thumbElementMin = wrapper.find('.js-slider__thumb_min');
        this.$thumbElementMax = wrapper.find('.js-slider__thumb_max');
        this.$thumbElementMin.css({
          left: 0,
        });

        this.$thumbElementMax.css({
          left: `${(this.$trackElement.width() as number) * this.rem}rem`,
        });
      }
      if (vertical) {
        this.viewOptional.makeVertical({ range, wrapper });
      }
    }

    createLabel(options: {initialValue: number; vertical: boolean; range: boolean;
      max: number; wrapper;}): void {
      const {
        initialValue, vertical, range, max, wrapper,
      } = options;

      if (!range) {
        const $labelElement = $('<div class="slider__label js-slider__label"></div>')
          .appendTo(wrapper);
        $labelElement.text(initialValue);
        if (vertical) {
          $labelElement.css({
            top: `${this.labelOffsetTop}rem`,
            left: `${this.labelOffsetTop / 2}rem`,
          });
        }
      } else {
        const $labelElementMin = $('<div class="slider__label js-slider__label slider__label_min js-slider__label_min"></div>')
          .appendTo(wrapper);
        if (vertical) {
          $labelElementMin.css({
            left: `${this.labelOffsetTop / 2}rem`,
            top: `${this.labelOffsetTop}rem`,
          });
        }
        $labelElementMin.text(initialValue);

        const $labelElementMax = $('<div class="slider__label js-slider__label slider__label_max js-slider__label_max"></div>')
          .appendTo(wrapper);
        !vertical ? $labelElementMax.css({
          left: `${(this.$trackElement.width() || 0) * this.rem - this.labelOffsetLeft}rem`,
        }) : $labelElementMax.css({
          top: `${(this.$trackElement.height() || 0) * this.rem + this.labelOffsetTop}rem`,
          left: `${this.labelOffsetTop / 2}rem`,
        });
        $labelElementMax.text(max);
      }
    }

    updateLabelValue(options: {value: number; coordinate: number; vertical: boolean;
      thumbElement: HTMLElement | JQuery;}): void {
      const {
        value, coordinate, vertical, thumbElement,
      } = options;

      const $thumb = $(thumbElement);
      const isThumbMinOrMax = $thumb.is('.slider__thumb_min')
        || $thumb.is('.slider__thumb_max');
      if (isThumbMinOrMax) {
        if ($thumb.is('.slider__thumb_min')) {
          const labelElementMin: JQuery = $(thumbElement).siblings('.js-slider__label_min');
          labelElementMin.text(value);
          !vertical ? labelElementMin.css({ left: `${coordinate - this.labelOffsetLeft}rem` })
            : labelElementMin.css({ top: `${coordinate + this.labelOffsetTop}rem` });
        } else {
          const $labelElementMax: JQuery = $(thumbElement).siblings('.js-slider__label_max');
          $labelElementMax.text(value);
          !vertical ? $labelElementMax.css({ left: `${coordinate - this.labelOffsetLeft}rem` })
            : $labelElementMax.css({ top: `${coordinate + this.labelOffsetTop}rem` });
        }
      } else {
        const $labelElement = $(thumbElement).next();
        $labelElement.text(value);

        !vertical ? $labelElement.css({ left: `${coordinate - this.labelOffsetLeft}rem` })
          : $labelElement.css({ top: `${coordinate + this.labelOffsetTop}rem` });
      }
    }
}

export default View;
