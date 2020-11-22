import autoBind from 'auto-bind';

import { SliderElementOptions } from '../../../types/types';
import Observable from '../../Observable/Observable';
import EventTypes from '../../constants';

class HandleView extends Observable {
  private settings: SliderElementOptions;

  constructor(options: SliderElementOptions) {
    super();
    autoBind(this);
    this.settings = options;
  }

  public addEvent(): void {
    $(window).on('resize', this.handleWindowResize);
  }

  public reloadSlider(options: SliderElementOptions): void {
    this.settings = { ...this.settings, ...options };

    this.settings.$element.empty();
    this.notifyAll({ value: this.settings, type: EventTypes.RECREATE });
  }

  private handleWindowResize(): void {
    const { valueMin, valueMax, value } = HandleView.getValue(
      { $element: this.settings.$element, isRange: this.settings.isRange },
    );

    this.reloadSlider({
      ...this.settings, valueMin, valueMax, value,
    });
    $(window).off('resize', this.handleWindowResize);
  }

  private static getValue(options: {$element: JQuery<HTMLElement>; isRange: boolean}):
      { valueMin?: number; valueMax?: number; value?: number } {
    const { $element, isRange } = options;

    if (isRange) {
      const valueMin = parseInt($element.find('.js-slider__label_type_min').text(), 10);
      const valueMax = parseInt($element.find('.js-slider__label_type_max').text(), 10);
      return { valueMin, valueMax };
    }
    const value = parseInt($element.find('.js-slider__label').text(), 10);
    return { value };
  }
}

export default HandleView;
