import autoBind from 'auto-bind';

import { SliderElementOptions, ValidationOptions, ValueAndType } from '../../../types/types';
import Observable from '../../Observable/Observable';
import EventTypes from '../../constants';
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

  public labelView: LabelView;

  public thumbView: ThumbView;

  public progressView: ProgressView;

  public createElements(options: SliderElementOptions): void {
    const {
      isVertical, step, withProgress, withLabel,
    } = options;

    this.settings = options;
    this.thumbView = new ThumbView(options);
    this.trackView = new TrackView(options);
    this.thumbView.createElements();

    if (isVertical) {
      this.trackView.makeVertical();
    }
    this.scaleView = new ScaleView(options);
    this.labelView = new LabelView(options);
    this.progressView = new ProgressView(options);

    this.subscribeViews();
    this.trackView.getSize();
    if (withLabel) {
      this.labelView.createElements();
    }
    if (step) {
      this.notifyAll({ type: EventTypes.SET_STEP_VALUES });
      this.scaleView.createElements(this.getTrackSize());
    }

    this.thumbView.setStartPosition(this.getTrackSize());
    if (withProgress) {
      this.progressView.createNode();
      this.progressView.update();
    }
    this.addEvent();
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

  public updateSlider(options: ValueAndType): void {
    const { withProgress } = this.settings;

    this.thumbView.update(options);
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
    this.settings = { ...this.settings, ...options };
    this.settings.$element.empty();
    this.recreate(options);
  }

  public setStepValues(values: number[]): void {
    this.scaleView.setValues(values);
  }

  private handleWindowResize(): void {
    this.reloadSlider(this.settings);
  }

  private addEvent(): void {
    $(window).off('resize', this.handleWindowResize);
    $(window).on('resize', this.handleWindowResize);
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
    this.notifyAll({ value: options, type: EventTypes.VALIDATE_VALUE });
  }

  private subscribeViews(): void {
    this.trackView.subscribe(
      { method: this.notifyAboutValueChange, type: EventTypes.VALUE_CHANGE },
    );
    this.thumbView.subscribe(
      { method: this.notifyAboutValueChange, type: EventTypes.VALUE_CHANGE },
    );
    this.thumbView.subscribe({ method: this.validateValue, type: EventTypes.VALIDATE_VALUE });
    this.trackView.subscribe({ method: this.validateValue, type: EventTypes.VALIDATE_VALUE });
    this.labelView.subscribe({ method: this.updateOptions, type: EventTypes.UPDATE_OPTIONS });
  }
}

export default View;
