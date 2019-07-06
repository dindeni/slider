import {ViewOptional} from "../view/viewOptional";
import {Model} from "../model/model";

class Presenter {
    private coordXStart: number;
    private coordYStart: number;
    private shift: number;
    private divThumbLeft: number = 0;
    private divThumbTop: number = 0;
    optionProgress: boolean = false;
    private min: number;
    private max: number;
    sliderValuePercent: number;
    divTrack: HTMLElement;
    scaleValueCoords: number[] = [];

    model: Model;
    viewOptional: ViewOptional;

    addDnD(step: number | undefined, vertical: boolean, range: boolean){
        let divThumb, divThumbMin: HTMLElement, divThumbMax;
        if (range){
            divThumbMin = document.querySelector('#thumb-min') as HTMLElement;
            divThumbMax = document.querySelector('#thumb-max') as HTMLElement;
        }else {
            divThumb = document.querySelector('.slider-thumb') as HTMLElement;
        }


        /*const  divThumb = document.querySelector('.slider-thumb') as HTMLElement;*/
        this.divTrack = document.querySelector('.slider-track') as HTMLElement;
        /*const thumbWidth: number = divThumb.getBoundingClientRect().width;*/
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

            this.optionProgress ? this.viewOptional.stylingProgress(this.divThumbLeft) :
                null;

            this.setModelValue(vertical, range, evt, divThumbMin, divThumbMax);
           /* if (!vertical ){
                this.model.sliderValuePercent = this.calculateSliderMovePercent(
                    this.divTrack.getBoundingClientRect().width, this.divThumbLeft);
                !range ? this.model.sliderValue = this.calculateSliderValue(this.min, this.max,
                    this.model.sliderValuePercent) : null;
                range && evt.target === divThumbMin ? this.model.sliderValueMin = this.calculateSliderValue(this.min, this.max,
                    this.model.sliderValuePercent) : null;
                range && evt.target === divThumbMax ? this.model.sliderValueMax = this.calculateSliderValue(this.min, this.max,
                    this.model.sliderValuePercent) : null;
                this.viewOptional.updateLabelValue(vertical, this.model.sliderValue,
                    this.divThumbLeft, range);
                console.log(this.model.sliderValueMin, this.model.sliderValueMax);
            } else {
                this.model.sliderValuePercent = this.calculateSliderMovePercent(
                    this.divTrack.getBoundingClientRect().height, this.divThumbTop);
                 !range ? this.model.sliderValue = this.calculateSliderValue(this.min, this.max,
                    this.model.sliderValuePercent) : null;
                 range && evt.target === divThumbMin ? this.model.sliderValueMin = this.calculateSliderValue(this.min, this.max,
                     this.model.sliderValuePercent) : null;
                this.viewOptional.updateLabelValue(vertical, this.model.sliderValue,
                    this.divThumbTop, range);

            }*/

            step ? document.removeEventListener('mousemove', moveThumb) : null;
        };

        const getDownCoord = (evt: MouseEvent)=>{
            evt.preventDefault();

            if ((evt.target === divThumb || evt.target === divThumbMin ||
                evt.target === divThumbMax) && !vertical){
                this.coordXStart = evt.screenX;

                this.shift = parseInt((evt.target as HTMLElement).style.left || '0', 10);


            }else if (evt.target === divThumb && vertical){
                this.coordYStart = evt.screenY;

                this.shift = parseInt(divThumb.style.top || '0', 10);

            }
            document.addEventListener('mousemove', moveThumb);
        };

        document.addEventListener('mousedown', getDownCoord);

        document.addEventListener('mouseup', ()=>{
            document.removeEventListener('mousemove', moveThumb);
        });
    }

    getMinMax(min: number, max: number){
        this.min = min;
        this.max = max;
    }

    calculateSliderMovePercent(trackWidthHeight: number, distance: number){
        let value: number = Math.floor((distance / trackWidthHeight) * 100);
        switch (true) {
            case value < 0:
                return value = 0;
            case value > 100:
                return value = 100;
            default: return value
        }
    }

    calculateSliderValue(min: number, max: number, percent: number){

        switch (true) {
            case percent <= 0 ||
            !percent:
                return min;
            default:
                return min + ((max - min) * percent) / 100
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

    calculateThumbDistance(vertical: boolean, evt: MouseEvent,
                           step: number | undefined, divThumb: HTMLElement){

        switch (true) {
            case step && !vertical:
                return this.addDnDStep(step, divThumb, this.coordXStart,
                    evt.screenX, vertical);
            case step && vertical:
                return this.addDnDStep(step, divThumb, this.coordYStart,
                    evt.screenY, vertical);
            case !step && !vertical:
                return evt.screenX - this.coordXStart;
            case !step && vertical:
                return evt.screenY - this.coordYStart;
            default: return  0
        }
    }

    updateThumbCoordinates(vertical: boolean, step: number | undefined,
                           thumbDistance: number, divThumb: HTMLElement,
                           thumbWidth: number, trackHeight: number, evt: MouseEvent){
        const trackWidth = this.divTrack.getBoundingClientRect().width;

        if (!vertical && !step){
            switch (true) {
                case thumbDistance + this.shift > trackWidth:
                    divThumb.style.left = trackWidth + 'px';
                    break;
                case thumbDistance + this.shift  < 0 : divThumb.style.left = 0 + 'px';
                    break;
                default: divThumb.style.left = this.shift + thumbDistance + 'px';
                this.divThumbLeft = this.shift + thumbDistance
            }
        }else if(!vertical && step && evt.target === divThumb){
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

        }else if(vertical && step && evt.target === divThumb){
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

        } else if (vertical  && !step) {
            switch (true) {
                case thumbDistance + this.shift > trackHeight:
                    divThumb.style.top = trackHeight + 'px';
                    break;
                case thumbDistance + this.shift < 0:
                    divThumb.style.top = 0 + 'px';
                    break;
                default: divThumb.style.top = (this.shift + thumbDistance) + 'px';
                    this.divThumbTop = this.shift + thumbDistance
            }
        }

    }

    setModelValue(vertical: boolean, range: boolean, evt: MouseEvent,
                  divThumbMin: HTMLElement, divThumbMax: HTMLElement){
        if (!vertical){
            this.model.sliderValuePercent = this.calculateSliderMovePercent(
                this.divTrack.getBoundingClientRect().width, this.divThumbLeft);

            switch (true) {
                case !range:
                    this.model.sliderValue = this.calculateSliderValue(this.min,
                        this.max, this.model.sliderValuePercent);
                    this.viewOptional.updateLabelValue(range,
                        'default', this.model.sliderValue, this.divThumbLeft);
                break;
                case range && evt.target === divThumbMin:
                    this.model.sliderValueMin = this.calculateSliderValue(this.min, this.max,
                        this.model.sliderValuePercent);
                    this.viewOptional.updateLabelValue(range,
                        'min', this.model.sliderValueMin, this.divThumbLeft);
                    break;
                case range && evt.target === divThumbMax:
                    this.model.sliderValueMax = this.calculateSliderValue(this.min, this.max,
                        this.model.sliderValuePercent);
                    this.viewOptional.updateLabelValue(range,
                        'max', this.model.sliderValueMax, this.divThumbLeft);
                    break;
            }


            /*this.viewOptional.updateLabelValue(vertical, this.model.sliderValue,
                this.divThumbLeft, range);*/
            console.log(this.model.sliderValueMin, this.model.sliderValueMax);
        }
    }

}

export {Presenter};