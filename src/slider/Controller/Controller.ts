import autoBind from 'auto-bind';

import { SliderElementOptions, ValidationOptions } from '../../types/types';
import Model from '../Model/Model';
import View from '../views/View/View';
import Observable from '../Observable/Observable';
import EventTypes from '../constants';

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
    const {
      UPDATE_OPTIONS, VALIDATE, SET_FRACTION, SET_STEP_VALUE,
    } = EventTypes;

    this.view.subscribe({ method: this.updateOptions, type: UPDATE_OPTIONS });
    this.view.subscribe({ method: this.validateValue, type: VALIDATE });
    this.view.subscribe({ method: this.setFractionOfValue, type: SET_FRACTION });
    this.model.subscribe({ method: this.view.setStepValue, type: SET_STEP_VALUE });
    this.model.subscribe({ method: this.view.setIsValidValue, type: VALIDATE });
    this.model.subscribe({ method: this.view.setFractionOfValue, type: SET_FRACTION });
  }
}

export default Controller;
