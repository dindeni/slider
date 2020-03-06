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

interface TrackSizesOptions {
  trackWidth: number;
  trackHeight: number;
}

interface FromValueToCoordinate extends ExtremumOptions{
  value: number;
  trackSize: number;
}

interface ScaleData {
  value: number[];
  coordinates: number[];
  shortValue: number[];
  shortCoordinates: number[];
}

interface ScaleCoordinatesOptions extends ExtremumOptions{
  step: number | undefined;
  vertical: boolean;
  trackWidth: number;
  trackHeight: number;
}

interface SliderValueOptions extends ExtremumOptions{
  trackSize: number;
  distance: number;
}

interface DistanceOptions {
  coordinateStart: number;
  coordinateMove: number;
}

interface CoordinateOfMiddleOptions {
  start: number;
  itemSize: number;
}

/* eslint-disable no-undef */
export {
  SliderOptionsForInit, SliderOptions, SliderElementOptions, Slider,
  ExtremumOptions, RangeAndVerticalOptions, SliderBasicOptions, TrackSizesOptions,
  FromValueToCoordinate, ScaleData, ScaleCoordinatesOptions, SliderValueOptions, DistanceOptions,
  CoordinateOfMiddleOptions,
};
