import autoBind from 'auto-bind';
import Model from '../Model/Model';
import View from '../views/View/View';
import Observable from '../Observable/Observable';
import {
  ScaleData,
  DistanceOptions,
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

  private getScaleData(options: ScaleData): void {
    const scaleData = Model.validateStepValues(options);
    this.view.setScaleData(scaleData);
  }

  private getCoordinates(value: number): void {
    const { min, max } = this.sliderOptions;
    const coordinate = Model.calculateCurrentCoordinate({ value, min, max });
    this.view.setCoordinate(coordinate);
  }

  private getValue(fraction: number): void {
    const { min, max } = this.sliderOptions;
    this.sliderValue = this.model.calculateSliderValue({ fraction, min, max });
    this.view.setLabelValue(this.sliderValue);
  }

  private getDistance(options: DistanceOptions): void {
    const distance = Model.calculateDistance(options);
    this.view.getDistance(distance);
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
    this.view.subscribe({ method: this.getScaleData, type: 'getScaleData' });
    this.view.subscribe({ method: this.updateOptions, type: 'updateOptions' });
  }
}

export default Controller;
