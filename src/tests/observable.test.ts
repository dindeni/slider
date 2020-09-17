import Observable from '../slider/Observable/Observable';

describe('Observable', () => {
  let observable: Observable;
  let spyObservable;

  beforeAll(() => {
    observable = new Observable();
    const sum = (number): number => number + number;
    const multiply = (number): number => number * number;
    observable.subscribe({ method: sum, type: 'sum' });
    observable.subscribe({ method: multiply, type: 'multiply' });
    spyObservable = jest.spyOn(observable, 'notifyAll');
  });

  it('should subscribe', () => {
    expect(observable.observers.length).toBe(2);
  });

  it('should notify', () => {
    observable.notifyAll({ type: 'multiply', value: 10 });
    observable.notifyAll({ type: 'sum', value: 10 });
    expect(spyObservable).toHaveBeenCalledTimes(2);
  });
});
