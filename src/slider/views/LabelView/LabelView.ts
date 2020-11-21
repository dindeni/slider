import { SliderElementOptions, UpdatingLabelOptions } from '../../../types/types';
import Observable from '../../Observable/Observable';

class LabelView extends Observable {
  public labelValue: number;

  private trackSize: number;

  private readonly settings: SliderElementOptions;

  constructor(settings: SliderElementOptions) {
    super();
    this.settings = settings;
  }

  public create(trackSize: number): void {
    const {
      isRange, isVertical, value, min, $element,
    } = this.settings;

    this.trackSize = trackSize;
    const thumbSet = $element.children('.js-slider__thumb');
    if (isRange) {
      this.createRangeLabel(thumbSet);
    } else {
      const $labelElement = $('<div class="slider__label js-slider__label"></div>').appendTo(thumbSet[0]);
      $labelElement.text(value || min);
      if (isVertical) {
        $labelElement.addClass('slider__label_type_vertical');
      }
    }

    if (isVertical) {
      $element.addClass('slider_type_vertical');
    } else $element.removeClass('slider_type_vertical');
  }

  public updateValue(options: UpdatingLabelOptions): void {
    const { value, thumbElement } = options;

    const labelElement = $(thumbElement).children();
    labelElement.text(value);
    this.updateOptions();
  }

  private createRangeLabel(thumbSet: JQuery<HTMLElement>): void {
    const {
      isVertical, min, max, valueMin, valueMax,
    } = this.settings;

    const $elementMin = $('<div class="slider__label js-slider__label slider__label_type_min js-slider__label_type_min"></div>')
      .appendTo(thumbSet[0]);
    if (isVertical) {
      $elementMin.addClass('slider__label_type_vertical');
    }
    $elementMin.text(valueMin || min);

    const $elementMax = $('<div class="slider__label js-slider__label slider__label_type_max js-slider__label_type_max"></div>')
      .appendTo(thumbSet[1]);
    $elementMax.text(valueMax || max);
  }

  private updateOptions(): void {
    const { isRange, $element } = this.settings;

    if (isRange) {
      const valueMin = parseInt($element.find('.js-slider__label_type_min').text(), 10);
      const valueMax = parseInt($element.find('.js-slider__label_type_max').text(), 10);
      this.notifyAll({ value: { ...this.settings, valueMin, valueMax }, type: 'updateOptions' });
    } else {
      const value = parseInt($element.find('.js-slider__label').text(), 10);
      this.notifyAll({ value: { ...this.settings, value }, type: 'updateOptions' });
    }
  }
}

export default LabelView;
