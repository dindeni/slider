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

      Array.from($wrapper.find('.slider-thumb')).map((value) => {
        this.viewOptional = new ViewOptional();
        this.view = new View();

        const trackHeight: number = (((value as HTMLElement).parentElement as HTMLElement)
          .querySelector('.slider-track') as HTMLElement).getBoundingClientRect().height;
        const trackWidth: number = (((value as HTMLElement).parentElement as HTMLElement)
          .querySelector('.slider-track') as HTMLElement).getBoundingClientRect().width;

        let scaleCoordStep: number;
        if (step) {
          const { coords } = this.presenter.calculateLeftScaleCoords(min, max, step, vertical,
            trackWidth, trackHeight);
          [, scaleCoordStep] = coords;
        }

        const moveThumb = (evt: MouseEvent): void => {
          evt.preventDefault();

          const { width } = (evt.target as HTMLElement).getBoundingClientRect();

          if (evt.target === value) {
            let thumbDistance: number;
            vertical ? thumbDistance = Presenter.calculateThumbDistance(
              vertical, step, evt.target as HTMLElement, this.coordYStart,
              evt.screenY,
            ) : thumbDistance = Presenter.calculateThumbDistance(
              vertical, step, evt.target as HTMLElement, this.coordXStart,
              evt.screenX,
            );

            this.updateThumbCoordinates(vertical, step, thumbDistance,
                        evt.target as HTMLElement, width, trackHeight, evt,
                        trackWidth, this.shift, scaleCoordStep);

            !vertical ? this.updateData(min, max, trackWidth,
              parseInt((evt.target as HTMLElement).style.left || '0', 10),
              vertical, evt.target as HTMLElement, progress, this.divThumbLeft)
              : this.updateData(min, max, trackHeight,
                parseInt((evt.target as HTMLElement).style.top || '0', 10),
                vertical, evt.target as HTMLElement, progress, this.divThumbTop);
          }

          if (step) {
            value.removeEventListener('mousemove', moveThumb);
          }
        };

        const getDownCoord = (evt: MouseEvent): void => {
          evt.preventDefault();
          const isVertical = (evt.target as HTMLElement).classList.contains('vertical');

          const isVerticalMinOrMax = (evt.target === value || evt.target === divThumbMin
            || evt.target === divThumbMax) && isVertical;
          if (!isVertical) {
            this.coordXStart = evt.screenX;
            this.shift = parseInt((evt.target as HTMLElement).style.left || '0', 10);
          } else if (isVerticalMinOrMax) {
            this.coordYStart = evt.screenY;

            this.shift = parseInt((evt.target as HTMLElement).style.top || '0', 10);
          }
          value.addEventListener('mousemove', moveThumb);
        };

        value.addEventListener('mousedown', getDownCoord);

        const handlerRemoveMouseup = (): void => value.removeEventListener('mousemove', moveThumb);
        return value.addEventListener('mouseup', handlerRemoveMouseup);
      });
    }

    updateThumbCoordinates(vertical: boolean, step: number | undefined,
      thumbDistance: number, thumbElement: HTMLElement,
      thumbWidth: number, trackHeight: number, evt: MouseEvent,
      trackWidth, shift: number,
      scaleCoordStep: number): void {
      const divThumb: HTMLElement = thumbElement;
      const isNotVerticalStep = !vertical && !step;
      const isDivThumbStep = step && evt.target === divThumb;
      const isVerticalNotStep = vertical && !step;
      if (isNotVerticalStep) {
        switch (true) {
          case thumbDistance + shift > trackWidth:
            divThumb.style.left = `${trackWidth}px`;
            break;
          case thumbDistance + shift < 0: divThumb.style.left = `${0}px`;
            break;
          default: divThumb.style.left = `${shift + thumbDistance}px`;
            this.divThumbLeft = shift + thumbDistance;
        }
      } else if (isDivThumbStep) {
        ViewDnD.setStepPosition(thumbDistance, trackWidth, trackHeight,
          divThumb, scaleCoordStep, vertical);
        !vertical ? this.divThumbLeft = parseInt((
                evt.target as HTMLElement).style.left || '0', 10)
          : this.divThumbTop = parseInt((
                    evt.target as HTMLElement).style.top || '0', 10);
      } else if (isVerticalNotStep) {
        switch (true) {
          case thumbDistance + shift > trackHeight:
            divThumb.style.top = `${trackHeight}px`;
            break;
          case thumbDistance + shift < 0:
            divThumb.style.top = `${0}px`;
            break;
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
      numberTranslation: number, vertical: boolean): void {
      const coord = coordElement;
      const stepPosition = {
        left: (): void => {
          const numberCoordLeft = parseInt(coord.style.left || '0', 10);

          const isAbove0 = thumbDistance > 0 && numberCoordLeft < trackWidth;
          const isBelow0 = thumbDistance <= 0 && numberCoordLeft
            >= numberTranslation;
          if (isAbove0) {
            coord.style.left = `${numberCoordLeft + numberTranslation}px`;
          } else if (isBelow0) {
            coord.style.left = `${numberCoordLeft - numberTranslation}px`;
          }
        },
        top: (): void => {
          const numberCoordTop = parseInt(coord.style.top || '0', 10);

          const isAbove0 = thumbDistance > 0 && numberCoordTop < trackHeight;
          const isBelow0 = thumbDistance <= 0 && numberCoordTop
            >= numberTranslation;
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
