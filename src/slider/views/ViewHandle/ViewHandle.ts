import autoBind from 'auto-bind';
import View from '../View/View';
import { SliderElementOptions } from '../../../types/types';
import ViewUpdating from '../ViewUpdating/ViewUpdating';
import ViewOnTrack from '../ViewOnTrack/ViewOnTrack';

class ViewHandle {
    private coordinateXStart: number;

    private shift: number;

    private coordinateYStart: number;

    private coordinateStep: number[];

    private stepValues: number[];

    private trackElement: HTMLElement;

    private step: number | undefined;

    private min: number;

    private max: number;

    private range: boolean;

    private vertical: boolean;

    private progress: boolean;

    private label: boolean | undefined;

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
        step, vertical, range, progress, min, max, $element, label,
      } = options;

      this.step = step;
      this.min = min;
      this.max = max;
      this.range = range;
      this.vertical = vertical;
      this.progress = progress;
      this.label = label;
      const trackElement = $element.find('.js-slider__track').get(0);
      this.trackWidth = trackElement.getBoundingClientRect().width;
      this.trackHeight = trackElement.getBoundingClientRect().height;
      const thumbCollection = $element.find('.js-slider__thumb');
      this.thumbElement = (thumbCollection.get(0));
      const thumbWidth = this.thumbElement.getBoundingClientRect().width;
      this.$element = $element;

      if (step) {
        this.view.notifyAll({
          value: {
            min,
            max,
            step,
            vertical,
            trackSize: vertical
              ? Math.round(this.trackHeight - thumbWidth)
              : Math.round(this.trackWidth - thumbWidth),
          },
          type: 'getScaleData',
        });

        this.coordinateStep = this.view.scaleData.coordinates;
        this.stepValues = this.view.scaleData.value;
      }

      this.thumbElement.addEventListener('mousedown', this.handleDocumentMousedown);
      if (range) {
        this.thumbElementMax = thumbCollection.get(1);
        this.thumbElementMax.addEventListener('mousedown', this.handleDocumentMousedown);
      }

      [...$element.find('.js-slider__thumb')].forEach((value) => {
        this.trackElement = (((value as HTMLElement).parentElement as HTMLElement)
          .querySelector('.js-slider__track') as HTMLElement);

        this.step = step;
        this.min = min;
        this.max = max;
        this.range = range;
        this.vertical = vertical;
        this.progress = progress;
      });

      const sliderElement = $element.find('.js-slider')[0];
      sliderElement.addEventListener('click', (event) => this.viewOnTrack.handleSliderElementClick({
        event,
        trackElement,
        coordinatesStep: this.coordinateStep,
        progress,
        min,
        max,
        vertical,
        range,
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

      this.vertical
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
        vertical: this.vertical,
        range: this.range,
        trackWidth: this.trackWidth,
        trackHeight: this.trackHeight,
        thumbDistance: this.view.distance,
        thumbElement: this.thumbElement,
        shift: this.shift,
        trackElement: this.trackElement,
        coordinateStep: this.coordinateStep ? this.coordinateStep[1] : undefined,
        coordinatesStep: this.coordinateStep,
      });

      const optionsForData = {
        min: this.min,
        max: this.max,
        trackElement: this.trackElement,
        distance: this.vertical ? parseFloat(this.thumbElement.style.top)
          : parseFloat(this.thumbElement.style.left),
        vertical: this.vertical,
        thumbElement: this.thumbElement,
        progress: this.progress,
        progressSize: this.vertical ? parseFloat(this.thumbElement.style.top)
          : parseFloat(this.thumbElement.style.left),
        range: this.range,
        $wrapper: this.$element,
      };

      this.view.updateData(optionsForData);
    }

    private handleDocumentMousedown(event): void {
      if (event.target.classList.contains('js-slider__thumb')) {
        this.thumbElement = event.target;

        const isVertical = (event.target as HTMLElement).classList.contains('js-slider__thumb_type_vertical');
        if (isVertical) {
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
        { $element: this.$element, range: this.range },
      );
      this.view.reloadSlider({
        ...this.view.sliderSettings, valueMin, valueMax, value,
      });
      $(window).off('resize', this.handleWindowResize);
    }

    private static getLabelValue(options: {$element: JQuery; range: boolean}):
      { valueMin?: number; valueMax?: number; value?: number } {
      const { $element, range } = options;
      if (range) {
        const valueMin = parseInt($element.find('.js-slider__label_type_min').text(), 10);
        const valueMax = parseInt($element.find('.js-slider__label_type_max').text(), 10);
        return { valueMin, valueMax };
      }
      const value = parseInt($element.find('.js-slider__label').text(), 10);
      return { value };
    }
}

export default ViewHandle;
