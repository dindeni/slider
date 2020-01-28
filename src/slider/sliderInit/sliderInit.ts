import View from '../views/View/View';
import { SliderOptionsForInit, SliderOptions } from '../../types/types';

const view = new View();

declare global {
  interface JQuery {
    slider(options?: SliderOptions): JQuery;
    }
}

const initSlider = (options: SliderOptionsForInit): void => {
  view.createElements(options);
};

/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
(function ($): void {
  $.fn.slider = function (options?: SliderOptions): JQuery {
    const optionsDefault = {
      progress: false,
      min: 0,
      max: 100,
      label: false,
      step: undefined,
      vertical: false,
      range: false,
      $element: this,
      valueMin: undefined,
      valueMax: undefined,
      value: undefined,
    };

    const config = $.extend({}, optionsDefault, options);

    initSlider(config);

    return this;
  };
}(jQuery));
