import {ViewOptional} from "../view/viewOptional";
import {Model} from "../model/model";
import {View} from "../view/view";

class Presenter {
    optionProgress: boolean = false;
    sliderValuePercent: number;
    divTrack: HTMLElement;
    scaleValueCoords: number[] = [];

    model: Model = new Model();
    viewOptional: ViewOptional = new ViewOptional();
    view: View = new View();

    /*addDnD(step: number | undefined, vertical: boolean, range: boolean, progress: boolean,
           ){
        let divThumb, divThumbMin: HTMLElement, divThumbMax;

        Array.from(document.querySelectorAll('.slider-thumb')).map((value, i)=>{
           /!* const divTrack = document.querySelector('.slider-track') as HTMLElement;*!/
            /!*const thumbWidth: number = divThumb.getBoundingClientRect().width;*!/
            /!*const trackHeight: number = divTrack.getBoundingClientRect().height;*!/
            /!*const trackWidth: number = divTrack.getBoundingClientRect().width;*!/

            this.viewOptional = new ViewOptional();
            this.model = new Model();
            this.view = new View();

            const moveThumb = (evt: MouseEvent)=>{
                evt.preventDefault();

                const trackHeight: number = (((evt.target as HTMLElement).parentElement as HTMLElement).
                querySelector('.slider-track') as HTMLElement).getBoundingClientRect().height;
                const trackWidth: number = (((evt.target as HTMLElement).parentElement as HTMLElement).
                querySelector('.slider-track') as HTMLElement).getBoundingClientRect().width;
                const isVertical = (evt.target as HTMLElement).classList.contains('vertical');


                const width: number = (evt.target as HTMLElement).getBoundingClientRect().width;

                let thumbDistance: number = this.calculateThumbDistance(isVertical,
                    evt, step, evt.target as HTMLElement);

                /!*(evt.target === value || evt.target === divThumbMin ||
                    evt.target === divThumbMax) ? this.updateThumbCoordinates(vertical, step, thumbDistance,
                    evt.target as HTMLElement, width, trackHeight, evt) : null;

                this.updateData(vertical, range, evt, divThumbMin, divThumbMax, progress);*!/
                if (evt.target === value){

                    this.updateThumbCoordinates(isVertical, step, thumbDistance,
                        evt.target as HTMLElement, width, trackHeight, evt,
                        trackWidth);
                    this.updateData(isVertical, range, evt, divThumbMin, divThumbMax,
                        value as HTMLElement, progress, trackWidth, trackHeight);

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
       /!* /!*if (range){
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
        });*!/
    }*/

    /*getMinMax(min: number, max: number){
        this.min = min;
        this.max = max;
    }*/

    calculateSliderMovePercent(trackWidthHeight: number, distance: number){
        this.model.sliderValuePercent = Math.floor((distance / trackWidthHeight) * 100);
        switch (true) {
            case this.model.sliderValuePercent < 0:
                return this.model.sliderValuePercent = 0;
            case this.model.sliderValuePercent > 100:
                return this.model.sliderValuePercent = 100;
            default: return this.model.sliderValuePercent;
        }
    }

    calculateSliderValue(min: number, max: number, trackWidthHeight: number,
                         distance: number){
        this.calculateSliderMovePercent(trackWidthHeight, distance);

        switch (true) {
            case this.model.sliderValuePercent <= 0 ||
            !this.model.sliderValuePercent:
                return this.model.sliderValue =  min;
            default:
                return this.model.sliderValue = min + ((max - min) *
                    this.model.sliderValuePercent) / 100
        }
    }

    calculateLeftScaleCoords(min: number, max: number, step: number | undefined,
                             vertical: boolean){
        let scaleValue: {value: number[], coords: number[]} = {
            coords: [],
            value: []
        };

        if (step){
            let stepCount = 0;
            for (let i = min; i<=max; i+=step){
                let coordsItems;
                !vertical ? coordsItems = stepCount / (max - min) *
                    this.divTrack.getBoundingClientRect().width :
                    coordsItems = stepCount / (max - min) *
                        this.divTrack.getBoundingClientRect().height;
                scaleValue.value.push(i);
                scaleValue.coords.push(coordsItems);
                this.scaleValueCoords.push(coordsItems);
                stepCount+=step;
            }

            this.viewOptional.createScale(scaleValue.value, scaleValue.coords,
                vertical);
        }
    }

    addDnDStep(step: number | undefined, divThumb: any, coordDown: number,
               coordMove: number, vertical: boolean): number{

        if (!vertical){
            switch (true) {
                case coordMove > coordDown:
                    return parseInt(divThumb.style.left) + this.scaleValueCoords[1];
                case coordMove < coordDown:
                    return parseInt(divThumb.style.left) - this.scaleValueCoords[1];
                default: return parseInt(divThumb.style.left)
            }
        } else {
            switch (vertical) {
                case coordMove > coordDown:
                    return parseInt(divThumb.style.top) + this.scaleValueCoords[1];
                case coordMove < coordDown:
                    return parseInt(divThumb.style.top) - this.scaleValueCoords[1];
                default: return parseInt(divThumb.style.top)
            }
        }

    }

    calculateThumbDistance(vertical: boolean, step: number | undefined,
                           divThumb: HTMLElement, coordStart: number,
                           coordMove: number){
        /*const isVertical = divThumb.classList.contains('vertical');*/
        switch (true) {
            case step && !vertical:
                return this.addDnDStep(step, divThumb, coordStart,
                    coordMove, vertical);
            case step && vertical:
                return this.addDnDStep(step, divThumb, coordStart,
                    coordMove, vertical);
            case !step && !vertical:
                return coordMove - coordStart;
            case !step && vertical:
                return coordMove - coordStart;
            default: return  0
        }
    }

    /*updateThumbCoordinates(vertical: boolean, step: number | undefined,
                           thumbDistance: number, divThumb: HTMLElement,
                           thumbWidth: number, trackHeight: number, evt: MouseEvent,
                           trackWidth, shift: number){
        /!*const trackWidth = this.divTrack.getBoundingClientRect().width;*!/
        console.log(thumbDistance);
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

    }*/

  /*  updateData(vertical: boolean, range: boolean, evt: MouseEvent,
                  divThumbMin: HTMLElement, divThumbMax: HTMLElement,
               divThumb: HTMLElement, progress: boolean, trackWidth: number,
               trackHeight: number){
        if (!vertical){
            this.model.sliderValuePercent = this.calculateSliderMovePercent(
                /!*this.divTrack.getBoundingClientRect().width*!/trackWidth,
                this.divThumbLeft);

            this.model.sliderValue = this.calculateSliderValue(this.min,
                this.max, this.model.sliderValuePercent);
            this.view.updateLabelValue(this.model.sliderValue, this.divThumbLeft,
                false, divThumb);
            progress ? this.viewOptional.stylingProgress(this.divThumbLeft, vertical,
                divThumb) : null;
            switch (true) {
                case !range:
                    /!*this.model.sliderValue = this.calculateSliderValue(this.min,
                        this.max, this.model.sliderValuePercent);
                    this.view.updateLabelValue(range,
                        'default', this.model.sliderValue, this.divThumbLeft,
                        false, divThumb);
                    progress ? this.view.stylingProgress(this.divThumbLeft,
                    'default', vertical, divThumb) : null;*!/
                break;
              /!*  case range && evt.target === divThumbMin:
                    this.model.sliderValueMin = this.calculateSliderValue(this.min, this.max,
                        this.model.sliderValuePercent);
                    this.viewOptional.updateLabelValue(range,
                        'min', this.model.sliderValueMin, this.divThumbLeft,
                        false);
                    progress ? this.viewOptional.stylingProgress(this.divThumbLeft,
                        'min', vertical) : null;
                    break;
                case range && evt.target === divThumbMax:
                    this.model.sliderValueMax = this.calculateSliderValue(this.min, this.max,
                        this.model.sliderValuePercent);
                    this.viewOptional.updateLabelValue(range,
                        'max', this.model.sliderValueMax, this.divThumbLeft,
                        false);
                    progress ? this.viewOptional.stylingProgress(this.divThumbLeft,
                        'max', vertical) : null;
                    break;*!/
            }
        }else{
            this.model.sliderValuePercent = this.calculateSliderMovePercent(
                /!*this.divTrack.getBoundingClientRect().height*!/trackHeight,
                this.divThumbTop);

            this.model.sliderValue = this.calculateSliderValue(this.min, this.max,
                this.model.sliderValuePercent);
            this.view.updateLabelValue(this.model.sliderValue, this.divThumbTop,
                true, divThumb);
            progress ? this.viewOptional.stylingProgress(this.divThumbTop, vertical,
                divThumb) : null;
                /!*case range && evt.target === divThumbMin:
                    this.model.sliderValueMin = this.calculateSliderValue(this.min, this.max,
                        this.model.sliderValuePercent);
                    this.viewOptional.updateLabelValue(range,
                        'min', this.model.sliderValueMin, this.divThumbTop,
                        true);
                    progress ? this.viewOptional.stylingProgress(this.divThumbTop,
                        'min', vertical) : null;
                    break;
                case range && evt.target === divThumbMax:
                    this.model.sliderValueMax = this.calculateSliderValue(this.min, this.max,
                        this.model.sliderValuePercent);
                    this.viewOptional.updateLabelValue(range,
                        'max', this.model.sliderValueMax, this.divThumbTop,
                        true);
                    progress ? this.viewOptional.stylingProgress(this.divThumbTop,
                        'max', vertical) : null;*!/

        }
    }*/

}

export {Presenter};