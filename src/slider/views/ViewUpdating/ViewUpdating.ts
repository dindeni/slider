import { Slider, TrackSizesOptions, CoordinateOfMiddleOptions } from '../../../types/types';
import ViewOptional from '../ViewOptional/ViewOptional';
import View from '../View/View';

interface ThumbUpdatingOptions extends Pick<Slider, 'isVertical' | 'isRange' | 'step'> {
  thumbDistance: number;
  thumbElement: HTMLElement;
  shift: number;
  trackElement: HTMLElement;
  trackWidth: number;
  trackHeight: number;
  stepValues?: number[];
}
interface OptionsForSettingElementNotStep extends TrackSizesOptions {
  thumbElement: HTMLElement;
  thumbMin?: HTMLElement;
  thumbMax?: HTMLElement;
  thumbMinTop?: number;
  thumbMaxTop?: number;
  thumbMinLeft?: number;
  thumbMaxLeft?: number;
}
interface SettingStepPositionOptions extends Pick<Slider, 'isVertical' | 'isRange'> {
  thumbElement: HTMLElement;
  stepValues: number[];
  thumbMin?: HTMLElement;
  thumbMax?: HTMLElement;
  thumbMinTop?: number;
  thumbMaxTop?: number;
  thumbMinLeft?: number;
  thumbMaxLeft?: number;
}

interface SettingZIndexOptions extends TrackSizesOptions {
  isVertical: boolean;
  trackElement: HTMLElement;
  thumbMin?: HTMLElement;
  thumbMax?: HTMLElement;
}
interface ThumbExtremumOptions {
  trackWidth: number;
  trackHeight: number;
  isVertical: boolean;
  thumbWidth: number;
}

class ViewUpdating {
  public thumbLeft: number;

  public thumbTop: number;

  private thumbElement: HTMLElement;

  private distance: number;

  private keyCoordinate: string;

  private viewOptional: ViewOptional;

  readonly view: View;

  constructor(view) {
    this.view = view;
    this.viewOptional = new ViewOptional(this.view);
  }

  public updateThumbCoordinates(options: ThumbUpdatingOptions): void {
    const {
      isVertical, step, thumbDistance, shift, thumbElement, trackHeight, trackWidth,
      isRange, trackElement, stepValues,
    } = options;

    this.distance = thumbDistance + shift;
    this.thumbElement = thumbElement;
    this.keyCoordinate = isVertical ? 'top' : 'left';

    const getRangeValues = (): {
      thumbMin: HTMLElement | undefined;
      thumbMax: HTMLElement | undefined;
      thumbMinLeft: number | undefined; thumbMaxLeft: number | undefined;
      thumbMinTop: number | undefined; thumbMaxTop: number | undefined;
    } => {
      if (isRange) {
        const thumbMin = (thumbElement.parentElement as HTMLElement).querySelector('.js-slider__thumb_type_min') as HTMLElement;
        const thumbMax = (thumbElement.parentElement as HTMLElement).querySelector('.js-slider__thumb_type_max') as HTMLElement;
        const thumbMinLeft = parseFloat((thumbMin as HTMLElement).style.left);
        const thumbMaxLeft = parseFloat((thumbMax as HTMLElement).style.left);
        const thumbMinTop = parseFloat((thumbMin as HTMLElement).style.top);
        const thumbMaxTop = parseFloat((thumbMax as HTMLElement).style.top);

        return {
          thumbMin, thumbMax, thumbMinLeft, thumbMaxLeft, thumbMinTop, thumbMaxTop,
        };
      }
      return {
        thumbMin: undefined,
        thumbMax: undefined,
        thumbMinLeft: undefined,
        thumbMaxLeft: undefined,
        thumbMinTop: undefined,
        thumbMaxTop: undefined,
      };
    };

    const {
      thumbMin, thumbMax, thumbMinLeft, thumbMaxLeft, thumbMinTop,
      thumbMaxTop,
    } = getRangeValues();
    this.setRangeZIndex({
      isVertical, trackWidth, trackHeight, thumbMax, thumbMin, trackElement,
    });

    if (step) {
      this.setStepPosition({
        isVertical,
        isRange,
        stepValues: stepValues || [],
        thumbMin,
        thumbMax,
        thumbElement,
      });

      isVertical ? this.thumbTop = parseFloat(thumbElement.style.top)
        : this.thumbLeft = parseFloat(thumbElement.style.left);
    } else {
      this.setElementsNotStep({
        thumbElement,
        trackWidth,
        trackHeight,
        thumbMin,
        thumbMax,
        thumbMinLeft,
        thumbMaxLeft,
        thumbMinTop,
        thumbMaxTop,
      });
    }
  }

  public static getCoordinatesOfMiddle(options: CoordinateOfMiddleOptions): number {
    const { start, itemSize } = options;
    return start + itemSize / 2;
  }

  private setElementsNotStep(options: OptionsForSettingElementNotStep): void {
    const {
      trackWidth, trackHeight, thumbElement, thumbMin, thumbMax,
      thumbMinLeft, thumbMaxLeft, thumbMinTop, thumbMaxTop,
    } = options;
    const { isVertical } = this.view.sliderSettings;

    const thumbWidth = thumbElement.getBoundingClientRect().width;

    const isValidMinAndMaxLeft = !isVertical
      && ((thumbElement === thumbMin
      && thumbMaxLeft
      && (this.distance < thumbMaxLeft))
      || (thumbElement === thumbMax
      && (thumbMinLeft || thumbMinLeft === 0)
      && (this.distance > thumbMinLeft)));
    const isValidMinAndMaxTop = isVertical
      && ((thumbElement === thumbMin
      && thumbMaxTop
      && (this.distance < thumbMaxTop))
      || (thumbElement === thumbMax
      && (thumbMinTop || thumbMinTop === 0)
      && (this.distance > thumbMinTop)));

    const setRangeCoordinate = (): void => {
      if (isValidMinAndMaxLeft) {
        this.thumbElement.style.left = `${this.distance}px`;
        this.thumbLeft = this.distance;
      } else if (isValidMinAndMaxTop) {
        this.thumbElement.style.top = `${this.distance}px`;
        this.thumbTop = this.distance;
      }
    };

    if (this.view.sliderSettings.isRange) {
      setRangeCoordinate();
    } else {
      this.thumbElement.style[this.keyCoordinate] = `${this.distance}px`;
      isVertical ? this.thumbTop = this.distance : this.thumbLeft = this.distance;
    }
    this.checkThumbExtremum({
      isVertical, trackWidth, trackHeight, thumbWidth,
    });
  }

  private checkThumbExtremum(options: ThumbExtremumOptions): void {
    const {
      trackWidth, trackHeight, isVertical, thumbWidth,
    } = options;

    const thumbCoordinate = isVertical ? this.thumbElement.style.top : this.thumbElement.style.left;
    const coordinateKey = isVertical ? 'top' : 'left';
    const trackSize = isVertical ? trackHeight - thumbWidth : trackWidth - thumbWidth;

    if (parseFloat(thumbCoordinate) < 0) {
      this.thumbElement.style[coordinateKey] = '0px';
    } else if (parseFloat(thumbCoordinate) > trackSize) {
      this.thumbElement.style[coordinateKey] = `${trackSize}px`;
    }
  }

  private setStepPosition(options: SettingStepPositionOptions): void {
    const {
      isRange, stepValues, isVertical, thumbMin, thumbMax,
      thumbElement,
    } = options;

    const data = ViewOptional.checkStepData({
      checkedCoordinate: (this.distance),
      data: { coordinates: this.view.scaleData.coordinates, value: stepValues },
    });
    const coordinateKey = isVertical ? 'top' : 'left';
    const thumbMinCoordinate = thumbMin ? parseFloat(thumbMin.style[coordinateKey]) : undefined;
    const thumbMaxCoordinate = thumbMax
      ? parseFloat((thumbMax as HTMLElement).style[coordinateKey])
      : undefined;

    const isValidCoordinate = !isRange
      || (thumbElement === thumbMax
      && (thumbMinCoordinate || thumbMinCoordinate === 0)
      && data.coordinate > thumbMinCoordinate)
      || (thumbElement === thumbMin
      && thumbMaxCoordinate && data.coordinate < thumbMaxCoordinate);

    if (isValidCoordinate) {
      this.thumbElement.style[coordinateKey] = `${data.coordinate}px`;
    }
  }

  private setRangeZIndex(options: SettingZIndexOptions): void {
    const {
      isVertical, thumbMin, trackElement, trackHeight, trackWidth, thumbMax,
    } = options;
    if (thumbMin && thumbMax) {
      const start = isVertical ? trackElement.getBoundingClientRect().top + window.scrollY
        : trackElement.getBoundingClientRect().left;

      const coordinateOfMiddle = ViewUpdating.getCoordinatesOfMiddle({
        start, itemSize: isVertical ? trackHeight : trackWidth,
      });
      ViewOptional.changeZIndex({
        coordinatesOfMiddle: coordinateOfMiddle,
        isVertical,
        thumbMax,
        thumbMin,
        thumbElement: this.thumbElement,
      });
    }
  }
}

export default ViewUpdating;
