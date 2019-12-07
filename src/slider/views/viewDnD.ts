import ViewOptional from './viewOptional';
import View from './view';
import Presenter from '../presenter/presenter';

class ViewDnD {
    private coordXStart: number;

    private shift: number;

    private coordYStart: number;

    private divThumbLeft: number;

    private divThumbTop: number;

    private coordsStep: number[];

    private stepValues: number[];

    private rem = 0.077;

    viewOptional: ViewOptional = new ViewOptional();

    view: View = new View();

    presenter: Presenter = new Presenter();

    addDnD(step: number | undefined, vertical: boolean, range: boolean, progress: boolean,
      min: number, max: number, $wrapper: JQuery): void {
      let divThumbMin: HTMLElement; let
        divThumbMax;

      Array.from($wrapper.find('.js-slider__thumb')).map((value) => {
        const trackHeight: number = (((value as HTMLElement).parentElement as HTMLElement)
          .querySelector('.js-slider__track') as HTMLElement).getBoundingClientRect().height;
        const trackWidth: number = (((value as HTMLElement).parentElement as HTMLElement)
          .querySelector('.js-slider__track') as HTMLElement).getBoundingClientRect().width;

        let scaleCoordStep: number;
        if (step) {
          const stepData = this.presenter.calculateLeftScaleCoords(min, max, step, vertical,
            trackWidth, trackHeight);

          [, scaleCoordStep] = stepData.coords;

          this.coordsStep = stepData.coords;
          this.stepValues = stepData.value;
        }


        return document.addEventListener('mousedown', (evt) => this.getDownCoord(evt,
          divThumbMin, divThumbMax, value, vertical, step, trackWidth, trackHeight,
          min, max, scaleCoordStep, progress, range));
      });

      Array.from($wrapper.find('.js-slider__track')).map((value) => value
        .addEventListener('click', (evt) => this.handlerClick(evt,
          value, vertical, step, range, progress, min, max)));


      this.viewOptional = new ViewOptional();
      this.view = new View();
    }

    moveThumb(evt: MouseEvent, value: HTMLElement, vertical: boolean, step,
      trackWidth: number, trackHeight: number, min: number, max: number,
      scaleCoordStep: number, progress: boolean, range: boolean): void {
      evt.preventDefault();

      let thumbDistance: number;
      vertical ? thumbDistance = Presenter.calculateThumbDistance(this.coordYStart,
        evt.screenY) : thumbDistance = Presenter.calculateThumbDistance(
        this.coordXStart, evt.screenX,
      );

      this.updateThumbCoordinates(vertical, step, thumbDistance,
        value, trackHeight, evt,
        trackWidth, this.shift, scaleCoordStep, range);

      !vertical ? this.updateData(min, max, trackWidth, this.divThumbLeft,
        vertical, value, progress, this.divThumbLeft)
        : this.updateData(min, max, trackHeight, parseFloat(value.style.top),
          vertical, value, progress, this.divThumbTop);
    }

    getDownCoord(evt: MouseEvent, divThumbMin: HTMLElement, divThumbMax: HTMLElement,
      value: HTMLElement, vertical: boolean, step: number | undefined, trackWidth: number,
      trackHeight: number, min: number, max: number,
      scaleCoordStep: number, progress: boolean, range: boolean): void {
      if (evt.target === value) {
        const isVertical = (evt.target as HTMLElement).classList.contains('js-slider__thumb_vertical');

        const isVerticalMinOrMax = (evt.target === value || evt.target === divThumbMin
        || evt.target === divThumbMax) && isVertical;
        if (!isVertical) {
          this.coordXStart = evt.screenX;
          this.shift = parseFloat((evt.target as HTMLElement).style.left);
        } else if (isVerticalMinOrMax) {
          this.coordYStart = evt.screenY;
          this.shift = parseFloat((evt.target as HTMLElement).style.top);
        }

        const handlerMousemove = (evtMove): void => this.moveThumb(evtMove,
          value, vertical, step, trackWidth, trackHeight, min, max,
          scaleCoordStep, progress, range);

        document.addEventListener('mousemove', handlerMousemove);

        document.addEventListener('mouseup', () => {
          document.removeEventListener('mousemove', handlerMousemove);
        });
      }
    }

    handlerClick(evt: MouseEvent, track, vertical, step, range, progress, min, max): void {
      const target = evt.target as HTMLElement;
      const wrapper = target.parentElement as HTMLElement;

      const isTrack = target === track || wrapper.querySelector('.js-slider__progress');
      if (isTrack) {
        const thumb = track.parentElement.querySelector('.js-slider__thumb') as HTMLElement;
        let distance = !vertical ? evt.pageX - track.getBoundingClientRect().left
        - thumb.getBoundingClientRect().width / 2
          : evt.pageY - window.scrollY - track.getBoundingClientRect().top
           + thumb.getBoundingClientRect().height / 2;

        const trackHeight = track.getBoundingClientRect().height;
        const trackWidth = track.getBoundingClientRect().width;

        if (distance < 0) {
          distance = 0;
        }
        const isVerticalAboveTrackHeight = vertical && distance > trackHeight;
        if (isVerticalAboveTrackHeight) {
          distance = trackHeight;
        }

        let coordStep;

        const updateStepThumbLabel = (thumbElement: HTMLElement): void => {
          const scaleCoordsStep = this.presenter.calculateLeftScaleCoords(min, max,
            step, vertical, trackWidth, trackHeight);

          const stepDistance = distance + thumbElement.getBoundingClientRect().width;
          scaleCoordsStep.coords.forEach((value, index, array) => {
            let flag = false;

            const isDistanceAbove0 = stepDistance >= value && stepDistance
            < array[index + 1] && !flag;
            const isLastCoord = !flag && distance > array[array.length - 2]
            + thumb.getBoundingClientRect().width;

            if (isDistanceAbove0) {
              coordStep = value;
              flag = true;
            } else if (isLastCoord) {
              coordStep = value;
              flag = true;
            }
          });

          const thumbNode = thumbElement;
          !vertical ? thumbNode.style.left = `${coordStep * this.rem}rem`
            : thumbNode.style.top = `${coordStep * this.rem}rem`;
          !vertical ? this.divThumbLeft = coordStep * this.rem : this.divThumbTop = coordStep
           * this.rem;

          !vertical ? this.updateData(min, max, trackWidth, coordStep * this.rem, vertical,
            thumbElement, progress, this.divThumbLeft, true)
            : this.updateData(min, max, trackHeight, coordStep * this.rem, vertical, thumbElement,
              progress, this.divThumbTop, true);
        };

        const updateThumbLabel = (thumbElement: HTMLElement): void => {
          this.updateThumbCoordinates(vertical, step, distance, thumbElement,
            trackHeight, evt, trackWidth, 0, coordStep, false);

          !vertical ? this.updateData(min, max, trackWidth, distance * this.rem, vertical,
            thumbElement, progress, this.divThumbLeft)
            : this.updateData(min, max, trackHeight * this.rem, distance * this.rem, vertical,
              thumbElement, progress, this.divThumbTop);
        };

        const isNotRangeStep = !range && !step;
        const isStepNotRange = !range && step;
        if (isNotRangeStep) {
          updateThumbLabel(thumb);
        } else if (isStepNotRange) {
          updateStepThumbLabel(thumb);
        }

        if (range) {
          const thumbMin = track.parentElement.querySelector('.js-slider__thumb_min');
          const thumbMax = track.parentElement.querySelector('.js-slider__thumb_max');
          const thumbMinLeft = thumbMin.getBoundingClientRect().left;
          const thumbMaxLeft = thumbMax.getBoundingClientRect().left;
          const thumbMinTop = thumbMin.getBoundingClientRect().top;
          const thumbMaxTop = thumbMax.getBoundingClientRect().top;
          const thumbHeight = thumb.getBoundingClientRect().height;

          const coordsOfMiddle = !vertical ? Presenter.calculateCoordinatesOfMiddle(
            track.getBoundingClientRect().left, trackWidth,
          )
            : Presenter.calculateCoordinatesOfMiddle(
              track.getBoundingClientRect().top, trackHeight,
            );

          const isStepNotVertical = step && !vertical;
          const isStepVertical = step && vertical;
          if (isStepNotVertical) {
            switch (true) {
              case coordsOfMiddle > evt.pageX:
                updateStepThumbLabel(thumbMin);
                break;
              case coordsOfMiddle < evt.pageX:
                updateStepThumbLabel(thumbMax);
                break;
              default:
            }
          } else if (isStepVertical) {
            switch (true) {
              case coordsOfMiddle > evt.pageY - window.scrollY:
                updateStepThumbLabel(thumbMin);
                break;
              case coordsOfMiddle < evt.pageY - window.scrollY:
                updateStepThumbLabel(thumbMax);
                break;
              default:
            }
          } else {
            switch (true) {
              case !vertical ? evt.pageX < thumbMinLeft : thumbMinTop > evt.pageY - window.scrollY:
                updateThumbLabel(thumbMin);
                break;
              case !vertical ? evt.pageX > thumbMaxLeft : thumbMaxTop < evt.pageY - window.scrollY:
                updateThumbLabel(thumbMax);
                break;
              case !vertical ? evt.pageX < coordsOfMiddle : coordsOfMiddle - thumbHeight
              > evt.pageY - window.scrollY:
                updateThumbLabel(thumbMin);
                break;
              case !vertical ? evt.pageX > coordsOfMiddle : coordsOfMiddle - thumbHeight
              < evt.pageY - window.scrollY:
                updateThumbLabel(thumbMax);
                break;
              default:
            }
          }
        }
      }
    }

    updateThumbCoordinates(vertical: boolean, step: number | undefined,
      thumbDistance: number, thumbElement: HTMLElement, trackHeight: number,
      evt: MouseEvent, trackWidth, shift: number, scaleCoordStep: number, range: boolean): void {
      const distance = thumbDistance * this.rem;
      const divThumb: HTMLElement = thumbElement;
      const isNotVerticalStep = !vertical && !step;
      const isVerticalNotStep = vertical && !step;

      let thumbMinLeft; let thumbMaxLeft; let thumbMinTop; let thumbMaxTop;
      let thumbMin; let thumbMax; let thumbMinWidth;

      if (range) {
        thumbMin = (thumbElement.parentElement as HTMLElement).querySelector('.js-slider__thumb_min');
        thumbMax = (thumbElement.parentElement as HTMLElement).querySelector('.js-slider__thumb_max');
        thumbMinLeft = parseFloat((thumbMin as HTMLElement).style.left);
        thumbMaxLeft = parseFloat((thumbMax as HTMLElement).style.left);
        thumbMinTop = parseFloat((thumbMin as HTMLElement).style.top);
        thumbMaxTop = parseFloat((thumbMax as HTMLElement).style.top);
        thumbMinWidth = thumbMin.getBoundingClientRect().width * this.rem;
      }

      if (isNotVerticalStep) {
        switch (true) {
          case distance + shift >= trackWidth * this.rem
          && thumbElement !== thumbMin: divThumb.style.left = `${trackWidth * this.rem}rem`;
            this.divThumbLeft = trackWidth * this.rem;
            break;
          case distance + shift < 0 && thumbElement !== thumbMax: divThumb.style.left = `${0}rem`;
            this.divThumbLeft = 0;
            break;
          case thumbElement === thumbMin && (shift + distance
           > thumbMaxLeft - thumbMinWidth): return;
          case thumbElement === thumbMax && ((shift + distance)
           < thumbMinLeft + thumbMinWidth): return;
          default: divThumb.style.left = `${shift + distance}rem`;
            this.divThumbLeft = shift + distance;
        }
      } else if (step) {
        this.setStepPosition(thumbDistance, trackWidth, trackHeight,
          divThumb, scaleCoordStep, vertical, evt, range);
        !vertical ? this.divThumbLeft = parseFloat(thumbElement.style.left)
          : this.divThumbTop = parseFloat(thumbElement.style.top);
      } else if (isVerticalNotStep) {
        switch (true) {
          case distance + shift >= trackHeight * this.rem
          && thumbElement !== thumbMin: divThumb.style.top = `${trackHeight * this.rem}rem`;
            this.divThumbTop = trackHeight * this.rem;
            break;
          case distance + shift < 0 && thumbElement !== thumbMax:
            divThumb.style.top = `${0}rem`;
            this.divThumbTop = 0;
            break;
          case thumbElement === thumbMin && (shift + distance
           > thumbMaxTop - thumbMinWidth * 2): return;
          case thumbElement === thumbMax && ((shift + distance)
           < thumbMinTop + thumbMinWidth * 2): return;
          default: divThumb.style.top = `${shift + distance}rem`;
            this.divThumbTop = shift + distance;
        }
      }
    }

    updateData(min, max, trackWidthHeight: number, distance: number, vertical,
      divThumb: HTMLElement, progress: boolean, progressWidthHeight: number, step?: boolean): void {
      const isUpdateEnabled = step || !this.coordsStep;

      if (isUpdateEnabled) {
        const value: number = this.presenter.calculateSliderValue(min, max,
          Math.round(trackWidthHeight), distance / this.rem);
        this.view.updateLabelValue(Math.round(value), distance, vertical, divThumb);
      }

      if (progress) {
        this.viewOptional.stylingProgress(progressWidthHeight, vertical, divThumb);
      }
    }

    setStepPosition(thumbDistance: number, trackWidth: number,
      trackHeight: number, coordElement: HTMLElement,
      numberTranslation: number, vertical: boolean, evt: MouseEvent, range: boolean): void {
      const coord = coordElement;

      const setCoords = (type: 'above' | 'below', indexOfCoord: number): number => {
        let index = indexOfCoord;
        const set = {
          above: (): number => {
            if (this.coordsStep[index] === this.coordsStep[index + 1]) {
              do {
                index += 1;
              } while (this.coordsStep[index] === this.coordsStep[index + 1]);
            }
            return this.coordsStep[index + 1];
          },

          below: (): number => {
            if (this.coordsStep[index] === this.coordsStep[index - 1]) {
              do {
                index += 1;
              } while (this.coordsStep[index] === this.coordsStep[index - 1]);
            }
            return this.coordsStep[index - 1];
          },
        };

        return type === 'above' ? set.above() : set.below();
      };

      const stepPosition = {
        left: (): void => {
          const numberCoordLeft = parseFloat(coord.style.left);

          const index = this.coordsStep.findIndex((value) => value === Math.round(
            numberCoordLeft / this.rem,
          ));

          const distanceOfPageX = evt.pageX - (((coord as HTMLElement)
            .parentElement as HTMLElement).querySelector('.slider__track') as HTMLElement).getBoundingClientRect().left;
          const thumbRangeFlag: {above: boolean; below: boolean} = { above: false, below: false };
          if (range) {
            const isThumbMin = coord.classList.contains('js-slider__thumb_min');
            if (isThumbMin) {
              const thumbMaxLeft = parseFloat((coord.nextElementSibling as HTMLElement).style.left);
              thumbRangeFlag.above = thumbMaxLeft > this.coordsStep[index + 1] * this.rem;
              thumbRangeFlag.below = numberCoordLeft <= thumbMaxLeft;
            } else {
              const thumbMinLeft = parseFloat((coord.previousElementSibling as HTMLElement)
                .style.left);
              thumbRangeFlag.below = this.coordsStep[index - 1] * this.rem > thumbMinLeft;
              thumbRangeFlag.above = numberCoordLeft >= thumbMinLeft;
            }
          }

          const isAbove0 = !range ? numberCoordLeft < trackWidth * this.rem
            && distanceOfPageX >= this.coordsStep[index]
            + (this.coordsStep[index + 1] - this.coordsStep[index]) / 2
            : numberCoordLeft < trackWidth * this.rem && thumbRangeFlag.above
            && distanceOfPageX >= this.coordsStep[index]
            + (this.coordsStep[index + 1] - this.coordsStep[index]) / 2;

          const isBelow0 = !range ? numberCoordLeft >= numberTranslation * this.rem
           && distanceOfPageX <= this.coordsStep[index]
            - (this.coordsStep[index] - this.coordsStep[index - 1]) / 2
            : numberCoordLeft >= numberTranslation * this.rem && thumbRangeFlag.below
            && distanceOfPageX <= this.coordsStep[index]
            - (this.coordsStep[index] - this.coordsStep[index - 1]) / 2;

          if (isAbove0) {
            coord.style.left = `${setCoords('above', index) * this.rem}rem`;
            this.view.updateLabelValue(this.stepValues[index + 1],
              this.coordsStep[index + 1] * this.rem, vertical, coord);
          } else if (isBelow0) {
            coord.style.left = `${setCoords('below', index) * this.rem}rem`;
            this.view.updateLabelValue(this.stepValues[index - 1],
              this.coordsStep[index - 1] * this.rem, vertical, coord);
          }
        },
        top: (): void => {
          const numberCoordTop = parseFloat(coord.style.top);
          const index = this.coordsStep.findIndex((value) => parseFloat((value * this.rem)
            .toFixed(3)) === numberCoordTop);
          const distanceOfPageY = evt.pageY - ((((coord as HTMLElement)
            .parentElement as HTMLElement).querySelector('.slider__track') as HTMLElement).getBoundingClientRect().top + window.scrollY);

          const thumbRangeFlag: {above: boolean; below: boolean} = { above: false, below: false };
          if (range) {
            const isThumbMin = coord.classList.contains('js-slider__thumb_min');
            if (isThumbMin) {
              const thumbMaxTop = parseFloat((coord.nextElementSibling as HTMLElement).style.top);
              thumbRangeFlag.above = thumbMaxTop > this.coordsStep[index + 1] * this.rem;
              thumbRangeFlag.below = numberCoordTop <= thumbMaxTop;
            } else {
              const thumbMinTop = parseFloat((coord.previousElementSibling as HTMLElement)
                .style.top);
              thumbRangeFlag.below = this.coordsStep[index - 1] * this.rem > thumbMinTop;
              thumbRangeFlag.above = numberCoordTop >= thumbMinTop;
            }
          }

          const isAbove0 = !range ? numberCoordTop < trackHeight * this.rem && distanceOfPageY
           >= this.coordsStep[index]
            + (this.coordsStep[index + 1] - this.coordsStep[index]) / 2
            : numberCoordTop < trackHeight * this.rem && thumbRangeFlag.above
             && distanceOfPageY >= this.coordsStep[index]
            + (this.coordsStep[index + 1] - this.coordsStep[index]) / 2;

          const isBelow0 = !range ? numberCoordTop <= trackHeight * this.rem && numberCoordTop !== 0
           && distanceOfPageY <= this.coordsStep[index]
            - (this.coordsStep[index] - this.coordsStep[index - 1]) / 2
            : numberCoordTop <= trackHeight * this.rem && numberCoordTop !== 0
             && thumbRangeFlag.below && distanceOfPageY <= this.coordsStep[index]
            - (this.coordsStep[index] - this.coordsStep[index - 1]) / 2;

          if (isAbove0) {
            coord.style.top = `${(setCoords('above', index)) * this.rem}rem`;
            this.view.updateLabelValue(this.stepValues[index + 1],
              this.coordsStep[index + 1] * this.rem, vertical, coord);
          } else if (isBelow0) {
            coord.style.top = `${(setCoords('below', index)) * this.rem}rem`;
            this.view.updateLabelValue(this.stepValues[index - 1],
              this.coordsStep[index - 1] * this.rem, vertical, coord);
          }
        },
      };

      !vertical ? stepPosition.left() : stepPosition.top();
    }
}

export default ViewDnD;
