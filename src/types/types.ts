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

interface TrackSizesOptions {
  trackWidth: number;
  trackHeight: number;
}

interface CurrentCoordinate extends Pick<Slider, 'min' | 'max'> {
  value: number;
}

interface ScaleData {
  value: number[];
  coordinates: number[];
  shortValue: number[];
  shortCoordinates: number[];
}

interface SliderValueOptions extends Pick<Slider, 'min' | 'max'> {
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
  SliderOptions, SliderElementOptions, Slider, TrackSizesOptions, CurrentCoordinate, ScaleData,
  SliderValueOptions, DistanceOptions, CoordinateOfMiddleOptions,
};
