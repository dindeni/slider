import {Model} from "../model/model";

class Presenter {
    private scaleValueCoords: number[] = [];

    model: Model = new Model();

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
                             vertical: boolean, trackWidth: number,
                             trackHeight: number){
        let scaleValue: {value: number[], coords: number[]} = {
            coords: [],
            value: []
        };

        if (step){
            let stepCount = 0;
            for (let i = min; i<=max; i+=step){
                let coordsItems;
                !vertical ? coordsItems = stepCount / (max - min) *
                    trackWidth : coordsItems = stepCount / (max - min) *
                        trackHeight;
                scaleValue.value.push(i);
                scaleValue.coords.push(coordsItems);
                this.scaleValueCoords.push(coordsItems);
                stepCount+=step;
            }


            return scaleValue;

        }return {coords: [],
            value: []}
    }

    calculateThumbDistance(vertical: boolean, step: number | undefined,
                           divThumb: HTMLElement, coordStart: number,
                           coordMove: number){
        switch (true) {
            case !vertical:
                return coordMove - coordStart;
            case vertical:
                return coordMove - coordStart;
            default: return  0
        }
    }

    calculateFromValueToCoordinates(value: number, min: number,
                                    max: number, widthHeight: number): number{
        const unit = widthHeight / (max - min);
        return (value - min) * unit
    }
}

export {Presenter};