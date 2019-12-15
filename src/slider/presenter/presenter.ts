import Model from '../model/model';

class Presenter {
    private dataForScale: number[] = [];

    model: Model = new Model();

    calculateSliderMovePercent(options: {trackSize: number; distance: number}): number {
      const { trackSize, distance } = options;
      this.model.sliderValuePercent = (distance / trackSize) * 100;
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

    calculateSliderValue(options: {min: number; max: number; trackSize: number;
      distance: number;}): number {
      const {
        min, max, trackSize, distance,
      } = options;
      this.calculateSliderMovePercent({ trackSize, distance });

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
       {value: number[]; coordinates: number[]; shortValue: number[]; shortCoordinates: number[]} {
      const {
        min, max, step, vertical, trackWidth, trackHeight,
      } = options;

      const scaleValue: {value: number[]; coordinates: number[]; shortValue: number[];
        shortCoordinates: number[];} = {
          coordinates: [],
          value: [],
          shortValue: [],
          shortCoordinates: [],
        };
      const height = Math.round(trackHeight);
      const width = Math.round(trackWidth);

      if (step) {
        let stepCount = 0;
        for (let i = min; i <= max; i += step) {
          let coordinatesItems;
          !vertical ? coordinatesItems = (stepCount / (max - min))
                    * trackWidth : coordinatesItems = (stepCount / (max - min))
                        * height;
          scaleValue.value.push(i);
          scaleValue.coordinates.push(Math.round(coordinatesItems));
          this.dataForScale.push(coordinatesItems);
          stepCount += step;
        }

        const isNotVerticalLastCoordinate = !vertical && scaleValue.coordinates[
          scaleValue.coordinates.length - 1] !== width;
        const isVerticalLastCoordinate = vertical && scaleValue.coordinates[
          scaleValue.coordinates.length - 1] !== height;
        if (isNotVerticalLastCoordinate) {
          scaleValue.coordinates.push(width);
        }
        if (isVerticalLastCoordinate) {
          scaleValue.coordinates.push(height);
        }

        scaleValue.shortValue = scaleValue.value;
        scaleValue.shortCoordinates = scaleValue.coordinates;

        while (scaleValue.shortValue.length > 10) {
          scaleValue.shortValue = scaleValue.shortValue.filter((value, index) => {
            const isIndex0OrEven = index === 0 || index % 2 === 0;
            if (isIndex0OrEven) {
              return true;
            } return false;
          });
        }

        while (scaleValue.shortCoordinates.length > 10) {
          scaleValue.shortCoordinates = scaleValue.shortCoordinates.filter((value, index) => {
            const isIndex0OrEven = index === 0 || index % 2 === 0;
            if (isIndex0OrEven) {
              return true;
            } return false;
          });
        }

        return scaleValue;
      } return {
        coordinates: [],
        value: [],
        shortCoordinates: [],
        shortValue: [],
      };
    }

    static calculateThumbDistance(options: {coordinateStart: number;
     coordinateMove: number;}): number {
      const { coordinateStart, coordinateMove } = options;
      return coordinateMove - coordinateStart;
    }

    static calculateFromValueToCoordinates(options: {value: number; min: number;
      max: number; trackSize: number;}): number {
      const {
        value, min, max, trackSize,
      } = options;
      const unit = trackSize / (max - min);
      const rem = 0.077;
      return ((value - min) * unit) * rem;
    }

    static calculateCoordinatesOfMiddle(options: {start: number; itemSize: number}): number {
      const { start, itemSize } = options;
      return start + itemSize / 2;
    }
}

export default Presenter;
