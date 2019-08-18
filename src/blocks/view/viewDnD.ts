import ViewOptional from "./viewOptional";
import View from "./view";
import Presenter from "../presenter/presenter";

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
    min: number, max: number, wrapper: JQuery){
        let divThumbMin: HTMLElement, divThumbMax;

        Array.from(wrapper.find('.slider-thumb')).map((value, i)=>{

            this.viewOptional = new ViewOptional();
            this.view = new View();

            const trackHeight: number = (((value as HTMLElement).parentElement as HTMLElement).
            querySelector('.slider-track') as HTMLElement).getBoundingClientRect().height;
            const trackWidth: number = (((value as HTMLElement).parentElement as HTMLElement).
            querySelector('.slider-track') as HTMLElement).getBoundingClientRect().width;

            let scaleCoordStep: number;
            step ? scaleCoordStep = this.presenter.calculateLeftScaleCoords(min, max, step, vertical,
                trackWidth, trackHeight).coords[1] : null;

            const moveThumb = (evt: MouseEvent)=>{
                evt.preventDefault();

                const width: number = (evt.target as HTMLElement).getBoundingClientRect().width;

                if (evt.target === value){

                    let thumbDistance: number;
                    vertical ? thumbDistance = Presenter.calculateThumbDistance(
                        vertical, step, evt.target as HTMLElement, this.coordYStart,
                        evt.screenY) : thumbDistance = Presenter.calculateThumbDistance(
                        vertical, step, evt.target as HTMLElement, this.coordXStart,
                        evt.screenX);

                    this.updateThumbCoordinates(vertical, step, thumbDistance,
                        evt.target as HTMLElement, width, trackHeight, evt,
                        trackWidth, this.shift, scaleCoordStep);

                    !vertical ? this.updateData(min, max, trackWidth,
                        parseInt((evt.target as HTMLElement).style.left || '0', 10),
                        vertical, evt.target as HTMLElement, progress, this.divThumbLeft) :
                        this.updateData(min, max, trackHeight,
                            parseInt((evt.target as HTMLElement).style.top || '0', 10),
                            vertical, evt.target as HTMLElement, progress, this.divThumbTop);

                }

                step ? value.removeEventListener('mousemove', moveThumb) : null;
            };

            const getDownCoord = (evt: MouseEvent)=>{
                evt.preventDefault();
                const isVertical = (evt.target as HTMLElement).classList.contains('vertical');

                if (!isVertical){
                    this.coordXStart = evt.screenX;
                    this.shift = parseInt((evt.target as HTMLElement).style.left || '0', 10);

                }else if (evt.target === value|| evt.target === divThumbMin ||
                    evt.target === divThumbMax && isVertical){
                    this.coordYStart = evt.screenY;

                    this.shift = parseInt((evt.target as HTMLElement).style.top || '0', 10);

                }
                value.addEventListener('mousemove', moveThumb);
            };

            value.addEventListener('mousedown', getDownCoord);

            value.addEventListener('mouseup', ()=>{
                value.removeEventListener('mousemove', moveThumb);
            });

        });
    }

    updateThumbCoordinates(vertical: boolean, step: number | undefined,
                           thumbDistance: number, divThumb: HTMLElement,
                           thumbWidth: number, trackHeight: number, evt: MouseEvent,
                           trackWidth, shift: number,
                           scaleCoordStep: number){

        if (!vertical && !step){
            switch (true) {
                case thumbDistance + shift > trackWidth:
                    divThumb.style.left = trackWidth + 'px';
                    break;
                case thumbDistance + shift  < 0 : divThumb.style.left = 0 + 'px';
                    break;
                default: divThumb.style.left = shift + thumbDistance + 'px';
                    this.divThumbLeft = shift + thumbDistance
            }
        }else if(step && evt.target === divThumb){

            this.setStepPosition(thumbDistance, trackWidth, trackHeight,
                divThumb, scaleCoordStep, vertical);
            !vertical ? this.divThumbLeft = parseInt((
                evt.target as HTMLElement).style.left ||'0') :
                this.divThumbTop =  parseInt((
                    evt.target as HTMLElement).style.top ||'0')

        }else if (vertical  && !step) {
            switch (true) {
                case thumbDistance + shift > trackHeight:
                    divThumb.style.top = trackHeight + 'px';
                    break;
                case thumbDistance + shift < 0:
                    divThumb.style.top = 0 + 'px';
                    break;
                default: divThumb.style.top = (shift + thumbDistance) + 'px';
                    this.divThumbTop = shift + thumbDistance
            }
        }
    }

    updateData(min, max, trackWidthHeight: number, distance: number, vertical,
               divThumb: HTMLElement, progress: boolean, progressWidthHeight: number) {
        let value: number;

            value = this.presenter.calculateSliderValue(min, max,
                trackWidthHeight, distance);

            this.view.updateLabelValue(value, distance, vertical, divThumb);
            if (progress){
                ViewOptional.stylingProgress(progressWidthHeight, vertical, divThumb)
            }

    }

    setStepPosition(thumbDistance: number, trackWidth: number,
                             trackHeight: number, coord: HTMLElement,
                    numberTranslation: number, vertical: boolean){

        const stepPosition = {
            left: ()=>{
                const numberCoordLeft = parseInt(coord.style.left || '0');

                if(thumbDistance > 0 && numberCoordLeft < trackWidth){
                    coord.style.left = numberCoordLeft + numberTranslation + 'px';
                }else if(thumbDistance <= 0 && numberCoordLeft >=
                    numberTranslation){
                    coord.style.left = numberCoordLeft - numberTranslation + 'px';
                }
            },
            top: ()=>{
                const numberCoordTop = parseInt(coord.style.top || '0');

                if(thumbDistance > 0 && numberCoordTop < trackHeight){
                    coord.style.top = numberCoordTop + numberTranslation + 'px';
                }else if(thumbDistance <= 0 && numberCoordTop >=
                    numberTranslation){
                    coord.style.top = numberCoordTop - numberTranslation + 'px';
                }
            }
        };

        !vertical ? stepPosition.left() : stepPosition.top();
    }
}

export {ViewDnD}