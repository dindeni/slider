import autoBind from 'auto-bind';

import { SliderElementOptions, ValidationOptions } from '../../types/types';
import Model from '../Model/Model';
import View from '../views/View/View';
import Observable from '../Observable/Observable';

class Controller extends Observable {
  public readonly view: View = new View();

  private model: Model;

  constructor(model: Model) {
    super();
    this.model = model;
    autoBind(this);
  }

  public init(): void {
    this.subscribeAll();
    this.view.setSliderOptions(this.model.sliderOptions);
    this.view.createElements(this.model.sliderOptions);
  }

  public passMethod(method: (options: SliderElementOptions) => void): void {
    method(this.model.sliderOptions);
  }

  public reloadSlider(options: SliderElementOptions): void {
    this.model.setSliderOptions(options);
    this.view.reloadSlider(options);
  }

  private validateValue(options: ValidationOptions): void {
    this.model.validateValue(options);
  }

  private setFractionOfValue(value: number): void {
    this.model.calculateFractionOfValue(value);
  }

  private updateOptions(options: SliderElementOptions): void {
    this.model.setSliderOptions(options);
    if (this.model.sliderOptions.method) {
      this.passMethod(this.model.sliderOptions.method);
    }
  }

  private subscribeAll(): void {
    this.view.subscribe({ method: this.updateOptions, type: 'updateOptions' });
    this.view.subscribe({ method: this.validateValue, type: 'validateValue' });
    this.view.subscribe({ method: this.setFractionOfValue, type: 'setFractionOfValue' });
    this.model.subscribe({ method: this.view.setStepValue, type: 'setStepValue' });
    this.model.subscribe({ method: this.view.setIsValidValue, type: 'validateValue' });
    this.model.subscribe({ method: this.view.setFractionOfValue, type: 'setFractionOfValue' });
  }
}

export default Controller;
