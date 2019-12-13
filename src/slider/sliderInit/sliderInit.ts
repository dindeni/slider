import View from '../views/view';

const view = new View();

interface SliderOptions {
  progress?: boolean;
  max?: number;
  min?: number;
  label?: boolean;
  step?: number;
  vertical?: boolean;
  range?: boolean;
}

interface SliderOptionsForInit {
  $element: JQuery;
  progress: boolean;
  min: number;
  max: number;
  label: boolean;
  step: number | undefined;
  vertical: boolean;
  range: boolean;
}

declare global {
  interface JQuery {
    slider(options?: SliderOptions): JQuery;
    }
}

const initSlider = (options: SliderOptionsForInit): void => {
  view.createElements(options);
};

(function ($): void {
  $.fn.slider = function (options?: SliderOptions): JQuery {
    const optionsDefault = {
      progress: false,
      min: 0,
      max: 100,
      label: true,
      step: undefined,
      vertical: false,
      range: false,
      $element: this,
    };

    const config = $.extend({}, optionsDefault, options);

    initSlider(config);

    return this;
  };
}(jQuery));

export default SliderOptionsForInit;
