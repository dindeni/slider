import ViewOptional from '../ViewOptional/ViewOptional';
import { RangeAndVerticalOptions, TrackSizesOptions } from '../../../types/types';
import View from '../View/View';

interface ThumbUpdatingOptions extends RangeAndVerticalOptions, TrackSizesOptions{
  step: number | undefined;
  thumbDistance: number;
  thumbElement: HTMLElement;
  event: MouseEvent;
  shift: number;
  trackElement: HTMLElement;
  stepValues?: number[];
  coordinatesStep?: number[];
  coordinateStep?: number;
}

interface EventAndCoordinatesOptions{
  event: MouseEvent;
  coordinatesStep: number[];
  stepValues: number[];
}

interface ThumbStepUpdatingOptions extends RangeAndVerticalOptions, TrackSizesOptions,
 EventAndCoordinatesOptions{
  thumbDistance: number;
  elementCoordinate: HTMLElement;
  numberTranslation: number;
}

interface OptionsForSettingElementNotStep extends TrackSizesOptions{
  vertical: boolean;
  distance: number;
  shift: number;
  thumbElement: HTMLElement;
  thumbMin?: HTMLElement;
  thumbMax?: HTMLElement;
  thumbMinTop?: number;
  thumbMaxTop?: number;
  thumbMinLeft?: number;
  thumbMaxLeft?: number;
}

interface OptionsForValidationCoordinates {
  indexOfCoordinate: number;
  type: 'above' | 'below';
  coordinatesStep: number[];
}

interface SettingLeftStepPositionOptions extends RangeAndVerticalOptions,
 EventAndCoordinatesOptions{
  trackWidth: number;
  numberTranslation: number;
}

interface SettingsTopStepPositions extends RangeAndVerticalOptions, EventAndCoordinatesOptions{
  trackHeight: number;
}

interface SettingZIndexOptions extends TrackSizesOptions{
  vertical: boolean;
  trackElement: HTMLElement;
  thumbMin?: HTMLElement;
  thumbMax?: HTMLElement;
}

class ViewUpdating {
  private rem = 0.077;

  private thumbLeft: number;

  private thumbTop: number;

  private thumbElement: HTMLElement;

  private viewOptional: ViewOptional;

  readonly view: View;

  constructor(view) {
    this.view = view;
    this.viewOptional = new ViewOptional(this.view);
  }

  public updateThumbCoordinates(options: ThumbUpdatingOptions): void {
    const {
      vertical, step, thumbDistance, thumbElement, trackHeight, event, trackWidth, shift,
      range, trackElement, stepValues, coordinatesStep, coordinateStep,
    } = options;

    const distance = thumbDistance * this.rem;
    this.thumbElement = thumbElement;

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
      this.updateStepCoordinates({
        thumbDistance,
        trackWidth,
        trackHeight,
        elementCoordinate: this.thumbElement,
        numberTranslation: coordinateStep || 0,
        vertical,
        event,
        range,
        coordinatesStep: coordinatesStep || [],
        stepValues: stepValues || [],
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
      });
    }
  }

  public updateStepCoordinates(options: ThumbStepUpdatingOptions): void {
    const {
      trackWidth, trackHeight, elementCoordinate, numberTranslation, vertical,
      event, range, coordinatesStep, stepValues,
    } = options;

    this.thumbElement = elementCoordinate;

    vertical ? this.setTopStepPosition({
      vertical, range, event, trackHeight, coordinatesStep, stepValues,
    }) : this.setLeftStepPosition({
      vertical, range, event, coordinatesStep, stepValues, trackWidth, numberTranslation,
    });
  }

  private setElementsNotStep(options: OptionsForSettingElementNotStep): void {
    const {
      vertical, distance, shift, trackWidth, trackHeight, thumbElement, thumbMin, thumbMax,
      thumbMinLeft, thumbMaxLeft, thumbMinTop, thumbMaxTop,
    } = options;

    if (vertical) {
      switch (true) {
        case distance + shift >= trackHeight * this.rem
        && thumbElement !== thumbMin: this.thumbElement.style.top = `${trackHeight * this.rem}rem`;
          this.thumbTop = trackHeight * this.rem;
          break;
        case distance + shift < 0 && thumbElement !== thumbMax:
          this.thumbElement.style.top = `${0}rem`;
          this.thumbTop = 0;
          break;
        case thumbElement === thumbMin
          && Boolean((thumbMaxTop || thumbMaxTop === 0)
          && (shift + distance > thumbMaxTop)): return;
        case thumbElement === thumbMax
          && Boolean((thumbMinTop || thumbMinTop === 0)
          && (shift + distance < thumbMinTop)): return;
        default: this.thumbElement.style.top = `${shift + distance}rem`;
          this.thumbTop = shift + distance;
      }
    } else {
      switch (true) {
        case distance + shift >= trackWidth * this.rem
          && thumbElement !== thumbMin: this.thumbElement.style.left = `${trackWidth * this.rem}rem`;
          this.thumbLeft = trackWidth * this.rem;
          break;
        case distance + shift < 0 && thumbElement !== thumbMax: this.thumbElement.style.left = `${0}rem`;
          this.thumbLeft = 0;
          break;
        case thumbElement === thumbMin
          && Boolean((thumbMaxLeft || thumbMaxLeft === 0)
          && (shift + distance > thumbMaxLeft)): return;
        case thumbElement === thumbMax
          && Boolean((thumbMinLeft || thumbMinLeft === 0)
          && (shift + distance < thumbMinLeft)): return;
        default: this.thumbElement.style.left = `${shift + distance}rem`;
          this.thumbLeft = shift + distance;
      }
    }
  }

  private static validateCoordinate(options: OptionsForValidationCoordinates): number {
    const { indexOfCoordinate, type, coordinatesStep } = options;
    let index = indexOfCoordinate;
    if (type === 'above') {
      if (coordinatesStep[index] === coordinatesStep[index + 1]) {
        do {
          index += 1;
        } while (coordinatesStep[index] === coordinatesStep[index + 1]);
      }
      return coordinatesStep[index + 1];
    }
    if (coordinatesStep[index] === coordinatesStep[index - 1]) {
      do {
        index += 1;
      } while (coordinatesStep[index] === coordinatesStep[index - 1]);
    }
    return coordinatesStep[index - 1];
  }

  private setLeftStepPosition(options: SettingLeftStepPositionOptions): void {
    const {
      range, event, coordinatesStep, stepValues, trackWidth, numberTranslation, vertical,
    } = options;

    const numberCoordinateLeft = parseFloat(this.thumbElement.style.left);
    const index = coordinatesStep.findIndex(
      (value) => value === Number((numberCoordinateLeft / this.rem).toFixed(2)),
    );

    const distanceOfPageX = event.pageX - ((this.thumbElement
      .parentElement as HTMLElement).querySelector('.slider__track') as HTMLElement).getBoundingClientRect().left;
    const thumbRangeFlag: {above: boolean; below: boolean} = { above: false, below: false };
    if (range) {
      const isThumbMin = this.thumbElement.classList.contains('js-slider__thumb_type_min');
      if (isThumbMin) {
        const thumbMaxLeft = parseFloat((this.thumbElement.nextElementSibling as HTMLElement)
          .style.left);
        const thumbMinLeft = parseFloat(this.thumbElement.style.left);
        thumbRangeFlag.above = thumbMaxLeft > coordinatesStep[index + 1] * this.rem
            && thumbMinLeft < thumbMaxLeft;
        thumbRangeFlag.below = numberCoordinateLeft <= thumbMaxLeft;
      } else {
        const thumbMinLeft = parseFloat((this.thumbElement.previousElementSibling as HTMLElement)
          .style.left);
        const thumbMaxLeft = parseFloat(this.thumbElement.style.left);
        thumbRangeFlag.below = coordinatesStep[index - 1] * this.rem > thumbMinLeft
            && thumbMaxLeft > thumbMinLeft;
        thumbRangeFlag.above = numberCoordinateLeft >= thumbMinLeft;
      }
    }

    const isAbove0 = range
      ? numberCoordinateLeft <= trackWidth * this.rem
        && thumbRangeFlag.above && distanceOfPageX >= coordinatesStep[index]
        + (coordinatesStep[index + 1] - coordinatesStep[index]) / 2
      : numberCoordinateLeft < trackWidth * this.rem
        && distanceOfPageX >= coordinatesStep[index]
        + (coordinatesStep[index + 1] - coordinatesStep[index]) / 2;

    const isBelow0 = range
      ? numberCoordinateLeft >= Number((numberTranslation * this.rem).toFixed(5))
        && thumbRangeFlag.below
        && distanceOfPageX <= coordinatesStep[index]
          - (coordinatesStep[index] - coordinatesStep[index - 1]) / 2
      : numberCoordinateLeft >= Number((numberTranslation * this.rem).toFixed(5))
        && distanceOfPageX <= coordinatesStep[index]
        - (coordinatesStep[index] - coordinatesStep[index - 1]) / 2;

    if (isAbove0) {
      this.thumbElement.style.left = `${ViewUpdating.validateCoordinate(
        { type: 'above', indexOfCoordinate: index, coordinatesStep },
      ) * this.rem}rem`;
      const optionsForLabel = {
        value: stepValues[index + 1] || stepValues[stepValues.length - 1],
        coordinate: coordinatesStep[index + 1] * this.rem,
        vertical,
        thumbElement: this.thumbElement,
      };
      this.view.updateLabelValue(optionsForLabel);
    } else if (isBelow0) {
      this.thumbElement.style.left = `${ViewUpdating.validateCoordinate(
        { type: 'below', indexOfCoordinate: index, coordinatesStep },
      ) * this.rem}rem`;
      const optionsForLabel = {
        value: stepValues[index - 1],
        coordinate: coordinatesStep[index - 1] * this.rem,
        vertical,
        thumbElement: this.thumbElement,
      };
      this.view.updateLabelValue(optionsForLabel);
    }
  }

  private setTopStepPosition(options: SettingsTopStepPositions): void {
    const {
      range, event, coordinatesStep, stepValues, trackHeight, vertical,
    } = options;

    const numberCoordinateTop = parseFloat(this.thumbElement.style.top);
    const index = coordinatesStep.findIndex((value) => value
      === Number((numberCoordinateTop / this.rem).toFixed(2)));
    const distanceOfPageY = event.pageY - ((((this.thumbElement as HTMLElement)
      .parentElement as HTMLElement).querySelector('.slider__track') as HTMLElement).getBoundingClientRect().top + window.scrollY);

    const thumbRangeFlag: {above: boolean; below: boolean} = { above: false, below: false };
    if (range) {
      const isThumbMin = this.thumbElement.classList.contains('js-slider__thumb_type_min');
      if (isThumbMin) {
        const thumbMaxTop = parseFloat((this.thumbElement.nextElementSibling as HTMLElement)
          .style.top);
        const thumbMinTop = parseFloat(this.thumbElement.style.top);
        thumbRangeFlag.above = thumbMaxTop > coordinatesStep[index + 1] * this.rem
          && thumbMinTop < thumbMaxTop;
        thumbRangeFlag.below = numberCoordinateTop <= thumbMaxTop;
      } else {
        const thumbMinTop = parseFloat((this.thumbElement.previousElementSibling as HTMLElement)
          .style.top);
        const thumbMaxTop = parseFloat(this.thumbElement.style.top);
        thumbRangeFlag.below = coordinatesStep[index - 1] * this.rem > thumbMinTop
          && thumbMaxTop > thumbMinTop;
        thumbRangeFlag.above = numberCoordinateTop >= thumbMinTop;
      }
    }

    const nextCoordinate = coordinatesStep[index + 1] === 0
      ? 0
      : coordinatesStep[index + 1] || coordinatesStep[coordinatesStep.length - 1];
    const isAbove0 = range
      ? numberCoordinateTop <= trackHeight * this.rem
        && thumbRangeFlag.above && distanceOfPageY >= coordinatesStep[index]
        + (nextCoordinate - coordinatesStep[index]) / 2
      : numberCoordinateTop < trackHeight * this.rem && distanceOfPageY >= coordinatesStep[index]
        + (coordinatesStep[index + 1] - coordinatesStep[index]) / 2;

    const previousCoordinate = coordinatesStep[index - 1] === 0
      ? 0
      : coordinatesStep[index - 1] || coordinatesStep[1];
    const isBelow0 = range
      ? numberCoordinateTop <= trackHeight * this.rem
        && thumbRangeFlag.below && distanceOfPageY <= coordinatesStep[index]
        - (coordinatesStep[index] - previousCoordinate) / 2
      : numberCoordinateTop <= trackHeight * this.rem
        && numberCoordinateTop !== 0 && distanceOfPageY <= coordinatesStep[index]
        - (coordinatesStep[index] - coordinatesStep[index - 1]) / 2;

    if (isAbove0) {
      this.thumbElement.style.top = `${ViewUpdating.validateCoordinate(
        { type: 'above', indexOfCoordinate: index, coordinatesStep },
      ) * this.rem}rem`;
      const optionsForLabel = {
        value: stepValues[index + 1] || stepValues[stepValues.length - 1],
        coordinate: coordinatesStep[index + 1] * this.rem,
        vertical,
        thumbElement: this.thumbElement,
      };
      this.view.updateLabelValue(optionsForLabel);
    } else if (isBelow0) {
      this.thumbElement.style.top = `${(ViewUpdating.validateCoordinate(
        { type: 'below', indexOfCoordinate: index, coordinatesStep },
      )) * this.rem}rem`;
      const optionsForLabel = {
        value: stepValues[index - 1] || stepValues[0],
        coordinate: coordinatesStep[index - 1] * this.rem || coordinatesStep[0],
        vertical,
        thumbElement: this.thumbElement,
      };
      this.view.updateLabelValue(optionsForLabel);
    }
  }

  setRangeZIndex(options: SettingZIndexOptions): void {
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
