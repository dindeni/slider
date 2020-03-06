import ViewOptional from '../ViewOptional/ViewOptional';
import ViewHandle from '../ViewHandle/ViewHandle';
import ViewUpdating from '../ViewUpdating/ViewUpdating';
import {
  SliderElementOptions, RangeAndVerticalOptions, ExtremumOptions, ScaleData,
} from '../../../types/types';
import Observable from '../../Observable/Observable';

interface OptionsForStylingElements extends RangeAndVerticalOptions{
  wrapper: JQuery;
  step: number | undefined;
}

interface LabelCreationOptions extends RangeAndVerticalOptions{
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

interface ThumbCreationOptions extends RangeAndVerticalOptions{
  wrapper: JQuery;
}

interface UpdatingDataOptions extends ExtremumOptions{
  trackSize: number;
  distance: number;
  vertical;
  thumbElement: HTMLElement;
  progress: boolean;
  step?: boolean;
}

interface OptionsForInitializingProgress extends RangeAndVerticalOptions{
  $wrapper: JQuery;
}

interface SettingStepCoordinatesOptions {
  step: number | undefined;
  range: boolean;
}

interface OptionsForCreateRangeLabel {
  vertical: boolean;
  $wrapper: JQuery;
}

class View extends Observable {
  private $trackElement: JQuery;

  private $thumbElement: JQuery;

  private $thumbElementMin: JQuery;

  private $thumbElementMax: JQuery;

  private LABEL_OFFSET_LEFT = 0.62;

  private LABEL_TOP_CORRECTION = 0.17;

  private REM = 0.077;

  private LABEL_OFFSET_TOP = -4.2;

  private value: number | undefined;

  private valueMin: number | undefined;

  private valueMax: number | undefined;

  private trackSize: number;

  private thumbCoordinate: number;

  private thumbCoordinateMin: number;

  private thumbCoordinateMax: number;

  public coordinate: number;

  private min: number;

  private max: number;

  private valueForLabel: number;

  private viewOptional: ViewOptional;

  private viewHandle: ViewHandle;

  private viewUpdating: ViewUpdating;

  public scaleData: ScaleData;

  public sliderSettings: SliderElementOptions;

  public distance: number;

  public coordinateOfMiddle: number;

  public createElements(options: SliderElementOptions): void {
    const {
      $element, range, vertical, min, max, step, progress, value, valueMin, valueMax, label,
    } = options;

    this.min = min;
    this.max = max;
    this.value = value || undefined;
    this.valueMin = valueMin || undefined;
    this.valueMax = valueMax || undefined;

    const $wrapper: JQuery = step ? $('<div class="slider js-slider slider_step js-slider_step"></div>')
      .appendTo($element) : $('<div class="slider js-slider"></div>')
      .appendTo($element);
    this.$trackElement = $('<div class="slider__track js-slider__track"></div>')
      .appendTo($wrapper);

    this.createThumb({ range, vertical, wrapper: $wrapper });

    this.viewOptional = new ViewOptional(this);
    this.viewHandle = new ViewHandle(this);
    this.viewUpdating = new ViewUpdating(this);

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
        initialValue: min, vertical, range, max, $wrapper,
      });
    }

    if (progress) {
      this.initializeProgress({ vertical, range, $wrapper });
    }
    this.viewHandle.addDragAndDrop(this.sliderSettings);
  }

  public setLabelValue(value: number): void {
    this.valueForLabel = value;
  }

  public setScaleData(scaleData: ScaleData): void {
    this.scaleData = scaleData;
  }

  public getSliderOptions(sliderSettings: SliderElementOptions): void {
    this.sliderSettings = sliderSettings;
  }

  public getDistance(distance: number): void {
    this.distance = distance;
  }

  public getCoordinateOfMiddle(coordinateOfMiddle: number): void {
    this.coordinateOfMiddle = coordinateOfMiddle;
  }

  public updateData(options: UpdatingDataOptions): void {
    const {
      min, max, trackSize, distance, vertical, thumbElement, progress,
    } = options;

    const valueOptions = {
      min,
      max,
      trackSize: Math.round(trackSize),
      distance: distance / this.REM,
    };
    this.notifyAll({ value: valueOptions, type: 'getValue' });

    const optionsForLabel = {
      value: Math.round(this.valueForLabel),
      coordinate: distance,
      vertical,
      thumbElement,
    };

    const isDistance = distance || distance === 0;
    if (isDistance) {
      this.updateLabelValue(optionsForLabel);
    }

    if (progress) {
      this.viewOptional.stylingProgress({
        progressSize: distance,
        vertical,
        thumbElement,
      });
    }
  }

  private initializeProgress(options: OptionsForInitializingProgress): void {
    const { range, vertical, $wrapper } = options;

    ViewOptional.createProgress({ range, wrapper: $wrapper });
    const viewOptional = new ViewOptional(this.notifyAll);
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

  private createThumb(options: ThumbCreationOptions): void {
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

  public setCoordinate(value: number): void {
    this.coordinate = value;
  }

  public stylingElements(options: OptionsForStylingElements): void {
    const {
      range, vertical, wrapper, step,
    } = options;

    this.trackSize = wrapper.find('.slider__track').width() || 0;
    if (range) {
      this.notifyAll({
        value: {
          value: this.valueMin || this.min, min: this.min, max: this.max, trackSize: this.trackSize,
        },
        type: 'getCoordinates',
      });
      this.thumbCoordinateMin = this.coordinate;

      this.notifyAll({
        value: {
          value: this.valueMax || this.max, min: this.min, max: this.max, trackSize: this.trackSize,
        },
        type: 'getCoordinates',
      });
      this.thumbCoordinateMax = this.coordinate;
    } else {
      this.notifyAll({
        value: {
          value: this.value || this.min, min: this.min, max: this.max, trackSize: this.trackSize,
        },
        type: 'getCoordinates',
      });
      this.thumbCoordinate = this.coordinate;
    }
    this.setStepCoordinates({ step, range });

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

  private setStepCoordinates(options: SettingStepCoordinatesOptions): void {
    const { step, range } = options;
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
  }

  private createLabel(options: LabelCreationOptions): void {
    const {
      vertical, range, $wrapper,
    } = options;

    if (range) {
      this.createRangeLabel({ $wrapper, vertical });
    } else {
      const $labelElement = $('<div class="slider__label js-slider__label"></div>')
        .appendTo($wrapper);
      $labelElement.css({
        left: `${this.thumbCoordinate - this.LABEL_OFFSET_LEFT}rem`,
      });
      $labelElement.text(this.value || this.min);
      if (vertical) {
        $labelElement.css({
          top: `${this.thumbCoordinate - this.LABEL_TOP_CORRECTION}rem`,
          left: `${this.LABEL_OFFSET_TOP}rem`,
        });
        $labelElement.addClass('slider__label_vertical');
      }
    }
  }

  private createRangeLabel(options: OptionsForCreateRangeLabel): void {
    const { vertical, $wrapper } = options;

    const $labelElementMin = $('<div class="slider__label js-slider__label slider__label_min js-slider__label_min"></div>')
      .appendTo($wrapper);
    if (vertical) {
      $labelElementMin.css({
        left: `${this.LABEL_OFFSET_TOP}rem`,
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
      .appendTo($wrapper);
    if (vertical) {
      $labelElementMax.css({
        top: `${this.thumbCoordinateMax - this.LABEL_TOP_CORRECTION}rem`,
        left: `${this.LABEL_OFFSET_TOP}rem`,
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
  }

  public updateLabelValue(options: UpdatingLabelOptions): void {
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
