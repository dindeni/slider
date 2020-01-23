interface ExtremumOptions {
  min: number;
  max: number;
}

interface RangeAndVerticalOptions {
  vertical: boolean;
  range: boolean;
}

interface SliderBasicOptions extends ExtremumOptions, RangeAndVerticalOptions{
  progress: boolean;
  step?: number;
}

interface Slider extends ExtremumOptions, RangeAndVerticalOptions{
  progress: boolean;
  step?: number;
  valueMin?: number;
  valueMax?: number;
  value?: number;
  label?: boolean;
}

interface SliderElementOptions extends Slider{
  $element: JQuery;
}

interface SliderOptionsForInit extends SliderElementOptions{
  label?: boolean;
}

interface SliderOptions extends Slider{
  label?: boolean;
}

export {
  SliderOptionsForInit, SliderOptions, SliderElementOptions, Slider,
  ExtremumOptions, RangeAndVerticalOptions, SliderBasicOptions,
};
