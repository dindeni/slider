import { SliderOptions } from '../../types/types';
import Controller from '../Controller/Controller';

declare global {
  interface JQuery {
    slider(options?: SliderOptions): SliderOptions;
    }
}

/* eslint-disable func-names */

$.fn.slider = function (options?: SliderOptions): SliderOptions {
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

  const controller = new Controller();
  controller.getSliderOptions(config);

  controller.init();
  if (config.method) {
    return controller.getPublicData(config.method);
  } return config;
};
