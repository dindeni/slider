import Model from '../Model/Model';
import Controller from '../Controller/Controller';
import { SliderOptionsForInit, SliderOptions } from '../../types/types';

const model = new Model();
const controller = new Controller(model);

declare global {
  interface JQuery {
    slider(options?: SliderOptions): JQuery;
    }
}

const initSlider = (options: SliderOptionsForInit): void => {
  model.getSliderOptions(options);
  controller.init();
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
