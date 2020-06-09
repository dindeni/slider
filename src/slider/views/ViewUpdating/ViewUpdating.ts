import ViewOptional from '../ViewOptional/ViewOptional';
import { RangeAndVerticalOptions, TrackSizesOptions } from '../../../types/types';
import View from '../View/View';

interface ThumbUpdatingOptions extends RangeAndVerticalOptions, TrackSizesOptions{
  step: number | undefined;
  thumbDistance: number;
  thumbElement: HTMLElement;
  shift: number;
  trackElement: HTMLElement;
  event?: MouseEvent;
  coordinateStep?: number;
  stepValues?: number[];
  coordinatesStep?: number[];
}

interface OptionsForSettingElementNotStep extends TrackSizesOptions{
  vertical: boolean;
  distance: number;
  shift: number;
  thumbElement: HTMLElement;
  range: boolean;
  thumbMin?: HTMLElement;
  thumbMax?: HTMLElement;
  thumbMinTop?: number;
  thumbMaxTop?: number;
  thumbMinLeft?: number;
  thumbMaxLeft?: number;
}

interface SettingStepPositionOptions extends RangeAndVerticalOptions {
  distance: number;
  shift: number;
  thumbElement: HTMLElement;
  coordinatesStep: number[];
  stepValues: number[];
  thumbMin?: HTMLElement;
  thumbMax?: HTMLElement;
  thumbMinTop?: number;
  thumbMaxTop?: number;
  thumbMinLeft?: number;
  thumbMaxLeft?: number;
}

interface SettingZIndexOptions extends TrackSizesOptions{
  vertical: boolean;
  trackElement: HTMLElement;
  thumbMin?: HTMLElement;
  thumbMax?: HTMLElement;
}

interface ThumbExtremumOptions {
  trackWidth: number;
  trackHeight: number;
  vertical: boolean;
}

class ViewUpdating {
  private rem = 0.077;

  public thumbLeft: number;

  public thumbTop: number;

  private thumbElement: HTMLElement;

  private viewOptional: ViewOptional;

  private keyCoordinate: string;

  readonly view: View;

  constructor(view) {
    this.view = view;
    this.viewOptional = new ViewOptional(this.view);
  }

  public updateThumbCoordinates(options: ThumbUpdatingOptions): void {
    const {
      vertical, step, thumbDistance, thumbElement, trackHeight, trackWidth, shift,
      range, trackElement, stepValues, coordinatesStep,
    } = options;

    const distance = thumbDistance * this.rem;
    this.thumbElement = thumbElement;
    this.keyCoordinate = vertical ? 'top' : 'left';

    const getRangeValues = (): {
      thumbMin: HTMLElement | undefined;
      thumbMax: HTMLElement | undefined;
      thumbMinLeft: number | undefined; thumbMaxLeft: number | undefined;
      thumbMinTop: number | undefined; thumbMaxTop: number | undefined;
    } => {
      if (range) {
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
      vertical, trackWidth, trackHeight, thumbMax, thumbMin, trackElement,
    });

    if (step) {
      this.setStepPosition({
        range,
        coordinatesStep: coordinatesStep || [],
        stepValues: stepValues || [],
        vertical,
        distance,
        shift,
        thumbMin,
        thumbMax,
        thumbElement,
      });

      vertical ? this.thumbTop = parseFloat(thumbElement.style.top)
        : this.thumbLeft = parseFloat(thumbElement.style.left);
    } else {
      this.setElementsNotStep({
        vertical,
        distance,
        shift,
        thumbElement,
        trackWidth,
        trackHeight,
        thumbMin,
        thumbMax,
        thumbMinLeft,
        thumbMaxLeft,
        thumbMinTop,
        thumbMaxTop,
        range,
      });
    }
  }

  private setElementsNotStep(options: OptionsForSettingElementNotStep): void {
    const {
      vertical, distance, shift, trackWidth, trackHeight, thumbElement, thumbMin, thumbMax,
      thumbMinLeft, thumbMaxLeft, thumbMinTop, thumbMaxTop, range,
    } = options;

    const isValidMinAndMaxLeft = !vertical
      && ((thumbElement === thumbMin
      && thumbMaxLeft
      && (shift + distance < thumbMaxLeft))
      || (thumbElement === thumbMax
      && (thumbMinLeft || thumbMinLeft === 0)
      && (shift + distance > thumbMinLeft)));
    const isValidMinAndMaxTop = vertical
      && ((thumbElement === thumbMin
      && thumbMaxTop
      && (shift + distance < thumbMaxTop))
      || (thumbElement === thumbMax
      && (thumbMinTop || thumbMinTop === 0)
      && (shift + distance > thumbMinTop)));

    const setRangeCoordinate = (): void => {
      if (isValidMinAndMaxLeft) {
        this.thumbElement.style.left = `${shift + distance}rem`;
        this.thumbLeft = shift + distance;
      } else if (isValidMinAndMaxTop) {
        this.thumbElement.style.top = `${shift + distance}rem`;
        this.thumbTop = shift + distance;
      }
    };

    if (range) {
      setRangeCoordinate();
    } else {
      this.thumbElement.style[this.keyCoordinate] = `${shift + distance}rem`;
      vertical ? this.thumbTop = shift + distance : this.thumbLeft = shift + distance;
    }
    this.checkThumbExtremum({ vertical, trackWidth, trackHeight });
  }

  private checkThumbExtremum(options: ThumbExtremumOptions): void {
    const { trackWidth, trackHeight, vertical } = options;

    const thumbCoordinate = vertical ? this.thumbElement.style.top : this.thumbElement.style.left;
    const coordinateKey = vertical ? 'top' : 'left';
    const trackSize = vertical ? trackHeight : trackWidth;

    if (parseFloat(thumbCoordinate) < 0) {
      this.thumbElement.style[coordinateKey] = '0rem';
    } else if (parseFloat(thumbCoordinate) > trackSize * this.rem) {
      this.thumbElement.style[coordinateKey] = `${trackSize * this.rem}rem`;
    }
  }

  private setStepPosition(options: SettingStepPositionOptions): void {
    const {
      range, coordinatesStep, stepValues, vertical, distance, shift, thumbMin, thumbMax,
      thumbElement,
    } = options;

    const data = this.viewOptional.checkStepData({
      checkedCoordinate: (distance + shift),
      data: { coordinates: coordinatesStep, value: stepValues },
    });
    const coordinateKey = vertical ? 'top' : 'left';
    const thumbMinCoordinate = thumbMin ? parseFloat(thumbMin.style[coordinateKey]) : undefined;
    const thumbMaxCoordinate = thumbMax
      ? parseFloat((thumbMax as HTMLElement).style[coordinateKey])
      : undefined;

    const isValidCoordinate = !range
      || (thumbElement === thumbMax
      && (thumbMinCoordinate || thumbMinCoordinate === 0)
      && (data.coordinate * this.rem) > thumbMinCoordinate)
      || (thumbElement === thumbMin
      && thumbMaxCoordinate && (data.coordinate * this.rem) < thumbMaxCoordinate);

    if (isValidCoordinate) {
      this.thumbElement.style[coordinateKey] = `${data.coordinate * this.rem}rem`;
    }
  }

  private setRangeZIndex(options: SettingZIndexOptions): void {
    const {
      vertical, thumbMin, trackElement, trackHeight, trackWidth, thumbMax,
    } = options;
    if (thumbMin && thumbMax) {
      const start = vertical ? trackElement.getBoundingClientRect().top + window.scrollY
        : trackElement.getBoundingClientRect().left;

      this.view.notifyAll({
        value:
        { start, itemSize: vertical ? trackHeight : trackWidth },
        type: 'getCoordinatesOfMiddle',
      });
      ViewOptional.changeZIndex({
        coordinatesOfMiddle: this.view.coordinateOfMiddle,
        vertical,
        thumbMax,
        thumbMin,
        thumbElement: this.thumbElement,
      });
    }
  }
}

export default ViewUpdating;
