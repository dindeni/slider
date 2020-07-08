import View from '../View/View';
import ViewUpdating from '../ViewUpdating/ViewUpdating';
import { SliderBasicOptions } from '../../../types/types';

interface TrackElementOptions {
  event: MouseEvent;
  trackElement: HTMLElement;
}

interface TrackClickOptions extends SliderBasicOptions, TrackElementOptions {
  coordinatesStep: number[];
}

class ViewOnTrack {
  readonly view: View;

  private viewUpdating: ViewUpdating;

  private thumbElement: HTMLElement;

  private vertical: boolean;

  private thumbList: NodeList;

  private trackSize: number;

  constructor(view) {
    this.view = view;
    this.viewUpdating = new ViewUpdating(this.view);
  }

  public handleSliderElementClick(options: TrackClickOptions): void {
    const {
      event, trackElement, vertical, step, range, progress, min, max, coordinatesStep,
    } = options;
    this.vertical = vertical;
    const target = event.target as HTMLElement;
    const wrapper = target.parentElement as HTMLElement;

    const isTrack = target === trackElement
      || wrapper.querySelector('.js-slider__progress')
      || wrapper.querySelector('.js-slider__scale-item');
    if (isTrack) {
      const trackHeight = this.view.$trackElement[0].getBoundingClientRect().height;
      const trackWidth = this.view.$trackElement[0].getBoundingClientRect().width;
      this.thumbList = this.view.$wrapper[0].querySelectorAll('.js-slider__thumb');
      this.trackSize = this.vertical ? trackHeight : trackWidth;

      this.thumbElement = range ? this.getRangeThumbElement(event) as HTMLElement
        : this.thumbList[0] as HTMLElement;

      const distance = this.getDistance({ event, trackElement });

      this.viewUpdating.updateThumbCoordinates({
        vertical,
        range,
        thumbDistance: Math.round(distance),
        step,
        thumbElement: this.thumbElement,
        shift: 0,
        trackWidth,
        trackHeight,
        trackElement,
        coordinatesStep,
        stepValues: step ? this.view.scaleData.value : undefined,
      });

      this.view.updateData({
        vertical,
        progress,
        min,
        max,
        range,
        trackElement,
        distance: this.vertical ? parseFloat(this.thumbElement.style.top)
          : parseFloat(this.thumbElement.style.left),
        thumbElement: this.thumbElement,
        $wrapper: $(trackElement).parent(),
      });
    }
  }

  private getRangeThumbElement(event: MouseEvent): HTMLElement {
    const thumbMin = this.thumbList[0] as HTMLElement;
    const thumbMax = this.thumbList[1]as HTMLElement;
    const trackPositionKey = this.vertical ? 'top' : 'left';
    this.view.notifyAll({
      value: {
        start: this.view.$trackElement[0].getBoundingClientRect()[trackPositionKey],
        itemSize: this.trackSize,
      },
      type: 'getCoordinatesOfMiddle',
    });
    const position = this.vertical ? event.pageY - window.scrollY : event.pageX;

    if (position < this.view.coordinateOfMiddle) {
      return thumbMin;
    }
    return thumbMax;
  }

  private getDistance(options: TrackElementOptions): number {
    const { event, trackElement } = options;

    const thumbDistance = this.vertical
      ? event.pageY - window.scrollY - trackElement.getBoundingClientRect().top + this.thumbElement
        .getBoundingClientRect().height / 2
      : event.pageX - trackElement.getBoundingClientRect().left
       - this.thumbElement.getBoundingClientRect().width / 2;
    if (thumbDistance < 0) {
      return 0;
    }
    return thumbDistance;
  }
}

export default ViewOnTrack;
