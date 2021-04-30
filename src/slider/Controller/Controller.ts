import autoBind from 'auto-bind';

import { SliderElementOptions, ValidationOptions } from '../../types/types';
import Model from '../Model/Model';
import Main from '../views/Main/Main';
import Observable from '../Observable/Observable';
import EventTypes from '../constants';

export interface Slider {
  min?: number;
  max?: number;
  isVertical?: boolean;
  isRange?: boolean;
  withProgress?: boolean;
  step?: number;
  valueMin?: number;
  valueMax?: number;
  value?: number;
  withLabel?: boolean;
  withScale?: boolean;
  method?: (options: Slider) => void;
}

class Controller extends Observable {
  public readonly view: Main = new Main();

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

  public passMethod(method: (options?: Slider) => void): void {
    method(this.model.settings);
  }

  public reloadSlider(options: Slider): void {
    this.model.setSettings(options);
    this.view.reloadSlider(this.model.settings);
    this.updateOptions(this.model.settings);
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
    this.view.subscribe({ method: this.updateOptions, type: EventTypes.UPDATE_OPTIONS });
    this.view.subscribe({ method: this.validateValue, type: EventTypes.VALIDATE_VALUE });
    this.view.subscribe({ method: this.setFractionOfValue, type: EventTypes.SET_FRACTION });
    this.model.subscribe({ method: this.view.setFractionOfValue, type: EventTypes.SET_FRACTION });
    this.model.subscribe({ method: this.view.updateSlider, type: EventTypes.UPDATE_VALUE });
  }
}

export default Controller;
