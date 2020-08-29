import View from '../View/View';

class ProgressView {
  view: View;

  constructor(view) {
    this.view = view;
  }

  public createProgressNode(): void {
    $('<div class="slider__progress js-slider__progress"></div>').appendTo(this.view.$trackElement);
  }

  public makeProgress(): void {
    const { isVertical, isRange } = this.view.sliderSettings;

    const $progressElement = this.view.$wrapper.find('.js-slider__progress');
    if (isRange) {
      const thumbMin = isVertical
        ? parseFloat(this.view.$thumbElementMin.css('top'))
        : parseFloat(this.view.$thumbElementMin.css('left'));
      const thumbMax = isVertical
        ? parseFloat(this.view.$thumbElementMax.css('top'))
        : parseFloat(this.view.$thumbElementMax.css('left'));
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
        ? parseFloat(this.view.$thumbElement.css('top'))
        : parseFloat(this.view.$thumbElement.css('left'));
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
