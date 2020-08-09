import { SliderOptions } from '../../types/types';
import Controller from '../Controller/Controller';

declare global {
  interface JQuery {
    slider(options?: SliderOptions): {reload: Function} | JQuery;
    }
}

/* eslint-disable func-names */

$.fn.slider = function (options?: SliderOptions): {reload: Function} | JQuery {
  const optionsDefault = {
    progress: false,
    min: 0,
    max: 100,
    label: false,
    isVertical: false,
    isRange: false,
    $element: this,
  };

  const config = $.extend({}, optionsDefault, options);

  const controller = new Controller();
  controller.getSliderOptions(config);

  controller.init();
  if (config.method) {
    return controller.getPublicData(config.method);
  }
  return this;
};
