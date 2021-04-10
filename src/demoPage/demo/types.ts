import { MethodOption, SliderOptions } from '../../types/types';

export interface Slider {
  min?: number;
  max?: number;
  isVertical?: boolean;
  isRange?: boolean;
  withProgress?: boolean;
  step?: number;
  valueMin?: number;
  valueMax?: number;
  value?: number;
  withLabel?: boolean;
  withScale?: boolean;
  method?: MethodOption;
}

export interface ObservingInputOptions extends Pick<Slider, 'step'> {
  element: HTMLElement;
}

export interface DemoElementsAndEventOptions {
  event: Event;
  element: HTMLElement;
  formElement: HTMLElement;
}

export interface DemoElementChangeOptions extends DemoElementsAndEventOptions {
  step: number | undefined;
}

export interface OptionsForUpdatingSlider extends DemoElementsAndEventOptions {
  settings: SliderOptions;
}

export interface ElementsCreationOptions {
  settings: Slider;
  form: HTMLElement;
}

export interface ErrorCreationOptions {
  element: HTMLInputElement;
  text: string;
}

export interface ValidateOptions {
  element: HTMLInputElement;
  value: number;
}

export interface SetInputValueOptions {
  type: string;
  input: HTMLInputElement;
  key: keyof SliderOptions;
}

export interface CheckRangeValue {
  inputValue: number;
  inputElement: HTMLInputElement;
}

export type SettingsKeyOptions = 'value' | 'valueMin' | 'valueMax' | 'min' | 'max' | 'withProgress'
  | 'isVertical' | 'isRange' | 'withLabel' | 'step' | 'withScale';
