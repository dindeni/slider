import Model from '../Model/Model';
import View from '../views/View/View';
import ViewHandle from '../views/ViewHandle/ViewHandle';
import ViewOnTrack from '../views/ViewOnTrack/ViewOnTrack';
import ViewUpdating from '../views/ViewUpdating/ViewUpdating';
import ViewOptional from '../views/ViewOptional/ViewOptional';
import {
  ScaleValue, ScaleCoordinatesOptions, FromValueToCoordinate, SliderValueOptions,
  DistanceOptions, CoordinateOfMiddleOptions, SliderOptionsForInit,
} from '../../types/types';

class Controller {
  private model: Model;

  private view: View;

  private viewHandle: ViewHandle;

  private viewOnTrack: ViewOnTrack;

  private viewUpdating: ViewUpdating;

  private viewOptional: ViewOptional = new ViewOptional();

  constructor(model) {
    this.model = model;
  }

  public init(): void {
    this.subscribeToViewOptional();

    this.view = new View(this.viewOptional);
    this.subscribe();

    const sliderInitValues = this.getSliderOptions();
    const sliderSettings = {
      $element: sliderInitValues.$element,
      min: sliderInitValues.min,
      max: sliderInitValues.max,
      range: sliderInitValues.range,
      vertical: sliderInitValues.vertical,
      progress: sliderInitValues.progress,
      step: sliderInitValues.step,
    };


    this.view.createElements({
      ...sliderSettings,
      value: sliderInitValues.value,
      valueMin: sliderInitValues.valueMin,
      valueMax: sliderInitValues.valueMax,
      label: sliderInitValues.label,
    });

    this.viewOnTrack = new ViewOnTrack(this.view);
    this.viewUpdating = new ViewUpdating();
    this.viewHandle = new ViewHandle({
      view: this.view,
      viewOnTrack: this.viewOnTrack,
      viewUpdating: this.viewUpdating,
    });
    this.subscribeToHandle();
    this.viewHandle.addDragAndDrop(sliderSettings);
    this.subscribeToTrack();
    this.subscribeToViewUpdating();
  }

  private getSliderOptions(): SliderOptionsForInit {
    return {
      $element: this.model.$element,
      min: this.model.min,
      max: this.model.max,
      range: this.model.range,
      vertical: this.model.vertical,
      progress: this.model.progress,
      step: this.model.step,
      value: this.model.value,
      valueMin: this.model.valueMin,
      valueMax: this.model.valueMax,
      label: this.model.label,
    };
  }

  private getScaleCoordinates(options: ScaleCoordinatesOptions): ScaleValue {
    return this.model.calculateLeftScaleCoordinates(options);
  }

  private static getCoordinates(options: FromValueToCoordinate): number {
    return Model.calculateFromValueToCoordinates(options);
  }

  private getValue(options: SliderValueOptions): number {
    return this.model.calculateSliderValue(options);
  }

  private static getDistance(options: DistanceOptions): number {
    return Model.calculateThumbDistance(options);
  }

  private static getCoordinatesOfMiddle(options: CoordinateOfMiddleOptions): number {
    return Model.calculateCoordinatesOfMiddle(options);
  }

  private subscribe(): void {
    this.view.subscribe({ method: Controller.getCoordinates, type: 'getCoordinates' });
    this.view.subscribe({ method: this.getValue.bind(this), type: 'getValue' });
  }

  private subscribeToHandle(): void {
    this.viewHandle.subscribe({ method: this.getScaleCoordinates.bind(this), type: 'getScaleValue' });
    this.viewHandle.subscribe({ method: Controller.getDistance, type: 'getDistance' });
  }

  private subscribeToTrack(): void {
    this.viewOnTrack.subscribe({
      method: this.getScaleCoordinates.bind(this),
      type: 'getScaleValue',
    });
    this.viewOnTrack.subscribe({ method: Controller.getCoordinatesOfMiddle, type: 'getCoordinatesOfMiddle' });
  }

  private subscribeToViewUpdating(): void {
    this.viewUpdating.subscribe({ method: Controller.getCoordinatesOfMiddle, type: 'getCoordinatesOfMiddle' });
  }

  private subscribeToViewOptional(): void {
    this.viewOptional.subscribe({ method: this.getScaleCoordinates.bind(this), type: 'getScaleValue' });
  }
}

export default Controller;
