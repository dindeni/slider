import ThumbView from '../slider/views/ThumbView/ThumbView';
import Controller from '../slider/Controller/Controller';
import Model from '../slider/Model/Model';
import { SliderElementOptions } from '../types/types';
import createEvent from './events';

describe('ThumbView', () => {
  let options: SliderElementOptions;
  let thumbView: ThumbView;
  let controller: Controller;
  let $thumbMin: JQuery<HTMLElement>;
  let $thumbMax: JQuery<HTMLElement>;

  const simulateGetBounding = (settings: { element: HTMLElement; left: number }): void => {
    const { element, left } = settings;
    element.getBoundingClientRect = jest.fn((): DOMRect => ({
      top: 0,
      bottom: 0,
      left,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: (): void => {},
    }));
  };

  beforeAll(() => {
    const $element = $('<div class="slider js-slider"></div>');
    $element.appendTo(document.body);
    options = {
      $element,
      isRange: true,
      isVertical: false,
      min: 100,
      max: 500,
      withProgress: true,
      withLabel: true,
      step: undefined,
    };
    const model = new Model();
    controller = new Controller(model);
    model.setSettings(options);
    controller.init();
    thumbView = controller.view.thumbView;
    thumbView.setStartPosition(300);
    $thumbMin = $('.js-slider__thumb_type_min');
    $thumbMax = $('.js-slider__thumb_type_max');
  });

  it('should create elements', () => {
    expect($('.js-slider__thumb').length).toBe(2);
  });

  it('should move thumb min', () => {
    const mousedown = createEvent({ type: 'mousedown', clientX: 0, clientY: 0 });
    const mousemove = createEvent({ type: 'mousemove', clientX: 50, clientY: 0 });
    $thumbMin[0].dispatchEvent(mousedown);
    $thumbMin[0].dispatchEvent(mousemove);
    expect($thumbMin.css('left')).toBe('50px');
  });

  it('should move thumb max', () => {
    const mousedown = createEvent({ type: 'mousedown', clientX: 300, clientY: 0 });
    const mousemove = createEvent({ type: 'mousemove', clientX: 200, clientY: 0 });
    $thumbMax[0].dispatchEvent(mousedown);
    $thumbMax[0].dispatchEvent(mousemove);
    expect($thumbMax.css('left')).toBe('200px');
  });

  it('should update thumb position min', () => {
    thumbView.updatePosition({ thumbElement: $thumbMin[0], shift: 150, trackSize: 300 });
    expect($thumbMin.css('left')).toBe('150px');
  });

  it('should update thumb position max', () => {
    thumbView.updatePosition({ thumbElement: $thumbMax[0], shift: 200, trackSize: 300 });
    expect($thumbMax.css('left')).toBe('200px');
  });

  it('should change thumb zIndex min', () => {
    $thumbMin.css({ zIndex: '500' });
    simulateGetBounding({ element: $thumbMin[0], left: 150 });
    thumbView.changeZIndex($thumbMin[0]);
    expect($thumbMin.css('zIndex')).toBe('200');
  });

  it('should change thumb zIndex max', () => {
    $thumbMax.css({ zIndex: '500' });
    simulateGetBounding({ element: $thumbMax[0], left: 200 });
    thumbView.changeZIndex($thumbMax[0]);
    expect($thumbMax.css('zIndex')).toBe('100');
  });

  it('should create vertical thumb', () => {
    controller.reloadSlider({ ...options, isVertical: true });
    const thumbElement = $('.js-slider__thumb_type_max')[0];
    expect(thumbElement.style.top).toBe('200px');
  });
});
