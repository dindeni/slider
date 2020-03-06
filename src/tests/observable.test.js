/* eslint-disable  @typescript-eslint/explicit-function-return-type */
/* eslint-disable  @typescript-eslint/no-var-requires  */
import Observable from '../slider/Observable/Observable';

describe('Observable', () => {
  let observable;
  beforeAll(() => {
    observable = new Observable();
    const getString = (string) => string;
    const getNumber = (number) => number;
    const getScaleValue = () => ({
      value: [1, 2, 3],
      coordinates: [0, 10, 20],
      shortValue: [1, 2, 3],
      shortCoordinates: [0, 10, 20],
    });

    observable.subscribe({ method: getString, type: 'getString' });
    observable.subscribe({ method: getNumber, type: 'getNumber' });
    observable.subscribe({ method: getScaleValue, type: 'getScaleValue' });
  });

  it('should subscribe string method and call', () => {
    spyOn(observable, 'notifyAll');
    observable.notifyAll({ value: 'test', type: 'getString' });
    expect(observable.notifyAll).toHaveBeenCalledWith({ value: 'test', type: 'getString' });
  });

  it('should subscribe number method and call', () => {
    spyOn(observable, 'notifyAll');
    observable.notifyAll({ value: 200, type: 'getNumber' });
    expect(observable.notifyAll).toHaveBeenCalledWith({ value: 200, type: 'getNumber' });
  });

  it('should subscribe getScaleValue method and call', () => {
    spyOn(observable, 'notifyAll');
    observable.notifyAll({ value: '', type: 'getScaleValue' });
    expect(observable.notifyAll).toHaveBeenCalledWith({ value: '', type: 'getScaleValue' });
  });
});
