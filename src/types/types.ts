interface Slider {
  progress: boolean;
  min: number;
  max: number;
  vertical: boolean;
  range: boolean;
  step?: number;
  valueMin?: number;
  valueMax?: number;
  value?: number;
}

interface SliderElementOptions extends Slider{
  $element: JQuery;
}

interface SliderOptionsForInit extends SliderElementOptions{
  label: boolean;
}

interface SliderOptions extends Slider{
  label?: boolean;
}

export {SliderOptionsForInit, SliderOptions, SliderElementOptions, Slider};
