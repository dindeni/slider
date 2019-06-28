import {ViewOptional} from "../view/viewOptional";
import {Model} from "../model/model";

class Presenter {
    private coordXStart: number;
    private shift: number;
    divThumbLeft: number = 0;
    optionProgress: boolean = false;
    private min: number;
    private max: number;
    sliderValuePercent: number;
    divTrack: HTMLElement;
    scaleValueCoords: number[] = [];


    model: Model;
    viewOptional: ViewOptional;

    addDnD(step: number | undefined){
        const  divThumb = document.querySelector('.slider-thumb') as HTMLElement;
        this.divTrack = document.querySelector('.slider-track') as HTMLElement;
        const thumbWidth = divThumb.getBoundingClientRect().width;

        this.viewOptional = new ViewOptional();
        this.model = new Model();

        const moveThumb = (evt: MouseEvent)=>{
            evt.preventDefault();

            let thumbDistance: number;

            if (step){
                thumbDistance = this.addDnDStep(step, divThumb, this.coordXStart,
                    evt.screenX);
            } else {
                thumbDistance  = evt.screenX - this.shift;
            }

            const trackWidth = this.divTrack.getBoundingClientRect().width;

                switch (true) {
                    case thumbDistance > trackWidth:
                        divThumb.style.left = trackWidth - thumbWidth + 'px';
                        break;
                    case thumbDistance  < 0 : divThumb.style.left = 0 + 'px';
                        break;
                    default: divThumb.style.left = thumbDistance + 'px';
                }


            this.divThumbLeft = parseInt(divThumb.style.left, 10);

            this.optionProgress ? this.viewOptional.stylingProgress(this.divThumbLeft) :
                null;

            this.model.sliderValuePercent = this.calculateSliderMovePercent(
                this.divTrack.getBoundingClientRect().width, thumbDistance);
            this.model.sliderValue = this.calculateSliderValue(this.min, this.max,
                this.model.sliderValuePercent);

            this.viewOptional.updateLabelValue(this.model.sliderValue,
                this.divThumbLeft);

            step  ? document.removeEventListener('mousemove', moveThumb) : null;
        };

        const getDownCoord = (evt: MouseEvent)=>{
            evt.preventDefault();

            if (evt.target === divThumb){
                this.coordXStart = evt.screenX;

                this.shift = evt.screenX - divThumb.getBoundingClientRect().left
                    + thumbWidth;

                document.addEventListener('mousemove', moveThumb);
            }
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

    calculateSliderMovePercent(trackWidth: number, distance: number){
        let value: number = Math.floor((distance / trackWidth) * 100);

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

    calculateLeftScaleCoords(min: number, max: number, step: number | undefined){
        let scaleValue: {value: number[], coords: number[]} = {
            coords: [],
            value: []
        };

        if (step){
            let stepCount = 0;
            for (let i = min; i<=max; i+=step){
                const coordsItems = stepCount / (max - min) *
                    this.divTrack.getBoundingClientRect().width;
                scaleValue.value.push(i);
                scaleValue.coords.push(coordsItems);
                this.scaleValueCoords.push(coordsItems);
                stepCount+=step;
            }

            this.viewOptional.createScale(scaleValue.value, scaleValue.coords);
        }
    }

    addDnDStep(step: number, divThumb: any, coordDown: number, coordMove: number):
        number{

        switch (true) {
            case coordMove > coordDown:
                return parseInt(divThumb.style.left) + this.scaleValueCoords[1];
            case coordMove < coordDown:
                return parseInt(divThumb.style.left) - this.scaleValueCoords[1];
            default: return parseInt(divThumb.style.left)
        }
    }
}

export {Presenter};