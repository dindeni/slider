import Model from '../Model/Model';
import View from '../views/View/View';
import {
  ScaleCoordinatesOptions, FromValueToCoordinate, SliderValueOptions,
  DistanceOptions, CoordinateOfMiddleOptions, SliderOptionsForInit,
} from '../../types/types';

class Controller {
  private model: Model = new Model();

  private view: View = new View();

  private sliderOptions: SliderOptionsForInit;

  private sliderValue: number;

  public init(): void {
    const {
      $element, min, max, range, vertical, progress, step, value, valueMin, valueMax, label,
    } = this.sliderOptions;
    const sliderOptions = {
      $element, min, max, range, vertical, progress, step,
    };

    this.subscribe();
    this.view.getSliderOptions(sliderOptions);

    const sliderValues = this.model.updateState({
      min, max, value, valueMin, valueMax,
    });

    this.view.createElements({
      ...sliderOptions,
      value: sliderValues.value,
      valueMin: sliderValues.valueMin,
      valueMax: sliderValues.valueMax,
      label,
    });
  }

  public getSliderOptions(options: SliderOptionsForInit): void {
    this.sliderOptions = options;
  }

  private getScaleCoordinates(options: ScaleCoordinatesOptions): void {
    const scaleData = this.model.calculateLeftScaleCoordinates(options);
    this.view.setScaleData(scaleData);
  }

  private getCoordinates(options: FromValueToCoordinate): void {
    const coordinate = Model.calculateFromValueToCoordinates(options);
    this.view.setCoordinate(coordinate);
  }

  private getValue(options: SliderValueOptions): void {
    this.sliderValue = this.model.calculateSliderValue(options);
    this.view.setLabelValue(this.sliderValue);
  }

  private getDistance(options: DistanceOptions): void {
    const distance = Model.calculateThumbDistance(options);
    this.view.getDistance(distance);
  }

  private getCoordinatesOfMiddle(options: CoordinateOfMiddleOptions): void {
    const coordinateOfMiddle = Model.calculateCoordinatesOfMiddle(options);
    this.view.getCoordinateOfMiddle(coordinateOfMiddle);
  }

  private subscribe(): void {
    this.model.subscribe({ method: this.model.validateValue.bind(this.model), type: 'validateValue' });
    this.view.subscribe({ method: this.getCoordinates.bind(this), type: 'getCoordinates' });
    this.view.subscribe({ method: this.getValue.bind(this), type: 'getValue' });
    this.view.subscribe({ method: this.getDistance.bind(this), type: 'getDistance' });
    this.view.subscribe({ method: this.getCoordinatesOfMiddle.bind(this), type: 'getCoordinatesOfMiddle' });
    this.view.subscribe({ method: this.getScaleCoordinates.bind(this), type: 'getScaleData' });
  }
}

export default Controller;
