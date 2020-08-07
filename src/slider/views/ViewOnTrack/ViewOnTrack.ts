import View from '../View/View';
import ViewUpdating from '../ViewUpdating/ViewUpdating';
import { SliderBasicOptions } from '../../../types/types';

interface TrackElementOptions {
  event: MouseEvent;
  trackElement: HTMLElement;
}

interface TrackClickOptions extends SliderBasicOptions, TrackElementOptions {
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
      event, trackElement, vertical, step, range, progress,
    } = options;
    this.vertical = vertical;
    const target = event.target as HTMLElement;

    const isItemElement = target.classList.contains('js-slider__scale-item');
    const isTrackElement = target === trackElement || target.classList.contains('js-slider__progress');
    const isClickedElement = isItemElement || isTrackElement;
    if (isClickedElement) {
      const trackHeight = this.view.$trackElement[0].getBoundingClientRect().height;
      const trackWidth = this.view.$trackElement[0].getBoundingClientRect().width;
      this.thumbList = this.view.$wrapper[0].querySelectorAll('.js-slider__thumb');
      this.trackSize = this.vertical ? trackHeight : trackWidth;

      this.thumbElement = range ? this.getRangeThumbElement(event) as HTMLElement
        : this.thumbList[0] as HTMLElement;

      if (isItemElement) {
        this.view.notifyAll({
          value: Number(target.textContent),
          type: 'getCoordinates',
        });
      }
      const distance = isItemElement
        ? this.view.coordinate
        : this.getDistance({ event, trackElement });

      this.viewUpdating.updateThumbCoordinates({
        vertical,
        range,
        thumbDistance: distance,
        step,
        thumbElement: this.thumbElement,
        shift: 0,
        trackWidth,
        trackHeight,
        trackElement,
        stepValues: step ? this.view.scaleData.value : undefined,
      });


      this.view.updateData({
        vertical,
        progress,
        trackElement,
        distance: this.vertical ? parseFloat(this.thumbElement.style.top)
          : parseFloat(this.thumbElement.style.left),
        thumbElement: this.thumbElement,
        labelValue: isItemElement ? Number(target.textContent) : undefined,
      });
    }
  }

  private getRangeThumbElement(event: MouseEvent): HTMLElement {
    const thumbMin = this.thumbList[0] as HTMLElement;
    const thumbMax = this.thumbList[1]as HTMLElement;
    const trackPositionKey = this.vertical ? 'top' : 'left';

    const coordinateOfMiddle = ViewUpdating.getCoordinatesOfMiddle({
      start: this.view.$trackElement[0].getBoundingClientRect()[trackPositionKey],
      itemSize: this.trackSize,
    });
    const position = this.vertical ? event.pageY - window.scrollY : event.pageX;

    if (position < coordinateOfMiddle) {
      return thumbMin;
    }
    return thumbMax;
  }

  private getDistance(options: TrackElementOptions): number {
    const { event, trackElement } = options;

    const thumbDistance = this.vertical
      ? event.pageY - window.scrollY - trackElement.getBoundingClientRect().top - this.thumbElement
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
