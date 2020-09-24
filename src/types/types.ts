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

type MethodOption = (options: SliderElementOptions) => void;

type SliderReturnOption = { reload: MethodOption; method: MethodOption } | JQuery;

interface SliderElementOptions extends Slider {
  $element: JQuery;
  method?: MethodOption;
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

interface UpdateStateOptions {
  data: number | boolean;
  actionType: 'validateValue' | 'validateStepValue' | 'getFractionOfValue';
}

/* eslint-disable no-undef */
export {
  SliderOptions, SliderElementOptions, Slider, ScaleData, DistanceOptions,
  CoordinateOfMiddleOptions, ValidationOptions, UpdateStateOptions, SliderReturnOption,
  MethodOption,
};
