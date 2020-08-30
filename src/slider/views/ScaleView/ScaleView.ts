import View from '../View/View';

class ScaleView {
  trackSize: number;

  $wrapper: JQuery;

  view: View;

  constructor(view) {
    this.view = view;
    this.$wrapper = this.view.sliderSettings.$element;
  }

  public createScale(): void {
    this.trackSize = this.view.trackSize;
    this.generateStepCoordinate(this.trackSize);

    const $ul = $('<ul class="slider__scale"></ul>').appendTo(this.view.$wrapper);
    this.view.scaleData.shortValue.map((item, index) => {
      const $itemElement = $(`<li class="slider__scale-item js-slider__scale-item">${item}</li>`).appendTo($ul);

      const verticalCorrection = 7;
      return this.view.sliderSettings.isVertical
        ? $itemElement.css({ top: `${(this.view.scaleData.shortCoordinates[index]) - verticalCorrection}px` })
        : $itemElement.css({ left: `${this.view.scaleData.shortCoordinates[index]}px` });
    });
  }

  public setStepPosition(distance): number {
    const fraction = distance / this.view.trackSize;
    this.view.labelView.calculateSliderValue(fraction);
    this.view.notifyAll({ value: this.view.labelView.labelValue, type: 'validateStepValue' });
    const getIndex = (): number => this.view.scaleData.value.findIndex(
      (value) => value === this.view.stepValue,
    );

    return this.view.scaleData.coordinates[getIndex()];
  }

  private generateStepCoordinate(trackSize: number): void {
    const { max, min, step } = this.view.sliderSettings;

    this.view.scaleData.coordinates = [];
    this.view.scaleData.value = [];

    if (step) {
      let stepCount = 0;
      const arrayLength = Math.round((max - min) / step) + 1;
      [...Array(arrayLength)].map(() => {
        const fractionOfValue = stepCount / (max - min);
        const coordinatesItems = Number((fractionOfValue * trackSize).toFixed(2));
        this.view.scaleData.value.push(stepCount + min);
        this.view.scaleData.coordinates.push(coordinatesItems);
        stepCount += step;
        return stepCount;
      });

      const isLastCoordinate = this.view.scaleData.coordinates[
        this.view.scaleData.coordinates.length - 1] !== trackSize;
      if (isLastCoordinate) {
        this.view.scaleData.coordinates.pop();
        this.view.scaleData.coordinates.push(trackSize);
        this.view.scaleData.value.pop();
        this.view.scaleData.value.push(max);
      }
    }
    this.checkStepData();
  }

  private checkStepData(): void {
    const { coordinates, value } = this.view.scaleData;
    let shortValue = value;
    let shortCoordinates = coordinates;

    while (shortValue.length > 10) {
      shortValue = shortValue.filter(
        (currentValue, index) => index === 0 || index % 2 === 0,
      );
    }

    while (shortCoordinates.length > 10) {
      shortCoordinates = shortCoordinates.filter(
        (currentValue, index) => index === 0 || index % 2 === 0,
      );
    }
    this.view.scaleData.shortValue = shortValue;
    this.view.scaleData.shortCoordinates = shortCoordinates;
  }
}

export default ScaleView;
