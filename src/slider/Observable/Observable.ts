interface ObserverAndType{
  type: string;
  method: Function;
}

class Observable {
  public observers: ObserverAndType[] = [];

  public subscribe({ method, type }: ObserverAndType): void{
    const checkHasMethod = (): boolean => this.observers.some((value) => value.type === type);
    if (!checkHasMethod()) {
      this.observers.push({ method, type });
    }
  }

  public notifyAll(data: { value: any; type: string }): void {
    this.observers.forEach((observer) => {
      if (observer.type === data.type) {
        observer.method(data.value);
      }
    });
  }
}

export default Observable;
