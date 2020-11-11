import HandleView from '../slider/views/HandleView/HandleView';
import Controller from '../slider/Controller/Controller';
import Model from '../slider/Model/Model';
import { SliderElementOptions, SliderOptions } from '../types/types';

describe('HandleView', () => {
  let options: SliderOptions;
  let elementOptions: SliderElementOptions;
  let handleView: HandleView;

  const createEvent = (eventOptions: { type: 'mousedown' | 'mousemove' | 'click'; clientX: number; clientY: number }): MouseEvent => {
    const { type, clientX, clientY } = eventOptions;
    return new MouseEvent(type, {
      view: window,
      bubbles: true,
      clientX,
      clientY,
      cancelable: true,
    });
  };

  beforeAll(() => {
    const $element = $('<div class="slider js-slider"></div>');
    $element.appendTo(document.body);
    options = {
      isRange: true,
      isVertical: false,
      min: 100,
      max: 500,
      withProgress: true,
      withLabel: true,
    };
    elementOptions = { ...options, $element };
    const model = new Model();
    const controller = new Controller(model);
    model.setSliderOptions(elementOptions);
    controller.init();
    handleView = controller.view.handleView;
  });

  describe('Events addDragAndDrop', () => {
    it('should move thumb max', () => {
      const mouseDown = createEvent({ type: 'mousedown', clientX: 0, clientY: 0 });
      const mouseMove = createEvent({ type: 'mousemove', clientX: -100, clientY: 0 });
      const $thumbMax = $('.js-slider__thumb_type_max');
      $thumbMax[0].dispatchEvent(mouseDown);
      $thumbMax[0].dispatchEvent(mouseMove);
      expect($thumbMax.css('left')).toBe('100px');
    });

    it('should move thumb min', () => {
      const mouseDown = createEvent({ type: 'mousedown', clientX: 0, clientY: 0 });
      const mouseMove = createEvent({ type: 'mousemove', clientX: 100, clientY: 0 });
      const $thumbMin = $('.js-slider__thumb_type_min');
      $thumbMin[0].dispatchEvent(mouseDown);
      $thumbMin[0].dispatchEvent(mouseMove);
      expect($thumbMin.css('left')).toBe('100px');
    });

    it('should move thumb after click', () => {
      const mouseClick = createEvent({ type: 'click', clientX: 50, clientY: 0 });
      const $track = $('.js-slider__track');
      const $thumbMin = $('.js-slider__thumb_type_min');
      $track[0].dispatchEvent(mouseClick);
      expect($thumbMin.css('left')).toEqual('50px');
    });
  });

  it('should update data', () => {
    const trackElement = $('.js-slider__track')[0];
    trackElement.getBoundingClientRect = jest.fn(() => ({
      width: 300,
      height: 10,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: (): void => {},
    }));
    const thumbElement = $('.js-slider__thumb')[0];
    handleView.updateData({
      trackElement,
      distance: 150,
      thumbElement,
    });
    const label = thumbElement.children[0];
    expect(label.textContent).toBe('300');
  });

  it('should call reload after resize', () => {
    const spy = jest.spyOn(handleView, 'reloadSlider');
    $(window).trigger('resize');
    expect(spy).toBeCalled();
  });

  it('should create basic nodes', () => {
    expect($('.js-slider').length).toBe(1);
    expect($('.js-slider__track').length).toBe(1);
    expect($('.js-slider__thumb').length).toBeGreaterThanOrEqual(1);
  });

  it('should reload slider', () => {
    handleView.reloadSlider({ ...options, isRange: false });
    expect($('.js-slider__thumb').length).toBe(1);
  });
});
