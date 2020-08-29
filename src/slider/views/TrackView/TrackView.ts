import { Slider } from '../../../types/types';
import View from '../View/View';
import ThumbView from '../ThumbView/ThumbView';

interface TrackElementOptions {
  event: MouseEvent;
  trackElement: HTMLElement;
}
interface TrackClickOptions extends Slider, TrackElementOptions {
}

class TrackView {
  readonly view: View;

  private thumbElement: HTMLElement;

  private isVertical: boolean;

  private thumbList: NodeList;

  private trackSize: number;

  private thumbSize: number;

  private $wrapper: JQuery;

  private thumbView: ThumbView;

  constructor(view) {
    this.view = view;
    this.$wrapper = this.view.sliderSettings.$element;
    this.thumbView = new ThumbView(view);
  }

  public handleSliderElementClick(options: TrackClickOptions): void {
    const {
      event, trackElement, isVertical, isRange,
    } = options;
    this.isVertical = isVertical;
    const target = event.target as HTMLElement;

    const isItemElement = target.classList.contains('js-slider__scale-item');
    const isTrackElement = target === trackElement || target.classList.contains('js-slider__progress');
    const isClickedElement = isItemElement || isTrackElement;
    if (isClickedElement) {
      const trackHeight = this.view.$trackElement[0].getBoundingClientRect().height;
      const trackWidth = this.view.$trackElement[0].getBoundingClientRect().width;
      this.thumbList = this.view.$wrapper[0].querySelectorAll('.js-slider__thumb');
      this.trackSize = this.isVertical ? trackHeight : trackWidth;

      this.thumbElement = isRange ? this.getRangeThumbElement(event) as HTMLElement
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

      this.view.thumbView.setThumbPosition({ thumbElement: this.thumbElement, distance });
      this.view.handleView.updateData({ distance, trackElement, thumbElement: this.thumbElement });
    }
  }

  public getTrackSize(): number {
    this.view.$trackElement = this.view.$wrapper.find('.js-slider__track');
    this.thumbSize = this.view.thumbSize;

    const trackSize = this.view.$trackElement.width();

    return Math.round((trackSize || 0) - this.view.thumbSize);
  }

  private getRangeThumbElement(event: MouseEvent): HTMLElement {
    const thumbMin = this.thumbList[0] as HTMLElement;
    const thumbMax = this.thumbList[1]as HTMLElement;
    const trackPositionKey = this.isVertical ? 'top' : 'left';

    const coordinateOfMiddle = ThumbView.getCoordinatesOfMiddle({
      start: this.view.$trackElement[0].getBoundingClientRect()[trackPositionKey],
      itemSize: this.trackSize,
    });
    const position = this.isVertical ? event.pageY - window.scrollY : event.pageX;

    if (position < coordinateOfMiddle) {
      return thumbMin;
    }
    return thumbMax;
  }

  private getDistance(options: TrackElementOptions): number {
    const { event, trackElement } = options;

    const thumbDistance = this.isVertical
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

export default TrackView;
