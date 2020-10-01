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
  private thumbElement: HTMLElement;

  private isVertical: boolean;

  private thumbSize: number;

  private $wrapper: JQuery<HTMLElement>;

  readonly view: View;

  private thumbView: ThumbView;

  constructor(view: View) {
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
      this.thumbElement = isRange ? this.getRangeThumbElement(event)
        : this.$wrapper.find('.js-slider__thumb')[0];

      const distance = isItemElement
        ? this.thumbView.getThumbCoordinate(Number(target.textContent))
        : this.getDistance({ event, trackElement });

      this.view.thumbView.setThumbPosition({ thumbElement: this.thumbElement, distance });
      const keyPosition = isVertical ? 'top' : 'left';
      const thumbCoordinate = parseFloat(this.thumbElement.style[keyPosition]);
      this.view.handleView.updateData({
        distance: thumbCoordinate,
        trackElement,
        thumbElement: this.thumbElement,
      });
    }
  }

  public getTrackSize(): number {
    this.view.$trackElement = this.view.$wrapper.find('.js-slider__track');
    this.thumbSize = this.view.thumbSize;
    const trackSize = this.view.$trackElement.width();

    return Math.round((trackSize || 0) - this.view.thumbSize);
  }

  private getRangeThumbElement(event: MouseEvent): HTMLElement {
    const thumbMin = this.$wrapper.find('.js-slider__thumb_type_min')[0];
    const thumbMax = this.$wrapper.find('.js-slider__thumb_type_max')[0];
    const trackPositionKey = this.isVertical ? 'top' : 'left';

    const coordinateOfMiddle = ThumbView.getCoordinatesOfMiddle({
      start: this.view.$trackElement[0].getBoundingClientRect()[trackPositionKey],
      itemSize: this.view.trackSize,
    });
    const position = this.isVertical ? event.clientY : event.clientX;

    if (position < coordinateOfMiddle) {
      return thumbMin;
    }
    return thumbMax;
  }

  private getDistance(options: TrackElementOptions): number {
    const { event, trackElement } = options;

    const thumbDistance = this.isVertical
      ? event.clientY - trackElement.getBoundingClientRect().top - this.thumbElement
        .getBoundingClientRect().height / 2
      : event.clientX - trackElement.getBoundingClientRect().left
       - this.thumbElement.getBoundingClientRect().width / 2;
    if (thumbDistance < 0) {
      return 0;
    }
    return thumbDistance;
  }
}

export default TrackView;
