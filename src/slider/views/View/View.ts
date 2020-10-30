import autoBind from 'auto-bind';

import {
  ChangeZIndexOptions, SetStepThumbOptions, ScaleData, SliderElementOptions, ThumbPositionsOptions,
  UpdatingLabelOptions, ValidationOptions,
} from '../../../types/types';
import Observable from '../../Observable/Observable';
import HandleView from '../HandleView/HandleView';
import ScaleView from '../ScaleView/ScaleView';
import TrackView from '../TrackView/TrackView';
import ThumbView from '../ThumbView/ThumbView';
import LabelView from '../LabelView/LabelView';
import ProgressView from '../ProgressView/ProgressView';


class View extends Observable {
  constructor() {
    super();
    autoBind(this);
  }

  private settings: SliderElementOptions;

  public scaleView: ScaleView;

  public trackView: TrackView;

  public handleView: HandleView;

  public labelView: LabelView;

  public thumbView: ThumbView;

  public progressView: ProgressView;

  public createElements(options: SliderElementOptions): void {
    const {
      isVertical, step, withProgress, withLabel,
    } = options;

    this.settings = options;
    this.handleView = new HandleView();
    this.handleView.createBasicNodes(options);
    this.thumbView = new ThumbView(options);
    this.trackView = new TrackView(options);

    if (isVertical) {
      this.trackView.makeVertical();
    }
    this.scaleView = new ScaleView(options);
    this.labelView = new LabelView(options);
    this.progressView = new ProgressView(options);

    this.subscribeViews();

    this.trackView.getSize();
    if (step) {
      this.scaleView.create(this.getTrackSize());
    }

    this.thumbView.create(this.getTrackSize());
    if (withLabel) {
      this.labelView.create(this.getTrackSize());
    }

    if (withProgress) {
      this.progressView.createNode();
      this.progressView.update();
    }

    this.handleView.addDragAndDrop({
      ...options, trackSize: this.getTrackSize(),
    });
  }

  public getSliderOptions(sliderSettings: SliderElementOptions): void {
    this.settings = {
      ...sliderSettings,
      valueMin: sliderSettings.min,
      valueMax: sliderSettings.max,
    };
  }

  public setFractionOfValue(fraction: number): void {
    this.thumbView.getFractionOfValue(fraction);
    this.handleView.getFractionOfValue(fraction);
  }

  public setIsValidValue(isValid: boolean): void {
    this.thumbView.setIsValidValue(isValid);
  }

  public getValidStepValue(value: number): void{
    this.scaleView.value = value;
  }

  public getTrackSize(): number {
    return this.trackView.size;
  }

  public getScaleData(): ScaleData {
    return this.scaleView.data;
  }

  public reloadSlider(options: SliderElementOptions): void {
    this.handleView.reloadSlider(options);
  }

  private setThumbPosition(options: ThumbPositionsOptions): void {
    this.thumbView.setPosition(options);
  }

  private setStepThumb(options: SetStepThumbOptions): void {
    this.scaleView.setPosition(options);
  }

  private changeZIndex(options: ChangeZIndexOptions): void {
    this.thumbView.changeZIndex(options);
  }

  private updateLabelValue(options: UpdatingLabelOptions): void {
    this.labelView.updateValue(options);
    if (this.settings.withProgress) {
      this.progressView.update();
    }
  }

  private getFractionOfValue(value: number): void {
    this.notifyAll({ value, type: 'setFractionOfValue' });
  }

  private updateOptions(options: SliderElementOptions): void {
    this.settings = options;
    this.notifyAll({ value: options, type: 'updateOptions' });
  }

  private recreate(options: SliderElementOptions): void {
    this.settings = options;
    this.createElements(options);
  }

  private validateValue(options: ValidationOptions): void {
    this.notifyAll({ value: options, type: 'validateValue' });
  }

  private validateStepValue(value: number): void {
    this.notifyAll({ value, type: 'validateStepValue' });
  }

  private subscribeViews(): void {
    this.handleView.subscribe({ method: this.setThumbPosition, type: 'setThumbPosition' });
    this.handleView.subscribe({ method: this.changeZIndex, type: 'changeZIndex' });
    this.handleView.subscribe({ method: this.updateLabelValue, type: 'updateLabelValue' });
    this.handleView.subscribe({ method: this.getFractionOfValue, type: 'getFractionOfValue' });
    this.handleView.subscribe({ method: this.updateOptions, type: 'updateOptions' });
    this.handleView.subscribe({ method: this.recreate, type: 'recreate' });
    this.thumbView.subscribe({ method: this.getFractionOfValue, type: 'getFractionOfValue' });
    this.thumbView.subscribe({ method: this.setStepThumb, type: 'setStepThumb' });
    this.thumbView.subscribe({ method: this.validateValue, type: 'validateValue' });
    this.scaleView.subscribe({ method: this.validateStepValue, type: 'validateStepValue' });
  }
}

export default View;
