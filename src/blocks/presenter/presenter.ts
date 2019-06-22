import {ViewOptional} from "../view/viewOptional";
import {Model} from "../model/model";

/*const viewOptional = new ViewOptional();*/

class Presenter {
    private coordXStart: number;
    private shift: number;
    divThumbLeft: number = 0;
    optionProgress: boolean = false;
    private min: number;
    private max: number;
    sliderValuePercent: number;

    model: Model;
    viewOptional: ViewOptional;

    addDnD(){
        const  divThumb = document.querySelector('.slider-thumb') as HTMLElement;
        const  divTrack = document.querySelector('.slider-track') as HTMLElement;
        const thumbWidth = divThumb.getBoundingClientRect().width;

        this.viewOptional = new ViewOptional();
        this.model = new Model();

        const moveThumb = (evt: MouseEvent)=>{
            evt.preventDefault();

            const thumbDistance: number = evt.screenX - this.shift;
            const trackWidth = divTrack.getBoundingClientRect().width;

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
                divTrack.getBoundingClientRect().width, thumbDistance);
            this.model.sliderValue = this.calculateSliderValue(this.min, this.max,
                this.model.sliderValuePercent);

            this.viewOptional.updateLabelValue(this.model.sliderValue,
                this.divThumbLeft);


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
                return 0;
            default:
                return min + ((max - min) * percent) / 100
        }
    }
}

export {Presenter};