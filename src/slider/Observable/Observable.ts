import {
  SliderElementOptions, ValidationOptions, DistanceOptions, ThumbPositionsOptions,
  ChangeZIndexOptions, UpdatingLabelOptions, ThumbValueOptions,
} from '../../types/types';

type ObserverValueOption = number | boolean | SliderElementOptions | ValidationOptions
  | DistanceOptions | ThumbPositionsOptions | ChangeZIndexOptions | UpdatingLabelOptions
  | ThumbValueOptions;

interface ObserverAndType {
  type: string;
  method: (value: ObserverValueOption) => void;
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

  public notifyAll(data: { value: ObserverValueOption; type: string }): void {
    this.observers.forEach((observer) => {
      if (observer.type === data.type) {
        observer.method(data.value);
      }
    });
  }
}

export default Observable;
