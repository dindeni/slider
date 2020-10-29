import { SliderElementOptions } from '../../../types/types';

class ProgressView {
  settings: SliderElementOptions;

  constructor(settings: SliderElementOptions) {
    this.settings = settings;
  }

  public createProgressNode(): void {
    const $trackElement = this.settings.$element.find('.js-slider__track');
    $('<div class="slider__progress js-slider__progress"></div>').appendTo($trackElement);
  }

  public makeProgress(): void {
    const { isVertical, isRange, $element } = this.settings;

    const $progressElement = $element.find('.js-slider__progress');
    const thumbCollection = $element.find('.js-slider__thumb');
    if (isRange) {
      const thumbMin = isVertical
        ? parseFloat(thumbCollection[0].style.top)
        : parseFloat(thumbCollection[0].style.left);
      const thumbMax = isVertical
        ? parseFloat(thumbCollection[1].style.top)
        : parseFloat(thumbCollection[1].style.left);
      const progressSize = thumbMax - thumbMin;
      isVertical
        ? $progressElement.css({
          height: `${progressSize}px`,
          top: thumbMin,
        })
        : $progressElement.css({
          width: `${progressSize}px`,
          left: thumbMin,
        });
    } else {
      const progressSize = isVertical
        ? parseFloat(thumbCollection[0].style.top)
        : parseFloat(thumbCollection[0].style.left);
      isVertical
        ? $progressElement.css({
          height: `${progressSize}px`,
        })
        : $progressElement.css({
          width: `${progressSize}px`,
        });
    }
  }
}

export default ProgressView;
