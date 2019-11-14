import Model from '../model/model';

class Presenter {
    private scaleValueCoords: number[] = [];

    model: Model = new Model();

    calculateSliderMovePercent(trackWidthHeight: number, distance: number): number {
      this.model.sliderValuePercent = Math.floor((distance / trackWidthHeight) * 100);
      switch (true) {
        case this.model.sliderValuePercent < 0:
          this.model.sliderValuePercent = 0;
          break;
        case this.model.sliderValuePercent > 100:
          this.model.sliderValuePercent = 100;
          break;
        default: return this.model.sliderValuePercent;
      }
      return this.model.sliderValuePercent;
    }

    calculateSliderValue(min: number, max: number, trackWidthHeight: number,
      distance: number): number {
      this.calculateSliderMovePercent(trackWidthHeight, distance);

      const isBelow0 = this.model.sliderValuePercent <= 0
        || !this.model.sliderValuePercent;
      if (isBelow0) {
        this.model.sliderValue = min;
      } else {
        this.model.sliderValue = min + ((max - min)
                  * this.model.sliderValuePercent) / 100;
      }
      return this.model.sliderValue;
    }

    calculateLeftScaleCoords(min: number, max: number, step: number | undefined,
      vertical: boolean, trackWidth: number,
      trackHeight: number): {value: number[]; coords: number[]} {
      const scaleValue: {value: number[]; coords: number[]} = {
        coords: [],
        value: [],
      };

      if (step) {
        let stepCount = 0;
        for (let i = min; i <= max; i += step) {
          let coordsItems;
          !vertical ? coordsItems = (stepCount / (max - min))
                    * trackWidth : coordsItems = (stepCount / (max - min))
                        * trackHeight;
          scaleValue.value.push(i);
          scaleValue.coords.push(coordsItems);
          this.scaleValueCoords.push(coordsItems);
          stepCount += step;
        }


        return scaleValue;
      } return {
        coords: [],
        value: [],
      };
    }

    static calculateThumbDistance(coordStart: number, coordMove: number): number {
          return coordMove - coordStart;
    }

    static calculateFromValueToCoordinates(value: number, min: number,
      max: number, widthHeight: number): number {
      const unit = widthHeight / (max - min);
      return (value - min) * unit;
    }

    static calculateCoordinatesOfMiddle(start: number, width: number): number {
      return start + width/2;
    }
}

export default Presenter;
