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

      switch (true) {
        case this.model.sliderValuePercent <= 0
            || !this.model.sliderValuePercent:
          this.model.sliderValue = min;
          break;
        default:
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

    static calculateThumbDistance(vertical: boolean, step: number | undefined,
      divThumb: HTMLElement, coordStart: number,
      coordMove: number): number {
      switch (true) {
        case !vertical:
          return coordMove - coordStart;
        case vertical:
          return coordMove - coordStart;
        default: return 0;
      }
    }

    static calculateFromValueToCoordinates(value: number, min: number,
      max: number, widthHeight: number): number {
      const unit = widthHeight / (max - min);
      return (value - min) * unit;
    }
}

export default Presenter;
