import autoBind from 'auto-bind';

import { SliderElementOptions, ValidationOptions, ValueAndType } from '../../../types/types';
import Observable from '../../Observable/Observable';
import EventTypes from '../../constants';
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

  public settings: SliderElementOptions;

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

    this.thumbView.setStartPosition(this.getTrackSize());
    if (withProgress) {
      this.progressView.createNode();
      this.progressView.update();
    }
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

  public update(options: ValueAndType): void {
    const { withProgress } = this.settings;

    this.thumbView.update();
    if (this.settings.step) {
      this.scaleView.update(options);
    }
    this.labelView.updateValue(options);

    if (withProgress) {
      this.progressView.update();
    }
  }

  public getTrackSize(): number {
    return this.trackView.size;
  }

  public reloadSlider(options: SliderElementOptions): void {
    this.handleView.reloadSlider(options);
  }

  private notifyAboutValueChange(value: number): void {
    this.notifyAll({ value, type: EventTypes.SET_FRACTION });
  }

  private updateOptions(options: SliderElementOptions): void {
    this.settings = options;
    this.notifyAll({ value: options, type: EventTypes.UPDATE_OPTIONS });
  }

  private recreate(options: SliderElementOptions): void {
    this.trackView.removeEvent();
    this.settings = options;
    this.createElements(options);
  }

  private validateValue(options: ValidationOptions): void {
    this.notifyAll({ value: options, type: EventTypes.VALIDATE });
  }

  private subscribeViews(): void {
    const {
      VALIDATE, UPDATE_OPTIONS, RECREATE, VALUE_CHANGE,
    } = EventTypes;

    this.trackView.subscribe({ method: this.notifyAboutValueChange, type: VALUE_CHANGE });
    this.thumbView.subscribe({ method: this.notifyAboutValueChange, type: VALUE_CHANGE });
    this.handleView.subscribe({ method: this.recreate, type: RECREATE });
    this.thumbView.subscribe({ method: this.validateValue, type: VALIDATE });
    this.trackView.subscribe({ method: this.validateValue, type: VALIDATE });
    this.labelView.subscribe({ method: this.updateOptions, type: UPDATE_OPTIONS });
  }
}

export default View;
