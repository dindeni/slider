import ViewOptional from '../ViewOptional/ViewOptional';
import ViewHandle from '../ViewHandle/ViewHandle';
import ViewUpdating from '../ViewUpdating/ViewUpdating';
import {
  SliderElementOptions, SliderOptions, RangeAndVerticalOptions, ExtremumOptions, ScaleData,
} from '../../../types/types';
import Observable from '../../Observable/Observable';

interface OptionsForStylingElements extends RangeAndVerticalOptions {
  step: number | undefined;
  value?: number;
  valueMin?: number;
  valueMax?: number;
}

interface LabelCreationOptions extends RangeAndVerticalOptions {
  initialValue: number;
  max: number;
  $wrapper: JQuery;
}

interface UpdatingLabelOptions {
  value: number;
  coordinate: number;
  vertical: boolean;
  thumbElement: HTMLElement | JQuery;
}

interface UpdatingDataOptions extends ExtremumOptions {
  trackElement: HTMLElement;
  distance: number;
  thumbElement: HTMLElement;
  vertical;
  $wrapper: JQuery;
  progress: boolean;
  range;
  step?: boolean;
}

interface OptionsForCreateRangeLabel {
  vertical: boolean;
  $wrapper: JQuery;
}

class View extends Observable {
  private $thumbElement: JQuery;

  public $thumbElementMin: JQuery;

  public $thumbElementMax: JQuery;

  private LABEL_OFFSET_LEFT = 0.62;

  private LABEL_TOP_CORRECTION = 0.17;

  private REM = 0.077;

  private LABEL_OFFSET_TOP = -4.2;

  private trackSize: number;

  private thumbSize: number;

  public thumbCoordinate: number;

  public thumbCoordinateMin: number;

  public thumbCoordinateMax: number;

  public $trackElement: JQuery;

  public coordinate: number;

  private valueForLabel: number;

  private viewOptional: ViewOptional;

  private viewHandle: ViewHandle;

  private viewUpdating: ViewUpdating;

  public scaleData: ScaleData;

  public sliderSettings: SliderElementOptions;

  public distance: number;

  public coordinateOfMiddle: number;

  public $wrapper: JQuery;

  private parentElement: HTMLElement;

  public createElements(options: SliderElementOptions): void {
    const {
      $element, range, vertical, min, max, step, progress, label, valueMin, valueMax, value,
    } = options;

    this.$wrapper = $element;
    this.createBasicNodes();
    this.$trackElement = this.$wrapper.find('.js-slider__track');
    const trackSize = this.$trackElement.width() || 0;
    this.thumbSize = $element.find('.slider__thumb').width() || 0;
    this.createThumb({ range, vertical });

    this.viewOptional = new ViewOptional(this);
    this.viewHandle = new ViewHandle(this);
    this.viewUpdating = new ViewUpdating(this);

    if (step) {
      const optionsForScale = {
        vertical,
        min,
        max,
        step,
        trackWidth: Math.round(trackSize - this.thumbSize),
        trackHeight: Math.round(trackSize - this.thumbSize),
        wrapper: this.$wrapper,
      };
      this.viewOptional.createScale(optionsForScale);
    }

    this.stylingElements({
      range, vertical, step, value, valueMin, valueMax,
    });
    if (label) {
      this.createLabel({
        initialValue: min, vertical, range, max, $wrapper: this.$wrapper,
      });
    }

    if (progress) {
      this.viewOptional.createProgress();
      this.viewOptional.makeProgress({
        vertical, range, $wrapper: this.$wrapper, trackSize,
      });
    }

    this.viewHandle.addDragAndDrop({
      min, max, range, label, vertical, progress, $element: this.$wrapper, step,
    });
  }

  public reloadSlider(options: SliderOptions): void {
    this.sliderSettings = { ...this.sliderSettings, ...options };
    const sliderElement = this.sliderSettings.$element;
    if (sliderElement.length !== 0) {
      this.viewHandle.removeWindowEvent();
      this.parentElement = sliderElement[0].parentElement as HTMLElement;
      $(this.parentElement).empty();
      this.createElements(this.sliderSettings);
    }
  }

  public setLabelValue(value: number): void {
    this.valueForLabel = value;
  }

  public setScaleData(scaleData: ScaleData): void {
    this.scaleData = scaleData;
  }

  public getSliderOptions(sliderSettings: SliderElementOptions): void {
    this.sliderSettings = {
      ...sliderSettings,
      valueMin: sliderSettings.min,
      valueMax: sliderSettings.max,
    };
  }

  public getDistance(distance: number): void {
    this.distance = distance;
  }

  public getCoordinateOfMiddle(coordinateOfMiddle: number): void {
    this.coordinateOfMiddle = coordinateOfMiddle;
  }

  public updateData(options: UpdatingDataOptions): void {
    const {
      min, max, trackElement, distance, vertical, thumbElement, progress, $wrapper, range,
    } = options;
    const trackSize = vertical
      ? trackElement.getBoundingClientRect().height
      : trackElement.getBoundingClientRect().width;
    const thumbSize = thumbElement.getBoundingClientRect().width;

    const valueOptions = {
      min,
      max,
      trackSize: (trackSize - thumbSize),
      distance: distance / this.REM,
    };

    this.notifyAll({ value: valueOptions, type: 'getValue' });

    const optionsForLabel = {
      value: this.valueForLabel,
      coordinate: distance,
      vertical,
      thumbElement,
    };

    const isDistance = distance || distance === 0;
    if (isDistance) {
      this.updateLabelValue(optionsForLabel);
      this.notifyAll({ value: this.sliderSettings, type: 'updateOptions' });
    }
    if (progress) {
      this.viewOptional.makeProgress({
        vertical,
        range,
        $wrapper,
        trackSize,
      });
    }
  }

  public setCoordinate(value: number): void {
    this.coordinate = value;
  }

  public stylingElements(options: OptionsForStylingElements): void {
    const {
      range, vertical, step, value, valueMin, valueMax,
    } = options;

    this.$wrapper.css({ width: '100%' });
    this.trackSize = this.$wrapper.find('.slider__track').width() || 0;
    this.thumbSize = this.$wrapper.find('.slider__thumb').width() || 0;
    if (range) {
      this.thumbCoordinateMin = this.getThumbCoordinates(
        valueMin || this.sliderSettings.min,
      );
      this.thumbCoordinateMax = this.getThumbCoordinates(
        valueMax || this.sliderSettings.max,
      );
    } else {
      this.thumbCoordinate = this.getThumbCoordinates(
        value || this.sliderSettings.min,
      );
    }
    this.viewOptional.setStepCoordinates({ step, range });

    if (vertical) {
      this.viewOptional.makeVertical({
        range,
        wrapper: this.$wrapper,
        min: this.sliderSettings.min,
        max: this.sliderSettings.max,
        coordinates: {
          notRange: this.thumbCoordinate,
          min: this.thumbCoordinateMin,
          max: this.thumbCoordinateMax,
        },
      });
    } else if (range) {
      this.$thumbElementMin = this.$wrapper.find('.js-slider__thumb_type_min');
      this.$thumbElementMax = this.$wrapper.find('.js-slider__thumb_type_max');

      this.$thumbElementMin.css({
        left: `${this.thumbCoordinateMin}rem`,
        zIndex: this.thumbCoordinateMin > (this.trackSize / 2) * this.REM ? 100 : 50,
      });

      this.$thumbElementMax.css({
        left: `${this.thumbCoordinateMax}rem`,
        zIndex: this.thumbCoordinateMax > (this.trackSize / 2) * this.REM ? 50 : 100,
      });
    } else {
      this.$thumbElement = this.$wrapper.find('.js-slider__thumb');
      this.$thumbElement.css({
        left: `${this.thumbCoordinate}rem`,
      });
    }
  }

  private createBasicNodes(): void {
    if (this.$wrapper.parent().find('.js-slider').length === 0) {
      const sliderElement = $('<div class="slider js-slider"></div>');
      this.$wrapper = sliderElement.appendTo(this.parentElement);
      this.sliderSettings.$element = this.$wrapper;
    }
    const $sliderElements = $('<div class="slider__track js-slider__track">'
      + '</div><div class="slider__thumb js-slider__thumb"></div>');
    $sliderElements.appendTo(this.$wrapper);
  }

  private getThumbCoordinates(value): number {
    this.notifyAll({
      value: {
        value,
        min: this.sliderSettings.min,
        max: this.sliderSettings.max,
        trackSize: this.trackSize - this.thumbSize,
      },
      type: 'getCoordinates',
    });
    return this.coordinate;
  }

  private createThumb(options: RangeAndVerticalOptions): void {
    const { range, vertical } = options;
    if (range) {
      this.$thumbElementMin = vertical
        ? this.$wrapper.find('.js-slider__thumb').addClass('slider__thumb_type_min js-slider__thumb_type_min slider__thumb_type_vertical js-slider__thumb_type_vertical')
        : this.$wrapper.find('.js-slider__thumb').addClass('slider__thumb_type_min js-slider__thumb_type_min');
      this.$thumbElementMax = vertical
        ? $('<div class="slider__thumb js-slider__thumb slider__thumb_type_vertical js-slider__thumb_type_vertical slider__thumb_type_max js-slider__thumb_type_max"></div>').appendTo(this.$wrapper)
        : $('<div class="slider__thumb js-slider__thumb slider__thumb_type_max js-slider__thumb_type_max"></div>').appendTo(this.$wrapper);
    } else {
      this.$thumbElement = vertical
        ? this.$wrapper.find('.js-slider__thumb').addClass('slider__thumb_type_vertical js-slider__thumb_type_vertical')
        : this.$wrapper.find('.js-slider__thumb');
    }
  }

  private createLabel(options: LabelCreationOptions): void {
    const {
      vertical, range, $wrapper,
    } = options;

    if (range) {
      this.createRangeLabel({ $wrapper, vertical });
    } else {
      const $labelElement = $('<div class="slider__label js-slider__label"></div>').appendTo($wrapper);
      $labelElement.css({
        left: `${this.thumbCoordinate - this.LABEL_OFFSET_LEFT}rem`,
      });
      $labelElement.text(this.sliderSettings.value || this.sliderSettings.min);
      if (vertical) {
        $labelElement.css({
          top: `${this.thumbCoordinate - this.LABEL_TOP_CORRECTION}rem`,
          left: `${this.LABEL_OFFSET_TOP}rem`,
        });
        $labelElement.addClass('slider__label_type_vertical');
      }
    }
  }

  public updateLabelValue(options: UpdatingLabelOptions): void {
    const {
      value, coordinate, vertical, thumbElement,
    } = options;

    const $thumb = $(thumbElement);
    const isThumbMinOrMax = $thumb.is('.slider__thumb_type_min')
        || $thumb.is('.slider__thumb_type_max');
    if (isThumbMinOrMax) {
      if ($thumb.is('.slider__thumb_type_min')) {
        const labelElementMin: JQuery = $(thumbElement).siblings('.js-slider__label_type_min');
        labelElementMin.text(value);
        vertical ? labelElementMin.css({ top: `${coordinate - this.LABEL_TOP_CORRECTION}rem` })
          : labelElementMin.css({ left: `${coordinate - this.LABEL_OFFSET_LEFT}rem` });
        this.sliderSettings.valueMin = this.valueForLabel;
      } else {
        const $labelElementMax: JQuery = $(thumbElement).siblings('.js-slider__label_type_max');
        $labelElementMax.text(value);
        vertical ? $labelElementMax.css({ top: `${coordinate - this.LABEL_TOP_CORRECTION}rem` })
          : $labelElementMax.css({ left: `${coordinate - this.LABEL_OFFSET_LEFT}rem` });
        this.sliderSettings.valueMax = value;
      }
    } else {
      const $labelElement = $(thumbElement).parent().find('.slider__label');
      $labelElement.text(value);
      this.sliderSettings.value = value;

      vertical ? $labelElement.css({ top: `${coordinate - this.LABEL_TOP_CORRECTION}rem` })
        : $labelElement.css({ left: `${coordinate - this.LABEL_OFFSET_LEFT}rem` });
    }
  }

  private createRangeLabel(options: OptionsForCreateRangeLabel): void {
    const { vertical, $wrapper } = options;

    const $labelElementMin = $('<div class="slider__label js-slider__label slider__label_type_min js-slider__label_type_min"></div>')
      .appendTo($wrapper);
    if (vertical) {
      $labelElementMin.css({
        left: `${this.LABEL_OFFSET_TOP}rem`,
        top: `${this.thumbCoordinateMin - this.LABEL_TOP_CORRECTION}rem`,
        zIndex: this.thumbCoordinateMin > (this.trackSize / 2) * this.REM ? 100 : 50,
      });
      $labelElementMin.addClass('slider__label_type_vertical');
    } else {
      $labelElementMin.css({
        left: `${this.thumbCoordinateMin - this.LABEL_OFFSET_LEFT}rem`,
        zIndex: this.thumbCoordinateMin > (this.trackSize / 2) * this.REM ? 100 : 50,
      });
    }
    $labelElementMin.text(this.sliderSettings.valueMin || this.sliderSettings.min);

    const $labelElementMax = $('<div class="slider__label js-slider__label slider__label_type_max js-slider__label_type_max"></div>')
      .appendTo($wrapper);
    if (vertical) {
      $labelElementMax.css({
        top: `${this.thumbCoordinateMax - this.LABEL_TOP_CORRECTION}rem`,
        left: `${this.LABEL_OFFSET_TOP}rem`,
        zIndex: this.thumbCoordinateMax > (this.trackSize / 2) * this.REM ? 50 : 100,
      });
      $labelElementMax.addClass('slider__label_type_vertical');
    } else {
      $labelElementMax.css({
        left: `${this.thumbCoordinateMax - this.LABEL_OFFSET_LEFT}rem`,
        zIndex: this.thumbCoordinateMax > (this.trackSize / 2) * this.REM ? 50 : 100,
      });
    }
    $labelElementMax.text(this.sliderSettings.valueMax || this.sliderSettings.max);
  }
}

export default View;
