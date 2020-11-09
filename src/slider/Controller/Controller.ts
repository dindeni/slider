import autoBind from 'auto-bind';

import { SliderElementOptions, ValidationOptions, UpdateStateOptions } from '../../types/types';
import Model from '../Model/Model';
import View from '../views/View/View';
import Observable from '../Observable/Observable';
import { VALIDATE_VALUE, VALIDATE_STEP_VALUE, SET_FRACTION_OF_VALUE } from './constants';

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
    this.view.getSliderOptions(this.model.sliderOptions);
    this.view.createElements(this.model.sliderOptions);
  }

  public passMethod(method: (options: SliderElementOptions) => void): void {
    method(this.model.sliderOptions);
  }

  public reloadSlider(options: SliderElementOptions): void {
    this.model.getSliderOptions(options);
    this.view.reloadSlider(options);
  }

  private setValidStepValue(value: number): void {
    this.model.validateStepValue(value);
  }

  private setValueState(options: ValidationOptions): void {
    this.model.validateValue(options);
  }

  private setFractionOfValue(value: number): void {
    this.model.calculateFractionOfValue(value);
  }

  private updateState(value: UpdateStateOptions): null {
    switch (value.actionType) {
      case VALIDATE_VALUE: this.view.setIsValidValue(value.data as boolean);
        break;
      case VALIDATE_STEP_VALUE: this.view.getValidStepValue(value.data as number);
        break;
      case SET_FRACTION_OF_VALUE: this.view.setFractionOfValue(value.data as number);
        break;
      default: return null;
    }
    return null;
  }

  private updateOptions(options: SliderElementOptions): void {
    this.model.getSliderOptions(options);
    if (this.model.sliderOptions.method) {
      this.passMethod(this.model.sliderOptions.method);
    }
  }

  private subscribeAll(): void {
    this.view.subscribe({ method: this.updateOptions, type: 'updateOptions' });
    this.view.subscribe({ method: this.setValueState, type: 'validateValue' });
    this.view.subscribe({ method: this.setValidStepValue, type: 'validateStepValue' });
    this.view.subscribe({ method: this.setFractionOfValue, type: 'setFractionOfValue' });
    this.model.subscribe({ method: this.updateState, type: 'updateState' });
  }
}

export default Controller;
