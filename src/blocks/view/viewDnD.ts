import {ViewOptional} from "./viewOptional";
import {View} from "./view";
import {Presenter} from "../presenter/presenter";

class ViewDnD {
    coordXStart: number;
    shift: number;
    coordYStart: number;
    divThumbLeft: number;
    divThumbTop: number;

    viewOptional: ViewOptional = new ViewOptional();
    view: View = new View();
    presenter: Presenter = new Presenter();

    addDnD(step: number | undefined, vertical: boolean, range: boolean, progress: boolean,
    min: number, max: number){
        let divThumb, divThumbMin: HTMLElement, divThumbMax;

        Array.from(document.querySelectorAll('.slider-thumb')).map((value, i)=>{
            /* const divTrack = document.querySelector('.slider-track') as HTMLElement;*/
            /*const thumbWidth: number = divThumb.getBoundingClientRect().width;*/
            /*const trackHeight: number = divTrack.getBoundingClientRect().height;*/
            /*const trackWidth: number = divTrack.getBoundingClientRect().width;*/

            this.viewOptional = new ViewOptional();
            this.view = new View();

            const moveThumb = (evt: MouseEvent)=>{
                evt.preventDefault();

                const trackHeight: number = (((evt.target as HTMLElement).parentElement as HTMLElement).
                querySelector('.slider-track') as HTMLElement).getBoundingClientRect().height;
                const trackWidth: number = (((evt.target as HTMLElement).parentElement as HTMLElement).
                querySelector('.slider-track') as HTMLElement).getBoundingClientRect().width;
                const isVertical = (evt.target as HTMLElement).classList.contains('vertical');


                const width: number = (evt.target as HTMLElement).getBoundingClientRect().width;

                let thumbDistance: number;
                isVertical ? thumbDistance = this.presenter.calculateThumbDistance(
                    isVertical, step, evt.target as HTMLElement, this.coordYStart,
                    evt.screenY) : thumbDistance = this.presenter.calculateThumbDistance(
                    isVertical, step, evt.target as HTMLElement, this.coordXStart,
                    evt.screenX);

                /*(evt.target === value || evt.target === divThumbMin ||
                    evt.target === divThumbMax) ? this.updateThumbCoordinates(vertical, step, thumbDistance,
                    evt.target as HTMLElement, width, trackHeight, evt) : null;

                this.updateData(vertical, range, evt, divThumbMin, divThumbMax, progress);*/
                if (evt.target === value){

                    this.updateThumbCoordinates(isVertical, step, thumbDistance,
                        evt.target as HTMLElement, width, trackHeight, evt,
                        trackWidth, this.shift);

                    !isVertical ? this.updateData(min, max, trackWidth,
                        parseInt((evt.target as HTMLElement).style.left || '0', 10),
                        isVertical, evt.target as HTMLElement) :
                        this.updateData(min, max, trackHeight,
                            parseInt((evt.target as HTMLElement).style.top || '0', 10),
                            isVertical, evt.target as HTMLElement);

                    /*this.presenter.updateData(isVertical, range, evt, divThumbMin, divThumbMax,
                        value as HTMLElement, progress, trackWidth, trackHeight);*/

                }

                step ? document.removeEventListener('mousemove', moveThumb) : null;
            };

            const getDownCoord = (evt: MouseEvent)=>{
                evt.preventDefault();
                const isVertical = (evt.target as HTMLElement).classList.contains('vertical');

                if ((evt.target === value || evt.target === divThumbMin ||
                    evt.target === divThumbMax) && !isVertical){
                    this.coordXStart = evt.screenX;

                    this.shift = parseInt((evt.target as HTMLElement).style.left || '0', 10);


                }else if (evt.target === value|| evt.target === divThumbMin ||
                    evt.target === divThumbMax && isVertical){
                    this.coordYStart = evt.screenY;

                    this.shift = parseInt((evt.target as HTMLElement).style.top || '0', 10);

                }
                document.addEventListener('mousemove', moveThumb);
            };

            document.addEventListener('mousedown', getDownCoord);

            document.addEventListener('mouseup', ()=>{
                document.removeEventListener('mousemove', moveThumb);
            });

        });
        /* /!*if (range){
             divThumbMin = document.querySelector('#thumb-min') as HTMLElement;
             divThumbMax = document.querySelector('#thumb-max') as HTMLElement;
         }else {
             divThumb = document.querySelector('.slider-thumb') as HTMLElement;
         }*!/



         /!*const  divThumb = document.querySelector('.slider-thumb') as HTMLElement;*!/
         this.divTrack = document.querySelector('.slider-track') as HTMLElement;
         /!*const thumbWidth: number = divThumb.getBoundingClientRect().width;*!/
         const trackHeight: number = this.divTrack.getBoundingClientRect().height;

         this.viewOptional = new ViewOptional();
         this.model = new Model();

         const moveThumb = (evt: MouseEvent)=>{
             evt.preventDefault();

                 const width: number = (evt.target as HTMLElement).getBoundingClientRect().width;

             let thumbDistance: number = this.calculateThumbDistance(vertical,
                 evt, step, evt.target as HTMLElement);

             (evt.target === divThumb || evt.target === divThumbMin ||
                 evt.target === divThumbMax) ? this.updateThumbCoordinates(vertical, step, thumbDistance,
                 evt.target as HTMLElement, width, trackHeight, evt) : null;

             this.updateData(vertical, range, evt, divThumbMin, divThumbMax,
                 progress);

             step ? document.removeEventListener('mousemove', moveThumb) : null;
         };

         const getDownCoord = (evt: MouseEvent)=>{
             evt.preventDefault();

             if ((evt.target === divThumb || evt.target === divThumbMin ||
                 evt.target === divThumbMax) && !vertical){
                 this.coordXStart = evt.screenX;

                 this.shift = parseInt((evt.target as HTMLElement).style.left || '0', 10);


             }else if (evt.target === divThumb|| evt.target === divThumbMin ||
                 evt.target === divThumbMax && vertical){
                 this.coordYStart = evt.screenY;

                 this.shift = parseInt((evt.target as HTMLElement).style.top || '0', 10);

             }
             document.addEventListener('mousemove', moveThumb);
         };

         document.addEventListener('mousedown', getDownCoord);

         document.addEventListener('mouseup', ()=>{
             document.removeEventListener('mousemove', moveThumb);
         });*/
    }

    updateThumbCoordinates(vertical: boolean, step: number | undefined,
                           thumbDistance: number, divThumb: HTMLElement,
                           thumbWidth: number, trackHeight: number, evt: MouseEvent,
                           trackWidth, shift: number){

        const isVertical = divThumb.classList.contains('vertical');
        if (!isVertical && !step){
            switch (true) {
                case thumbDistance + shift > trackWidth:
                    divThumb.style.left = trackWidth + 'px';
                    break;
                case thumbDistance + shift  < 0 : divThumb.style.left = 0 + 'px';
                    break;
                default: divThumb.style.left = shift + thumbDistance + 'px';
                    this.divThumbLeft = shift + thumbDistance
            }
        }else if(!isVertical && step && evt.target === divThumb){
            switch (true) {
                case thumbDistance > trackWidth:
                    divThumb.style.left = thumbWidth + 'px';
                    break;
                case thumbDistance < 0:
                    divThumb.style.left = 0 + 'px';
                    break;
                default: divThumb.style.left = thumbDistance + 'px';
                    this.divThumbLeft = parseInt(divThumb.style.left);
            }

        }else if(isVertical && step && evt.target === divThumb){
            switch (true) {
                case thumbDistance > trackHeight:
                    divThumb.style.top = trackHeight + 'px';
                    break;
                case thumbDistance < 0:
                    divThumb.style.top = 0 + 'px';
                    break;
                default: divThumb.style.top = thumbDistance + 'px';
                    this.divThumbTop = parseInt(divThumb.style.top);
            }

        } else if (isVertical  && !step) {
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
               divThumb: HTMLElement){
        let value: number;

            value = this.presenter.calculateSliderValue(min, max,
                trackWidthHeight, distance);

            this.view.updateLabelValue(value, distance, vertical, divThumb);
            !vertical ? this.viewOptional.stylingProgress(this.divThumbLeft, vertical,
                divThumb) : this.viewOptional.stylingProgress(this.divThumbTop,
                vertical, divThumb)



    }
}

export {ViewDnD}