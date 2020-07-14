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
  method?: Function;
}

interface SliderOptions extends Slider{
  method?: Function;
}

interface TrackSizesOptions {
  trackWidth: number;
  trackHeight: number;
}

interface CurrentCoordinate extends ExtremumOptions{
  value: number;
}

interface ScaleData {
  value: number[];
  coordinates: number[];
  shortValue: number[];
  shortCoordinates: number[];
}

interface SliderValueOptions extends ExtremumOptions{
  fraction: number;
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
  SliderOptions, SliderElementOptions, Slider, ExtremumOptions, RangeAndVerticalOptions,
  SliderBasicOptions, TrackSizesOptions, CurrentCoordinate, ScaleData, SliderValueOptions,
  DistanceOptions, CoordinateOfMiddleOptions,
};
