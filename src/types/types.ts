interface Slider {
  min: number;
  max: number;
  isVertical: boolean;
  isRange: boolean;
  withProgress: boolean;
  step?: number;
  valueMin?: number;
  valueMax?: number;
  value?: number;
  withLabel?: boolean;
}

interface SliderElementOptions extends Slider {
  $element: JQuery;
  method?: Function;
}

type SliderOptions = Omit<SliderElementOptions, '$element'>;

interface ScaleData {
  value: number[];
  coordinates: number[];
  shortValue: number[];
  shortCoordinates: number[];
}

interface DistanceOptions {
  coordinateStart: number;
  coordinateMove: number;
}

interface CoordinateOfMiddleOptions {
  start: number;
  itemSize: number;
}

interface ValidationOptions {
  type?: 'min' | 'max';
  value: number;
}

/* eslint-disable no-undef */
export {
  SliderOptions, SliderElementOptions, Slider, ScaleData, DistanceOptions,
  CoordinateOfMiddleOptions, ValidationOptions,
};
