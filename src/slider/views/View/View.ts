import ViewOptional from '../ViewOptional/ViewOptional';
import ViewUpdating from '../ViewUpdating/ViewUpdating';
import { SliderElementOptions, RangeAndVerticalOptions } from '../../../types/types';
import Presenter from '../../Presenter/Presenter';


interface OptionsForStylingElements extends RangeAndVerticalOptions{
  wrapper: JQuery;
  step: number | undefined;
}

interface LabelCreationOptions extends RangeAndVerticalOptions{
  initialValue: number;
  max: number; wrapper;
}

interface UpdatingLabelOptions {
  value: number;
  coordinate: number;
  vertical: boolean;
  thumbElement: HTMLElement | JQuery;
}

interface ThumbCreationOptions extends RangeAndVerticalOptions{
  wrapper: JQuery;
}

class View {
    private $trackElement: JQuery;

    private $thumbElement: JQuery;

    private $thumbElementMin: JQuery;

    private $thumbElementMax: JQuery;

    private LABEL_OFFSET_LEFT = 0.62;

    private LABEL_TOP_CORRECTION = 0.17;

    private REM = 0.077;

    private value: number | undefined = undefined;

    private valueMin: number | undefined;

    private valueMax: number | undefined;

    private trackSize: number;

    private thumbCoordinate: number;

    private thumbCoordinateMin: number;

    private thumbCoordinateMax: number;

    private min: number;

    private max: number;

    viewOptional: ViewOptional;

    viewUpdating: ViewUpdating;

    createElements(options: SliderElementOptions): void {
      const {
        $element, range, vertical, min, max, step, progress, value, valueMin, valueMax, label,
      } = options;

      this.min = min;
      this.max = max;
      this.value = value || undefined;
      this.valueMin = valueMin || undefined;
      this.valueMax = valueMax || undefined;
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
      if (label) {
        this.createLabel({
          initialValue: min, vertical, range, max, wrapper: $wrapper,
        });
      }

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
        $element: $wrapper,
      });
    }

    createThumb(options: ThumbCreationOptions): void {
      const { range, vertical, wrapper } = options;

      if (range) {
        vertical ? this.$thumbElementMin = $('<div class="slider__thumb js-slider__thumb slider__thumb_vertical js-slider__thumb_vertical slider__thumb_min js-slider__thumb_min">'
          + '</div>').appendTo(wrapper)
          : this.$thumbElementMin = $('<div class="slider__thumb js-slider__thumb slider__thumb_min js-slider__thumb_min">'
          + '</div>').appendTo(wrapper);
        vertical ? this.$thumbElementMax = $('<div class="slider__thumb js-slider__thumb slider__thumb_vertical js-slider__thumb_vertical slider__thumb_max js-slider__thumb_max">'
          + '</div>').appendTo(wrapper)
          : this.$thumbElementMax = $('<div class="slider__thumb js-slider__thumb slider__thumb_max js-slider__thumb_max">'
          + '</div>').appendTo(wrapper);
      } else {
        vertical ? this.$thumbElement = $('<div class="slider__thumb js-slider__thumb slider__thumb_vertical js-slider__thumb_vertical"></div>')
          .appendTo(wrapper) : this.$thumbElement = $('<div class="slider__thumb js-slider__thumb"></div>')
          .appendTo(wrapper);
      }
    }

    stylingElements(options: OptionsForStylingElements): void {
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
      if (isStepRange) {
        const stepData = this.viewOptional.correctStepCoordinate({
          coordinateMin: this.thumbCoordinateMin,
          coordinateMax: this.thumbCoordinateMax,
        });

        stepData.coordinateMin || stepData.coordinateMin === 0
          ? this.thumbCoordinateMin = stepData.coordinateMin * this.REM
          : this.thumbCoordinateMin = this.min * this.REM;

        stepData.coordinateMax || stepData.coordinateMax === 0
          ? this.thumbCoordinateMax = stepData.coordinateMax * this.REM
          : this.thumbCoordinateMax = this.max * this.REM;

        if (stepData.coordinateMax) {
          this.thumbCoordinateMax = (stepData.coordinateMax || this.max) * this.REM;
        }
        this.valueMin = stepData.valueMin;
        this.valueMax = stepData.valueMax;
      } else if (isStepNotRange) {
        const stepData = this.viewOptional.correctStepCoordinate({
          coordinate: this.thumbCoordinate,
        });

        this.thumbCoordinate = stepData.coordinate
        || stepData.coordinate === 0 ? stepData.coordinate * this.REM : 0;

        this.value = stepData.value;
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
          zIndex: this.thumbCoordinateMin > (this.trackSize / 2) * this.REM ? 100 : 50,
        });

        this.$thumbElementMax.css({
          left: `${this.thumbCoordinateMax}rem`,
          zIndex: this.thumbCoordinateMax > (this.trackSize / 2) * this.REM ? 50 : 100,
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

    createLabel(options: LabelCreationOptions): void {
      const {
        vertical, range, wrapper,
      } = options;
      const LABEL_OFFSET_TOP = -4.2;

      if (range) {
        const $labelElementMin = $('<div class="slider__label js-slider__label slider__label_min js-slider__label_min"></div>')
          .appendTo(wrapper);
        if (vertical) {
          $labelElementMin.css({
            left: `${LABEL_OFFSET_TOP}rem`,
            top: `${this.thumbCoordinateMin - this.LABEL_TOP_CORRECTION}rem`,
            zIndex: this.thumbCoordinateMin > (this.trackSize / 2) * this.REM ? 100 : 50,
          });
          $labelElementMin.addClass('slider__label_vertical');
        } else {
          $labelElementMin.css({
            left: `${this.thumbCoordinateMin - this.LABEL_OFFSET_LEFT}rem`,
            zIndex: this.thumbCoordinateMin > (this.trackSize / 2) * this.REM ? 100 : 50,
          });
        }
        $labelElementMin.text(this.valueMin || this.min);

        const $labelElementMax = $('<div class="slider__label js-slider__label slider__label_max js-slider__label_max"></div>')
          .appendTo(wrapper);
        if (vertical) {
          $labelElementMax.css({
            top: `${this.thumbCoordinateMax - this.LABEL_TOP_CORRECTION}rem`,
            left: `${LABEL_OFFSET_TOP}rem`,
            zIndex: this.thumbCoordinateMax > (this.trackSize / 2) * this.REM ? 50 : 100,
          });
          $labelElementMax.addClass('slider__label_vertical');
        } else {
          $labelElementMax.css({
            left: `${this.thumbCoordinateMax - this.LABEL_OFFSET_LEFT}rem`,
            zIndex: this.thumbCoordinateMax > (this.trackSize / 2) * this.REM ? 50 : 100,
          });
        }
        $labelElementMax.text(this.valueMax || this.max);
      } else {
        const $labelElement = $('<div class="slider__label js-slider__label"></div>')
          .appendTo(wrapper);
        $labelElement.css({
          left: `${this.thumbCoordinate - this.LABEL_OFFSET_LEFT}rem`,
        });
        $labelElement.text(this.value || this.min);
        if (vertical) {
          $labelElement.css({
            top: `${this.thumbCoordinate - this.LABEL_TOP_CORRECTION}rem`,
            left: `${LABEL_OFFSET_TOP}rem`,
          });
          $labelElement.addClass('slider__label_vertical');
        }
      }
    }

    updateLabelValue(options: UpdatingLabelOptions): void {
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
          vertical ? labelElementMin.css({ top: `${coordinate - this.LABEL_TOP_CORRECTION}rem` })
            : labelElementMin.css({ left: `${coordinate - this.LABEL_OFFSET_LEFT}rem` });
        } else {
          const $labelElementMax: JQuery = $(thumbElement).siblings('.js-slider__label_max');
          $labelElementMax.text(value);
          vertical ? $labelElementMax.css({ top: `${coordinate - this.LABEL_TOP_CORRECTION}rem` })
            : $labelElementMax.css({ left: `${coordinate - this.LABEL_OFFSET_LEFT}rem` });
        }
      } else {
        const $labelElement = $(thumbElement).parent().find('.slider__label');
        $labelElement.text(value);

        vertical ? $labelElement.css({ top: `${coordinate - this.LABEL_TOP_CORRECTION}rem` })
          : $labelElement.css({ left: `${coordinate - this.LABEL_OFFSET_LEFT}rem` });
      }
    }
}

export default View;