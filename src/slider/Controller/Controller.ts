import autoBind from 'auto-bind';
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

  public sliderValue: number;

  constructor() {
    autoBind(this);
  }

  public init(): void {
    this.subscribe();
    this.view.getSliderOptions(this.sliderOptions);

    this.view.createElements();
  }

  public getSliderOptions(options: SliderOptionsForInit): void {
    this.sliderOptions = options;
  }

  public getPublicValue(): number {
    return this.sliderValue;
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
    this.model.subscribe({ method: this.model.validateValue, type: 'validateValue' });
    this.view.subscribe({ method: this.getCoordinates, type: 'getCoordinates' });
    this.view.subscribe({ method: this.getValue, type: 'getValue' });
    this.view.subscribe({ method: this.getDistance, type: 'getDistance' });
    this.view.subscribe({ method: this.getCoordinatesOfMiddle, type: 'getCoordinatesOfMiddle' });
    this.view.subscribe({ method: this.getScaleCoordinates, type: 'getScaleData' });
  }
}

export default Controller;
