import autoBind from 'auto-bind';

import { ScaleData, DistanceOptions, SliderElementOptions } from '../../types/types';
import Model from '../Model/Model';
import View from '../views/View/View';
import Observable from '../Observable/Observable';

class Controller extends Observable {
  private model: Model;

  private view: View = new View();

  public sliderValue: number;

  constructor(model) {
    super();
    this.model = model;
    autoBind(this);
  }

  public init(): void {
    this.subscribeAll();
    this.view.getSliderOptions(this.model.sliderOptions);
    this.view.createElements(this.model.sliderOptions);
  }

  public passMethod(method: Function): void {
    method(this.model.sliderOptions);
  }

  public reloadSlider(options: SliderElementOptions): void {
    this.view.reloadSlider(options);
  }

  private getScaleData(options: ScaleData): void {
    const scaleData = Model.validateStepValues(options);
    this.view.setScaleData(scaleData);
  }

  private getCoordinates(value: number): void {
    const { min, max } = this.model.sliderOptions;
    const coordinate = Model.calculateCurrentCoordinate({ value, min, max });
    this.view.setCoordinate(coordinate);
  }

  private getValue(fraction: number): void {
    const { min, max } = this.model.sliderOptions;
    this.sliderValue = this.model.calculateSliderValue({ fraction, min, max });
    this.view.setLabelValue(this.sliderValue);
  }

  private getDistance(options: DistanceOptions): void {
    const distance = Model.calculateDistance(options);
    this.view.getDistance(distance);
  }

  private updateOptions(options: SliderElementOptions): void {
    this.model.updateOptions(options);
    if (this.model.sliderOptions.method) {
      this.passMethod(this.model.sliderOptions.method);
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
