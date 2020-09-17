import HandleView from '../slider/views/HandleView/HandleView';
import Controller from '../slider/Controller/Controller';
import Model from '../slider/Model/Model';

describe('HandleView', () => {
  let options;
  let elementOptions;
  let handleView: HandleView;
  let view;

  const createEvent = (eventOptions: { type: 'mousedown' | 'mousemove'; screenX: number; screenY: number }): MouseEvent => {
    const { type, screenX, screenY } = eventOptions;
    return new MouseEvent(type, {
      view: window,
      bubbles: true,
      screenX,
      screenY,
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
    model.getSliderOptions(elementOptions);
    view = controller.view;
    controller.init();
    view.trackSize = 300;
    handleView = new HandleView(view);
  });

  describe('Events addDragAndDrop', () => {
    beforeAll(() => {
      handleView.addDragAndDrop(elementOptions);
    });

    it('should move thumb max', () => {
      const mouseDown = createEvent({ type: 'mousedown', screenX: 0, screenY: 0 });
      const mouseMove = createEvent({ type: 'mousemove', screenX: 250, screenY: 0 });
      const $thumbMax = $('.js-slider__thumb_type_max');
      $thumbMax[0].dispatchEvent(mouseDown);
      $thumbMax[0].dispatchEvent(mouseMove);
      expect($thumbMax.css('left')).toBe('250px');
    });

    it('should move thumb min', () => {
      const mouseDown = createEvent({ type: 'mousedown', screenX: 0, screenY: 0 });
      const mouseMove = createEvent({ type: 'mousemove', screenX: 100, screenY: 0 });
      const $thumbMin = $('.js-slider__thumb_type_min');
      $thumbMin[0].dispatchEvent(mouseDown);
      $thumbMin[0].dispatchEvent(mouseMove);
      expect($thumbMin.css('left')).toBe('100px');
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
      toJSON: (): any => {},
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
