import { SliderElementOptions } from '../../../types/types';

class TrackView {
  public size: number;

  private $trackElement: JQuery<HTMLElement>;

  private readonly settings: SliderElementOptions;

  constructor(settings: SliderElementOptions) {
    this.settings = settings;
    this.checkSize();
  }

  public makeVertical(): void {
    const { $element } = this.settings;
    const trackElement = $element.find('.js-slider__track');
    trackElement.css({
      height: `${trackElement.width()}px`,
      width: `${trackElement.height()}px`,
    });
    $element.css({
      width: '10%',
    });
  }

  public getSize(): void {
    const { isVertical, $element } = this.settings;
    const $thumbElement = $element.find('.js-slider__thumb');
    const trackSize = isVertical ? this.$trackElement.height() : this.$trackElement.width();

    this.size = Math.round((trackSize || 0) - ($thumbElement.width() || 0));
  }

  private checkSize(): void {
    const { $element } = this.settings;
    this.$trackElement = $element.find('.js-slider__track');
    if (!this.$trackElement.width()) {
      this.$trackElement.css({ width: '200px' });
    }
  }
}

export default TrackView;
