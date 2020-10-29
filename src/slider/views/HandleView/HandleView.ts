import autoBind from 'auto-bind';

import { SliderElementOptions, SliderOptions } from '../../../types/types';
import Observable from '../../Observable/Observable';

interface UpdatingDataOptions {
  trackElement: HTMLElement;
  distance: number;
  thumbElement: HTMLElement;
}

interface ClickOptions {
  isVertical: boolean;
  isRange: boolean;
  event: MouseEvent;
  trackElement: HTMLElement;
  trackSize: number;
}

type GetThumbOptions = Omit<ClickOptions, 'isVertical' | 'isRange'>;

interface TrackElementOptions {
  event: MouseEvent;
  trackElement: HTMLElement;
  isVertical: boolean;
  thumbElement: HTMLElement;
}

interface AddDragAndDropOptions extends SliderElementOptions{
  trackSize: number;
}

class HandleView extends Observable {
  private coordinateXStart: number;

  private coordinateYStart: number;

  private shift: number;

  private trackElement: HTMLElement;

  private trackSize: number;

  private thumbElement: HTMLElement | null;

  private thumbElementMax: HTMLElement;

  private settings: SliderElementOptions;

  private fraction: number;

  private distance: number;

  private parentElement: HTMLElement;

  constructor() {
    super();
    autoBind(this);
  }

  public addDragAndDrop(options: AddDragAndDropOptions): void {
    const {
      isVertical, isRange, $element, trackSize,
    } = options;
    this.trackSize = trackSize;
    this.settings = options;

    this.trackElement = $element.find('.js-slider__track').get(0);
    const thumbCollection = $element.find('.js-slider__thumb');
    this.thumbElement = (thumbCollection.get(0));

    this.thumbElement.addEventListener('mousedown', this.handleThumbElementMousedown);
    if (isRange) {
      this.thumbElementMax = thumbCollection.get(1);
      this.thumbElementMax.addEventListener('mousedown', this.handleThumbElementMousedown);
    }

    const sliderElement = $element[0];
    sliderElement.addEventListener('click', (event) => this.handleSliderElementClick({
      event,
      trackElement: this.trackElement,
      isVertical,
      isRange,
      trackSize,
    }));

    $(window).on('resize', this.handleWindowResize);
  }

  public createBasicNodes(settings: SliderElementOptions): void {
    const { $element, isVertical } = settings;

    if (!document.contains($element[0])) {
      const sliderElement = $('<div class="slider js-slider"></div>');
      this.settings.$element = sliderElement.appendTo(this.parentElement);
    }
    const $trackElement = $('<div class="slider__track js-slider__track"></div>');
    const $thumbElement = $('</div><div class="slider__thumb js-slider__thumb">');
    if ($element.find('.js-slider__track').length === 0) {
      $trackElement.appendTo($element);
    }
    if ($element.find('.js-slider__thumb').length === 0) {
      $thumbElement.appendTo($element);
    }
    if (isVertical) {
      $element.addClass('slider_type_vertical');
    }
  }

  public reloadSlider(options: SliderOptions): void {
    this.settings = { ...this.settings, ...options };
    const { $element } = this.settings;

    if ($element.length !== 0) {
      if ($element[0].parentElement) {
        this.parentElement = $element[0].parentElement;
      }
      $element.parent().empty();
    }
    this.createBasicNodes(this.settings);
    this.notifyAll({ value: this.settings, type: 'recreate' });
  }

  public updateData(options: UpdatingDataOptions): void {
    const {
      trackElement, distance, thumbElement,
    } = options;
    const { isVertical } = this.settings;

    const trackSize = isVertical
      ? trackElement.getBoundingClientRect().height
      : trackElement.getBoundingClientRect().width;
    const thumbSize = thumbElement.getBoundingClientRect().width;

    const fraction = (distance / Math.round(trackSize - thumbSize));

    const isDistance = distance || distance === 0;
    if (isDistance) {
      this.notifyAll({ value: { fraction, thumbElement }, type: 'updateLabelValue' });
      const { valueMin, valueMax, value } = HandleView.getLabelValue(
        { $element: this.settings.$element, isRange: this.settings.isRange },
      );
      this.notifyAll({
        value: {
          ...this.settings, valueMin, valueMax, value,
        },
        type: 'updateOptions',
      });
    }
  }

  public getFractionOfValue(fraction: number): void {
    this.fraction = fraction;
  }

  private handleSliderElementClick(options: ClickOptions): void {
    const {
      event, trackElement, isVertical, isRange, trackSize,
    } = options;

    const target = event.target as HTMLElement;

    const isItemElement = target.classList.contains('js-slider__scale-item');
    const isTrackElement = target === trackElement || target.classList.contains('js-slider__progress');
    const isClickedElement = isItemElement || isTrackElement;
    if (isClickedElement) {
      this.thumbElement = isRange ? this.getRangeThumbElement({ event, trackElement, trackSize })
        : this.settings.$element.find('.js-slider__thumb')[0];

      if (isItemElement) {
        const value = Number(target.textContent);
        this.notifyAll({ value, type: 'getFractionOfValue' });
        this.distance = this.fraction * trackSize;
      } else {
        this.distance = HandleView.getDistance({
          event, thumbElement: this.thumbElement, trackElement, isVertical,
        });
      }
      this.notifyAll({
        value: {
          thumbElement: this.thumbElement,
          shift: this.distance,
          trackSize,
        },
        type: 'setThumbPosition',
      });
      const keyPosition = isVertical ? 'top' : 'left';
      const thumbCoordinate = parseFloat(this.thumbElement.style[keyPosition]);
      this.updateData({
        distance: thumbCoordinate,
        trackElement,
        thumbElement: this.thumbElement,
      });
    }
  }

  private handleDocumentMousemove(event: MouseEvent): void {
    event.preventDefault();

    const { isVertical, isRange } = this.settings;
    const coordinateStart = isVertical ? this.coordinateYStart : this.coordinateXStart;
    const coordinateMove = isVertical ? event.clientY : event.clientX;
    this.notifyAll({ value: { coordinateStart, coordinateMove }, type: 'getDistance' });

    if (this.thumbElement) {
      this.notifyAll({
        value: {
          thumbElement: this.thumbElement,
          shift: Math.round(this.shift),
          trackSize: this.trackSize,
          coordinateStart,
          coordinateMove,
        },
        type: 'setThumbPosition',
      });

      if (isRange) {
        this.notifyAll({
          value: { thumbElement: this.thumbElement, trackSize: this.trackSize },
          type: 'changeZIndex',
        });
      }

      const optionsForData = {
        trackElement: this.trackElement,
        distance: isVertical ? parseFloat(this.thumbElement.style.top)
          : parseFloat(this.thumbElement.style.left),
        thumbElement: this.thumbElement,
        progressSize: isVertical ? parseFloat(this.thumbElement.style.top)
          : parseFloat(this.thumbElement.style.left),
      };

      this.updateData(optionsForData);
    }
  }

  private handleThumbElementMousedown(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    const isTargetLabel = targetElement.classList.contains('js-slider__label');
    const isTargetThumbOrLabel = isTargetLabel || targetElement.classList.contains('js-slider__thumb');
    if (isTargetThumbOrLabel) {
      this.thumbElement = isTargetLabel ? targetElement.parentElement : targetElement;

      const { isVertical } = this.settings;
      if (isVertical && this.thumbElement) {
        this.coordinateYStart = event.clientY;
        this.shift = parseFloat(this.thumbElement.style.top);
      } else if (this.thumbElement) {
        this.coordinateXStart = event.clientX;
        this.shift = parseFloat(this.thumbElement.style.left);
      }

      const handleDocumentMouseup = (): void => {
        document.removeEventListener('mousemove', this.handleDocumentMousemove);
        document.removeEventListener('mouseup', handleDocumentMouseup);
      };

      document.addEventListener('mousemove', this.handleDocumentMousemove);
      document.addEventListener('mouseup', handleDocumentMouseup);
    }
  }

  private getRangeThumbElement(options: GetThumbOptions): HTMLElement {
    const { trackElement, event, trackSize } = options;
    const { $element, isVertical } = this.settings;

    const thumbMin = $element.find('.js-slider__thumb_type_min')[0];
    const thumbMax = $element.find('.js-slider__thumb_type_max')[0];
    const key = isVertical ? 'top' : 'left';
    const startPosition = trackElement.getBoundingClientRect()[key];
    const coordinateOfMiddle = startPosition + (trackSize / 2);
    const position = isVertical ? event.clientY : event.clientX;

    if (position < coordinateOfMiddle) {
      return thumbMin;
    }
    return thumbMax;
  }

  private handleWindowResize(): void {
    const { valueMin, valueMax, value } = HandleView.getLabelValue(
      { $element: this.settings.$element, isRange: this.settings.isRange },
    );

    this.reloadSlider({
      ...this.settings, valueMin, valueMax, value,
    });
    $(window).off('resize', this.handleWindowResize);
  }

  private static getDistance(options: TrackElementOptions): number {
    const {
      event, trackElement, isVertical, thumbElement,
    } = options;

    const thumbDistance = isVertical
      ? event.clientY - trackElement.getBoundingClientRect().top - thumbElement
        .getBoundingClientRect().height / 2
      : event.clientX - trackElement.getBoundingClientRect().left
      - thumbElement.getBoundingClientRect().width / 2;
    if (thumbDistance < 0) {
      return 0;
    }
    return thumbDistance;
  }

  private static getLabelValue(options: {$element: JQuery<HTMLElement>; isRange: boolean}):
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
