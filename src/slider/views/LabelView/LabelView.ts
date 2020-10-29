import { SliderElementOptions, UpdatingLabelOptions } from '../../../types/types';

class LabelView {
  public labelValue: number;

  private readonly settings: SliderElementOptions;

  constructor(settings: SliderElementOptions) {
    this.settings = settings;
  }

  public create(trackSize: number): void {
    const {
      isRange, isVertical, value, min, $element,
    } = this.settings;

    const thumbSet = $element.children('.js-slider__thumb');
    if (isRange) {
      this.createRangeLabel({ thumbSet, trackSize });
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

    this.calculateValue(fraction);
    const labelElement = $(thumbElement).children();
    labelElement.text(this.labelValue);
  }

  public calculateValue(fraction: number): void {
    const { min, max } = this.settings;

    const isBelowZero = fraction <= 0;
    if (isBelowZero) {
      this.labelValue = min;
    } else {
      this.labelValue = Math.round(min + ((max - min) * fraction));
    }
  }

  private createRangeLabel(options: { thumbSet: JQuery<HTMLElement>; trackSize: number }): void {
    const { thumbSet, trackSize } = options;
    const {
      isVertical, min, max, valueMin, valueMax,
    } = this.settings;

    const key = isVertical ? 'top' : 'left';

    const $labelElementMin = $('<div class="slider__label js-slider__label slider__label_type_min js-slider__label_type_min"></div>')
      .appendTo(thumbSet[0]);
    $labelElementMin.css({
      zIndex: parseInt($('.js-slider__thumb_type_min').css(key), 10) > (trackSize / 2) ? 100 : 50,
    });
    if (isVertical) {
      $labelElementMin.addClass('slider__label_type_vertical');
    }
    $labelElementMin.text(valueMin || min);

    const $labelElementMax = $('<div class="slider__label js-slider__label slider__label_type_max js-slider__label_type_max"></div>')
      .appendTo(thumbSet[1]);
    $labelElementMax.css({
      zIndex: parseInt($('.js-slider__thumb_type_max').css(key), 10) > (trackSize / 2) ? 50 : 100,
    });
    $labelElementMax.text(valueMax || max);
  }
}

export default LabelView;
