import { SliderOptions, SliderReturnOption } from '../../types/types';
import Controller from '../Controller/Controller';
import Model from '../Model/Model';

declare global {
  interface JQuery {
    slider(options?: SliderOptions): SliderReturnOption;
    }
}

/* eslint-disable func-names */
$.fn.slider = function (options?: SliderOptions): SliderReturnOption {
  const optionsDefault = {
    progress: false,
    min: 0,
    max: 100,
    isVertical: false,
    isRange: false,
    $element: this,
  };
  const dataAttributes = $(this).data();

  const config = $.extend({}, { ...optionsDefault, ...dataAttributes }, options);

  const model = new Model();
  const controller = new Controller(model);
  model.setSettings(config);

  controller.init();
  this.data = {};
  const isNotOptions = options && Object.values(options).length === 0;
  if (isNotOptions) {
    return this;
  }

  if (config.method) {
    this.data = { method: controller.passMethod(config.method) };
  }

  this.data = { ...this.data, reload: controller.reloadSlider };
  return this.data;
};

export default $.fn.slider;
