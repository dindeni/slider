import Controller from '../Controller/Controller';
import { SliderOptionsForInit, SliderOptions } from '../../types/types';

const controller = new Controller();

declare global {
  interface JQuery {
    slider(options?: SliderOptions): Controller;
    }
}

const initSlider = (options: SliderOptionsForInit): void => {
  controller.getSliderOptions(options);
  controller.init();
};

/* eslint-disable func-names */

$.fn.slider = function (options?: SliderOptions): Controller {
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

  return controller;
};
