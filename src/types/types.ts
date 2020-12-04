export interface Slider {
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

export type MethodOption = (options: SliderElementOptions) => void;

export type SliderReturnOption = { reload: MethodOption; method: MethodOption }
  | JQuery<HTMLElement>;

export interface SliderElementOptions extends Slider {
  $element: JQuery<HTMLElement>;
  method?: MethodOption;
}

export type SliderOptions = Omit<SliderElementOptions, '$element'>;

export interface ScaleData {
  value: number[];
  coordinates: number[];
  shortValue: number[];
  shortCoordinates: number[];
}

export interface DistanceOptions {
  coordinateStart: number;
  coordinateMove: number;
}

export interface ValidationOptions {
  value: number;
  type?: 'min' | 'max';
}

export interface ValueAndType extends Pick<ValidationOptions, 'type'>{
  value: number | null;
}

export interface ThumbPositionsOptions {
  thumbElement: HTMLElement;
  shift: number;
  trackSize: number;
  coordinateStart?: number;
  coordinateMove?: number;
}

export interface UpdatingLabelOptions {
  value: number;
  thumbElement: HTMLElement;
}

export interface ThumbValueOptions {
  trackSize: number;
  element: HTMLElement;
  value: number;
}
