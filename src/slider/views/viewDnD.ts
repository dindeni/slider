import ViewOptional from './viewOptional';
import View from './view';
import Presenter from '../presenter/presenter';

class ViewDnD {
    private coordXStart: number;

    private shift: number;

    private coordYStart: number;

    private divThumbLeft: number;

    private divThumbTop: number;

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
          const { coords } = this.presenter.calculateLeftScaleCoords(min, max, step, vertical,
            trackWidth, trackHeight);
          [, scaleCoordStep] = coords;
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

      !vertical ? this.updateData(min, max, trackWidth,
        parseInt(value.style.left || '0', 10),
        vertical, value, progress, this.divThumbLeft)
        : this.updateData(min, max, trackHeight,
          parseInt(value.style.top || '0', 10),
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
          this.shift = parseInt((evt.target as HTMLElement).style.left || '0', 10);
        } else if (isVerticalMinOrMax) {
          this.coordYStart = evt.screenY;
          this.shift = parseInt((evt.target as HTMLElement).style.top || '0', 10);
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
          !vertical ? thumbNode.style.left = `${coordStep}px`
            : thumbNode.style.top = `${coordStep}px`;
          !vertical ? this.divThumbLeft = coordStep : this.divThumbTop = coordStep;

          !vertical ? this.updateData(min, max, trackWidth, coordStep, vertical, thumbElement,
            progress, this.divThumbLeft)
            : this.updateData(min, max, trackHeight, coordStep, vertical, thumbElement,
              progress, this.divThumbTop);
        };

        const updateThumbLabel = (thumbElement: HTMLElement): void => {
          this.updateThumbCoordinates(vertical, step, distance, thumbElement,
            trackHeight, evt, trackWidth, 0, coordStep, false);

          !vertical ? this.updateData(min, max, trackWidth, distance, vertical, thumbElement,
            progress, this.divThumbLeft)
            : this.updateData(min, max, trackHeight, distance, vertical, thumbElement,
              progress, this.divThumbTop);
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
      const divThumb: HTMLElement = thumbElement;
      const isNotVerticalStep = !vertical && !step;
      const isVerticalNotStep = vertical && !step;
      const isStepNotRange = step && !range;

      let thumbMinLeft; let thumbMaxLeft; let thumbMinTop; let thumbMaxTop;
      let thumbMin; let thumbMax; let thumbMinWidth;

      if (range) {
        thumbMin = (thumbElement.parentElement as HTMLElement).querySelector('.js-slider__thumb_min');
        thumbMax = (thumbElement.parentElement as HTMLElement).querySelector('.js-slider__thumb_max');
        thumbMinLeft = parseInt((thumbMin as HTMLElement).style.left || '0', 10);
        thumbMaxLeft = parseInt((thumbMax as HTMLElement).style.left || '0', 10);
        thumbMinTop = parseInt((thumbMin as HTMLElement).style.top || '0', 10);
        thumbMaxTop = parseInt((thumbMax as HTMLElement).style.top || '0', 10);
        thumbMinWidth = thumbMin.getBoundingClientRect().width;

        if (step) {
          switch (true) {
            case thumbElement === thumbMin && !vertical && (shift + thumbDistance
             < thumbMaxLeft - scaleCoordStep):
              ViewDnD.setStepPosition(thumbDistance, trackWidth, trackHeight,
                divThumb, scaleCoordStep, vertical, evt);
              this.divThumbLeft = parseInt(thumbElement.style.left || '0', 10);
              break;
            case thumbElement === thumbMax && !vertical && (shift + thumbDistance
             > thumbMinLeft + scaleCoordStep):
              ViewDnD.setStepPosition(thumbDistance, trackWidth, trackHeight,
                divThumb, scaleCoordStep, vertical, evt);
              this.divThumbLeft = parseInt(thumbElement.style.left || '0', 10);
              break;
            case thumbElement === thumbMin && vertical && (shift + thumbDistance
             < thumbMaxTop - scaleCoordStep):
              ViewDnD.setStepPosition(thumbDistance, trackWidth, trackHeight,
                divThumb, scaleCoordStep, vertical, evt);
              this.divThumbTop = parseInt(thumbElement.style.top || '0', 10);
              break;
            case thumbElement === thumbMax && vertical && (shift + thumbDistance
             > thumbMinTop + scaleCoordStep):
              ViewDnD.setStepPosition(thumbDistance, trackWidth, trackHeight,
                divThumb, scaleCoordStep, vertical, evt);
              this.divThumbTop = parseInt(thumbElement.style.top || '0', 10);
              break;
            default: return;
          }
        }
      }

      if (isNotVerticalStep) {
        switch (true) {
          case thumbDistance + shift >= trackWidth && thumbElement !== thumbMin:
            divThumb.style.left = `${trackWidth}px`;
            break;
          case thumbDistance + shift < 0 && thumbElement !== thumbMax: divThumb.style.left = `${0}px`;
            break;
          case thumbElement === thumbMin && (shift + thumbDistance
           > thumbMaxLeft - thumbMinWidth): return;
          case thumbElement === thumbMax && ((shift + thumbDistance)
           < thumbMinLeft + thumbMinWidth): return;
          default: divThumb.style.left = `${shift + thumbDistance}px`;
            this.divThumbLeft = shift + thumbDistance;
        }
      } else if (isStepNotRange) {
        ViewDnD.setStepPosition(thumbDistance, trackWidth, trackHeight,
          divThumb, scaleCoordStep, vertical, evt);
        !vertical ? this.divThumbLeft = parseInt(thumbElement.style.left || '0', 10)
          : this.divThumbTop = parseInt(thumbElement.style.top || '0', 10);
      } else if (isVerticalNotStep) {
        switch (true) {
          case thumbDistance + shift > trackHeight && thumbElement !== thumbMin:
            divThumb.style.top = `${trackHeight}px`;
            break;
          case thumbDistance + shift < 0 && thumbElement !== thumbMax:
            divThumb.style.top = `${0}px`;
            break;
          case thumbElement === thumbMin && (shift + thumbDistance
           > thumbMaxTop - thumbMinWidth * 2): return;
          case thumbElement === thumbMax && ((shift + thumbDistance)
           < thumbMinTop + thumbMinWidth * 2): return;
          default: divThumb.style.top = `${shift + thumbDistance}px`;
            this.divThumbTop = shift + thumbDistance;
        }
      }
    }

    updateData(min, max, trackWidthHeight: number, distance: number, vertical,
      divThumb: HTMLElement, progress: boolean, progressWidthHeight: number): void {
      const value: number = this.presenter.calculateSliderValue(min, max,
        trackWidthHeight, distance);

      this.view.updateLabelValue(value, distance, vertical, divThumb);
      if (progress) {
        ViewOptional.stylingProgress(progressWidthHeight, vertical, divThumb);
      }
    }

    static setStepPosition(thumbDistance: number, trackWidth: number,
      trackHeight: number, coordElement: HTMLElement,
      numberTranslation: number, vertical: boolean, evt: MouseEvent): void {
      const coord = coordElement;
      const stepPosition = {
        left: (): void => {
          const numberCoordLeft = parseInt(coord.style.left || '0', 10);

          const isAbove0 = numberCoordLeft < trackWidth
            && evt.pageX >= coordElement.getBoundingClientRect().left + numberTranslation / 2;
          const isBelow0 = numberCoordLeft
            >= numberTranslation && evt.pageX <= coordElement.getBoundingClientRect().left
             - numberTranslation / 2;
          if (isAbove0) {
            coord.style.left = `${numberCoordLeft + numberTranslation}px`;
          } else if (isBelow0) {
            coord.style.left = `${numberCoordLeft - numberTranslation}px`;
          }
        },
        top: (): void => {
          const numberCoordTop = parseInt(coord.style.top || '0', 10);

          const isAbove0 = numberCoordTop < trackHeight && evt.pageY
           >= coordElement.getBoundingClientRect().top + window.scrollY + numberTranslation / 2;
          const isBelow0 = numberCoordTop <= trackHeight && numberCoordTop !== 0 && evt.pageY
           <= coordElement.getBoundingClientRect().top + window.scrollY - numberTranslation / 2;
          if (isAbove0) {
            coord.style.top = `${numberCoordTop + numberTranslation}px`;
          } else if (isBelow0) {
            coord.style.top = `${numberCoordTop - numberTranslation}px`;
          }
        },
      };

      !vertical ? stepPosition.left() : stepPosition.top();
    }
}

export default ViewDnD;
