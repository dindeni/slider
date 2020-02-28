/* eslint-disable  @typescript-eslint/explicit-function-return-type */
/* eslint-disable  @typescript-eslint/no-var-requires  */
import Model from '../slider/Model/Model';
import Controller from '../slider/Controller/Controller';
import style from '../blocks/slider/slider.scss';
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
    observable.notifyAll({ value: 'test', type: 'getString' });
    observable.notifyAll({ value: 200, type: 'getNumber' });
  });

  it('should subscribe string method and call', () => {
    expect(observable.notifyAll({ value: 'test', type: 'getString' })).toBe('test');
  });

  it('should subscribe number method and call', () => {
    expect(observable.notifyAll({ value: 200, type: 'getNumber' })).toBe(200);
  });

  it('should subscribe getScaleValue method and call', () => {
    expect(observable.notifyAll({ value: '', type: 'getScaleValue' })).toEqual({
      value: [1, 2, 3],
      coordinates: [0, 10, 20],
      shortValue: [1, 2, 3],
      shortCoordinates: [0, 10, 20],
    });
  });
});
