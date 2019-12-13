import Model from '../model/model';

class Presenter {
    private scaleValueCoords: number[] = [];

    model: Model = new Model();

    calculateSliderMovePercent(options: {trackWidthHeight: number; distance: number}): number {
      const { trackWidthHeight, distance } = options;
      this.model.sliderValuePercent = (distance / trackWidthHeight) * 100;
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

    calculateSliderValue(options: {min: number; max: number; trackWidthHeight: number;
      distance: number;}): number {
      const {
        min, max, trackWidthHeight, distance,
      } = options;
      this.calculateSliderMovePercent({ trackWidthHeight, distance });

      const isBelow0 = this.model.sliderValuePercent <= 0
        || !this.model.sliderValuePercent;
      if (isBelow0) {
        this.model.sliderValue = min;
      } else {
        this.model.sliderValue = min + ((max - min)
                  * (this.model.sliderValuePercent)) / 100;
      }
      return this.model.sliderValue;
    }

    calculateLeftScaleCoords(options: {min: number; max: number; step: number | undefined;
      vertical: boolean; trackWidth: number; trackHeight: number;}):
       {value: number[]; coords: number[]; shortValue: number[]; shortCoords: number[]} {
      const {
        min, max, step, vertical, trackWidth, trackHeight,
      } = options;

      const scaleValue: {value: number[]; coords: number[]; shortValue: number[];
        shortCoords: number[];} = {
          coords: [],
          value: [],
          shortValue: [],
          shortCoords: [],
        };
      const height = Math.round(trackHeight);
      const width = Math.round(trackWidth);

      if (step) {
        let stepCount = 0;
        for (let i = min; i <= max; i += step) {
          let coordsItems;
          !vertical ? coordsItems = (stepCount / (max - min))
                    * trackWidth : coordsItems = (stepCount / (max - min))
                        * height;
          scaleValue.value.push(i);
          scaleValue.coords.push(Math.round(coordsItems));
          this.scaleValueCoords.push(coordsItems);
          stepCount += step;
        }

        const isNotVerticalLastCoord = !vertical && scaleValue.coords[scaleValue.coords.length - 1]
        !== width;
        const isVerticalLastCoord = vertical && scaleValue.coords[scaleValue.coords.length - 1]
          !== height;
        if (isNotVerticalLastCoord) {
          scaleValue.coords.push(width);
        }
        if (isVerticalLastCoord) {
          scaleValue.coords.push(height);
        }

        scaleValue.shortValue = scaleValue.value;
        scaleValue.shortCoords = scaleValue.coords;

        while (scaleValue.shortValue.length > 10) {
          scaleValue.shortValue = scaleValue.shortValue.filter((value, index) => {
            const isIndex0OrEven = index === 0 || index % 2 === 0;
            if (isIndex0OrEven) {
              return true;
            } return false;
          });
        }

        while (scaleValue.shortCoords.length > 10) {
          scaleValue.shortCoords = scaleValue.shortCoords.filter((value, index) => {
            const isIndex0OrEven = index === 0 || index % 2 === 0;
            if (isIndex0OrEven) {
              return true;
            } return false;
          });
        }

        return scaleValue;
      } return {
        coords: [],
        value: [],
        shortCoords: [],
        shortValue: [],
      };
    }

    static calculateThumbDistance(options: {coordStart: number; coordMove: number}): number {
      const { coordStart, coordMove } = options;
      return coordMove - coordStart;
    }

    static calculateFromValueToCoordinates(options: {value: number; min: number;
      max: number; widthHeight: number;}): number {
      const {
        value, min, max, widthHeight,
      } = options;
      const unit = widthHeight / (max - min);
      const rem = 0.077;
      return ((value - min) * unit) * rem;
    }

    static calculateCoordinatesOfMiddle(options: {start: number; itemSize: number}): number {
      const { start, itemSize } = options;
      return start + itemSize / 2;
    }
}

export default Presenter;
