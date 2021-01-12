import { SliderElementOptions } from '../../../types/types';

class ProgressView {
  private readonly settings: SliderElementOptions;

  private $progress: JQuery<HTMLElement>;

  private $thumbMin: JQuery<HTMLElement>;

  private $thumbMax: JQuery<HTMLElement>;

  private $thumb: JQuery<HTMLElement>;

  private size: number;

  constructor(settings: SliderElementOptions) {
    this.settings = settings;
  }

  public createNode(): void {
    const $trackElement = this.settings.$element.find('.js-slider__track');
    this.$progress = $('<div class="slider__progress js-slider__progress"></div>');
    this.$progress.appendTo($trackElement);
    this.setVariables();
  }

  public update(): void {
    const { isVertical, isRange } = this.settings;

    const key = isVertical ? 'top' : 'left';
    if (isRange) {
      const min = parseFloat(this.$thumbMin.css(key));
      const max = parseFloat(this.$thumbMax.css(key));
      this.size = max - min;
      this.$progress.css({ [key]: `${min}px` });
    } else {
      this.size = parseFloat(this.$thumb.css(key));
    }
    isVertical
      ? this.$progress.css({
        height: `${this.size}px`,
      })
      : this.$progress.css({
        width: `${this.size}px`,
      });
  }

  private setVariables(): void {
    const { $element, isRange } = this.settings;

    if (isRange) {
      this.$thumbMin = $element.find('.js-slider__thumb_type_min');
      this.$thumbMax = $element.find('.js-slider__thumb_type_max');
    }
    this.$thumb = $element.find('.js-slider__thumb');
  }
}

export default ProgressView;
