import View from '../View/View';

interface UpdatingLabelOptions {
  value: number;
  thumbElement: HTMLElement;
}

class LabelView {
  public labelValue: number;

  private readonly view: View;

  constructor(view: View) {
    this.view = view;
  }

  public createLabel(): void {
    const {
      isRange, isVertical, value, min,
    } = this.view.sliderSettings;
    const { $thumbElement } = this.view;
    if (isRange) {
      this.createRangeLabel();
    } else {
      const $labelElement = $('<div class="slider__label js-slider__label"></div>').appendTo($thumbElement);
      $labelElement.text(value || min);
      if (isVertical) {
        $labelElement.addClass('slider__label_type_vertical');
      }
    }
  }

  public updateLabelValue(options: UpdatingLabelOptions): void {
    const { value, thumbElement } = options;

    const labelElement = $(thumbElement).children();
    labelElement.text(value);

    if (labelElement.hasClass('js-slider__label_type_min')) {
      this.view.sliderSettings.valueMin = value;
    } else if (labelElement.hasClass('js-slider__label_type_max')) {
      this.view.sliderSettings.valueMax = value;
    } else {
      this.view.sliderSettings.value = value;
    }
  }

  public calculateSliderValue(fraction: number): void {
    const { min, max } = this.view.sliderSettings;

    const isBelow0 = fraction <= 0;
    if (isBelow0) {
      this.labelValue = min;
    } else {
      this.labelValue = Math.round(min + ((max - min) * fraction));
    }
  }

  private createRangeLabel(): void {
    const {
      isVertical, min, max, valueMin, valueMax,
    } = this.view.sliderSettings;

    const {
      $thumbElementMin, $thumbElementMax, thumbCoordinateMin, thumbCoordinateMax,
    } = this.view;
    const { trackSize } = this.view;

    const $labelElementMin = $('<div class="slider__label js-slider__label slider__label_type_min js-slider__label_type_min"></div>')
      .appendTo($thumbElementMin);
    $labelElementMin.css({
      zIndex: thumbCoordinateMin > (trackSize / 2) ? 100 : 50,
    });
    if (isVertical) {
      $labelElementMin.addClass('slider__label_type_vertical');
    }
    $labelElementMin.text(valueMin || min);

    const $labelElementMax = $('<div class="slider__label js-slider__label slider__label_type_max js-slider__label_type_max"></div>')
      .appendTo($thumbElementMax);
    $labelElementMax.css({
      zIndex: thumbCoordinateMax > (trackSize / 2) ? 50 : 100,
    });
    $labelElementMax.text(valueMax || max);
  }
}

export default LabelView;
