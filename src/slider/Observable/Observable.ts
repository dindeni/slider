import {
  SliderElementOptions, ValidationOptions, DistanceOptions, ThumbPositionsOptions,
  UpdatingLabelOptions, ThumbValueOptions, ValueAndType,
} from '../../types/types';

type ObserverValueOption = number | boolean | HTMLElement | number[] | SliderElementOptions
  | ValueAndType | ValidationOptions | DistanceOptions | ThumbPositionsOptions
  | UpdatingLabelOptions | ThumbValueOptions;

interface ObserverAndType {
  type: string;
  method: (value?: ObserverValueOption) => void;
}

interface NotifyAllOptions {
  value?: ObserverValueOption;
  type?: string;
}

class Observable {
  public observers: ObserverAndType[] = [];

  public subscribe(options: ObserverAndType): void{
    const { type, method } = options;
    const checkHasMethod = (): boolean => this.observers.some((value) => value.type === type);
    if (!checkHasMethod()) {
      this.observers.push({ method, type });
    }
  }

  public notifyAll(data: NotifyAllOptions): void {
    const isValueAndType = (options: NotifyAllOptions, observer: ObserverAndType): options is
      { value: ObserverValueOption; type: string } => data.type !== undefined
      && data.value !== undefined
      && observer.type === data.type;

    this.observers.forEach((observer) => {
      if (isValueAndType(data, observer)) {
        observer.method(data.value);
      } else if (observer.type === data.type) {
        observer.method();
      }
    });
  }
}

export default Observable;
