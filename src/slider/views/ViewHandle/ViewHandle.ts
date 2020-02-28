import ViewOptional from '../ViewOptional/ViewOptional';
import View from '../View/View';
import { SliderElementOptions } from '../../../types/types';
import ViewUpdating from '../ViewUpdating/ViewUpdating';
import ViewOnTrack from '../ViewOnTrack/ViewOnTrack';
import Observable from '../../Observable/Observable';

interface ConstructorForHandle {
  view: View;
  viewOnTrack: ViewOnTrack;
  viewUpdating: ViewUpdating;
}

class ViewHandle extends Observable {
    private coordinateXStart: number;

    private shift: number;

    private coordinateYStart: number;

    private coordinateStep: number[];

    private stepValues: number[];

    private rem = 0.077;

    private trackElement: HTMLElement;

    private step: number | undefined;

    private min: number;

    private max: number;

    private range: boolean;

    private vertical: boolean;

    private progress: boolean;

    private thumbElement: HTMLElement;

    private thumbElementMax: HTMLElement;

    private trackWidth: number;

    private trackHeight: number;

    private viewOptional: ViewOptional = new ViewOptional();

    private view: View;

    private viewOnTrack: ViewOnTrack;

    private viewUpdating: ViewUpdating = new ViewUpdating();

    constructor(options: ConstructorForHandle) {
      super();
      const { view, viewOnTrack, viewUpdating } = options;
      this.view = view;
      this.viewOnTrack = viewOnTrack;
      this.viewUpdating = viewUpdating;
    }

    public addDragAndDrop(options: SliderElementOptions): void {
      const {
        step, vertical, range, progress, min, max, $element,
      } = options;

      this.step = step;
      this.min = min;
      this.max = max;
      this.range = range;
      this.vertical = vertical;
      this.progress = progress;
      const trackElement = $element.find('.js-slider__track').get(0);
      this.trackWidth = trackElement.getBoundingClientRect().width;
      this.trackHeight = trackElement.getBoundingClientRect().height;
      const thumbCollection = $element.find('.js-slider__thumb');
      this.thumbElement = (thumbCollection.get(0));

      if (step) {
        const stepData = this.notifyAllForScale({
          value: {
            min,
            max,
            step,
            vertical,
            trackWidth: this.trackWidth,
            trackHeight: this.trackHeight,
          },
          type: 'getScaleValue',
        });

        this.coordinateStep = stepData.coordinates;
        this.stepValues = stepData.value;
      }

      this.thumbElement.addEventListener('mousedown', this.handleDocumentMousedown.bind(this));
      if (range) {
        this.thumbElementMax = thumbCollection.get(1);
        this.thumbElementMax.addEventListener('mousedown', this.handleDocumentMousedown.bind(this));
      }

      Array.from($element.find('.js-slider__thumb')).map((value) => {
        this.trackElement = (((value as HTMLElement).parentElement as HTMLElement)
          .querySelector('.js-slider__track') as HTMLElement);

        this.step = step;
        this.min = min;
        this.max = max;
        this.range = range;
        this.vertical = vertical;
        this.progress = progress;
        return undefined;
      });

      trackElement.addEventListener('click', (event) => this.viewOnTrack.handleTrackElementClick({
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

      this.viewOptional = new ViewOptional();
    }

    private handleDocumentMousemove(event): void {
      event.preventDefault();

      const thumbDistance = this.vertical ? this.notifyAll({
        value: {
          coordinateStart: this.coordinateYStart,
          coordinateMove: event.screenY,
        },
        type: 'getDistance',
      }) : this.notifyAll({
        value:
        { coordinateStart: this.coordinateXStart, coordinateMove: event.screenX },
        type: 'getDistance',
      });

      this.viewUpdating.updateThumbCoordinates({
        step: this.step,
        vertical: this.vertical,
        range: this.range,
        trackWidth: this.trackWidth,
        trackHeight: this.trackHeight,
        thumbDistance,
        thumbElement: this.thumbElement,
        event,
        shift: this.shift,
        trackElement: this.trackElement,
        coordinateStep: this.coordinateStep ? this.coordinateStep[1] : undefined,
        coordinatesStep: this.coordinateStep,
      });

      const optionsForData = {
        min: this.min,
        max: this.max,
        trackSize: this.vertical ? this.trackHeight : this.trackWidth,
        distance: this.vertical ? parseFloat(this.thumbElement.style.top)
          : parseFloat(this.thumbElement.style.left),
        vertical: this.vertical,
        thumbElement: this.thumbElement,
        progress: this.progress,
        progressSize: this.vertical ? parseFloat(this.thumbElement.style.top)
          : parseFloat(this.thumbElement.style.left),
      };

      this.view.updateData(optionsForData);
    }

    private handleDocumentMousedown(event): void {
      if (event.target.classList.contains('js-slider__thumb')) {
        this.thumbElement = event.target;

        const isVertical = (event.target as HTMLElement).classList.contains('js-slider__thumb_vertical');
        if (isVertical) {
          this.coordinateYStart = event.screenY;
          this.shift = parseFloat((event.target as HTMLElement).style.top);
        } else {
          this.coordinateXStart = event.screenX;
          this.shift = parseFloat((event.target as HTMLElement).style.left);
        }
        const bindMove = this.handleDocumentMousemove.bind(this);

        const handleDocumentMouseup = (): void => {
          document.removeEventListener('mousemove', bindMove);
          document.removeEventListener('mouseup', handleDocumentMouseup);
        };

        document.addEventListener('mousemove', bindMove);
        document.removeEventListener('mouseup', handleDocumentMouseup);
        document.addEventListener('mouseup', handleDocumentMouseup);
      }
    }
}

export default ViewHandle;
