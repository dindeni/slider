import ViewOptional from '../ViewOptional/ViewOptional';
import View from '../View/View';
import Presenter from '../../Presenter/Presenter';
import { SliderElementOptions } from '../../../types/types';
import ViewUpdating from '../ViewUpdating/ViewUpdating';
import ViewOnTrack from '../ViewOnTrack/ViewOnTrack';

class ViewHandle {
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

    private value: HTMLElement;

    private valueMax: HTMLElement;

    private trackWidth: number;

    private trackHeight: number;

    private viewOptional: ViewOptional = new ViewOptional();

    private view: View = new View();

    private presenter: Presenter = new Presenter();

    private viewOnTrack: ViewOnTrack = new ViewOnTrack();

    private viewUpdatingCoordinates: ViewUpdating = new ViewUpdating();

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
      this.value = (thumbCollection.get(0));

      if (step) {
        const stepData = this.presenter.calculateLeftScaleCoordinates({
          min,
          max,
          step,
          vertical,
          trackWidth: this.trackWidth,
          trackHeight: this.trackHeight,
        });

        this.coordinateStep = stepData.coordinates;
        this.stepValues = stepData.value;
      }

      this.value.addEventListener('mousedown', this.handleDocumentMousedown.bind(this));
      if (range) {
        this.valueMax = thumbCollection.get(1);
        this.valueMax.addEventListener('mousedown', this.handleDocumentMousedown.bind(this));
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
      this.view = new View();
    }

    private handleDocumentMove(event): void {
      event.preventDefault();

      const thumbDistance = this.vertical ? Presenter.calculateThumbDistance({
        coordinateStart: this.coordinateYStart,
        coordinateMove: event.screenY,
      }) : Presenter.calculateThumbDistance(
        { coordinateStart: this.coordinateXStart, coordinateMove: event.screenX },
      );

      this.viewUpdatingCoordinates.updateThumbCoordinates({
        step: this.step,
        vertical: this.vertical,
        range: this.range,
        trackWidth: this.trackWidth,
        trackHeight: this.trackHeight,
        thumbDistance,
        thumbElement: this.value,
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
        distance: this.vertical ? parseFloat(this.value.style.top)
          : parseFloat(this.value.style.left),
        vertical: this.vertical,
        thumbElement: this.value,
        progress: this.progress,
        progressSize: this.vertical ? parseFloat(this.value.style.top)
          : parseFloat(this.value.style.left),
      };

      this.view.updateData(optionsForData);
    }

    private handleDocumentMousedown(event): void {
      if (event.target.classList.contains('js-slider__thumb')) {
        this.value = event.target;

        const isVertical = (event.target as HTMLElement).classList.contains('js-slider__thumb_vertical');
        if (isVertical) {
          this.coordinateYStart = event.screenY;
          this.shift = parseFloat((event.target as HTMLElement).style.top);
        } else {
          this.coordinateXStart = event.screenX;
          this.shift = parseFloat((event.target as HTMLElement).style.left);
        }
        const bindMove = this.handleDocumentMove.bind(this);

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
