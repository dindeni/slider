import { SliderElementOptions, ScaleData } from '../../../types/types';
import Observable from '../../Observable/Observable';
import HandleView from '../HandleView/HandleView';
import ScaleView from '../ScaleView/ScaleView';
import TrackView from '../TrackView/TrackView';
import ThumbView from '../ThumbView/ThumbView';
import LabelView from '../LabelView/LabelView';
import ProgressView from '../ProgressView/ProgressView';

class View extends Observable {
  public $thumbElement: JQuery;

  public $thumbElementMin: JQuery;

  public $thumbElementMax: JQuery;

  public thumbCoordinate: number;

  public thumbCoordinateMin: number;

  public thumbCoordinateMax: number;

  public $trackElement: JQuery;

  public coordinate: number;

  public scaleData: ScaleData = {
    value: [], coordinates: [], shortValue: [], shortCoordinates: [],
  };

  public sliderSettings: SliderElementOptions;

  public distance: number;

  public $wrapper: JQuery;

  public trackSize: number;

  public thumbSize: number;

  public isValidValue: boolean;

  public parentElement: HTMLElement;

  public stepValue: number;

  public fraction: number;

  private scaleView: ScaleView;

  private trackView: TrackView;

  public handleView: HandleView;

  public labelView: LabelView;

  public thumbView: ThumbView;

  public progressView: ProgressView;

  public createElements(options: SliderElementOptions): void {
    const {
      $element, isRange, isVertical, min, max, step, withProgress, withLabel,
    } = options;

    this.$wrapper = $element;
    this.handleView = new HandleView(this);
    this.scaleView = new ScaleView(this);
    this.trackView = new TrackView(this);
    this.thumbView = new ThumbView(this);
    this.labelView = new LabelView(this);
    this.progressView = new ProgressView(this);

    this.handleView.createBasicNodes();
    this.thumbSize = this.thumbView.getThumbSize();
    this.trackSize = this.trackView.getTrackSize();

    if (step) {
      this.scaleView.createScale();
    }

    this.thumbView.createThumb();
    if (withLabel) {
      this.labelView.createLabel();
    }

    if (withProgress) {
      this.progressView.createProgressNode();
      this.progressView.makeProgress();
    }

    this.handleView.addDragAndDrop({
      min, max, isRange, withLabel, isVertical, withProgress, $element: this.$wrapper, step,
    });
  }

  public getSliderOptions(sliderSettings: SliderElementOptions): void {
    this.sliderSettings = {
      ...sliderSettings,
      valueMin: sliderSettings.min,
      valueMax: sliderSettings.max,
    };
  }

  public getFractionOfValue(fraction: number): void {
    this.fraction = fraction;
  }

  public setValueState(isValid: boolean): void {
    this.isValidValue = isValid;
  }

  public getValidStepValue(value: number): void{
    this.stepValue = value;
  }
}

export default View;
