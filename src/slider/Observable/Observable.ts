import { ScaleValue } from '../../types/types';

interface Observer {
  method: Function;
}

interface ObserverAndType extends Observer{
  type: string;
}

class Observable {
  public observers: ObserverAndType[] = [];

  private resultOfMethod: number;

  private resultOfMethodForScale: ScaleValue;

  public subscribe({ method, type }: ObserverAndType): void{
    const checkHasMethod = (): boolean => this.observers.some((value) => value.type === type);
    if (!checkHasMethod()) {
      this.observers.push({ method, type });
    }
  }

  public notifyAll(data: { value; type: string }): number {
    this.observers.forEach((observer) => {
      if (observer.type === data.type) {
        this.resultOfMethod = observer.method(data.value);
      }
    });
    return this.resultOfMethod;
  }

  public notifyAllForScale(data: { value; type: string }): ScaleValue {
    this.observers.forEach((observer) => {
      if (observer.type === 'getScaleValue') {
        this.resultOfMethodForScale = observer.method(data.value);
      }
    });
    return this.resultOfMethodForScale;
  }
}

export default Observable;
