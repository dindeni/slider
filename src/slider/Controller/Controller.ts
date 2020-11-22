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
    this.view.setSliderOptions(this.model.settings);
    this.view.createElements(this.model.settings);
  }

  public passMethod(method: (options: SliderElementOptions) => void): void {
    method(this.model.settings);
  }

  public reloadSlider(options: SliderElementOptions): void {
    this.model.setSettings(options);
    this.view.reloadSlider(options);
  }

  private validateValue(options: ValidationOptions): void {
    this.model.validateValue(options);
  }

  private setFractionOfValue(value: number): void {
    this.model.calculateFractionOfValue(value);
  }

  private updateOptions(options: SliderElementOptions): void {
    this.model.setSettings(options);
    if (this.model.settings.method) {
      this.passMethod(this.model.settings.method);
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
