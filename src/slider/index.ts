import { PluginOptions, SliderReturnOption } from '../types/types';
import Controller from './Controller/Controller';
import Model from './Model/Model';

declare global {
  interface JQuery {
    slider(options?: PluginOptions): SliderReturnOption;
    }
}

/* eslint-disable func-names */
$.fn.slider = function (options?: PluginOptions): SliderReturnOption {
  const optionsDefault = {
    withProgress: false,
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
  this.settings = config;

  if (config.method) {
    this.method = controller.passMethod(config.method);
  }
  this.reload = (reloadOptions?: PluginOptions): void => controller.reloadSlider(reloadOptions);
  return this;
};

export default $.fn.slider;
