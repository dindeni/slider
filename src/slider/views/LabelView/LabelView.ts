import { SliderElementOptions, UpdatingLabelOptions } from '../../../types/types';

class LabelView {
  public labelValue: number;

  private readonly settings: SliderElementOptions;

  constructor(settings: SliderElementOptions) {
    this.settings = settings;
  }

  public create(): void {
    const {
      isRange, isVertical, value, min, $element,
    } = this.settings;

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
  }

  public updateValue(options: UpdatingLabelOptions): void {
    const { fraction, thumbElement } = options;

    this.setValue(fraction);
    const labelElement = $(thumbElement).children();
    labelElement.text(this.labelValue);
  }

  private setValue(fraction: number): void {
    const { min, max } = this.settings;

    const isBelowZero = fraction <= 0;
    if (isBelowZero) {
      this.labelValue = min;
    } else {
      this.labelValue = Math.round(min + ((max - min) * fraction));
    }
  }

  private createRangeLabel(thumbSet: JQuery<HTMLElement>): void {
    const {
      isVertical, min, max, valueMin, valueMax,
    } = this.settings;

    const $labelElementMin = $('<div class="slider__label js-slider__label slider__label_type_min js-slider__label_type_min"></div>')
      .appendTo(thumbSet[0]);
    if (isVertical) {
      $labelElementMin.addClass('slider__label_type_vertical');
    }
    $labelElementMin.text(valueMin || min);

    const $labelElementMax = $('<div class="slider__label js-slider__label slider__label_type_max js-slider__label_type_max"></div>')
      .appendTo(thumbSet[1]);
    $labelElementMax.text(valueMax || max);
  }
}

export default LabelView;
