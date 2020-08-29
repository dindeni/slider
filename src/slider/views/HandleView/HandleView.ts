import autoBind from 'auto-bind';

import { SliderElementOptions, SliderOptions } from '../../../types/types';
import View from '../View/View';
import TrackView from '../TrackView/TrackView';
import LabelView from '../LabelView/LabelView';
import ThumbView from '../ThumbView/ThumbView';

interface UpdatingDataOptions {
  trackElement: HTMLElement;
  distance: number;
  thumbElement: HTMLElement;
}

class HandleView {
  private coordinateXStart: number;

  private coordinateYStart: number;

  private shift: number;

  private trackElement: HTMLElement;

  private step: number | undefined;

  private min: number;

  private max: number;

  private isRange: boolean;

  private isVertical: boolean;

  private withProgress: boolean;

  private thumbElement: HTMLElement;

  private thumbElementMax: HTMLElement;

  private trackWidth: number;

  private trackHeight: number;

  private $element: JQuery;

  public sliderValue;

  public sliderSettings: SliderElementOptions;

  readonly view: View;

  private trackView: TrackView;

  private labelView: LabelView;

  private thumbView: ThumbView;

  constructor(view) {
    this.view = view;
    this.thumbView = new ThumbView(view);
    autoBind(this);
  }

  public addDragAndDrop(options: SliderElementOptions): void {
    const {
      step, isVertical, isRange, withProgress, min, max, $element,
    } = options;

    this.step = step;
    this.min = min;
    this.max = max;
    this.isRange = isRange;
    this.isVertical = isVertical;
    this.withProgress = withProgress;
    this.trackElement = $element.find('.js-slider__track').get(0);
    this.trackWidth = this.trackElement.getBoundingClientRect().width;
    this.trackHeight = this.trackElement.getBoundingClientRect().height;
    const thumbCollection = $element.find('.js-slider__thumb');
    this.thumbElement = (thumbCollection.get(0));
    this.$element = $element;

    this.thumbElement.addEventListener('mousedown', this.handleDocumentMousedown);
    if (isRange) {
      this.thumbElementMax = thumbCollection.get(1);
      this.view.$thumbElementMax.get(0).addEventListener('mousedown', this.handleDocumentMousedown);
    }

    const sliderElement = $element[0];
    sliderElement.addEventListener('click', (event) => this.trackView.handleSliderElementClick({
      event,
      trackElement: this.trackElement,
      withProgress,
      min,
      max,
      isVertical,
      isRange,
      step,
    }));

    this.trackView = new TrackView(this.view);
    this.labelView = this.view.labelView;

    $(window).on('resize', this.handleWindowResize);
  }

  public removeWindowEvent(): void {
    $(window).off('resize', this.handleWindowResize);
  }

  private handleDocumentMousemove(event): void {
    event.preventDefault();
    const coordinateStart = this.isVertical ? this.coordinateYStart : this.coordinateXStart;
    const coordinateMove = this.isVertical ? event.screenY : event.screenX;
    this.thumbView.calculateDistance({ coordinateStart, coordinateMove });

    this.thumbView.setThumbPosition({
      thumbElement: this.thumbElement,
      distance: this.view.distance + this.shift,
    });
    if (this.isRange) {
      this.thumbView.changeZIndex(this.thumbElement);
    }

    const optionsForData = {
      trackElement: this.trackElement,
      distance: this.isVertical ? parseFloat(this.thumbElement.style.top)
        : parseFloat(this.thumbElement.style.left),
      thumbElement: this.thumbElement,
      progressSize: this.isVertical ? parseFloat(this.thumbElement.style.top)
        : parseFloat(this.thumbElement.style.left),
    };

    this.updateData(optionsForData);
  }

  private handleDocumentMousedown(event): void {
    if (event.target.classList.contains('js-slider__thumb')) {
      this.thumbElement = event.target;

      if (this.view.sliderSettings.isVertical) {
        this.coordinateYStart = event.screenY;
        this.shift = parseFloat((event.target as HTMLElement).style.top);
      } else {
        this.coordinateXStart = event.screenX;
        this.shift = parseFloat((event.target as HTMLElement).style.left);
      }

      const handleDocumentMouseup = (): void => {
        document.removeEventListener('mousemove', this.handleDocumentMousemove);
        document.removeEventListener('mouseup', handleDocumentMouseup);
      };

      document.addEventListener('mousemove', this.handleDocumentMousemove);
      document.removeEventListener('mouseup', handleDocumentMouseup);
      document.addEventListener('mouseup', handleDocumentMouseup);
    }
  }

  private handleWindowResize(): void {
    const { valueMin, valueMax, value } = HandleView.getLabelValue(
      { $element: this.$element, isRange: this.isRange },
    );
    this.reloadSlider({
      ...this.view.sliderSettings, valueMin, valueMax, value,
    });
    $(window).off('resize', this.handleWindowResize);
  }

  public updateData(options: UpdatingDataOptions): void {
    const {
      trackElement, distance, thumbElement,
    } = options;
    const { isVertical, withProgress } = this.view.sliderSettings;

    const trackSize = isVertical
      ? trackElement.getBoundingClientRect().height
      : trackElement.getBoundingClientRect().width;
    const thumbSize = thumbElement.getBoundingClientRect().width;

    const fraction = (distance / Math.round(trackSize - thumbSize));
    this.view.labelView.calculateSliderValue(fraction);

    const optionsForLabel = {
      value: this.labelView.labelValue,
      coordinate: distance,
      isVertical,
      thumbElement,
    };

    const isDistance = distance || distance === 0;
    if (isDistance) {
      this.labelView.updateLabelValue(optionsForLabel);
      this.view.notifyAll({ value: this.view.sliderSettings, type: 'updateOptions' });
    }

    if (withProgress) {
      this.view.progressView.makeProgress();
    }
  }

  public createBasicNodes(): void {
    if (this.view.$wrapper.parent().find('.js-slider').length === 0) {
      const sliderElement = $('<div class="slider js-slider"></div>');
      this.view.$wrapper = sliderElement.appendTo(this.view.parentElement);
      this.view.sliderSettings.$element = this.view.$wrapper;
    }
    const $sliderElements = $('<div class="slider__track js-slider__track">'
      + '</div><div class="slider__thumb js-slider__thumb"></div>');
    $sliderElements.appendTo(this.view.$wrapper);

    if (this.view.sliderSettings.isVertical) {
      this.view.$wrapper.addClass('slider_type_vertical');
    }
  }

  public reloadSlider(options: SliderOptions): void {
    this.view.sliderSettings = { ...this.view.sliderSettings, ...options };
    const { handleView } = this.view;

    const sliderElement = this.view.sliderSettings.$element;
    if (sliderElement.length !== 0) {
      handleView.removeWindowEvent();
      this.view.parentElement = sliderElement[0].parentElement as HTMLElement;
      $(this.view.parentElement).empty();
      this.view.createElements(this.view.sliderSettings);
    }
  }

  private static getLabelValue(options: {$element: JQuery; isRange: boolean}):
      { valueMin?: number; valueMax?: number; value?: number } {
    const { $element, isRange } = options;
    if (isRange) {
      const valueMin = parseInt($element.find('.js-slider__label_type_min').text(), 10);
      const valueMax = parseInt($element.find('.js-slider__label_type_max').text(), 10);
      return { valueMin, valueMax };
    }
    const value = parseInt($element.find('.js-slider__label').text(), 10);
    return { value };
  }
}

export default HandleView;
