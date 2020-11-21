import autoBind from 'auto-bind';

import {
  ThumbValueOptions, SliderElementOptions, UpdatingLabelOptions,
  ValidationOptions, ThumbPositionsOptions,
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
    this.handleView = new HandleView(options);
    this.thumbView = new ThumbView(options);
    this.trackView = new TrackView(options);
    this.thumbView.create();

    if (isVertical) {
      this.trackView.makeVertical();
    }
    this.scaleView = new ScaleView(options);
    this.labelView = new LabelView(options);
    this.progressView = new ProgressView(options);

    this.subscribeViews();
    this.trackView.getSize();
    if (withLabel) {
      this.labelView.create(this.getTrackSize());
    }
    if (step) {
      this.scaleView.create(this.getTrackSize());
    }
    if (withProgress) {
      this.progressView.createNode();
      this.progressView.update();
    }
    this.thumbView.setStartPosition(this.getTrackSize());
    this.handleView.addEvent();
  }

  public setSliderOptions(sliderSettings: SliderElementOptions): void {
    this.settings = {
      ...sliderSettings,
      valueMin: sliderSettings.min,
      valueMax: sliderSettings.max,
    };
  }

  public setFractionOfValue(fraction: number): void {
    this.thumbView.setFractionOfValue(fraction);
    this.trackView.setFractionOfValue(fraction);
  }

  public setIsValidValue(isValid: boolean): void {
    this.thumbView.setIsValidValue(isValid);
  }

  public setStepValue(value: number): void{
    this.scaleView.value = value;
  }

  public getTrackSize(): number {
    return this.trackView.size;
  }

  public reloadSlider(options: SliderElementOptions): void {
    this.handleView.reloadSlider(options);
  }

  private updateThumbPosition(options: ThumbPositionsOptions): void {
    this.thumbView.updatePosition(options);
  }

  private setStepThumb(options: ThumbValueOptions): void {
    this.scaleView.setPosition(options);
  }

  private changeZIndex(element: HTMLElement): void {
    this.thumbView.changeZIndex(element);
  }

  private updateLabelValue(options: UpdatingLabelOptions): void {
    this.labelView.updateValue(options);
    if (this.settings.withProgress) {
      this.progressView.update();
    }
  }

  private notifyAboutValueChange(value: number): void {
    this.notifyAll({ value, type: 'setFractionOfValue' });
  }

  private updateOptions(options: SliderElementOptions): void {
    this.settings = options;
    this.notifyAll({ value: options, type: 'updateOptions' });
  }

  private recreate(options: SliderElementOptions): void {
    this.trackView.removeEvent();
    this.settings = options;
    this.createElements(options);
  }

  private validateValue(options: ValidationOptions): void {
    this.notifyAll({ value: options, type: 'validateValue' });
  }

  private subscribeViews(): void {
    this.trackView.subscribe({ method: this.updateThumbPosition, type: 'updateThumbPosition' });
    this.handleView.subscribe({ method: this.changeZIndex, type: 'changeZIndex' });
    this.trackView.subscribe({ method: this.notifyAboutValueChange, type: 'notifyAboutValueChange' });
    this.handleView.subscribe({ method: this.recreate, type: 'recreate' });
    this.thumbView.subscribe({ method: this.notifyAboutValueChange, type: 'notifyAboutValueChange' });
    this.thumbView.subscribe({ method: this.setStepThumb, type: 'setStepThumb' });
    this.thumbView.subscribe({ method: this.validateValue, type: 'validateValue' });
    this.thumbView.subscribe({ method: this.updateLabelValue, type: 'updateLabelValue' });
    this.scaleView.subscribe({ method: this.updateLabelValue, type: 'updateLabelValue' });
    this.labelView.subscribe({ method: this.updateOptions, type: 'updateOptions' });
  }
}

export default View;
