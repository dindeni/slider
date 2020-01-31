import ViewOptional from '../ViewOptional/ViewOptional';
import View from '../View/View';
import Presenter from '../../Presenter/Presenter';
import {
  SliderElementOptions, SliderBasicOptions, RangeAndVerticalOptions, ExtremumOptions,
} from '../../../types/types';

interface MovingThumbOptions extends SliderBasicOptions{
  event: MouseEvent;
  value: HTMLElement;
  trackWidth: number;
  trackHeight: number;
  coordinateStep?: number;
}

interface TrackClickOptions extends SliderBasicOptions{
  event: MouseEvent;
  trackElement: HTMLElement;
}

interface ThumbUpdatingOptions extends RangeAndVerticalOptions{
  step: number | undefined;
  thumbDistance: number;
  thumbElement: HTMLElement;
  trackHeight: number;
  event: MouseEvent;
  trackWidth;
  shift: number;
  coordinateStep?: number;
}

interface UpdatingDataOptions extends ExtremumOptions{
  trackSize: number;
  distance: number;
  vertical;
  thumbElement: HTMLElement;
  progress: boolean;
  progressSize: number;
  step?: boolean;
}

interface StepPositionOptions extends RangeAndVerticalOptions{
  thumbDistance: number;
  trackWidth: number;
  trackHeight: number;
  elementCoordinate: HTMLElement;
  numberTranslation: number;
  event: MouseEvent;
}

class ViewUpdating {
    private coordinateXStart: number;

    private shift: number;

    private coordinateYStart: number;

    private thumbLeft: number;

    private thumbTop: number;

    private coordinateStep: number[];

    private currentCoordinateStep: number;

    private stepValues: number[];

    private rem = 0.077;

    private trackElement: HTMLElement;

    viewOptional: ViewOptional = new ViewOptional();

    view: View = new View();

    presenter: Presenter = new Presenter();

    addDragAndDrop(options: SliderElementOptions): void {
      const {
        step, vertical, range, progress, min, max, $element,
      } = options;

      Array.from($element.find('.js-slider__thumb')).map((value) => {
        const trackHeight: number = (((value as HTMLElement).parentElement as HTMLElement)
          .querySelector('.js-slider__track') as HTMLElement).getBoundingClientRect().height;
        const trackWidth: number = (((value as HTMLElement).parentElement as HTMLElement)
          .querySelector('.js-slider__track') as HTMLElement).getBoundingClientRect().width;

        this.trackElement = (((value as HTMLElement).parentElement as HTMLElement)
          .querySelector('.js-slider__track') as HTMLElement);

        if (step) {
          const stepData = this.presenter.calculateLeftScaleCoordinates({
            min,
            max,
            step,
            vertical,
            trackWidth,
            trackHeight,
          });

          this.coordinateStep = stepData.coordinates;
          this.stepValues = stepData.value;
        }


        return document.addEventListener('mousedown', (event) => this.handleDocumentMousedown({
          event,
          value,
          vertical,
          step,
          trackWidth,
          trackHeight,
          min,
          max,
          progress,
          range,
          coordinateStep: this.coordinateStep ? this.coordinateStep[1] : undefined,
        }));
      });

      Array.from($element.find('.js-slider__track')).map((trackElement) => trackElement
        .addEventListener('click', (event) => this.handleTrackElementClick({
          event,
          trackElement,
          vertical,
          step,
          range,
          progress,
          min,
          max,
        })));


      this.viewOptional = new ViewOptional();
      this.view = new View();
    }

    moveThumb(options: MovingThumbOptions): void {
      const {
        event, value, vertical, step, trackWidth, trackHeight, min, max,
        progress, range,
      } = options;

      event.preventDefault();

      const thumbDistance = vertical ? Presenter.calculateThumbDistance({
        coordinateStart: this.coordinateYStart,
        coordinateMove: event.screenY,
      }) : Presenter.calculateThumbDistance(
        { coordinateStart: this.coordinateXStart, coordinateMove: event.screenX },
      );

      this.updateThumbCoordinates({
        vertical,
        step,
        thumbDistance,
        thumbElement: value,
        trackHeight,
        event,
        trackWidth,
        shift: this.shift,
        coordinateStep: this.coordinateStep ? this.coordinateStep[1] : undefined,
        range,
      });

      const optionsForData = {
        min,
        max,
        trackSize: vertical ? trackHeight : trackWidth,
        distance: vertical ? parseFloat(value.style.top) : this.thumbLeft,
        vertical,
        thumbElement: value,
        progress,
        progressSize: vertical ? this.thumbTop : this.thumbLeft,
      };

      this.updateData(optionsForData);
    }

    handleDocumentMousedown(options: MovingThumbOptions): void {
      const {
        event, value, vertical, step, trackWidth, trackHeight,
        min, max, coordinateStep, progress, range,
      } = options;

      if (event.target === value) {
        const isVertical = (event.target as HTMLElement).classList.contains('js-slider__thumb_vertical');
        const isVerticalMinOrMax = (event.target === value) && isVertical;
        if (isVerticalMinOrMax) {
          this.coordinateYStart = event.screenY;
          this.shift = parseFloat((event.target as HTMLElement).style.top);
        } else {
          this.coordinateXStart = event.screenX;
          this.shift = parseFloat((event.target as HTMLElement).style.left);
        }

        const handleDocumentMousemove = (eventMove): void => this.moveThumb({
          event: eventMove,
          value,
          vertical,
          step,
          trackWidth,
          trackHeight,
          min,
          max,
          coordinateStep,
          progress,
          range,
        });

        const handleDocumentMouseup = (): void => document.removeEventListener('mousemove', handleDocumentMousemove);

        document.addEventListener('mousemove', handleDocumentMousemove);
        document.addEventListener('mouseup', handleDocumentMouseup);
      }
    }

    handleTrackElementClick(options: TrackClickOptions): void {
      const {
        event, trackElement, vertical, step, range, progress, min, max,
      } = options;

      const target = event.target as HTMLElement;
      const wrapper = target.parentElement as HTMLElement;
      const parentElementOfTrack = ((trackElement as HTMLElement).parentElement as HTMLElement);

      const isTrack = target === trackElement || wrapper.querySelector('.js-slider__progress');
      if (isTrack) {
        const thumb = parentElementOfTrack.querySelector('.js-slider__thumb') as HTMLElement;

        let distance = vertical ? event.pageY - window.scrollY
         - trackElement.getBoundingClientRect().top + thumb.getBoundingClientRect().height / 2
          : event.pageX - trackElement.getBoundingClientRect().left
          - thumb.getBoundingClientRect().width / 2;

        const trackHeight = trackElement.getBoundingClientRect().height;
        const trackWidth = trackElement.getBoundingClientRect().width;

        if (distance < 0) {
          distance = 0;
        }
        const isVerticalAboveTrackHeight = vertical && distance > trackHeight;
        if (isVerticalAboveTrackHeight) {
          distance = trackHeight;
        }

        const updateStepThumbLabel = (stepOptions: {thumbElement: HTMLElement;
         siblingElement?: HTMLElement;}): number => {
          const { thumbElement, siblingElement } = stepOptions;

          const getCoordinateForSiblingElement = (): number | undefined => {
            if (siblingElement) {
              return vertical ? Math.round(parseFloat((
                siblingElement as HTMLElement).style.top) / this.rem) : Math.round(parseFloat((
                siblingElement as HTMLElement).style.left) / this.rem);
            } return undefined;
          };
          const siblingElementCoordinate = getCoordinateForSiblingElement();

          const scaleCoordinates = this.presenter.calculateLeftScaleCoordinates({
            min,
            max,
            step,
            vertical,
            trackWidth,
            trackHeight,
          });

          const stepDistance = distance + thumbElement.getBoundingClientRect().width;
          const indexOfCoordinate = scaleCoordinates.coordinates.findIndex(
            (value, index, array) => {
              const isDistanceAbove0 = stepDistance > value && stepDistance
              < array[index + 1] && siblingElementCoordinate !== value;
              const isLastCoordinate = stepDistance > value && value >= array[array.length - 1];
              const isFirstCoordinate = distance > value && value === array[0]
               && distance < array[1];
              return isFirstCoordinate || isDistanceAbove0 || isLastCoordinate;
            },
          );
          this.currentCoordinateStep = scaleCoordinates.coordinates[indexOfCoordinate];

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
          };
          this.updateData(optionsForData);
          return this.currentCoordinateStep;
        };

        const updateThumbLabel = (thumbElement: HTMLElement): void => {
          this.updateThumbCoordinates({
            vertical,
            step,
            thumbDistance: distance,
            thumbElement,
            trackHeight,
            event,
            trackWidth,
            shift: 0,
            coordinateStep: this.currentCoordinateStep,
            range: false,
          });

          const optionsForData = {
            min,
            max,
            trackSize: vertical ? trackHeight : trackWidth,
            distance: distance * this.rem,
            vertical,
            thumbElement,
            progress,
            progressSize: vertical ? this.thumbTop : this.thumbLeft,
          };
          this.updateData(optionsForData);
        };

        const isNotRangeStep = !range && !step;
        const isStepNotRange = !range && step;
        if (isNotRangeStep) {
          updateThumbLabel(thumb);
        } else if (isStepNotRange) {
          updateStepThumbLabel({ thumbElement: thumb });
        }

        if (range) {
          const thumbMin = parentElementOfTrack.querySelector('.js-slider__thumb_min') as HTMLElement;
          const thumbMax = parentElementOfTrack.querySelector('.js-slider__thumb_max') as HTMLElement;
          const thumbMinLeft = thumbMin.getBoundingClientRect().left;
          const thumbMaxLeft = thumbMax.getBoundingClientRect().left;
          const thumbMinTop = thumbMin.getBoundingClientRect().top;
          const thumbMaxTop = thumbMax.getBoundingClientRect().top;
          const thumbHeight = thumb.getBoundingClientRect().height;

          const coordinatesOfMiddle = vertical ? Presenter.calculateCoordinatesOfMiddle(
            { start: trackElement.getBoundingClientRect().top, itemSize: trackHeight },
          )
            : Presenter.calculateCoordinatesOfMiddle(
              { start: trackElement.getBoundingClientRect().left, itemSize: trackWidth },
            );
          const isStepNotVertical = step && !vertical;
          const isStepVertical = step && vertical;
          if (isStepNotVertical) {
            switch (true) {
              case coordinatesOfMiddle < event.pageX && event.pageX < thumbMinLeft
               && event.pageX < thumbMaxLeft: updateStepThumbLabel(
                  { thumbElement: thumbMin, siblingElement: thumbMax },
                );
                break;
              case coordinatesOfMiddle < event.pageX && event.pageX > thumbMinLeft
               && event.pageX < thumbMaxLeft: updateStepThumbLabel(
                  { thumbElement: thumbMax, siblingElement: thumbMin },
                );
                break;
              case coordinatesOfMiddle > event.pageX && event.pageX > thumbMinLeft
               && event.pageX > thumbMaxLeft: updateStepThumbLabel(
                  { thumbElement: thumbMax, siblingElement: thumbMin },
                );
                break;
              case coordinatesOfMiddle > event.pageX && event.pageX > thumbMinLeft
               && event.pageX < thumbMaxLeft: updateStepThumbLabel(
                  { thumbElement: thumbMin, siblingElement: thumbMax },
                );
                break;
              case thumbMinLeft < coordinatesOfMiddle && thumbMaxLeft < coordinatesOfMiddle
               && event.pageX > coordinatesOfMiddle: updateStepThumbLabel(
                  { thumbElement: thumbMax, siblingElement: thumbMin },
                );
                break;
              case thumbMinLeft > coordinatesOfMiddle && thumbMaxLeft > coordinatesOfMiddle
               && event.pageX < coordinatesOfMiddle: updateStepThumbLabel(
                  { thumbElement: thumbMin, siblingElement: thumbMax },
                );
                break;
              case event.pageX > thumbMaxLeft && event.pageX > coordinatesOfMiddle:
                updateStepThumbLabel({ thumbElement: thumbMax, siblingElement: thumbMin });
                break;
              case event.pageX < thumbMinLeft && event.pageX < coordinatesOfMiddle:
                updateStepThumbLabel({ thumbElement: thumbMin, siblingElement: thumbMax });
                break;
              default:
            }
          } else if (isStepVertical) {
            const pageY = event.pageY - window.scrollY;
            switch (true) {
              case coordinatesOfMiddle > pageY && thumbMinTop < coordinatesOfMiddle
               && thumbMaxTop < coordinatesOfMiddle && pageY > thumbMaxTop && pageY > thumbMinTop:
                updateStepThumbLabel({ thumbElement: thumbMax, siblingElement: thumbMin });
                break;
              case coordinatesOfMiddle < pageY && thumbMinTop > coordinatesOfMiddle
               && thumbMaxTop > coordinatesOfMiddle && pageY < thumbMaxTop && pageY < thumbMinTop:
                updateStepThumbLabel({ thumbElement: thumbMin, siblingElement: thumbMax });
                break;
              case coordinatesOfMiddle < pageY && thumbMinTop > coordinatesOfMiddle
               && thumbMaxTop > coordinatesOfMiddle && pageY > thumbMaxTop && pageY > thumbMinTop:
                updateStepThumbLabel({ thumbElement: thumbMax, siblingElement: thumbMin });
                break;
              case coordinatesOfMiddle > pageY && thumbMinTop < coordinatesOfMiddle
               && thumbMaxTop < coordinatesOfMiddle && pageY < thumbMaxTop && pageY < thumbMinTop:
                updateStepThumbLabel({ thumbElement: thumbMin, siblingElement: thumbMax });
                break;
              case coordinatesOfMiddle > pageY && thumbMinTop < pageY
               && thumbMaxTop > coordinatesOfMiddle: updateStepThumbLabel(
                  { thumbElement: thumbMin, siblingElement: thumbMax },
                );
                break;
              case coordinatesOfMiddle < pageY && thumbMinTop < pageY
               && thumbMaxTop > coordinatesOfMiddle: updateStepThumbLabel(
                  { thumbElement: thumbMax, siblingElement: thumbMin },
                );
                break;
              case coordinatesOfMiddle > pageY && thumbMinTop > pageY
               && thumbMaxTop > coordinatesOfMiddle: updateStepThumbLabel(
                  { thumbElement: thumbMin, siblingElement: thumbMax },
                );
                break;
              case coordinatesOfMiddle < pageY && thumbMinTop < pageY
               && thumbMaxTop < coordinatesOfMiddle: updateStepThumbLabel(
                  { thumbElement: thumbMax, siblingElement: thumbMin },
                );
                break;
              default:
            }
          } else {
            switch (true) {
              case vertical ? thumbMinTop > event.pageY - window.scrollY
                : event.pageX < thumbMinLeft:
                updateThumbLabel(thumbMin);
                break;
              case vertical ? thumbMaxTop < event.pageY - window.scrollY
                : event.pageX > thumbMaxLeft:
                updateThumbLabel(thumbMax);
                break;
              case vertical ? coordinatesOfMiddle - thumbHeight > event.pageY - window.scrollY
                : event.pageX < coordinatesOfMiddle:
                updateThumbLabel(thumbMin);
                break;
              case vertical ? coordinatesOfMiddle - thumbHeight < event.pageY - window.scrollY
                : event.pageX > coordinatesOfMiddle:
                updateThumbLabel(thumbMax);
                break;
              default:
            }
          }
        }
      }
    }

    updateThumbCoordinates(options: ThumbUpdatingOptions): void {
      const {
        vertical, step, thumbDistance, thumbElement, trackHeight, event, trackWidth, shift,
        coordinateStep, range,
      } = options;

      const distance = thumbDistance * this.rem;
      const thumbNode: HTMLElement = thumbElement;
      const isNotVerticalStep = !vertical && !step;
      const isVerticalNotStep = vertical && !step;

      const getRangeValues = (): {thumbMin: HTMLElement | undefined;
       thumbMax: HTMLElement | undefined;
       thumbMinLeft: number | undefined; thumbMaxLeft: number | undefined;
        thumbMinTop: number | undefined; thumbMaxTop: number | undefined;} => {
        if (range) {
          const thumbMin = (thumbElement.parentElement as HTMLElement).querySelector('.js-slider__thumb_min') as HTMLElement;
          const thumbMax = (thumbElement.parentElement as HTMLElement).querySelector('.js-slider__thumb_max') as HTMLElement;
          const thumbMinLeft = parseFloat((thumbMin as HTMLElement).style.left);
          const thumbMaxLeft = parseFloat((thumbMax as HTMLElement).style.left);
          const thumbMinTop = parseFloat((thumbMin as HTMLElement).style.top);
          const thumbMaxTop = parseFloat((thumbMax as HTMLElement).style.top);

          return {
            thumbMin, thumbMax, thumbMinLeft, thumbMaxLeft, thumbMinTop, thumbMaxTop,
          };
        } return {
          thumbMin: undefined,
          thumbMax: undefined,
          thumbMinLeft: undefined,
          thumbMaxLeft: undefined,
          thumbMinTop: undefined,
          thumbMaxTop: undefined,
        };
      };
      const setRangeZIndex = (zIndexOptions: {thumbMin: HTMLElement | undefined;
       thumbMax: HTMLElement | undefined;}): void => {
        const { thumbMin, thumbMax } = zIndexOptions;
        if (thumbMin && thumbMax) {
          const start = vertical ? this.trackElement.getBoundingClientRect().top + window.scrollY
            : this.trackElement.getBoundingClientRect().left;
          const coordinatesOfMiddle = Presenter.calculateCoordinatesOfMiddle(
            { start, itemSize: vertical ? trackHeight : trackWidth },
          );
          ViewOptional.changeZIndex({
            coordinatesOfMiddle, vertical, thumbMax, thumbMin, thumbElement,
          });
        }
      };

      const {
        thumbMin, thumbMax, thumbMinLeft, thumbMaxLeft, thumbMinTop,
        thumbMaxTop,
      } = getRangeValues();
      setRangeZIndex({ thumbMin, thumbMax });

      if (isNotVerticalStep) {
        switch (true) {
          case distance + shift >= trackWidth * this.rem
          && thumbElement !== thumbMin: thumbNode.style.left = `${trackWidth * this.rem}rem`;
            this.thumbLeft = trackWidth * this.rem;
            break;
          case distance + shift < 0 && thumbElement !== thumbMax: thumbNode.style.left = `${0}rem`;
            this.thumbLeft = 0;
            break;
          case thumbElement === thumbMin && Boolean((thumbMaxLeft || thumbMaxLeft === 0)
           && (shift + distance > thumbMaxLeft)): return;
          case thumbElement === thumbMax && Boolean((thumbMinLeft || thumbMinLeft === 0)
           && (shift + distance < thumbMinLeft)): return;
          default: thumbNode.style.left = `${shift + distance}rem`;
            this.thumbLeft = shift + distance;
        }
      } else if (step && coordinateStep) {
        this.setStepPosition({
          thumbDistance,
          trackWidth,
          trackHeight,
          elementCoordinate: thumbNode,
          numberTranslation: coordinateStep,
          vertical,
          event,
          range,
        });

        vertical ? this.thumbTop = parseFloat(thumbElement.style.top)
          : this.thumbLeft = parseFloat(thumbElement.style.left);
      } else if (isVerticalNotStep) {
        switch (true) {
          case distance + shift >= trackHeight * this.rem
          && thumbElement !== thumbMin: thumbNode.style.top = `${trackHeight * this.rem}rem`;
            this.thumbTop = trackHeight * this.rem;
            break;
          case distance + shift < 0 && thumbElement !== thumbMax:
            thumbNode.style.top = `${0}rem`;
            this.thumbTop = 0;
            break;
          case thumbElement === thumbMin && Boolean((thumbMaxTop || thumbMaxTop === 0)
           && (shift + distance > thumbMaxTop)): return;
          case thumbElement === thumbMax && Boolean((thumbMinTop || thumbMinTop === 0)
           && (shift + distance < thumbMinTop)): return;
          default: thumbNode.style.top = `${shift + distance}rem`;
            this.thumbTop = shift + distance;
        }
      }
    }

    updateData(options: UpdatingDataOptions): void {
      const {
        min, max, trackSize, distance, vertical, thumbElement, progress, progressSize,
        step,
      } = options;

      const isUpdateEnabled = step || !this.coordinateStep;

      if (isUpdateEnabled) {
        const valueOptions = {
          min,
          max,
          trackSize: Math.round(trackSize),
          distance: distance / this.rem,
        };
        const value: number = this.presenter.calculateSliderValue(valueOptions);
        const optionsForLabel = {
          value: Math.round(value),
          coordinate: distance,
          vertical,
          thumbElement,
        };
        const isDistance = distance || distance === 0;
        if (isDistance) {
          this.view.updateLabelValue(optionsForLabel);
        }
      }

      if (progress) {
        this.viewOptional.stylingProgress({
          progressSize,
          vertical,
          thumbElement,
        });
      }
    }

    setStepPosition(options: StepPositionOptions): void {
      const {
        trackWidth, trackHeight, elementCoordinate, numberTranslation, vertical,
        event, range,
      } = options;

      const element = elementCoordinate;

      const setCoordinate = (type: 'above' | 'below', indexOfCoordinate: number): number => {
        let index = indexOfCoordinate;
        if (type === 'above') {
          if (this.coordinateStep[index] === this.coordinateStep[index + 1]) {
            do {
              index += 1;
            } while (this.coordinateStep[index] === this.coordinateStep[index + 1]);
          }
          return this.coordinateStep[index + 1];
        }
        if (this.coordinateStep[index] === this.coordinateStep[index - 1]) {
          do {
            index += 1;
          } while (this.coordinateStep[index] === this.coordinateStep[index - 1]);
        }
        return this.coordinateStep[index - 1];
      };

      const stepPosition = {
        setLeft: (): void => {
          const numberCoordinateLeft = parseFloat(element.style.left);
          const index = this.coordinateStep.findIndex(
            (value) => value === Number((numberCoordinateLeft / this.rem).toFixed(2)),
          );

          const distanceOfPageX = event.pageX - (((element as HTMLElement)
            .parentElement as HTMLElement).querySelector('.slider__track') as HTMLElement).getBoundingClientRect().left;
          const thumbRangeFlag: {above: boolean; below: boolean} = { above: false, below: false };
          if (range) {
            const isThumbMin = element.classList.contains('js-slider__thumb_min');
            if (isThumbMin) {
              const thumbMaxLeft = parseFloat((element.nextElementSibling as HTMLElement)
                .style.left);
              const thumbMinLeft = parseFloat(element.style.left);
              thumbRangeFlag.above = thumbMaxLeft > this.coordinateStep[index + 1] * this.rem
              && thumbMinLeft < thumbMaxLeft;
              thumbRangeFlag.below = numberCoordinateLeft <= thumbMaxLeft;
            } else {
              const thumbMinLeft = parseFloat((element.previousElementSibling as HTMLElement)
                .style.left);
              const thumbMaxLeft = parseFloat(element.style.left);
              thumbRangeFlag.below = this.coordinateStep[index - 1] * this.rem > thumbMinLeft
              && thumbMaxLeft > thumbMinLeft;
              thumbRangeFlag.above = numberCoordinateLeft >= thumbMinLeft;
            }
          }

          const isAbove0 = range ? numberCoordinateLeft <= trackWidth * this.rem
           && thumbRangeFlag.above && distanceOfPageX >= this.coordinateStep[index]
            + (this.coordinateStep[index + 1] - this.coordinateStep[index]) / 2
            : numberCoordinateLeft < trackWidth * this.rem
            && distanceOfPageX >= this.coordinateStep[index]
            + (this.coordinateStep[index + 1] - this.coordinateStep[index]) / 2;

          const isBelow0 = range ? numberCoordinateLeft >= Number((numberTranslation * this.rem)
            .toFixed(5)) && thumbRangeFlag.below
            && distanceOfPageX <= this.coordinateStep[index]
            - (this.coordinateStep[index] - this.coordinateStep[index - 1]) / 2
            : numberCoordinateLeft >= Number((numberTranslation * this.rem).toFixed(5))
            && distanceOfPageX <= this.coordinateStep[index]
            - (this.coordinateStep[index] - this.coordinateStep[index - 1]) / 2;

          if (isAbove0) {
            element.style.left = `${setCoordinate('above', index) * this.rem}rem`;
            const optionsForLabel = {
              value: this.stepValues[index + 1] || this.stepValues[this.stepValues.length - 1],
              coordinate: this.coordinateStep[index + 1] * this.rem,
              vertical,
              thumbElement: element,
            };
            this.view.updateLabelValue(optionsForLabel);
          } else if (isBelow0) {
            element.style.left = `${setCoordinate('below', index) * this.rem}rem`;
            const optionsForLabel = {
              value: this.stepValues[index - 1],
              coordinate: this.coordinateStep[index - 1] * this.rem,
              vertical,
              thumbElement: element,
            };
            this.view.updateLabelValue(optionsForLabel);
          }
        },
        setTop: (): void => {
          const numberCoordinateTop = parseFloat(element.style.top);
          const index = this.coordinateStep.findIndex((value) => value
             === Number((numberCoordinateTop / this.rem).toFixed(2)));
          const distanceOfPageY = event.pageY - ((((element as HTMLElement)
            .parentElement as HTMLElement).querySelector('.slider__track') as HTMLElement).getBoundingClientRect().top + window.scrollY);

          const thumbRangeFlag: {above: boolean; below: boolean} = { above: false, below: false };
          if (range) {
            const isThumbMin = element.classList.contains('js-slider__thumb_min');
            if (isThumbMin) {
              const thumbMaxTop = parseFloat((element.nextElementSibling as HTMLElement).style.top);
              const thumbMinTop = parseFloat(element.style.top);
              thumbRangeFlag.above = thumbMaxTop > this.coordinateStep[index + 1] * this.rem
              && thumbMinTop < thumbMaxTop;
              thumbRangeFlag.below = numberCoordinateTop <= thumbMaxTop;
            } else {
              const thumbMinTop = parseFloat((element.previousElementSibling as HTMLElement)
                .style.top);
              const thumbMaxTop = parseFloat(element.style.top);
              thumbRangeFlag.below = this.coordinateStep[index - 1] * this.rem > thumbMinTop
              && thumbMaxTop > thumbMinTop;
              thumbRangeFlag.above = numberCoordinateTop >= thumbMinTop;
            }
          }

          const nextCoordinate = this.coordinateStep[index + 1] === 0 ? 0
            : this.coordinateStep[index + 1] || this.coordinateStep[this.coordinateStep.length - 1];
          const isAbove0 = range ? numberCoordinateTop <= trackHeight * this.rem
           && thumbRangeFlag.above && distanceOfPageY >= this.coordinateStep[index]
            + (nextCoordinate - this.coordinateStep[index]) / 2
            : numberCoordinateTop < trackHeight * this.rem && distanceOfPageY
            >= this.coordinateStep[index]
            + (this.coordinateStep[index + 1] - this.coordinateStep[index]) / 2;

          const previousCoordinate = this.coordinateStep[index - 1] === 0 ? 0
            : this.coordinateStep[index - 1] || this.coordinateStep[1];
          const isBelow0 = range ? numberCoordinateTop <= trackHeight * this.rem
           && thumbRangeFlag.below && distanceOfPageY <= this.coordinateStep[index]
            - (this.coordinateStep[index] - previousCoordinate) / 2
            : numberCoordinateTop <= trackHeight * this.rem
            && numberCoordinateTop !== 0 && distanceOfPageY <= this.coordinateStep[index]
            - (this.coordinateStep[index] - this.coordinateStep[index - 1]) / 2;

          if (isAbove0) {
            element.style.top = `${(setCoordinate('above', index)) * this.rem}rem`;
            const optionsForLabel = {
              value: this.stepValues[index + 1] || this.stepValues[this.stepValues.length - 1],
              coordinate: this.coordinateStep[index + 1] * this.rem,
              vertical,
              thumbElement: element,
            };
            this.view.updateLabelValue(optionsForLabel);
          } else if (isBelow0) {
            element.style.top = `${(setCoordinate('below', index)) * this.rem}rem`;
            const optionsForLabel = {
              value: this.stepValues[index - 1] || this.stepValues[0],
              coordinate: this.coordinateStep[index - 1] * this.rem || this.coordinateStep[0],
              vertical,
              thumbElement: element,
            };
            this.view.updateLabelValue(optionsForLabel);
          }
        },
      };

      vertical ? stepPosition.setTop() : stepPosition.setLeft();
    }
}

export default ViewUpdating;
