import autoBind from 'auto-bind';
import Model from '../Model/Model';
import View from '../views/View/View';
import Observable from '../Observable/Observable';
import {
  ScaleCoordinatesOptions,
  FromValueToCoordinate,
  SliderValueOptions,
  DistanceOptions,
  CoordinateOfMiddleOptions,
  SliderElementOptions,
  SliderOptions,
} from '../../types/types';

interface PublicData extends SliderOptions{
  reload: Function;
}

class Controller extends Observable {
  private model: Model = new Model();

  private view: View = new View();

  private sliderOptions: SliderElementOptions;

  public sliderValue: number;

  constructor() {
    super();
    autoBind(this);
  }

  public init(): void {
    this.subscribeAll();
    this.view.getSliderOptions(this.sliderOptions);
    this.view.createElements(this.sliderOptions);
  }

  public getSliderOptions(options: SliderElementOptions): void {
    this.sliderOptions = options;
  }

  public getPublicData(method: Function): PublicData {
    method(this.sliderOptions);
    return { ...this.sliderOptions, reload: this.reloadSlider };
  }

  private reloadSlider(options: SliderElementOptions): void {
    this.view.reloadSlider(options);
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

  private updateOptions(options: SliderElementOptions): void {
    this.sliderOptions = options;
    if (this.sliderOptions.method) {
      this.getPublicData(this.sliderOptions.method);
    }
  }

  private subscribeAll(): void {
    this.view.subscribe({ method: this.getCoordinates, type: 'getCoordinates' });
    this.view.subscribe({ method: this.getValue, type: 'getValue' });
    this.view.subscribe({ method: this.getDistance, type: 'getDistance' });
    this.view.subscribe({ method: this.getCoordinatesOfMiddle, type: 'getCoordinatesOfMiddle' });
    this.view.subscribe({ method: this.getScaleCoordinates, type: 'getScaleData' });
    this.view.subscribe({ method: this.updateOptions, type: 'updateOptions' });
  }
}

export default Controller;
