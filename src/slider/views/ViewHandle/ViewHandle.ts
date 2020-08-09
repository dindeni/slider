import autoBind from 'auto-bind';

import { SliderElementOptions } from '../../../types/types';
import View from '../View/View';
import ViewUpdating from '../ViewUpdating/ViewUpdating';
import ViewOnTrack from '../ViewOnTrack/ViewOnTrack';

class ViewHandle {
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

  private viewOnTrack: ViewOnTrack;

  private viewUpdating: ViewUpdating;

  constructor(view) {
    this.view = view;
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
      this.thumbElementMax.addEventListener('mousedown', this.handleDocumentMousedown);
    }

    const sliderElement = $element[0];
    sliderElement.addEventListener('click', (event) => this.viewOnTrack.handleSliderElementClick({
      event,
      trackElement: this.trackElement,
      withProgress,
      min,
      max,
      isVertical,
      isRange,
      step,
    }));

    this.viewUpdating = new ViewUpdating(this.view);
    this.viewOnTrack = new ViewOnTrack(this.view);

    $(window).on('resize', this.handleWindowResize);
  }

  public removeWindowEvent(): void {
    $(window).off('resize', this.handleWindowResize);
  }

  private handleDocumentMousemove(event): void {
    event.preventDefault();

    this.isVertical
      ? this.view.notifyAll({
        value: {
          coordinateStart: this.coordinateYStart,
          coordinateMove: event.screenY,
        },
        type: 'getDistance',
      })
      : this.view.notifyAll({
        value: { coordinateStart: this.coordinateXStart, coordinateMove: event.screenX },
        type: 'getDistance',
      });

    this.viewUpdating.updateThumbCoordinates({
      step: this.step,
      isVertical: this.isVertical,
      isRange: this.isRange,
      trackWidth: this.trackWidth,
      trackHeight: this.trackHeight,
      thumbDistance: this.view.distance,
      thumbElement: this.thumbElement,
      shift: this.shift,
      trackElement: this.trackElement,
    });

    const optionsForData = {
      min: this.min,
      max: this.max,
      trackElement: this.trackElement,
      distance: this.isVertical ? parseFloat(this.thumbElement.style.top)
        : parseFloat(this.thumbElement.style.left),
      isVertical: this.isVertical,
      thumbElement: this.thumbElement,
      withProgress: this.withProgress,
      progressSize: this.isVertical ? parseFloat(this.thumbElement.style.top)
        : parseFloat(this.thumbElement.style.left),
      isRange: this.isRange,
      $wrapper: this.$element,
    };

    this.view.updateData(optionsForData);
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
    const { valueMin, valueMax, value } = ViewHandle.getLabelValue(
      { $element: this.$element, isRange: this.isRange },
    );
    this.view.reloadSlider({
      ...this.view.sliderSettings, valueMin, valueMax, value,
    });
    $(window).off('resize', this.handleWindowResize);
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

export default ViewHandle;
