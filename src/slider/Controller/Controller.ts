import autoBind from 'auto-bind';

import { SliderElementOptions, ValidationOptions } from '../../types/types';
import Model from '../Model/Model';
import View from '../views/View/View';
import Observable from '../Observable/Observable';

interface UpdateStateOptions {
  data: any;
  actionType: 'validateValue' | 'validateStepValue' | 'getFractionOfValue';
}

class Controller extends Observable {
  private model: Model;

  private view: View = new View();

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
    this.model.getSliderOptions(options);
    this.view.handleView.reloadSlider(options);
  }

  private setValidStepValue(value: number): void {
    this.model.validateStepValue(value);
  }

  private setValueState(options: ValidationOptions): void {
    this.model.validateValue(options);
  }

  private getFractionOfValue(value: number): void {
    this.model.calculateFractionOfValue(value);
  }

  private updateState(value: UpdateStateOptions): undefined {
    switch (value.actionType) {
      case 'validateValue': this.view.setValueState(value.data);
        break;
      case 'validateStepValue': this.view.getValidStepValue(value.data);
        break;
      case 'getFractionOfValue': this.view.getFractionOfValue(value.data);
        break;
      default: return undefined;
    }
    return undefined;
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
    this.view.subscribe({ method: this.getFractionOfValue, type: 'getFractionOfValue' });
    this.model.subscribe({ method: this.updateState, type: 'updateState' });
  }
}

export default Controller;
