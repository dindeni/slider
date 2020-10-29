import {
  SliderElementOptions, ValidationOptions, UpdateStateOptions, DistanceOptions,
  ThumbPositionsOptions, ChangeZIndexOptions, UpdatingLabelOptions, SetStepThumbOptions,
} from '../../types/types';

type ObserverValueOption = number | SliderElementOptions | ValidationOptions | UpdateStateOptions
  | DistanceOptions | ThumbPositionsOptions | ChangeZIndexOptions | UpdatingLabelOptions
  | SetStepThumbOptions;

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
