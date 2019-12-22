import ViewOptional from '../ViewOptional/ViewOptional';
import ViewUpdating from '../ViewUpdating/ViewUpdating';
import SliderOptionsForInit from '../../sliderInit/sliderInit';
import Presenter from '../../Presenter/Presenter';

class View {
    private $trackElement: JQuery;

    private $thumbElement: JQuery;

    private $thumbElementMin: JQuery;

    private $thumbElementMax: JQuery;

    private labelOffsetLeft = 0.62;

    private labelOffsetTop = -2.31;

    private rem = 0.077;

    private value: number | undefined = undefined;

    private valueMin: number | undefined;

    private valueMax: number | undefined;

    private trackSize: number;

    private thumbCoordinate: number;

    private thumbCoordinateMin: number;

    private thumbCoordinateMax: number;

    min: number;

    max: number;

    viewOptional: ViewOptional;

    viewUpdating: ViewUpdating;

    createElements(options: SliderOptionsForInit): void {
      const {
        $element, range, vertical, min, max, step, progress, value, valueMin, valueMax,
      } = options;

      this.min = min;
      this.max = max;
      value ? this.value = value : this.value = undefined;
      valueMin ? this.valueMin = valueMin : this.valueMin = undefined;
      valueMax ? this.valueMax = valueMax : this.valueMax = undefined;
      this.valueMin = Presenter.validateValue({ value: valueMin, min, max });
      this.valueMax = Presenter.validateValue({ value: valueMax, min, max });
      this.value = Presenter.validateValue({ value, min, max });

      let $wrapper: JQuery;
      step ? $wrapper = $('<div class="slider js-slider slider_step js-slider_step"></div>')
        .appendTo($element) : $wrapper = $('<div class="slider js-slider"></div>')
        .appendTo($element);
      this.$trackElement = $('<div class="slider__track js-slider__track"></div>')
        .appendTo($wrapper);

      this.viewOptional = new ViewOptional();

      this.createThumb({ range, vertical, wrapper: $wrapper });

      if (step) {
        const optionsForScale = {
          vertical,
          min,
          max,
          step,
          trackWidth: vertical ? this.$trackElement.height() || 0 : this.$trackElement.width() || 0,
          trackHeight: vertical ? this.$trackElement.width() || 0
            : this.$trackElement.height() || 0,
          wrapper: $wrapper,
        };
        this.viewOptional.createScale(optionsForScale);
      }

      this.stylingElements({
        range, vertical, wrapper: $wrapper, step,
      });
      this.createLabel({
        initialValue: min, vertical, range, max, wrapper: $wrapper,
      });
      if (progress) {
        ViewOptional.createProgress({ range, wrapper: $wrapper });
        const viewOptional = new ViewOptional();
        if (range) {
          viewOptional.stylingProgress({
            progressSize: this.thumbCoordinateMin,
            vertical,
            thumbElement: this.$thumbElementMin.get(0),
          });
          viewOptional.stylingProgress({
            progressSize: this.thumbCoordinateMax,
            vertical,
            thumbElement: this.$thumbElementMax.get(0),
          });
        } else {
          viewOptional.stylingProgress({
            progressSize: this.thumbCoordinate,
            vertical,
            thumbElement: this.$thumbElement.get(0),
          });
        }
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

    stylingElements(options: {range: boolean; vertical: boolean; wrapper: JQuery;
     step: number | undefined;}): void {
      const {
        range, vertical, wrapper, step,
      } = options;

      this.trackSize = wrapper.find('.slider__track').width() || 0;
      if (range) {
        this.thumbCoordinateMin = Presenter.calculateFromValueToCoordinates({
          value: this.valueMin || this.min, min: this.min, max: this.max, trackSize: this.trackSize,
        });
        this.thumbCoordinateMax = Presenter.calculateFromValueToCoordinates({
          value: this.valueMax || this.max, min: this.min, max: this.max, trackSize: this.trackSize,
        });
      } else {
        this.thumbCoordinate = Presenter.calculateFromValueToCoordinates({
          value: this.value || this.min, min: this.min, max: this.max, trackSize: this.trackSize,
        });
      }

      const isStepNotRange = step && !range;
      const isStepRange = step && range;
      if (isStepNotRange) {
        const stepData = this.viewOptional.correctStepCoordinate(this.value || this.min);
        this.thumbCoordinate = stepData.coordinate * this.rem;
        this.value = stepData.value;
      } else if (isStepRange) {
        const stepDataMin = this.viewOptional.correctStepCoordinate(this.valueMin || this.min);
        this.thumbCoordinateMin = stepDataMin.coordinate * this.rem;
        this.valueMin = stepDataMin.value;
        const stepDataMax = this.viewOptional.correctStepCoordinate(this.valueMax || this.max);
        this.thumbCoordinateMax = stepDataMax.coordinate * this.rem;
        this.valueMax = stepDataMax.value;
      }

      const isRangeVertical = range && !vertical;
      if (!isRangeVertical) {
        this.$thumbElement = wrapper.find('.js-slider__thumb');
        this.$thumbElement.css({
          left: `${this.thumbCoordinate}rem`,
        });
      } else if (isRangeVertical) {
        this.$thumbElementMin = wrapper.find('.js-slider__thumb_min');
        this.$thumbElementMax = wrapper.find('.js-slider__thumb_max');

        this.$thumbElementMin.css({
          left: `${this.thumbCoordinateMin}rem`,
          zIndex: this.thumbCoordinateMin > (this.trackSize / 2) * this.rem ? 200 : 50,
        });

        this.$thumbElementMax.css({
          left: `${this.thumbCoordinateMax}rem`,
          zIndex: this.thumbCoordinateMax > (this.trackSize / 2) * this.rem ? 50 : 200,
        });
      }
      if (vertical) {
        this.viewOptional.makeVertical({
          range,
          wrapper,
          min: this.min,
          max: this.max,
          coordinates: {
            notRange: this.thumbCoordinate,
            min: this.thumbCoordinateMin,
            max: this.thumbCoordinateMax,
          },
        });
      }
    }

    createLabel(options: {initialValue: number; vertical: boolean; range: boolean;
      max: number; wrapper;}): void {
      const {
        vertical, range, wrapper,
      } = options;

      if (!range) {
        const $labelElement = $('<div class="slider__label js-slider__label"></div>')
          .appendTo(wrapper);
        $labelElement.css({
          left: `${this.thumbCoordinate - this.labelOffsetLeft}rem`,
        });
        $labelElement.text(this.value || this.min);
        if (vertical) {
          $labelElement.css({
            top: `${this.thumbCoordinate + this.labelOffsetTop}rem`,
            left: `${this.labelOffsetTop / 2}rem`,
          });
        }
      } else {
        const $labelElementMin = $('<div class="slider__label js-slider__label slider__label_min js-slider__label_min"></div>')
          .appendTo(wrapper);
        if (vertical) {
          $labelElementMin.css({
            left: `${this.labelOffsetTop / 2}rem`,
            top: `${this.thumbCoordinateMin + this.labelOffsetTop}rem`,
          });
        } else {
          $labelElementMin.css({
            left: `${this.thumbCoordinateMin - this.labelOffsetLeft}rem`,
          });
        }
        $labelElementMin.text(this.valueMin || this.min);

        const $labelElementMax = $('<div class="slider__label js-slider__label slider__label_max js-slider__label_max"></div>')
          .appendTo(wrapper);
        !vertical ? $labelElementMax.css({
          left: `${this.thumbCoordinateMax - this.labelOffsetLeft}rem`,
        }) : $labelElementMax.css({
          top: `${this.thumbCoordinateMax + this.labelOffsetTop}rem`,
          left: `${this.labelOffsetTop / 2}rem`,
        });
        $labelElementMax.text(this.valueMax || this.max);
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
        const $labelElement = $(thumbElement).parent().find('.slider__label');
        $labelElement.text(value);

        !vertical ? $labelElement.css({ left: `${coordinate - this.labelOffsetLeft}rem` })
          : $labelElement.css({ top: `${coordinate + this.labelOffsetTop}rem` });
      }
    }
}

export default View;
