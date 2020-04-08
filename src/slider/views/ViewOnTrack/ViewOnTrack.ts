import View from '../View/View';
import ViewUpdating from '../ViewUpdating/ViewUpdating';
import { ExtremumOptions, SliderBasicOptions, TrackSizesOptions } from '../../../types/types';

interface OptionsForChangeOnTrack extends ExtremumOptions, TrackSizesOptions{
  vertical: boolean;
  step: number | undefined;
  progress: boolean;
  distance: number;
  thumbElement: HTMLElement;
}

interface OptionsForStepElementsUpdateOnTrack extends OptionsForChangeOnTrack{
  siblingElement?: HTMLElement;
  coordinatesStep: number[];
}

interface OptionsForElementsUpdateOnTrack extends OptionsForChangeOnTrack{
  event: MouseEvent;
  trackElement: HTMLElement;
  coordinatesStep?: number[];
  coordinateStep?: number;
}

interface OptionsForRangeElementsUpdateOnTrack extends OptionsForChangeOnTrack{
  event: MouseEvent;
  range: boolean;
  parentElementOfTrack: HTMLElement;
  trackElement: HTMLElement;
  coordinatesStep?: number[];
}

interface TrackClickOptions extends SliderBasicOptions{
  event: MouseEvent;
  trackElement: HTMLElement;
  coordinatesStep: number[];
}

interface OptionsForStepRangeSettings extends OptionsForRangeElementsUpdateOnTrack{
  coordinatesOfMiddle: number;
  thumbMin: HTMLElement;
  thumbMax: HTMLElement;
  coordinatesStep: number[];
}

interface OptionsForStepRangeSettingHorizontal extends OptionsForStepRangeSettings{
  thumbMinLeft: number;
  thumbMaxLeft: number;
}

interface OptionsForStepRangeSettingVertical extends OptionsForStepRangeSettings{
  thumbMinTop: number;
  thumbMaxTop: number;
}

class ViewOnTrack {
  private rem = 0.077;

  private currentCoordinateStep: number;

  private thumbLeft: number;

  private thumbTop: number;

  readonly view: View;

  private viewUpdatingCoordinates: ViewUpdating = new ViewUpdating(this.view);

  constructor(view) {
    this.view = view;
  }

  public handleTrackElementClick(options: TrackClickOptions): void {
    const {
      event, trackElement, vertical, step, range, progress, min, max, coordinatesStep,
    } = options;

    const target = event.target as HTMLElement;
    const wrapper = target.parentElement as HTMLElement;
    const parentElementOfTrack = ((trackElement as HTMLElement).parentElement as HTMLElement);

    const isTrack = target === trackElement || wrapper.querySelector('.js-slider__progress');
    if (isTrack) {
      const thumbElement = parentElementOfTrack.querySelector('.js-slider__thumb') as HTMLElement;

      const trackHeight = trackElement.getBoundingClientRect().height;
      const trackWidth = trackElement.getBoundingClientRect().width;

      const getDistance = (): number => {
        const thumbDistance = vertical ? event.pageY - window.scrollY
          - trackElement.getBoundingClientRect().top + thumbElement.getBoundingClientRect()
          .height / 2 : event.pageX - trackElement.getBoundingClientRect().left
          - thumbElement.getBoundingClientRect().width / 2;
        if (thumbDistance < 0) {
          return 0;
        }
        const isVerticalAboveTrackHeight = vertical && thumbDistance > trackHeight;
        if (isVerticalAboveTrackHeight) {
          return trackHeight;
        }
        return thumbDistance;
      };
      const distance = getDistance();

      const optionsForUpdateStep = {
        min,
        max,
        vertical,
        trackWidth,
        trackHeight,
        distance,
        progress,
        step,
        coordinatesStep,
        trackElement,
      };

      const isNotRangeStep = !range && !step;
      const isStepNotRange = !range && step;
      if (isNotRangeStep) {
        this.updateElementsOnTrack({ thumbElement, event, ...optionsForUpdateStep });
      } else if (isStepNotRange) {
        this.updateStepElementsOnTrack({ thumbElement, ...optionsForUpdateStep });
      }

      this.updateRangeElementsOnTrack({
        range,
        parentElementOfTrack,
        event,
        trackElement,
        thumbElement,
        ...optionsForUpdateStep,
      });
    }
  }

  private updateStepElementsOnTrack(options: OptionsForStepElementsUpdateOnTrack): number {
    const {
      thumbElement, siblingElement, vertical, min, max, step, trackWidth,
      trackHeight, progress, distance, coordinatesStep,
    } = options;

    const getCoordinateForSiblingElement = (): number | undefined => {
      if (siblingElement) {
        return vertical ? Math.round(parseFloat((
          siblingElement as HTMLElement).style.top) / this.rem) : Math.round(parseFloat((
          siblingElement as HTMLElement).style.left) / this.rem);
      } return undefined;
    };
    const siblingElementCoordinate = getCoordinateForSiblingElement();

    this.view.notifyAll({
      value: {
        min,
        max,
        step,
        vertical,
        trackWidth,
        trackHeight,
      },
      type: 'getScaleData',
    });

    const stepDistance = distance + thumbElement.getBoundingClientRect().width;
    const indexOfCoordinate = this.view.scaleData.coordinates.findIndex(
      (value, index, array) => {
        const isDistanceAbove0 = stepDistance > value && stepDistance
          < array[index + 1] && siblingElementCoordinate !== value;
        const isLastCoordinate = stepDistance > value && value >= array[array.length - 1];
        const isFirstCoordinate = distance > value && value === array[0]
          && distance < array[1];
        return isFirstCoordinate || isDistanceAbove0 || isLastCoordinate;
      },
    );
    this.currentCoordinateStep = this.view.scaleData.coordinates[indexOfCoordinate];

    const thumbNode = thumbElement;
    vertical ? thumbNode.style.top = `${this.currentCoordinateStep * this.rem}rem`
      : thumbNode.style.left = `${this.currentCoordinateStep * this.rem}rem`;
    vertical ? this.thumbTop = this.currentCoordinateStep * this.rem
      : this.thumbLeft = this.currentCoordinateStep * this.rem;

    const optionsForData = {
      min,
      max,
      trackSize: vertical ? trackHeight : trackWidth,
      distance: this.currentCoordinateStep * this.rem,
      vertical,
      thumbElement,
      progress,
      progressSize: vertical ? this.thumbTop : this.thumbLeft,
      step: true,
      coordinatesStep,
    };
    this.view.updateData(optionsForData);
    return this.currentCoordinateStep;
  }

  private updateElementsOnTrack(options: OptionsForElementsUpdateOnTrack): void {
    const {
      vertical, step, min, max, progress, thumbElement, trackWidth, trackHeight, event, distance,
      coordinateStep, coordinatesStep, trackElement,
    } = options;

    this.viewUpdatingCoordinates.updateThumbCoordinates({
      vertical,
      step,
      thumbDistance: distance,
      thumbElement,
      trackHeight,
      event,
      trackWidth,
      shift: 0,
      range: false,
      coordinatesStep,
      coordinateStep,
      trackElement,
    });

    const optionsForData = {
      min,
      max,
      trackSize: vertical ? trackHeight : trackWidth,
      distance: distance * this.rem,
      vertical,
      thumbElement,
      progress,
      progressSize: vertical ? parseFloat(thumbElement.style.top)
        : parseFloat(thumbElement.style.left),
      coordinateStep,
    };
    this.view.updateData(optionsForData);
  }

  private updateRangeElementsOnTrack(options: OptionsForRangeElementsUpdateOnTrack): void {
    const {
      range, min, max, progress, thumbElement, parentElementOfTrack, vertical,
      trackWidth, trackHeight, step, trackElement, event, distance, coordinatesStep,
    } = options;
    if (range) {
      const thumbMin = parentElementOfTrack.querySelector('.js-slider__thumb_type_min') as HTMLElement;
      const thumbMax = parentElementOfTrack.querySelector('.js-slider__thumb_type_max') as HTMLElement;
      const thumbMinLeft = thumbMin.getBoundingClientRect().left;
      const thumbMaxLeft = thumbMax.getBoundingClientRect().left;
      const thumbMinTop = thumbMin.getBoundingClientRect().top;
      const thumbMaxTop = thumbMax.getBoundingClientRect().top;
      const thumbHeight = thumbElement.getBoundingClientRect().height;

      vertical ? this.view.notifyAll({
        value:
        { start: trackElement.getBoundingClientRect().top, itemSize: trackHeight },
        type: 'getCoordinatesOfMiddle',
      })
        : this.view.notifyAll({
          value:
          { start: trackElement.getBoundingClientRect().left, itemSize: trackWidth },
          type: 'getCoordinatesOfMiddle',
        });

      const optionsForUpdateStep = {
        min,
        max,
        vertical,
        trackWidth,
        trackHeight,
        distance,
        progress,
        step,
        trackElement,
      };
      const optionsForStepUpdates = {
        min,
        max,
        vertical,
        trackWidth,
        trackHeight,
        distance,
        progress,
        step,
        trackElement,
        range,
        event,
        thumbElement,
        coordinatesOfMiddle: this.view.coordinateOfMiddle,
        thumbMin,
        thumbMax,
        parentElementOfTrack,
        coordinatesStep: coordinatesStep || [],
      };
      const isStepNotVertical = coordinatesStep && step && !vertical;
      const isStepVertical = step && vertical;
      if (isStepNotVertical) {
        this.setRangeStepElementsHorizontal({
          thumbMaxLeft,
          thumbMinLeft,
          ...optionsForStepUpdates,
        });
      } else if (isStepVertical) {
        this.setRangeStepElementsVertical({ thumbMinTop, thumbMaxTop, ...optionsForStepUpdates });
      } else {
        switch (true) {
          case vertical ? thumbMinTop > event.pageY - window.scrollY
            : event.pageX < thumbMinLeft:
            this.updateElementsOnTrack(
              { thumbElement: thumbMin, event, ...optionsForUpdateStep },
            );
            break;
          case vertical ? thumbMaxTop < event.pageY - window.scrollY
            : event.pageX > thumbMaxLeft:
            this.updateElementsOnTrack(
              { thumbElement: thumbMax, event, ...optionsForUpdateStep },
            );
            break;
          case vertical ? this.view.coordinateOfMiddle - thumbHeight > event.pageY - window.scrollY
            : event.pageX < this.view.coordinateOfMiddle:
            this.updateElementsOnTrack(
              { thumbElement: thumbMin, event, ...optionsForUpdateStep },
            );
            break;
          case vertical ? this.view.coordinateOfMiddle - thumbHeight < event.pageY - window.scrollY
            : event.pageX > this.view.coordinateOfMiddle:
            this.updateElementsOnTrack(
              { thumbElement: thumbMax, event, ...optionsForUpdateStep },
            );
            break;
          default:
        }
      }
    }
  }

  private setRangeStepElementsHorizontal(options: OptionsForStepRangeSettingHorizontal): void {
    const {
      coordinatesStep, coordinatesOfMiddle, event, thumbMinLeft, thumbMaxLeft,
      thumbMin, thumbMax, min, max, vertical, trackWidth, trackHeight, distance, progress, step,
      trackElement,
    } = options;

    const optionsForUpdateStep = {
      min,
      max,
      vertical,
      trackWidth,
      trackHeight,
      distance,
      progress,
      step,
      trackElement,
      coordinatesStep,
    };
    switch (true) {
      case coordinatesOfMiddle < event.pageX && event.pageX < thumbMinLeft
        && event.pageX < thumbMaxLeft: this.updateStepElementsOnTrack(
          {
            thumbElement: thumbMin,
            coordinatesStep,
            siblingElement: thumbMax,
            ...optionsForUpdateStep,
          },
        );
        break;
      case coordinatesOfMiddle < event.pageX && event.pageX > thumbMinLeft
        && event.pageX < thumbMaxLeft: this.updateStepElementsOnTrack(
          { thumbElement: thumbMax, siblingElement: thumbMin, ...optionsForUpdateStep },
        );
        break;
      case coordinatesOfMiddle > event.pageX && event.pageX > thumbMinLeft
        && event.pageX > thumbMaxLeft: this.updateStepElementsOnTrack(
          { thumbElement: thumbMax, siblingElement: thumbMin, ...optionsForUpdateStep },
        );
        break;
      case coordinatesOfMiddle > event.pageX && event.pageX > thumbMinLeft
        && event.pageX < thumbMaxLeft: this.updateStepElementsOnTrack(
          { thumbElement: thumbMin, siblingElement: thumbMax, ...optionsForUpdateStep },
        );
        break;
      case thumbMinLeft < coordinatesOfMiddle && thumbMaxLeft < coordinatesOfMiddle
        && event.pageX > coordinatesOfMiddle: this.updateStepElementsOnTrack(
          { thumbElement: thumbMax, siblingElement: thumbMin, ...optionsForUpdateStep },
        );
        break;
      case thumbMinLeft > coordinatesOfMiddle && thumbMaxLeft > coordinatesOfMiddle
        && event.pageX < coordinatesOfMiddle: this.updateStepElementsOnTrack(
          { thumbElement: thumbMin, siblingElement: thumbMax, ...optionsForUpdateStep },
        );
        break;
      case event.pageX > thumbMaxLeft && event.pageX > coordinatesOfMiddle:
        this.updateStepElementsOnTrack(
          { thumbElement: thumbMax, siblingElement: thumbMin, ...optionsForUpdateStep },
        );
        break;
      case event.pageX < thumbMinLeft && event.pageX < coordinatesOfMiddle:
        this.updateStepElementsOnTrack(
          { thumbElement: thumbMin, siblingElement: thumbMax, ...optionsForUpdateStep },
        );
        break;
      default:
    }
  }

  private setRangeStepElementsVertical(options: OptionsForStepRangeSettingVertical): void {
    const {
      coordinatesStep, coordinatesOfMiddle, event, thumbMinTop, thumbMaxTop,
      thumbMin, thumbMax, min, max, vertical, trackWidth, trackHeight, distance, progress, step,
      trackElement,
    } = options;

    const optionsForUpdateStep = {
      min,
      max,
      vertical,
      trackWidth,
      trackHeight,
      distance,
      progress,
      step,
      trackElement,
      coordinatesStep,
    };
    const pageY = event.pageY - window.scrollY;

    switch (true) {
      case coordinatesOfMiddle > pageY && thumbMinTop < coordinatesOfMiddle
      && thumbMaxTop < coordinatesOfMiddle && pageY > thumbMaxTop && pageY > thumbMinTop:
        this.updateStepElementsOnTrack(
          { thumbElement: thumbMax, siblingElement: thumbMin, ...optionsForUpdateStep },
        );
        break;
      case coordinatesOfMiddle < pageY && thumbMinTop > coordinatesOfMiddle
      && thumbMaxTop > coordinatesOfMiddle && pageY < thumbMaxTop && pageY < thumbMinTop:
        this.updateStepElementsOnTrack(
          { thumbElement: thumbMin, siblingElement: thumbMax, ...optionsForUpdateStep },
        );
        break;
      case coordinatesOfMiddle < pageY && thumbMinTop > coordinatesOfMiddle
      && thumbMaxTop > coordinatesOfMiddle && pageY > thumbMaxTop && pageY > thumbMinTop:
        this.updateStepElementsOnTrack(
          { thumbElement: thumbMax, siblingElement: thumbMin, ...optionsForUpdateStep },
        );
        break;
      case coordinatesOfMiddle > pageY && thumbMinTop < coordinatesOfMiddle
      && thumbMaxTop < coordinatesOfMiddle && pageY < thumbMaxTop && pageY < thumbMinTop:
        this.updateStepElementsOnTrack(
          { thumbElement: thumbMin, siblingElement: thumbMax, ...optionsForUpdateStep },
        );
        break;
      case coordinatesOfMiddle > pageY && thumbMinTop < pageY
      && thumbMaxTop > coordinatesOfMiddle: this.updateStepElementsOnTrack(
          { thumbElement: thumbMin, siblingElement: thumbMax, ...optionsForUpdateStep },
        );
        break;
      case coordinatesOfMiddle < pageY && thumbMinTop < pageY
      && thumbMaxTop > coordinatesOfMiddle: this.updateStepElementsOnTrack(
          { thumbElement: thumbMax, siblingElement: thumbMin, ...optionsForUpdateStep },
        );
        break;
      case coordinatesOfMiddle > pageY && thumbMinTop > pageY
      && thumbMaxTop > coordinatesOfMiddle: this.updateStepElementsOnTrack(
          { thumbElement: thumbMin, siblingElement: thumbMax, ...optionsForUpdateStep },
        );
        break;
      case coordinatesOfMiddle < pageY && thumbMinTop < pageY
      && thumbMaxTop < coordinatesOfMiddle: this.updateStepElementsOnTrack(
          { thumbElement: thumbMax, siblingElement: thumbMin, ...optionsForUpdateStep },
        );
        break;
      default:
    }
  }
}

export default ViewOnTrack;
