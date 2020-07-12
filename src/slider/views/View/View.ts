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
}

interface UpdatingLabelOptions {
  value: number;
  thumbElement: HTMLElement;
}

interface UpdatingDataOptions extends ExtremumOptions {
  trackElement: HTMLElement;
  distance: number;
  thumbElement: HTMLElement;
  vertical;
  progress: boolean;
  step?: boolean;
}

class View extends Observable {
  public $thumbElement: JQuery;

  public $thumbElementMin: JQuery;

  public $thumbElementMax: JQuery;

  public thumbCoordinate: number;

  public thumbCoordinateMin: number;

  public thumbCoordinateMax: number;

  public $trackElement: JQuery;

  public coordinate: number;

  public scaleData: ScaleData;

  public sliderSettings: SliderElementOptions;

  public distance: number;

  public coordinateOfMiddle: number;

  public $wrapper: JQuery;

  private trackSize: number;

  private thumbSize: number;

  private valueForLabel: number;

  private viewOptional: ViewOptional;

  private viewHandle: ViewHandle;

  private viewUpdating: ViewUpdating;

  private parentElement: HTMLElement;

  public createElements(options: SliderElementOptions): void {
    const {
      $element, range, vertical, min, max, step, progress, label, valueMin, valueMax, value,
    } = options;

    this.$wrapper = $element;
    this.createBasicNodes();
    this.$trackElement = this.$wrapper.find('.js-slider__track');
    const trackSize = this.$trackElement.width() || 0;
    this.thumbSize = this.$wrapper.find('.slider__thumb').width() || 0;
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
        initialValue: min, vertical, range, max,
      });
    }

    if (progress) {
      this.viewOptional.createProgressNode();
      this.viewOptional.makeProgress();
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
      min, max, trackElement, distance, vertical, thumbElement, progress,
    } = options;

    const trackSize = vertical
      ? trackElement.getBoundingClientRect().height
      : trackElement.getBoundingClientRect().width;
    const thumbSize = thumbElement.getBoundingClientRect().width;

    const valueOptions = {
      min,
      max,
      trackSize: (trackSize - thumbSize),
      distance,
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
      this.viewOptional.makeProgress();
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
    if (step) {
      this.viewOptional.setStepCoordinates();
    }

    if (vertical) {
      this.viewOptional.makeVertical();
    } else if (range) {
      this.$thumbElementMin = this.$wrapper.find('.js-slider__thumb_type_min');
      this.$thumbElementMax = this.$wrapper.find('.js-slider__thumb_type_max');

      this.$thumbElementMin.css({
        left: `${this.thumbCoordinateMin}px`,
        zIndex: this.thumbCoordinateMin > (this.trackSize / 2) ? 100 : 50,
      });

      this.$thumbElementMax.css({
        left: `${this.thumbCoordinateMax}px`,
        zIndex: this.thumbCoordinateMax > (this.trackSize / 2) ? 50 : 100,
      });
    } else {
      this.$thumbElement = this.$wrapper.find('.js-slider__thumb');
      this.$thumbElement.css({
        left: `${this.thumbCoordinate}px`,
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

    if (this.sliderSettings.vertical) {
      this.$wrapper.addClass('slider_type_vertical');
    }
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
      this.$thumbElementMax = $('<div class="slider__thumb js-slider__thumb slider__thumb_type_max js-slider__thumb_type_max"></div>')
        .appendTo(this.$wrapper);
    } else {
      this.$thumbElement = this.$wrapper.find('.js-slider__thumb');
    }
  }

  private createLabel(options: LabelCreationOptions): void {
    const { vertical, range } = options;

    if (range) {
      this.createRangeLabel();
    } else {
      const $labelElement = $('<div class="slider__label js-slider__label"></div>').appendTo(this.$thumbElement);
      $labelElement.text(this.sliderSettings.value || this.sliderSettings.min);
      if (vertical) {
        $labelElement.addClass('slider__label_type_vertical');
      }
    }
  }

  private createRangeLabel(): void {
    const { vertical } = this.sliderSettings;
    const $labelElementMin = $('<div class="slider__label js-slider__label slider__label_type_min js-slider__label_type_min"></div>')
      .appendTo(this.$thumbElementMin);
    $labelElementMin.css({
      zIndex: this.thumbCoordinateMin > (this.trackSize / 2) ? 100 : 50,
    });
    if (vertical) {
      $labelElementMin.addClass('slider__label_type_vertical');
    }
    $labelElementMin.text(this.sliderSettings.valueMin || this.sliderSettings.min);

    const $labelElementMax = $('<div class="slider__label js-slider__label slider__label_type_max js-slider__label_type_max"></div>')
      .appendTo(this.$thumbElementMax);
    $labelElementMax.css({
      zIndex: this.thumbCoordinateMax > (this.trackSize / 2) ? 50 : 100,
    });
    $labelElementMax.text(this.sliderSettings.valueMax || this.sliderSettings.max);
  }

  public updateLabelValue(options: UpdatingLabelOptions): void {
    const { value, thumbElement } = options;

    const labelElement: JQuery = $(thumbElement).children();
    labelElement.text(value);

    if (labelElement.hasClass('js-slider__label_type_min')) {
      this.sliderSettings.valueMin = value;
    } else if (labelElement.hasClass('js-slider__label_type_max')) {
      this.sliderSettings.valueMax = value;
    } else {
      this.sliderSettings.value = value;
    }
  }
}

export default View;
